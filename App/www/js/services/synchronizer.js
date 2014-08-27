myApp.service("Synchronizer", ["Storage", "Server", "ModelConverter",
    function (Storage, Server, ModelConverter) {
        function update(className, count, offset, callback, lastLocalModified, lastServerModified) {
            Server.search(className, {
                "modifiedSince": lastLocalModified[className],
                "count": count,
                "offset": offset
            }, function (data) {
                if (data == null || data.length < count) {
                    Server.lastModified(className, function (date) {
                        if (date == lastServerModified) {
                            lastLocalModified[className] = lastServerModified;
                            console.log(lastLocalModified);
                            Storage.saveLastModify(lastLocalModified, function () {
                                callback();
                            });
                        } else {
                            update(className, count, 0, callback, lastLocalModified, date);
                        }
                    });

                } else {
                    for (var i = 0; i < data.length; i++) {
                        Storage.update(ModelConverter.getObject(className, data[i]));
                    }
                    var nextOffset = offset + count;
                    update(className, count, nextOffset, callback, lastLocalModified, lastServerModified);
                }
            });
        };

        return {
            updateData: function (className, count, offset, callback) {
                Storage.lastModified(["OperationalStatistics", "Visit", "Expenditures"], function (lastLocalModified) {
                    Server.lastModified(className, function (lastServerModified) {
                        console.log(lastLocalModified[className], lastServerModified);
                        if (lastLocalModified[className] == lastServerModified) {
                            callback();
                        } else
                            update(className, count, offset, callback, lastLocalModified, lastServerModified);
                    });
                });


            }
        };
    }
]);

var $inj = angular.injector(['myApp']);
var synchronizer = $inj.get('Synchronizer');
var storage = $inj.get('Storage');
synchronizer.updateData("OperationalStatistics", 20, 0, function () {
    console.log("synch end OperationalStatistics0");
    synchronizer.updateData("Visit", 20, 0, function () {
        console.log("synch end Visit0");
        synchronizer.updateData("Expenditures", 20, 0, function () {
            console.log("synch end Expenditures0");
        });
    });
});
setInterval(synchronizer.updateData, 60000, "OperationalStatistics", 20, 0, function () {
    console.log("synch end OperationalStatistics");
    setInterval(synchronizer.updateData, 60000, "Visit", 20, 0, function () {
        console.log("synch end Visit");
        synchronizer.updateData("Expenditures", 20, 0, function () {
            console.log("synch end Expenditures");
        });
    });
});