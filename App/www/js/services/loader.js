/**
 * @ngdoc service
 * @description Сервис для получения данных из хранилища или, при отсутствии кэшированных данных, с сервера по первичному ключу или за период.
 * @name myApp.service:Loader
 */
myApp.service("Loader", ["Storage", "ModelConverter", "Server",
    function (Storage, ModelConverter, Server) {
        return {
            //получение объектов по первичному ключу
            get: function (className, primaryKey, callback) {
                Storage.get(className, primaryKey, function (result) {
                    if (result == null) {
                        Server.get(className, primaryKey, function (data) {
                            callback(ModelConverter.getObject(className, data))
                        });
                    } else
                        callback(ModelConverter.getObject(className, result));
                });
            },
            //получение объектов за период
            search: function (className, params, callback) {
                Storage.search(className, params, function (data) {
                    if (data == null) { //если в базе ничего не нашли
                        Server.search(className, params, function (result) {
                            var objs = ModelConverter.getObjects(className, result);

                            //потом будет в синхронизаторе
                            for (var i = 0; i < objs.length; i++) {
                                if (objs[i] instanceof Array) {
                                    for (var j = 0; j < objs[i].length; j++) {
                                        Storage.update(objs[i][j]);
                                    }
                                } else
                                    Storage.update(objs[i]);
                            }

                            callback(objs);
                        });
                    } else {
                        var objs = ModelConverter.getObjects(className, data);
                        callback(objs);
                    }
                });
            }
        }
    }]);

//                var query = ["OperationalStatistics", "Visit", "Expenditures"];
//                console.log("lastModified: ", Storage.lastModified(query));
//
//                query = [{
//                    "type": "OperationalStatistics",
//                    "field": "date"
//                        }, {
//                    "type": "Visit",
//                    "field": "id"
//                        }, {
//                    "type": "Expenditures",
//                    "field": "date"
//                        }];
//                Storage.getFieldStat(query, function(result){
//                    console.log("getFieldStat ", result);
//                });