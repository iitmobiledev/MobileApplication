myApp.service("Synchronizer", ["Storage", "RealServer", "ModelConverter", "Loader",
    function (Storage, RealServer, ModelConverter, Loader) {

        var Server = new RealServer(sessvars.token);
        
        function save(data, className, offset, callback) {
            if (offset >= data.length) {
                callback();
            } else {
                if (data[offset].visible) {
                    //console.log("visible");
                    Storage.update(ModelConverter.getObject(className, data[offset]));
                    save(data, className, offset + 1, callback)
                } else {
                    //console.log("not visible");
                    Storage.del(ModelConverter.getObject(className, data[offset]), function () {
                        save(data, className, offset + 1, callback)
                    });
                }
            }
        };

        return {
            updateData: function (className, count, offset, callback, lastLocalModified, lastServerModified) {
                var synch = this;
                Server.search(className, {
                    "modifiedSince": lastLocalModified[className],
                    "count": count,
                    "offset": offset
                }, function (data) {
                    if (data == null || data.length < count) {
                        Server.lastModified(["OperationalStatistics", "Visit", "Expenditure"], function (date) {
                            lastLocalModified[className] = lastServerModified[className];
                            if (date[className] == lastServerModified[className]) {
                                Storage.saveLastModify(lastLocalModified, function () {
                                    Server.fieldStat([{
                                        type: className,
                                        field: "date"
                                    }], function (serverStat) {
                                        Storage.saveFieldStat(serverStat, function () {
                                            save(data, className, 0, callback);
                                        });
                                    });
                                });
                            } else {
                                Storage.saveLastModify(lastLocalModified, function () {
                                    synch.updateData(className, count, 0, callback, lastLocalModified, date);
                                });
                            }
                        });
                    } else {
                        save(data, className, 0, function () {
                            var nextOffset = offset + count;
                            synch.updateData(className, count, nextOffset, callback, lastLocalModified, lastServerModified);
                        });

                    }
                });
            },

            synchCheck: function (className, callback) {
                console.log('synch check');
                var synch = this;
                Storage.lastModified(["OperationalStatistics", "Visit", "Expenditure"], function (lastLocalModified) {
                    console.log('Storage.lastModified');
                    Server.lastModified(["OperationalStatistics", "Visit", "Expenditure"], function (lastServerModified) {
                        console.log('Server.lastModified');
                        if (lastLocalModified[className] == lastServerModified[className]) {
                            callback();
                        } else {
                            console.log('synch need');
                            synch.updateData(className, 20, 0, callback, lastLocalModified, lastServerModified);
                        }
                    });
                });
            }
        };
}]);

//var $inj = angular.injector(['myApp']);
//var synchronizer = $inj.get('Synchronizer');
//var loader = $inj.get('Loader');
//
//(function beginSynch() {
//    console.log("synch begin");
//    synchronizer.synchCheck.call(synchronizer, "OperationalStatistics", function () {
//                console.log("synch end OperationalStatistics0");
//        synchronizer.synchCheck.call(synchronizer, "Visit", function () {
//                        console.log("synch end Visit0");
//            synchronizer.synchCheck.call(synchronizer, "Expenditure", function () {
//                console.log("synch end");
//                loader.scope.$emit('synchEnd', '');
//
//                //                var synchEndEvent = new CustomEvent('synchEnd', {});
//                //                document.dispatchEvent(synchEndEvent);
//                setTimeout(beginSynch, 70000);
//            });
//        });
//    });
//})();