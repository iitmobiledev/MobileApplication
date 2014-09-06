//indexedDB.deleteDatabase("storage")
/**
 * @ngdoc service
 * @description Сервис для кэширования данных
 * @name myApp.service:Storage
 */
myApp.service("Storage", [

    function (DateHelper) {

        var dbName = "storage";
        var database = null;
        var dbVersion = 1.0;

        function ClassesLastModified() {
            this.primary = "primary";
            this.OperationalStatistics = null;
            this.Visit = null;
            this.Expenditures = null;
        }

        function ClassesFieldStat() {
            this.primary = "primary";
            this.OperationalStatistics = {
                date: {
                    min: null,
                    max: null
                }
            };
            this.Visit = {
                date: {
                    min: null,
                    max: null
                }
            };
            this.Expenditures = {
                date: {
                    min: null,
                    max: null
                }
            };
        }

        var classesLastModified = new ClassesLastModified();

        var classesFieldStat = new ClassesFieldStat();

        open();

        var lastModified = function (query, callbacK) {
            get("classesLastModified", "primary", function (data) {
                if (data == null || typeof (callbacK) == 'undefined') {
                    setTimeout(lastModified(query), 500);
                } else {
                    var result = new ClassesLastModified();
                    for (var i in query)
                        result[query[i]] = data[query[i]];
                    callbacK(result);
                }
            });
        };

        /**
         *
         * @ngdoc method
         * @name myApp.service:Storage#getFieldStat
         * @methodOf myApp.service:Storage
         * @description Метод для получения статистики
         * определенного поля у указанного класса. В данный
         * момент указывает максимальную и минимальную даты,
         * за которые еще есть данные.
         * @param {Array} query a
         * @param {Function} callback a
         * @return {Object} экземпляр класса className
         */
        var getFieldStat = function (query, callback) {
            get("fieldStat", "primary", function (data) {
                var result = [];
                for (var i in query) {
                    var resType = data[query[i].type];
                    var resField = resType[query[i].field];
                    result.push({
                        type: query[i].type,
                        field: query[i].field,
                        min: resField.min,
                        max: resField.max
                    });
                }
                callback(result);
            });
        };


        /**
         *
         * @ngdoc method
         * @name myApp.service:Storage#checkSupport
         * @methodOf myApp.service:Storage
         * @description Проверяет поддержку indexedDB платформой
         */
        function checkSupport() {
            return window.indexedDB;
        }

        var saveLastModify = waitDatabase(function (obj, callback) {
            var db = database;
            var trans = db.transaction(["classesLastModified"], "readwrite");
            var store = trans.objectStore("classesLastModified"); //найдем хранилище для объектов данного класса

            var request = store.put(obj); //положим в хранилище

            request.onsuccess = function (e) { //если транзакт прошел успешно
                //            console.log("onsuccess");
            };
            trans.onerror = function (e) { //если что-то пошло не так
                //                        console.log("update() transaction: Error", event);
            };
            request.onerror = function (e) { //если что-то пошло не так
                //                        console.log("update(): Error", event);
            };
            callback();

        });

        var saveFieldStat = waitDatabase(function (obj, callback) {
            if (obj instanceof Array) {
                get("fieldStat", "primary", function (classesStat) {

                    for (var i = 0; i < obj.length; i++) {
                        classesStat[obj[i].type][obj[i].field].min = obj[i].min;
                        classesStat[obj[i].type][obj[i].field].max = obj[i].max;
                    }
                    var db = database;
                    var trans = db.transaction(["fieldStat"], "readwrite");
                    var store = trans.objectStore("fieldStat");
                    var request = store.put(classesStat);
                    request.onsuccess = function (e) {};
                    callback();
                });
            } else {
                var db = database;
                var trans = db.transaction(["fieldStat"], "readwrite");
                var store = trans.objectStore("fieldStat");
                var request = store.put(obj);
                request.onsuccess = function (e) {};
                callback();
            }
        });

        /**
         *
         * @ngdoc method
         * @name myApp.service:Storage#init
         * @methodOf myApp.service:Storage
         * @description Инициализирует ибд
         */
        function open(callback) {

            var request = indexedDB.open(dbName, dbVersion);

            request.onupgradeneeded = function (event) {
                var db = event.target.result;
                
                console.log("onupgradeneeded");
                console.error("onupgradeneeded");

                var delModels = ['OperationalStatistics', 'Visit', 'Expenditures', 'classesLastModified', 'fieldStat'];
                //                for (var i in delModels) {
                //                    if (db.objectStoreNames.contains(delModels[i])) {
                //                        db.deleteObjectStore(delModels[i]);
                //                    }
                //                }

                var models = ['OperationalStatistics', 'Visit', 'Expenditures'];
                var $inj = angular.injector(['myApp']);
                for (var i in models) {
                    var serv = $inj.get(models[i]);
                    serv.initializeIndexedDb(db);
                }
                db.createObjectStore("classesLastModified", {
                    keyPath: "primary"
                });
                saveLastModify(classesLastModified, function () {
                    console.log("saveLastModify");
                });

                db.createObjectStore("fieldStat", {
                    keyPath: "primary"
                });
                saveFieldStat(classesFieldStat, function () {
                    console.log("saveFieldStat");
                });

                alert("onupgradeneeded");
                //                for (var i=0;i<db.objectStoreNames.lenght;i++) {
                //                    console.log(db.objectStoreNames[i]);
                //                }
            };

            request.onsuccess = function (event) {
                database = request.result;
            };

            request.onerror = function (event) {};
        }

        /**
         *
         * @ngdoc method
         * @name myApp.service:Storage#waitDatabase
         * @methodOf myApp.service:Storage
         * @param {Function} fn функция,которую нужно выполнить когда бд инициализирована
         * @description Ждет, пока бд инициализурется
         */
        function waitDatabase(fn) {
            var f = function () {
                var args = arguments;
                if (database) {
                    return fn.apply(null, args);
                }
                setTimeout(function () {
                    f.apply(null, args);
                }, 100);
            }
            return f;
        };


        /**
         *
         * @ngdoc method
         * @name myApp.service:Storage#update
         * @methodOf myApp.service:Storage
         * @param {Object} obj объект модель
         * @description Добавляет объект в контейнер, если объект с таким же первичным ключом уже присутствует в контейнере, данные должны быть обновлены Вложенные объекты также должны быть добавлены
         */
        var update = waitDatabase(function (obj) {
            var db = database;
            var objClass = obj.getClass(); //получим класс объекта
            var trans = db.transaction([objClass], "readwrite");
            var store = trans.objectStore(objClass); //найдем хранилище для объектов данного класса

            var request = store.put(obj); //положим в хранилище

            request.onsuccess = function (e) { //если транзакт прошел успешно
            };

            trans.onerror = function (e) { //если что-то пошло не так
                //            console.log("update() transaction: Error", event);
            };
            request.onerror = function (e) { //если что-то пошло не так
                //            console.log("update(): Error", event);
            };

        });

        /**  
         *
         *  @ngdoc method
         *  @name myApp.service:Storage#get
         *  @methodOf myApp.service:Storage
         *  @param {String} className имя класса определенного с помощью angular.factory
         *  @param {Array|String|Number} primary первичный ключ. Массив, еслиключсоставной
         *  @return {Object} экземпляр класса  className
         *  @description возвращает объект по первичному ключу. Объект должен быть предварительно добавлены с помощью
         */
        var get = waitDatabase(function (className, primary, callback) {
            var db = database;
            if (db.objectStoreNames.contains(className)) {
                var trans = db.transaction([className], "readwrite");
                var store = trans.objectStore(className); //найдем хранилище для объектов данного класса

                var request = store.get(primary);
                request.onerror = function (event) {
                    //make something
                };
                request.onsuccess = function (event) {
                    if (request.result) {
                        callback(request.result);
                    } else {
                        callback(null);
                    }
                };
            } else
                callback(null);
        });

        /**
         *
         * @ngdoc method
         * @name myApp.service:Storage#search
         * @methodOf myApp.service:Storage
         * @param {String} className имя класса определенного с помощью angular.factory
         * @param {Array|String|Number} params параметры поиска
         * @param {Function} callback функция callback
         * @return {Object} экземпляр класса  className
         * @description Ищет объект по параметрам в базе данных
         */
        var search = waitDatabase(function (className, params, callback) {
            var db = database;
            if (db.objectStoreNames.contains(className)) {
                var trans = db.transaction([className], "readwrite");
                var $inj = angular.injector(['myApp']);
                var serv = $inj.get(className);
                serv.searchIndexedDb(trans, params, callback);
            } else
                callback(null);
        });


        /**
         *
         * @ngdoc method
         * @name myApp.service:Storage#del
         * @methodOf myApp.service:Storage
         * @param {Object} obj объект модель
         * @description удаляет объект из контейнера. Вложенные объекты не удаляются
         */
        var del = waitDatabase(function (obj, callback) {
            var db = database;
            var objClass = obj.getClass();
            var trans = db.transaction([objClass], "readwrite");
            var store = trans.objectStore(objClass); //найдем хранилище для объектов данного класса

            var request = store.delete(obj.getKey()); //получим PK объекта, далее удалим по PK из бд нужный объект

            request.onsuccess = function (e) {
                callback();
                //        make something
            };

            request.onerror = function (e) {
                console.log(e);
            };
        });
        return {
            del: del,
            open: open,
            update: update,
            get: get,
            search: search,
            checkSupport: checkSupport,
            lastModified: lastModified,
            getFieldStat: getFieldStat,
            classesLastModified: classesLastModified,
            saveLastModify: saveLastModify,
            saveFieldStat: saveFieldStat
        };
}]);