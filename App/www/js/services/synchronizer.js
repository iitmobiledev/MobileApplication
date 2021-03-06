myApp.service("Synchronizer", ["Storage", "RealServer", "ModelConverter", "Loader", "$rootScope", "storageSupport","SYNC_TIMEOUT",
    function (Storage, RealServer, ModelConverter, Loader, $rootScope, storageSupport,SYNC_TIMEOUT) {
        var Server;
        var newObjs = [];

        function save(data, className, offset, callback) {
            if (offset >= data.length) {
                callback();
            } else {
                var model = ModelConverter.getObject(className, data[offset]);
                if (model.hasOwnProperty('visible') && model.visible == 0) {
                    Storage.del(model);
                    save(data, className, offset + 1, callback);
                } else {
                    newObjs.push(model);
                    Storage.update(model);
                    save(data, className, offset + 1, callback)
                }
            }
        };

        function updateData(className, count, offset, callback, lastLocalModified, lastServerModified) {
            synchEnd = false;
            Server.search(className, {
                "modifiedSince": new Date(lastLocalModified[className]),
                "count": count,
                "offset": offset
            }, function (data) {
//                console.log('new data ', offset, className, data);
                if (data == null || data.length < count) {
                    Server.lastModified(["OperationalStatistics", "Visit", "Expenditure"], function (date) {
                        lastLocalModified[className] = lastServerModified[className];
                        var lastMod = ModelConverter.getObject("LastModified", lastLocalModified);
                        Storage.update(lastMod);
                        if (date[className] == lastServerModified[className]) {
                            Server.fieldStat([{
                                type: className,
                                field: "date"
                                    }], function (serverStat) {
                                var fieldStat = ModelConverter.getObject("FieldStat", serverStat);
                                Storage.update(fieldStat);
                                save(data, className, 0, function () {
                                    $rootScope.$emit('synchEnd' + className, newObjs);
                                    newObjs = [];
                                    callback();
                                });
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
//                    console.log(lastLocalModified, lastServerModified);
                    if (!(className in lastLocalModified))
                        callback();
                    else {
                        if (new Date(lastLocalModified[className]) < new Date(lastServerModified[className])) {
                            console.log('synch need');
                            updateData(className, 20, 0, callback, lastLocalModified, lastServerModified);
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
                                setInterval(synch.beginSynch, SYNC_TIMEOUT);
                            });
                        });
                    });
                }
            }
        };
    }]);