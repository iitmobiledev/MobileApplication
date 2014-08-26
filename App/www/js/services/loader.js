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
                        Server.searchForPeriod(className, params, function (result) {
                            console.log("server.search", result);
                            var objs = ModelConverter.getObjects(className, result);
                            callback(objs);
                        });
                    } else {
                        console.log("Storage.search ", data);
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