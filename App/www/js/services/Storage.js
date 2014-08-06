/**
 * @ngdoc service
 * @description Сервис для кэширования данных
 * @name myApp.service:Storage
 */
myApp.factory('Storage', function () {

    var dbName = "storage";
    var database = {};

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
    function open() {
        var request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = function (event) {
            console.log("update store");
            var db = event.target.result;
            var objectStore = db.createObjectStore("visit", {
                keyPath: "id"
            });
        };

        request.onsuccess = function (event) {
            database = request.result;
            console.log("db in myApp.service.Storage.open: ", database);
        };

        request.onerror = function (event) { // Если ошибка
            alert("Что-то с IndexedDB пошло не так!");
        };
    }


    /**
     *
     * @ngdoc method
     * @name myApp.service:Storage#update
     * @methodOf myApp.service:Storage
     * @param {Object} obj объект модель
     * @description Добавляет объект в контейнер, если объект с таким же первичным ключом уже присутствует в контейнере, данные должны быть обновлены Вложенные объекты также должны быть добавлены
     */
    function update(obj) {
        open();
        //        var db = database;
        console.log("db in myApp.service.Storage.update: ", database);
        //        var objClass = obj.getClass(); //получим класс объекта
        //        var trans = db.indexedDB.db.transaction(["visit"], "readwrite");
        //        var store = trans.objectStore("visit"); //найдем хранилище для объектов данного класса
        //нужно проверить, нет ли объекта с таким же PK
        //обновление объекта: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Getting_data_from_the_database
        //если есть вложенные объекты, то как их вытащить?
        //        var request = store.put(obj); //положим в хранилище json-объект

        //если транзакт прошел успешно
        //        request.onsuccess = function (e) {
        //            //make something
        //            console.log("obj in db!");
        //        };
        //
        //        //если что-то пошло не так
        //        request.onerror = function (e) {
        //            console.log(e.value);
        //        };

    };

    //    /**  
    //     *
    //     *  @ngdoc method
    //     *  @name myApp.service:Storage#get
    //     *  @methodOf myApp.service:Storage
    //     *  @param {String} className имя класса определенного с помощью angular.factory
    //     *  @param {Array|String|Number} primary первичный ключ. Массив, еслиключсоставной
    //     *  @return {Object} экземпляр класса  className
    //     *  @description возвращает объект по первичному ключу. Объект должен быть предварительно добавлены с помощью
    //     */
    //    function get(className, primary) {
    //        var db = localdb.locdb;
    //        var objClass = obj.getClass(); //получим класс объекта
    //        var trans = db.transaction([objClass], "readwrite");
    //        var store = trans.objectStore(objClass); //найдем хранилище для объектов данного класса
    //
    //        var request = objectStore.get(primary); //произвести выборку по PK 
    //        request.onerror = function (event) {
    //            //make something
    //        };
    //        request.onsuccess = function (event) {
    //            // Do something with the request.result!
    //            //вернуть результат
    //            return request.result;
    //        };
    //    };
    //    /**
    //     *
    //     * @ngdoc method
    //     * @name myApp.service:Storage#del
    //     * @methodOf myApp.service:Storage
    //     * @param {Object} obj объект модель
    //     * @description удаляет объект из контейнера. Вложенные объекты не удаляются
    //     */
    //    function del(obj) {
    //        var db = localdb.locdb;
    //        var objClass = obj.getClass(); //получим класс объекта
    //        var trans = db.transaction([objClass], "readwrite");
    //        var store = trans.objectStore(objClass); //найдем хранилище для объектов данного класса
    //
    //        var request = store.delete(obj.getKey()); //получим PK объекта, далее удалим по PK из бд нужный объект
    //
    //        request.onsuccess = function (e) {
    //            //        make something
    //        };
    //
    //        request.onerror = function (e) {
    //            console.log(e);
    //        };
    //    };
    return {
        //        del: del,
        update: update,
        //        get: get,
        checkSupport: checkSupport,
        //        db: db,
        //        init: init
    };
});