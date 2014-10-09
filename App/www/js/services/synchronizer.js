myApp.service("Synchronizer", ["Storage", "RealServer", "ModelConverter", "Loader", "$rootScope", "storageSupport",
    function (Storage, RealServer, ModelConverter, Loader, $rootScope, storageSupport) {
        var Server;
        var synchEnd = true;

        function save(data, className, offset, callback) {
            if (offset >= data.length) {
                callback();
            } else {
                //                if (data[offset].visible) {
                Storage.update(ModelConverter.getObject(className, data[offset]));
                save(data, className, offset + 1, callback)
                //                } else {
                //                    console.log("not visible");
                //                    Storage.del(ModelConverter.getObject(className, data[offset]), function () {
                //                        save(data, className, offset + 1, callback)
                //                    });
                //                }
            }
        };

        function updateData(className, count, offset, callback, lastLocalModified, lastServerModified) {
            synchEnd = false;
            Server.search(className, {
                "modifiedSince": new Date(lastLocalModified[className]),
                "count": count,
                "offset": offset
            }, function (data) {
                //                console.log('data ', className, data);
                if (data == null || data.length < count) {
                    Server.lastModified(["OperationalStatistics", "Visit", "Expenditure"], function (date) {
                        lastLocalModified = lastServerModified;
                        var lastMod = ModelConverter.getObject("LastModified", lastLocalModified);
                        console.log("lastMod ", lastMod);
                        Storage.update(lastMod);
                        if (date[className] == lastServerModified[className]) {
                            Server.fieldStat([{
                                type: className,
                                field: "date"
                                    }], function (serverStat) {
                                var fieldStat = ModelConverter.getObject("FieldStat", stat);
                                Storage.update(fieldStat);
                                save(data, className, 0, callback);
                                synchEnd = true;
                                $rootScope.$emit('synchEnd' + className, '');
                            });
                        } else {
                            updateData(className, count, 0, callback, lastLocalModified, date);
                        }
                    });
                } else {
                    save(data, className, 0, function () {
                        var nextOffset = offset + count;
                        updateData(className, count, nextOffset, callback, lastLocalModified, lastServerModified);
                    });

                }
            });
        }

        function synchCheck(className, callback) {
            Storage.get("LastModified", 'primary', function (lastLocalModified) {
                Server.lastModified(["OperationalStatistics", "Visit", "Expenditure"], function (lastServerModified) {
                    lastLocalModified = ModelConverter.getObject("LastModified", lastLocalModified);
                    if (!(className in lastLocalModified))
                        callback();
                    else {
//                        console.log("className", className, new Date(lastLocalModified[className]), new Date(lastServerModified[className]));
                        if (new Date(lastLocalModified[className]) < new Date(lastServerModified[className])) {
                            console.log('synch need');
                            lastLocalModified[className] = new Date(lastServerModified[className]);
                            Storage.update(lastLocalModified, function () {
                                $rootScope.$emit('synchEnd' + className, '');
                                callback();
                            });
                            //                            if (synchEnd)
                            //                                updateData(className, 20, 0, callback, lastLocalModified, lastServerModified);
                        } else {
                            callback();
                        }
                    }
                });
            });
        }

        return {
            beginSynch: function () {
                var synch = this;
                Server = new RealServer(localStorage.getItem("UserToken"));
                if (storageSupport) {
                    synchCheck("OperationalStatistics", function () {
                        synchCheck("Visit", function () {
                            synchCheck("Expenditure", function () {
                                setInterval(synch.beginSynch, 15000);
                            });
                        });
                    });
                }
            }
        };
    }]);