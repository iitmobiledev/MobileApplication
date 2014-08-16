//indexedDB.deleteDatabase("storage")

/**
 * @ngdoc service
 * @description Сервис для кэширования данных
 * @name myApp.service:Storage
 */
myApp.factory('Storage', function () {

    var dbName = "storage";
    var database = null;
    var dbVersion = 1.0;
    open();
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


    /**
     *
     * @ngdoc method
     * @name myApp.service:Storage#init
     * @methodOf myApp.service:Storage
     * @description Инициализирует ибд
     */
    function open(callback) {
        var request = indexedDB.open(dbName, dbVersion);

        //пересоздаются ли объекты при изменении версии!?
        request.onupgradeneeded = function (event) {
            console.log("update store");
            var db = event.target.result;

            var $inj = angular.injector(['myApp']);
            var serv = $inj.get('OperationalStatistics');
            serv.initializeIndexedDb(db);
        };

        request.onsuccess = function (event) {
            database = request.result;
            console.log("db in myApp.service.Storage.open: ", database);
        };

        request.onerror = function (event) { // Если ошибка
            console.log("Что-то с IndexedDB пошло не так!");
        };
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
        var objClass = obj.getClass().toLowerCase(); //получим класс объекта
        var trans = db.transaction([objClass], "readwrite");
        var store = trans.objectStore(objClass); //найдем хранилище для объектов данного класса
        //        обновление объекта: https: //developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Getting_data_from_the_database
        var request = store.put(obj); //положим в хранилище

        request.onsuccess = function (e) { //если транзакт прошел успешно
            console.log("obj in db!");
        };

        request.onerror = function (e) { //если что-то пошло не так
            console.log(e.value);
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
        var objClass = className.toLowerCase(); //получим класс объекта
        if (db.objectStoreNames.contains(objClass)) {
            var trans = db.transaction([objClass], "readwrite");
            var store = trans.objectStore(objClass); //найдем хранилище для объектов данного класса
            //инжектором найти класс и проделать для него гетКей

            //            var request = store.get();
            //            request.onerror = function (event) {
            //                //make something
            //            };
            //            request.onsuccess = function (event) {
            //                if (request.result) {
            //                    console.log("obj get:", request.result);
            //                    callback(request.result);
            //                    //                    return request.result;
            //                } else {
            //                    console.log("object not found!", request.result);
            //                    callback(null);
            //                }
            //            };
            //        }
            //        return null;

            var pr = [];
            for (var i in primary) {
                pr.push(primary[i].toString());
            }
            var request = store.get(pr.join(":"));
            request.onerror = function (event) {
                //make something
            };
            request.onsuccess = function (event) {
                if (request.result) {
                    callback(request.result);
                }
            };
        }
        callback(null);
    });


    var search = waitDatabase(function (className, params, callback) {
        var db = database;
        var objClass = className.toLowerCase(); //получим класс объекта
        if (db.objectStoreNames.contains(objClass)) {
            var trans = db.transaction([objClass], "readwrite");
            var store = trans.objectStore(objClass); //найдем хранилище для объектов данного класса

            var obj;
            obj.searchIndexedDb(db, callback);

        }

        return null;
    });
    /**
     *
     * @ngdoc method
     * @name myApp.service:Storage#del
     * @methodOf myApp.service:Storage
     * @param {Object} obj объект модель
     * @description удаляет объект из контейнера. Вложенные объекты не удаляются
     */
    var del = waitDatabase(function (obj) {
        var db = database;
        var objClass = obj.getClass().toLowerCase(); //получим класс объекта
        var trans = db.transaction([objClass], "readwrite");
        var store = trans.objectStore(objClass); //найдем хранилище для объектов данного класса

        var request = store.delete(obj.getKey()); //получим PK объекта, далее удалим по PK из бд нужный объект

        request.onsuccess = function (e) {
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
        checkSupport: checkSupport
    };
});