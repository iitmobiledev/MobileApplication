/**
 * @ngdoc service
 * @description Сервис для получения данных из хранилища или,
 * при отсутствии кэшированных данных, с сервера по
 * первичному ключу или за период и для типизирования
 * этих данных.
 * @name myApp.service:Loader
 */
myApp.service("Loader", ["ModelConverter", "RealServer", "$rootScope", "fieldStatQuery", "Storage", "ClassesLastModified", "storageSupport",
    function (ModelConverter, RealServer, $rootScope, fieldStatQuery, Storage, ClassesLastModified, storageSupport) {

        var serverError = false;
        var fieldStat = null;
        var Server = new RealServer(sessvars.token);

        function getServerFieldStat() {
            Server = new RealServer(sessvars.token);
            Server.fieldStat(fieldStatQuery, function (stat) {
                console.log(stat);
                //                console.log();
                if (stat.error) {
                    serverError = true;
//                    $rootScope.$emit('serverError', '');
                } else {
                    serverError = false;
                    fieldStat = stat;
                    Storage.update(ModelConverter.getObject("FieldStat", stat));
                    $rootScope.$emit('minMaxGet', '');
                }
            });
        }

        function getFieldStat() {
            if (storageSupport) {
                Storage.get("FieldStat", 'primary', function (stat) {
                    if (stat) {
                        //                        console.log('storage.get', stat);
                        //                        if (stat.error)
                        //                            getServerFieldStat();
                        //                        else {
                        stat = ModelConverter.getObject("FieldStat", stat);
                        fieldStat = [];
                        angular.forEach(stat, function (value, key) {
                            fieldStat.push(value);
                        });
                        //                        }
                        //                        console.log(fieldStat);
                    } else
                        getServerFieldStat();
                });
            } else
                getServerFieldStat();
        };
        //        getFieldStat();

        $rootScope.$on('synchEndOperationalStatistics', function () {
            getFieldStat();
        });
        $rootScope.$on('synchEndVisit', function () {
            getFieldStat();
        });
        $rootScope.$on('synchEndExpenditure', function () {
            getFieldStat();
        });

        function serverSearch(className, params, callback) {
            Server.search(className, params, function (result) {
                var lastMod = ModelConverter.getObject("LastModified", new ClassesLastModified());
                Storage.update(lastMod);

                if (result instanceof Array) {
                    var objs = ModelConverter.getObjects(className, result);
                    console.log('server.search ', objs);
                    for (var i in objs)
                        Storage.update(objs[i]);

                    callback(objs);
                } else
                    callback([]);
            });
        }

        return {
            getFieldStat: getFieldStat,
            getMaxDate: function (className) {
                //                $rootScope.$emit('serverError', '');
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
                try {
                    if (fieldStat) {
                        var typeStat = fieldStat.filter(function (stat) {
                            return stat.type == className;
                        })[0];
                        return new Date(typeStat.max);
                    } else {
                        return null;
                    }
                } catch (e) {
                    console.log(e.message);
                    if (serverError)
                        $rootScope.$emit('serverError', '');
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
                try {
                    if (fieldStat) {
                        var typeStat = fieldStat.filter(function (stat) {
                            return stat.type == className;
                        })[0];
                        return new Date(typeStat.min);
                    } else {
                        return null;
                    }
                } catch (e) {
                    console.log(e.message);
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
                if (storageSupport) {
                    Storage.get(className, primaryKey, function (result) {
                        if (result) {
                            console.log("storage.get ", result);
                            var model = ModelConverter.getObject(className, result);
                            //                            console.log("model", model);
                            callback(model);
                        } else {
                            Server.get(className, primaryKey, function (data) {
                                var obj = ModelConverter.getObject(className, data);
                                console.log("server.get ", obj);
                                Storage.update(obj);
                                callback(obj);
                            });
                        }
                    });
                } else {
                    Server.get(className, primaryKey, function (data) {
                        var obj = ModelConverter.getObject(className, data);
                        Storage.update(obj);
                        callback(obj);
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
                if (storageSupport) {
                    Storage.search(className, params, function (data) {
                        if (data) {
                            var objs = ModelConverter.getObjects(className, data).reverse();
                            console.log('storage.search ', objs);
                            callback(objs);
                        } else {
                            serverSearch(className, params, callback);
                        }
                    });
                } else {
                    serverSearch(className, params, callback);
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