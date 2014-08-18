//indexedDB.deleteDatabase("storage")

/**
 * @ngdoc service
 * @description Сервис для кэширования данных
 * @name myApp.service:Storage
 */
myApp.factory('Storage', function (DateHelper) {

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

            var models = ['Visit']; //'OperationalStatistics', 
            var $inj = angular.injector(['myApp']);
            for (var i in models) {
                var serv = $inj.get(models[i]);
                console.log(serv);
                serv.initializeIndexedDb(db);
            }
        };

        request.onsuccess = function (event) {
            database = request.result;
            console.log("db in myApp.service.Storage.open: ", database);
        };

        request.onerror = function (event) { // Если ошибка
            console.log("open(): Error", event);
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
        var objClass = obj.getClass(); //получим класс объекта
        var trans = db.transaction([objClass], "readwrite");
        var store = trans.objectStore(objClass); //найдем хранилище для объектов данного класса
        var request = store.put(obj); //положим в хранилище

        request.onsuccess = function (e) { //если транзакт прошел успешно
            console.log("obj in db!");
        };

        trans.onerror = function (e) { //если что-то пошло не так
            console.log("update() transaction: Error", event);
        };
        request.onerror = function (e) { //если что-то пошло не так
            console.log("update(): Error", event);
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
        }
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
            console.log("serv", serv.prototype);
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
    var del = waitDatabase(function (obj) {
        var db = database;
        var objClass = obj.getClass();
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
        search: search,
        checkSupport: checkSupport
    };
});