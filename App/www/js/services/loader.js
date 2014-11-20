/**
 * @ngdoc service
 * @description Сервис для получения данных из хранилища или,
 * при отсутствии кэшированных данных, с сервера по
 * первичному ключу или за период и для типизирования
 * этих данных.
 * @name myApp.service:Loader
 */
myApp.service("Loader", ["DateHelper","ModelConverter", "RealServer", "$rootScope", "fieldStatQuery", "Storage", "ClassesLastModified", "storageSupport",
    function (DateHelper, ModelConverter, RealServer, $rootScope, fieldStatQuery, Storage, ClassesLastModified, storageSupport) {

        var fieldStat = null;
        var Server;
        var synchNeed = {
            "OperationalStatistics": false,
            "Visit": false,
            "Expenditure": false
        };

        function getServerFieldStat() {
            Server = new RealServer(localStorage.getItem("UserToken"));
            Server.fieldStat(fieldStatQuery, function (stat) {
                //                console.log(stat);
                fieldStat = stat;
                if (stat.error) {
                    $rootScope.$emit('serverError', '');
                } else {
                    Storage.update(ModelConverter.getObject("FieldStat", stat));
                    $rootScope.$emit('minMaxGet', '');
                }
            });
        }

        function getFieldStat() {
            if (storageSupport && !synchNeed["OperationalStatistics"] && !synchNeed["Visit"] && !synchNeed["Expenditure"]) {
                Storage.get("FieldStat", 'primary', function (stat) {
                    if (stat) {
                        stat = ModelConverter.getObject("FieldStat", stat);
                        fieldStat = [];
                        angular.forEach(stat, function (value, key) {
                            fieldStat.push(value);
                        });
                    } else
                        getServerFieldStat();
                });
            } else
                getServerFieldStat();
        };

        $rootScope.$on('synchEndOperationalStatistics', function () {
            synchNeed["OperationalStatistics"] = true;
            getFieldStat();
        });
        $rootScope.$on('synchEndVisit', function () {
            synchNeed["Visit"] = true;
            getFieldStat();
        });
        $rootScope.$on('synchEndExpenditure', function () {
            synchNeed["Expenditure"] = true;
            getFieldStat();
        });

        function serverSearch(className, params, callback) {
            for (var i in params){
                if (params.hasOwnProperty(i)){
                    if (params[i] instanceof Date){
                        params[i] = DateHelper.dateCanonicalFormat(params[i]);
                    }
                }
            }
            Server.lastModified([className], function (lastServerModified) {
                Server.search(className, params, function (result) {
                    Storage.get("LastModified", 'primary', function (lastMod) {

                        lastMod = ModelConverter.getObject("LastModified", lastMod);
                        lastMod[className] = lastServerModified[className];
                        Storage.update(lastMod);

                        if (result instanceof Array) {
                            console.log('server.search ',JSON.stringify(params), result);
                            var objs = ModelConverter.getObjects(className, result);
                            var needObjs = [];
                            for (var i in objs)
                            {
                                if (objs[i].hasOwnProperty('visible') && objs[i].visible == 0)
                                {
                                    Storage.del(objs[i]);
                                }
                                else{
                                    Storage.update(objs[i]);
                                    needObjs.push(objs[i]);
                                }

                            }
                            synchNeed[className] = false;
                            callback(needObjs);
                        } else
                            callback([]);
                    });
                });
            });
        }

        return {
            getFieldStat: getFieldStat,
            getMaxDate: function (className) {
                try {
                    //                    console.log(fieldStat);
                    if (fieldStat) {
                        var typeStat = fieldStat.filter(function (stat) {
                            return stat.type == className;
                        })[0];
                        return new Date(typeStat.max.replace(' ', 'T'));
                    } else {
                        return null;
                    }
                } catch (e) {
                    console.log(e.message);
                    //                    $rootScope.$emit('serverError', '');
                    return 'error';
                }
            },

            getMinDate: function (className) {
                try {
                    if (fieldStat) {
                        var typeStat = fieldStat.filter(function (stat) {
                            return stat.type == className;
                        })[0];
                        return new Date(typeStat.min.replace(' ', 'T'));
                    } else {
                        return null;
                    }
                } catch (e) {
                    console.log(e.message);
                    //                    $rootScope.$emit('serverError', '');
                    return 'error';
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
