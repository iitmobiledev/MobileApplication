myApp.service("Synchronizer", ["Storage", "Server", "ModelConverter",
    function (Storage, Server, ModelConverter) {
        function update(className, count, offset, callback, lastLocalModified, lastServerModified) {
            Server.search(className, {
                "modifiedSince": lastLocalModified,
                "count": count,
                "offset": offset
            }, function (data) {
//                console.log("data part from server ", data);
                if (data == null || data.length < count ) {
                    Server.lastModified(className, function (date) {
                        if (date == lastServerModified) {
                            Storage.classesLastModified[className] = lastServerModified;
                            callback();
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
                var lastLocalModified = Storage.lastModified(className);
                Server.lastModified(className, function (lastServerModified) {
//                    console.log(lastLocalModified, lastServerModified);
                    if (lastLocalModified == lastServerModified) {
                        callback();
                    } else
                        update(className, count, offset, callback, lastLocalModified, lastServerModified);
                });
            }
        };
    }
]);

var $inj = angular.injector(['myApp']);
var synchronizer = $inj.get('Synchronizer');
var storage = $inj.get('Storage');
synchronizer.updateData("OperationalStatistics", 10, 0, function () {
    console.log("synch end");
});
setInterval(synchronizer.updateData, 120000, "OperationalStatistics", 10, 0, function () {
    console.log("synch end");
});