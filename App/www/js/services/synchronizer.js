myApp.service("Synchronizer", ["Storage", "Server", "ModelConverter",
    function (Storage, Server, ModelConverter) {
        function update(className, count, offset, callback, lastLocalModified, lastServerModified) {
            console.log("modify different, offset = ", offset);
            Server.search(className, {
                "modifiedSince": lastLocalModified,
                "count": count,
                "offset": offset
            }, function (data) {
                console.log("server data part ", data);
                if (data == null || data.length == 0) {
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
                console.log("in update");
                var lastLocalModified = Storage.lastModified(className);
                Server.lastModified(className, function (lastServerModified) {
                    console.log(lastLocalModified, lastServerModified);
                    if (lastLocalModified == lastServerModified) {
                        console.log("db modify == server");
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
    console.log("synch end0");
});
setInterval(synchronizer.updateData, 60000, "OperationalStatistics", 10, 0, function () {
    console.log("synch end");
    //    console.log("storage modify ", storage.lastModified("OperationalStatistics"));
});