myApp.service("Synchronizer", ["Storage", "RealServer", "ModelConverter", "Loader", "$rootScope", "storageSupport",
    function (Storage, RealServer, ModelConverter, Loader, $rootScope, storageSupport) {

        var Server;

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
            var classModified;
            if (lastLocalModified)
                classModified = lastLocalModified[className];
            else
                classModified = null;
            Server.search(className, {
                "modifiedSince": classModified,
                "count": count,
                "offset": offset
            }, function (data) {
                if (data == null || data.length < count) {
                    Server.lastModified(["OperationalStatistics", "Visit", "Expenditure"], function (date) {
                        lastLocalModified = lastServerModified;
                        var lastMod = ModelConverter.getObject("LastModified", lastLocalModified);
                        Storage.update(lastMod);
                        if (date[className] == lastServerModified[className]) {
                            Server.fieldStat([{
                                type: className,
                                field: "date"
                                    }], function (serverStat) {
                                var fieldStat = ModelConverter.getObject("FieldStat", stat);
                                Storage.update(fieldStat);
                                save(data, className, 0, callback);
                                $rootScope.$emit('synchEnd'+className, '');
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
            //console.log('synch check');
            Storage.get("LastModified", 'primary', function (lastLocalModified) {
                Server.lastModified(["OperationalStatistics", "Visit", "Expenditure"], function (lastServerModified) {
                    lastLocalModified = ModelConverter.getObject("LastModified", lastLocalModified);
//                    console.log(lastLocalModified, lastServerModified);
                    if ( !(className in lastLocalModified) && new Date(lastLocalModified[className]) < new Date(lastServerModified[className])) {
                        console.log('synch need');
                        updateData(className, 20, 0, callback, lastLocalModified, lastServerModified);
                    } else {
                        callback();
                    }
                });
            });
        }

        return {
            beginSynch: function () {
                Server = new RealServer(sessvars.token);
                var synch = this;
                if (storageSupport) {
                    synchCheck("OperationalStatistics", function () {
                        synchCheck("Visit", function () {
                            synchCheck("Expenditure", function () {
//                                $rootScope.$emit('synchEndOperationalStatistics', '');
//                                $rootScope.$emit('synchEndVisit', '');
//                                $rootScope.$emit('synchEndExpenditure', '');
                                setInterval(synch.beginSynch, 5000);
                            });
                        });
                    });
                }
            }
        };
}]);

//var $inj = angular.injector(['myApp']);
//var synchronizer = $inj.get('Synchronizer');
//var loader = $inj.get('Loader');
//var Storage = $inj.get('Storage');
//console.log("synch begin");


//var RealServer = $inj.get('RealServer');
//var Server = new RealServer(sessvars.token);
//console.log('synch');
//Server.search("OperationalStatistics", {
//    "modifiedSince": "2014-09-15 00:00:00",
//    "count": 10,
//    "offset": 0
//}, function (data) {
//    console.log('Server.search', data);
//});


//(function beginSynch() {
//    console.log("synch begin");
//    Storage.isSupported(function (isSupport) {
//        if (isSupport) {
//            console.log("synch begin");
//            synchronizer.synchCheck.call(synchronizer, "OperationalStatistics", function () {
//                //                console.log("synch end OperationalStatistics0");
//                synchronizer.synchCheck.call(synchronizer, "Visit", function () {
//                    //                    console.log("synch end Visit0");
//                    synchronizer.synchCheck.call(synchronizer, "Expenditure", function () {
//                        console.log("synch end");
//                        $rootScope.$emit('synchEnd', '');
//                        //                        loader.scope.$emit('synchEnd', '');
//                        setTimeout(beginSynch, 70000);
//                    });
//                });
//            });
//        }
//    });
//
//})();