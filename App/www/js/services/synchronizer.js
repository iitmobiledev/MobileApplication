myApp.service("Synchronizer", ["Storage", "Server", "ModelConverter",
    function (Storage, Server, ModelConverter) {
        return {
            updateData: function (className, count, offset, callback, lastLocalModified, lastServerModified) {
                var synch = this;
                Server.search(className, {
                    "modifiedSince": lastLocalModified[className],
                    "count": count,
                    "offset": offset
                }, function (data) {
                    if (data == null || data.length < count) {
                        Server.lastModified(["OperationalStatistics", "Visit", "Expenditures"], function (date) {
                            lastLocalModified[className] = lastServerModified[className];
                            console.log("synch end", date[className], lastServerModified[className]);
                            if (date[className] == lastServerModified[className]) {
                                Storage.saveLastModify(lastLocalModified, function () {
                                    callback();
                                });
                            } else {
                                //                                Storage.saveLastModify(lastLocalModified, function () {
                                synch.updateData(className, count, 0, callback, lastLocalModified, date);
                                //                                });
                            }
                        });

                    } else {
                        for (var i = 0; i < data.length; i++) {
                            Storage.update(ModelConverter.getObject(className, data[i]));
                        }
                        var nextOffset = offset + count;
                        synch.updateData(className, count, nextOffset, callback, lastLocalModified, lastServerModified);
                    }
                });
            },

            synchCheck: function (className, callback) {
                var synch = this;
                Storage.lastModified(["OperationalStatistics", "Visit", "Expenditures"], function (lastLocalModified) {
                    Server.lastModified(["OperationalStatistics", "Visit", "Expenditures"], function (lastServerModified) {
                        console.log(lastLocalModified[className], lastServerModified[className]);
                        if (lastLocalModified[className] == lastServerModified[className]) {
                            callback();
                        } else {
                            synch.updateData(className, 20, 0, callback, lastLocalModified, lastServerModified);
                        }
                    });
                });
            }
        };
    }
]);

//var $inj = angular.injector(['myApp']);
//var synchronizer = $inj.get('Synchronizer');
//var storage = $inj.get('Storage');
//synchronizer.synchCheck.call(synchronizer, "OperationalStatistics", function () {
//    console.log("synch end OperationalStatistics0");
//    synchronizer.synchCheck.call(synchronizer, "Visit", function () {
//        console.log("synch end Visit0");
//        synchronizer.synchCheck.call(synchronizer, "Expenditures", function () {
//            console.log("synch end Expenditures0");
//        });
//    });
//});
//setInterval(synchronizer.synchCheck.call, 60000, synchronizer, "OperationalStatistics", function () {
//    //    console.log("synch end OperationalStatistics");
//    setInterval(synchronizer.synchCheck.call, 60000, synchronizer, "Visit", function () {
//        //        console.log("synch end Visit");
//        setInterval(synchronizer.synchCheck.call, 60000, synchronizer, "Expenditures", function () {
//            //            console.log("synch end Expenditures");
//        });
//    });
//});