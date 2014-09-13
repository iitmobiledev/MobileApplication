/**
 * @ngdoc service
 * @description Сервис для получения данных из хранилища или,
 * при отсутствии кэшированных данных, с сервера по
 * первичному ключу или за период и для типизирования
 * этих данных.
 * @name myApp.service:Loader
 */
myApp.service("Loader", ["ModelConverter", "Server", "RealServer", "$rootScope", "Storage",
    function (ModelConverter, Server, RealServer, $rootScope, Storage) {

        var localStat = null;
        var serverStat = null;
        //        var Server = new RealServer(sessvars.token);

        var query = [{
            type: "OperationalStatistics",
            field: "date"
                }, {
            type: "Visit",
            field: "date"
            }, {
            type: "Expenditure",
            field: "date"
            }];


        function getFieldStat() {
            var storageSupport;
            Storage.isSupported(function (isSupport) {
                storageSupport = isSupport;
                console.log("Support:", storageSupport);
            })
            if (storageSupport) {
                Storage.getFieldStat(query, function (stat) {
                    localStat = stat;
                    console.log('localStat ', stat);
                });
            }
            Server.fieldStat(query, function (stat) {
                console.log('server stat ', stat);
                serverStat = stat;
                $rootScope.$emit('received', '');
            });
        };

        getFieldStat();

        $rootScope.$on('synchEnd', getFieldStat);

        return {
            hasFutureData: function (className, date) {
                if (serverStat && localStat) {
                    var typeStat = localStat.filter(function (stat) {
                        return stat.type == className;
                    })[0];
                    if (typeStat.min == null || typeStat.max == null) {
                        typeStat = serverStat.filter(function (stat) {
                            return stat.type == className;
                        })[0];
                        return new Date(date) < new Date(typeStat.max);
                    } else {
                        return new Date(date) < new Date(typeStat.max);
                    }
                } else if (serverStat) {
                    var typeStat = serverStat.filter(function (stat) {
                        return stat.type == className;
                    })[0];
                    return new Date(date) < new Date(typeStat.max);
                } else {
                    return false;
                }
            },

            hasPastData: function (className, date) {
                if (serverStat && localStat) {
                    var typeStat = localStat.filter(function (stat) {
                        return stat.type == className;
                    })[0];
                    if (typeStat.min == null || typeStat.max == null) {
                        typeStat = serverStat.filter(function (stat) {
                            return stat.type == className;
                        })[0];
                        return new Date(date) > new Date(typeStat.min);
                    } else {
                        return new Date(date) > new Date(typeStat.min);
                    }
                } else if (serverStat) {
                    var typeStat = serverStat.filter(function (stat) {
                        return stat.type == className;
                    })[0];
                    return new Date(date) > new Date(typeStat.min);

                } else {
                    return false;
                }
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
                if (localStat && serverStat) {
                    var typeStatLocal = localStat.filter(function (stat) {
                        return stat.type == className;
                    })[0];
                    var typeStatServer = serverStat.filter(function (stat) {
                        return stat.type == className;
                    })[0];
                    if (typeStatServer.min == typeStatLocal.min && typeStatServer.max == typeStatLocal.max) {
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
                } else if (serverStat) {
                    Server.get(className, primaryKey, function (data) {
                        callback(ModelConverter.getObject(className, data))
                    });
                } else {
                    setTimeout(this.get, 500, className, primaryKey, callback);
                }
            },

            //получение объектов за период
            search: function (className, params, callback) {
                //                console.log('in search');
                if (localStat && serverStat) {
                    //                    console.log('localStat && serverStat');
                    var typeStatLocal = localStat.filter(function (stat) {
                        return stat.type == className;
                    })[0];
                    var typeStatServer = serverStat.filter(function (stat) {
                        return stat.type == className;
                    })[0];
                    if (typeStatServer.min == typeStatLocal.min && typeStatServer.max == typeStatLocal.max) {
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
                            console.log("server.search ", result);
                            var objs = ModelConverter.getObjects(className, result);
                            callback(objs);
                        });
                    }

                } else if (serverStat) {
                    //                    console.log('server.search begin');
                    Server.searchForPeriod(className, params, function (result) {
                        console.log("server.search ", result);
                        var objs = ModelConverter.getObjects(className, result);
                        callback(objs);
                    });
                } else {
                    //                    console.log('server stat not determ');
                    setTimeout(this.search, 500, className, params, callback);
                }
            },

            scope: $rootScope
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