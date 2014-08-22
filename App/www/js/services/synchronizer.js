myApp.service("Synchronizer", ["$http", "Storage", "Server",
    function ($http, Storage, Server) {
        return {
            updateData: function (className, count, offset, callback) {
                var lastLocalModified = Storage.lastModified[className];
                Server.lastModified(className, function (lastServerModified) {
                    server.search(className, {
                        "modifiedSince": lastLocalModified,
                        "count": count,
                        "offset": offset
                    }, function (data) {
                        Storage.update(data, function(){
                            var nextOffset = offset + count;
                            updateData(className, count, nextOffset);
                        });
                    });
                });
            }
        }
    }]);