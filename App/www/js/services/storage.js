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
                storage = new StorageCreator();
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
            try {
                var serv = $injector.get(obj.getClass());
                serv.onUpdate(obj);
                var primary = obj.getClass() + ":" + obj.getKey().join(":")
                storage.setItem(primary, obj);
            } catch (e) {
                console.log(e.message);
            }
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
            //            try {
            //                console.log(primary);
            var item = storage.getItem(className + ":" + primary);
            //                console.log("storage.get():", item);
            if (item) {
                callback(item);
            } else {
                callback(null);
            }

            //            } catch (e) {
            //                console.log(e.message);
            //            }
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
                var item;
                if (keys[i] instanceof Array){
                    var key = keys[i].join(":");
                    item = storage.getItem(key);
                }
                else{
                    item = storage.getItem(keys[i]);
                }
                if (item) {
                    results.push(item);
                }
            }
            if (results.length != keys.length || results.length == 0) {
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
                storage.removeItem(obj.getKey());
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
        };
}]);