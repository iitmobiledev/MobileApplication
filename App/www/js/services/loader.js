/**
 * @ngdoc service
 * @description Сервис для получения данных из хранилища или,
 * при отсутствии кэшированных данных, с сервера по
 * первичному ключу или за период и для типизирования
 * этих данных.
 * @name myApp.service:Loader
 */
myApp.service("Loader", ["ModelConverter", "RealServer", "$rootScope", "fieldStatQuery", "Storage", "ClassesLastModified",
    function (ModelConverter, RealServer, $rootScope, fieldStatQuery, Storage, ClassesLastModified) {

        //    var localStat = null;
        var fieldStat = null;
        var Server = new RealServer(sessvars.token);

        function getServerFieldStat() {
            Server.fieldStat(fieldStatQuery, function (stat) {
                fieldStat = stat;
                $rootScope.$emit('minMaxGet', '');
            });
        }

        function getFieldStat() {
            //            console.log('getFieldStat');
//            if (sessvars.support) {
//                Storage.get("FieldStat", 'primary', function (stat) {
//                    if (stat)
//                        fieldStat = ModelConverter.getObject("FieldStat", stat);
//                    else
//                        getServerFieldStat();
//                });
//            } else
                getServerFieldStat();
        };
        getFieldStat();

        $rootScope.$on('synchEnd', function () {
            //            console.log('synchEnd on');
            getFieldStat();
        });

        return {
            getMaxDate: function (className) {
                //        if (serverStat && localStat) {
                //            var typeStat = localStat.filter(function (stat) {
                //                return stat.type == className;
                //            })[0];
                //            if (typeStat.min == null || typeStat.max == null) {
                //                typeStat = serverStat.filter(function (stat) {
                //                    return stat.type == className;
                //                })[0];
                //                return new Date(date) < new Date(typeStat.max);
                //            } else {
                //                return new Date(date) < new Date(typeStat.max);
                //            }
                //        } else 
                if (fieldStat) {
                    var typeStat = fieldStat.filter(function (stat) {
                        return stat.type == className;
                    })[0];
                    return new Date(typeStat.max);
                    //                    return new Date(date) < new Date(typeStat.max);
                } else {
                    return null;
                }
            },

            getMinDate: function (className) {
                //        if (serverStat && localStat) {
                //            var typeStat = localStat.filter(function (stat) {
                //                return stat.type == className;
                //            })[0];
                //            if (typeStat.min == null || typeStat.max == null) {
                //                typeStat = serverStat.filter(function (stat) {
                //                    return stat.type == className;
                //                })[0];
                //                return new Date(date) > new Date(typeStat.min);
                //            } else {
                //                return new Date(date) > new Date(typeStat.min);
                //            }
                //        } else 
                if (fieldStat) {
                    var typeStat = fieldStat.filter(function (stat) {
                        return stat.type == className;
                    })[0];
                    return new Date(typeStat.min);
                    //                    return new Date(date) > new Date(typeStat.min);

                } else {
                    return null;
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
                if (sessvars.support) {
                    Storage.get(className, primaryKey, function (result) {
                        if (result) {
                            console.log(result);
                            var model = ModelConverter.getObject(className, result);
                            console.log("model", model);
                            callback(model);
                        } else {
                            Server.get(className, primaryKey, function (data) {
                                callback(ModelConverter.getObject(className, data))
                            });
                        }
                    });
                } else {
                    Server.get(className, primaryKey, function (data) {
                        callback(ModelConverter.getObject(className, data))
                    });
                }

                //                getFieldStat();
                //                Server.get(className, primaryKey, function (data) {
                //                    console.log('server.get ', data);
                //                    callback(ModelConverter.getObject(className, data));
                //
                //                });


                //                        if (localStat && serverStat) {
                //            var typeStatLocal = localStat.filter(function (stat) {
                //                return stat.type == className;
                //            })[0];
                //            var typeStatServer = serverStat.filter(function (stat) {
                //                return stat.type == className;
                //            })[0];
                //            if (typeStatServer.min == typeStatLocal.min && typeStatServer.max == typeStatLocal.max) {
                //                console.log("Storage.get");
                //                Storage.get(className, primaryKey, function (result) {
                //                    if (result == null) {
                //                        console.log("Storage empty!");
                //                        callback(null);
                //                    } else {
                //                        callback(ModelConverter.getObject(className, result));
                //                    }
                //                });
                //            } else {
                //                console.log("server.get ", primaryKey);
                //                Server.get(className, primaryKey, function (data) {
                //                    callback(ModelConverter.getObject(className, data))
                //                });
                //            }
                //        } else if (serverStat) {
                //            Server.get(className, primaryKey, function (data) {
                //                callback(ModelConverter.getObject(className, data))
                //            });
                //        } else {
                //            setTimeout(this.get, 500, className, primaryKey, callback);
                //        }
            },

            //получение объектов за период
            search: function (className, params, callback) {
                if (sessvars.support) {
                    Storage.search(className, params, function (data) {
                        if (data) {
                            var objs = ModelConverter.getObjects(className, data);
                            callback(objs);
                        } else {
                            Server.search(className, params, function (result) {
                                var lastMod = ModelConverter.getObject("LastModified", new ClassesLastModified());
                                Storage.update(lastMod);
                                console.log('server.search ', result);
                                if (result instanceof Array) {
                                    var objs = ModelConverter.getObjects(className, result);
                                    callback(objs);
                                } else
                                    callback([]);
                            });
                        }
                    });
                } else {
                    Server.search(className, params, function (result) {
                        var lastMod = ModelConverter.getObject("LastModified", new ClassesLastModified());
                        Storage.update(lastMod);
                        console.log('server.search ', result);
                        if (result instanceof Array) {
                            var objs = ModelConverter.getObjects(className, result);
                            callback(objs);
                        } else
                            callback([]);
                    });
                }

                //                getFieldStat();
                //                Server.search(className, params, function (result) {
                //                    console.log('server.search ', result);
                //                    if (result instanceof Array) {
                //                        var objs = ModelConverter.getObjects(className, result);
                //                        callback(objs);
                //                    } else
                //                        callback([]);
                //                });


                //        if (localStat && serverStat) {
                //
                //            var typeStatLocal = localStat.filter(function (stat) {
                //                return stat.type == className;
                //            })[0];
                //            var typeStatServer = serverStat.filter(function (stat) {
                //                return stat.type == className;
                //            })[0];
                //            console.log(typeStatServer, typeStatLocal);
                //            if (typeStatServer.min == typeStatLocal.min && typeStatServer.max == typeStatLocal.max) {
                //                Storage.search(className, params, function (data) {
                //                    console.log("Storage.search ", data);
                //                    if (data == null) {
                //                        console.log("Storage empty!");
                //                        callback([]);
                //                    } else {
                //                        var objs = ModelConverter.getObjects(className, data);
                //                        callback(objs);
                //                    }
                //                });
                //            } else {
                //                Server.searchForPeriod(className, params, function (result) {
                //                    console.log("server.search ", result);
                //                    var objs = ModelConverter.getObjects(className, result);
                //                    callback(objs);
                //                });
                //            }
                //
                //        } else if (serverStat) {
                //            //                    console.log('server.search begin');
                //            Server.searchForPeriod(className, params, function (result) {
                //                console.log("server.search ", result);
                //                var objs = ModelConverter.getObjects(className, result);
                //                callback(objs);
                //            });
                //        } else {
                //            //                    console.log('server stat not determ');
                //            setTimeout(this.search, 500, className, params, callback);
                //        }
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