/**
 * @ngdoc service
 * @description Сервис для получения данных из хранилища или,
 * при отсутствии кэшированных данных, с сервера по
 * первичному ключу или за период и для типизирования
 * этих данных.
 * @name myApp.service:Loader
 */
myApp.service("Loader", ["ModelConverter", "Server", "Storage",
    function (ModelConverter, Server, Storage) {
        return {
            
            hasFutureData: function (className, date){
            },
            
            hasPastData: function (className, date){
            },
            
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
                var query = [{
                    type: className,
                    field: "date"
                }];
                Storage.getFieldStat(query, function (localStat) {
                    Server.getFieldStat(query, function (serverStat) {
                        if (serverStat[0].min == localStat[0].min && serverStat[0].max == localStat[0].max) {
                            console.log("Storage.get");
                            Storage.get(className, primaryKey, function (result) {
                                if (result == null) {
                                    console.log("Storage empty!");
                                    callback(null);
                                } else {
                                    callback(ModelConverter.getObject(className, result));
                                }
                            });
                        } else {
                            console.log("server.get ", primaryKey);
                            Server.get(className, primaryKey, function (data) {
                                callback(ModelConverter.getObject(className, data))
                            });
                        }
                    });
                });
            },
            //получение объектов за период
            search: function (className, params, callback) {
                var query = [{
                    type: className,
                    field: "date"
                                                        }];
                Storage.getFieldStat(query, function (localStat) {
                    Server.getFieldStat(query, function (serverStat) {
                        //                        console.log(serverStat[0], localStat[0]);
                        if (serverStat[0].min == localStat[0].min && serverStat[0].max == localStat[0].max) {
                            Storage.search(className, params, function (data) {
                                console.log("Storage.search ", data);
                                if (data == null) {
                                    console.log("Storage empty!");
                                    callback([]);
                                } else {
                                    var objs = ModelConverter.getObjects(className, data);
                                    callback(objs);
                                }
                            });
                        } else {
                            Server.searchForPeriod(className, params, function (result) {
                                console.log("server.search", result);
                                var objs = ModelConverter.getObjects(className, result);
                                callback(objs);
                            });
                        }
                    });
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