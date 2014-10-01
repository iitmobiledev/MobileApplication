//indexedDB.deleteDatabase("storage")
/**
 * @ngdoc service
 * @description Сервис для кэширования данных
 * @name myApp.service:Storage
 */
myApp.service("Storage", ["$injector",

    function ($injector) {

        /**
         *
         * @ngdoc method
         * @name myApp.service:Storage#isSupported
         * @methodOf myApp.service:Storage
         * @description Проверяет поддержку localStorage платформой
         */
        function isSupported() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        }

        /**  
         *
         *  @ngdoc method
         *  @name myApp.service:Storage#clearStorage
         *  @methodOf myApp.service:Storage
         *  @description Полностью очищает localStorage
         */
        var clearStorage = function () {
            try {
                localStorage.clear();
            } catch (e) {
                console.log(e.message);
            }
        }

        /**
         *
         * @ngdoc method
         * @name myApp.service:Storage#update
         * @methodOf myApp.service:Storage
         * @param {Object} obj объект модель
         * @description Добавляет объект в контейнер, если объект с таким же первичным ключом уже присутствует в контейнере, данные должны быть обновлены Вложенные объекты также должны быть добавлены
         */
        var update = function (obj) {
//            try {
                var serv = $injector.get(obj.getClass());
                serv.onUpdate(obj);
                localStorage.setItem(obj.getClass() + ":" + obj.getKey().join(':'), JSON.stringify(obj.json()));
//            } catch (e) {
//                console.log(e.message);
//            }

        };

        /**  
         *
         *  @ngdoc method
         *  @name myApp.service:Storage#get
         *  @methodOf myApp.service:Storage
         * @param {String} className имя класса определенного с помощью angular.factory
         *  @param {Array|String|Number} primary первичный ключ. Массив, еслиключсоставной
         *  @return {Object} экземпляр класса  className
         *  @description возвращает объект по первичному ключу. Объект должен быть предварительно добавлены с помощью
         */
        var get = function (className, primary, callback) {
            try {
                //                console.log(primary);
                var item = localStorage.getItem(className + ":" + primary);
                //                console.log("storage.get():", item);
                if (item) {
                    callback(JSON.parse(item));
                } else {
                    callback(null);
                }

            } catch (e) {
                console.log(e.message);
            }
        };

        /**
         *
         * @ngdoc method
         * @name myApp.service:Storage#search
         * @methodOf myApp.service:Storage
         * @param {String} className имя класса определенного с помощью angular.factory
         * @param {Array|String|Number} params параметры поиска
         * @param {Function} callback функция callback
         * @return {Object} экземпляр класса  className
         * @description Ищет объект по параметрам в localStorage
         */
        var search = function (className, params, callback) {
            var serv = $injector.get(className);
            var keys = serv.searchInLocalStorage(params, callback);
            var results = [];
            for (var i = 0; i < keys.length; i++) {
                var item = localStorage.getItem(keys[i].join(":"));
                //                console.log("storage.search():", item);
                if (item) {
                    results.push(JSON.parse(item));
                }
            }
            if (results.length != keys.length) {
                callback(null);
            } else {
                callback(results);
            }
        };

        /**
         *
         * @ngdoc method
         * @name myApp.service:Storage#del
         * @methodOf myApp.service:Storage
         * @param {Object} obj объект модель
         * @description удаляет объект из контейнера.
         */
        var del = function (obj, callback) {
            try {
                localStorage.removeItem(obj.getKey());
            } catch (e) {
                console.log(e.message);
            }

        };

        return {
            del: del,
            update: update,
            get: get,
            isSupported: isSupported,
            clearStorage: clearStorage,
            search: search
            //            lastModified: lastModified,
            //            getFieldStat: getFieldStat,
            //            classesLastModified: classesLastModified,
            //            saveLastModify: saveLastModify,
            //            saveFieldStat: saveFieldStat
        };
}]);


//
//
//
//  var classesLastModified = new ClassesLastModified();
//
//        var classesFieldStat = new ClassesFieldStat();
//
//        var lastModified = function (query, callback) {
//            get("classesLastModified", "primary", function (data) {
//                if (data == null || typeof (callback) == 'undefined') {
//                    setTimeout(lastModified(query), 500);
//                } else {
//                    var result = new ClassesLastModified();
//                    for (var i in query)
//                        result[query[i]] = data[query[i]];
//                    console.log(result);
//                    callback(result);
//                }
//            });
//        };
//
//        /**
//         *
//         * @ngdoc method
//         * @name myApp.service:Storage#getFieldStat
//         * @methodOf myApp.service:Storage
//         * @description Метод для получения статистики
//         * определенного поля у указанного класса. В данный
//         * момент указывает максимальную и минимальную даты,
//         * за которые еще есть данные.
//         * @param {Array} query a
//         * @param {Function} callback a
//         * @return {Object} экземпляр класса className
//         */
//        var getFieldStat = function (query, callback) {
//            get("fieldStat", "primary", function (data) {
//                if (data == null) {
//                    setTimeout(getFieldStat(query, callback), 500);
//                } else {
//                    var result = [];
//                    for (var i in query) {
//                        var resType = data[query[i].type];
//                        var resField = resType[query[i].field];
//                        result.push({
//                            type: query[i].type,
//                            field: query[i].field,
//                            min: resField.min,
//                            max: resField.max
//                        });
//                    }
//                    callback(result);
//                }
//            });
//        };
//
//
//        var saveLastModify = waitDatabase(function (obj, callback) {
//            var db = database;
//            var trans = db.transaction(["classesLastModified"], "readwrite");
//            var store = trans.objectStore("classesLastModified"); //найдем хранилище для объектов данного класса
//
//            var request = store.put(obj); //положим в хранилище
//
//            request.onsuccess = function (e) { //если транзакт прошел успешно
//            };
//            trans.onerror = function (e) { //если что-то пошло не так
//                //                        console.log("update() transaction: Error", event);
//            };
//            request.onerror = function (e) { //если что-то пошло не так
//                //                        console.log("update(): Error", event);
//            };
//            callback();
//
//        });
//
//        var saveFieldStat = waitDatabase(function (obj, callback) {
//            if (obj instanceof Array) {
//                get("fieldStat", "primary", function (classesStat) {
//
//                    for (var i = 0; i < obj.length; i++) {
//                        classesStat[obj[i].type][obj[i].field].min = obj[i].min;
//                        classesStat[obj[i].type][obj[i].field].max = obj[i].max;
//                    }
//                    var db = database;
//                    var trans = db.transaction(["fieldStat"], "readwrite");
//                    var store = trans.objectStore("fieldStat");
//                    var request = store.put(classesStat);
//                    request.onsuccess = function (e) {};
//                    callback();
//                });
//            } else {
//                var db = database;
//                var trans = db.transaction(["fieldStat"], "readwrite");
//                var store = trans.objectStore("fieldStat");
//                var request = store.put(obj);
//                request.onsuccess = function (e) {};
//                callback();
//            }
//        });