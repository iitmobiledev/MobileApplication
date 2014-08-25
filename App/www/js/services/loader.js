/**
 * @ngdoc service
 * @description Сервис для получения данных из хранилища или,
 * при отсутствии кэшированных данных, с сервера по
 * первичному ключу или за период и для типизирования
 * этих данных.
 * @name myApp.service:Loader
 */
myApp.service("Loader", ["Storage", "ModelConverter", "Server",
    function (Storage, ModelConverter, Server) {
        return {
            /**
             * @ngdoc method
             * @name myApp.service:Loader#get
             * @methodOf myApp.service:Loader
             * @param {String} className Класс, объект которого
             * необходимо получить.
             * @param {String} primaryKey Первичный ключ.
             * @param {Function} callback Функция, в которую
             * параметром будет передан полученный объект,
             * будет вызвана после получения объекта.
             * @description Метод предназначен для получения
             * объекта по первичному ключу.
             */
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
                            console.log("server.search", result);
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
                        //                        var neededData = [];
                        //                        for (var i = 0; i < data.length; i++) {
                        //                            if (data[i].step == params.step) {
                        //                                neededData.push(data[i]);
                        //                            }
                        //                        }
                        //                        console.log("loader-search result:", neededData);
                        //                        if (neededData.length == 0) {
                        //                            Server.search(className, params, function (result) {
                        //                                var objs = ModelConverter.getObjects(className, result);
                        //
                        //                                //потом будет в синхронизаторе
                        //                                for (var i = 0; i < objs.length; i++) {
                        //                                    Storage.update(objs[i]);
                        //                                }
                        //                                callback(objs);
                        //                            });
                        //                        } else {
                        var objs = ModelConverter.getObjects(className, data);
                        callback(objs);
                        //                        }
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