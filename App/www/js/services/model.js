/**
 * @ngdoc overview
 * @name myApp.module:DataExchange
 * @description Здесь обсуждаются вопросы, связанные с получением и хранением
 * объектов-данных. Процесс взаимодействия в целом такой: мы получаем с сервера
 * данные, преобразуем их на стороне клиента в объекты, с которыми работаем
 *
 * ## Общие соображения
 *
 * 1. Объекты на клиенте могут иметь собственное поведение
 * 2. На сервер и с сервера мы можем передавать только JSON, следовательно,
 *    нужно позаботиться о сериализации/десериализации сложных типов, начиная
 *    с Date и включая все пользовательские типы из п.1
 * 3. Мы понимаем, что стратегии получения данных могут быть разными
 *    в зависимости от интерфейса. Пример:
 *
 *    * Выводим статистику только за текущую дату в панельке с переключением
 *      дат без скроллинга. Для этой задачи достаточно получать один объект
 *      статистики по дате/шагу.
 *    * Та же задача, но со скроллингом.
 *      Необходимо получить как минимум три объекта - за текущий,
 *      пердыдущий и следующий периоды
 *    * Та же задача, но со сравнением с предыдущими периодами.
 *      Нужно получать как минимум шесть объектов - текущий, предыдущий,
 *      следущий периоды + три объекта для сравнения.
 *
 * 4. Стратегии получения данных могут также "наслаиваться" друг на друга,
 *    например, чтобы уменьшить время отклика, нам вероятно, захочется
 *
 *    * получать данные за немного более ранний и немного более поздний период и
 *    * кэшировать данные, чтобы не получать заново например, при промотке
 *      обратно
 *
 *
 * ## Задачи, которые нам нужно решить для взаимодействия с сервером.
 *
 * 1. Позволить (рекурсивно) создавать полноценные javascript-объекты из
 *    получаемых данных
 * 2. Предоставить общий подход для сериализации/десериализации
 * 3. Предоставить общий подход для идентификации объектов.
 * 3. Предоставить сервис  кэширования
 *
 *  * уровня 1, т.е. в оперативной памяти на время выполнения
 *  * уровня 2, т.е. в постоянном хранилище, сохраняется между запусками
 *  * реализовать механизм обновления кэша
 *
 * 3. Предоставить возможность менять стратегии взаимодействия с сервером
 * в зависимости от типа объекта и конкретной задачи, которая решается в данный
 * момент
 * 3. Сформулировать и реализовать интерфейс взаимодействия с сервером.
 *
 * {@link myApp.interface:IModel} - интерфейс для объектов, который позволит
 * решить первые 4 задачи <br/>
 * {@link myApp.service:Model} - фабрика классов, реализующих
 * {@link myApp.interface:IModel}
 * <br/>
 * {@link myApp.interface:IStorage} - интерфейс для cинхронного доступа к данным
 *  (для кэша)
 * <br/>
 * {@link myApp.interface:IAsyncStorage} - интерфейс для асинхронного доступа к
 * данным
 * <br/>
 */
/** @ngdoc interface
 *  @name myApp.interface:IModel
 *  @description интерфейс, который должны реализовать объекты данных.
 *  коструктор класса должен принимать десериализованные JSON  объекты
 */
/**  @ngdoc method
 *  @methodOf myApp.interface:IModel
 *  @name getKey
 *  @return {Array} массив значений свойств, входящих в первичный ключ
 *  @virtual
 */
/**  @ngdoc method
 *  @methodOf myApp.interface:IModel
 *  @name getClass
 *  @return {String}  название класса
 *  @virtual
 */
/**  @ngdoc method
 *  @methodOf myApp.interface:IModel
 *  @name json
 *  @return {Object} отформатированный JSON-объект
 *  @virtual
 */
/** @ngdoc interface
 *  @name myApp.interface:IStorage
 *  @description интерфейс, для синхронного контейнера
 */
/**  @ngdoc method
 *  @methodOf myApp.interface:IStorage
 *  @name get
 *  @param {String} className имя класса определенного с помощью angular.factory
 *  @param {Array|String|Number}  primary первичный ключ.
 *  Массив, если ключ составной
 *  @return {Object} экземпляр класса  className
 *  @description возвращает объект по первичному ключу. Объект должен быть
 *  предварительно добавлены с помощью
 *  {@link myApp.interface:IStorage#methods_save}
 *  @virtual
 */
/**  @ngdoc method
 *  @methodOf myApp.interface:IStorage
 *  @name update
 *  @param {Object} obj объект-модель
 *  @description добавляет объект в контейнер, если объект с таким же первичным
 *  ключом уже присутствует в контейнере, данные должны быть обновлены
 *  Вложенные объекты также должны быть добавлены
 *  @virtual
 */
/**  @ngdoc method
 *  @methodOf myApp.interface:IStorage
 *  @name del
 *  @param {Object} obj объект-модель
 *  @virtual
 *  @description  удаляет объект из контейнера. Вложенные объекты не удаляются
 */
/** @ngdoc interface
 *  @name myApp.interface:IAsyncStorage
 *  @description интерфейс, для асинхронного контейнера
 */
/**  @ngdoc method
 *  @methodOf myApp.interface:IAsyncStorage
 *  @name get
 *  @param {String} className имя класса определенного с помощью
 *  angular.factory
 *  @param {Array|String|Number}  primary первичный ключ.
 *  Массив, если ключ составной
 *  @param {Function} success(obj) вызывается в момент, когда объект получен,
 *  параметр - экземпляр класса  `className`
 *  @description возвращает объект по первичному ключу
 *  @virtual
 */
/**  @ngdoc method
 *  @methodOf myApp.interface:IAsyncStorage
 *  @name search
 *  @param {String} className имя класса определенного с помощью
 *  angular.factory
 *  @param {Object}  params параметры поиска,
 *  @param {Function} success(data) вызывается в момент, когда объект получен,
 *  параметр ассоциативный массив из экземпляров. Ключи - строковые
 *  представления первичных ключей, значения - экземпляры класса `className`
 *  @description возвращает объект по первичному ключу
 *  @virtual
 */
/**  @ngdoc method
 *  @methodOf myApp.interface:IAsyncStorage
 *  @name update
 *  @param {Object} obj объект-модель
 *  @param {Function} callback(obj) вызывается после успешного
 *  сохранения объекта
 *  @description добавляет объект в контейнер, если объект с таким же первичным
 *  ключом уже присутствует в контейнере, данные должны быть обновлены
 *  Вложенные объекты также должны быть добавлены
 *  @virtual
 */
/**  @ngdoc method
 *  @methodOf myApp.interface:IAsyncStorage
 *  @name del
 *  @param {Object} obj объект-модель
 *  @param {Function} callback(obj) - вызывается после того, как объект удален
 *  @virtual
 *  @description  удаляет объект из контейнера. Вложенные объекты не удаляются
 */
/**
 * @ngdoc service
 * @name myApp.service:Model
 * @description сервис-фабрика классов, для которых идентификация определена
 * как совокупность полей и определена десериализация.
 * @param {String} className название класса
 * @param {Object} [options={}] объект, задающий нюансы поведения:
 *  <pre>
 *  {
 *      // обратный вызов для сериализации объекта. Принимает один
 *      // аргумент - типизированный объект, вовращает объект-данные.
 *      // Поведение по умолчанию: копирует все собственные значения,
 *      // если значение содержит метод  json, он будет вызван и результат
 *      // записан вместо самого объекта.  Добавляет ключ __class__
 *      // содержащий имя класса
 *      serialize: function(self){}
 *      // обратный вызов для сериализации объекта. Принимает два
 *      // аргумента - типизированный объект и объект-данные.
 *      // Поведение по умолчанию - почленное копирование
 *      deserialize: function(self, data){}
 *      // массив с именами полей, входящих в первичный ключ
 *      // по умолчанию: ['id']
 *      primary: ['something', 'something2']
 * }
 * </pre>
 * @return {Function} конструктор для объектов, у которых определен
 * интерфейс модели, в качестве параметра конструктору передаются JSON-данные.
 * Класс содержит также статический метод  key(data), который позволяет
 * вычислить первичный ключ по JSON-данным
 * @example
 * <pre>
 * myApp.factory("OperationalStatistics",["Model", "DateHelper",function(Model){
 *      OpStat = Model("OperationalStatistics", {
 *          deserialize: function(self, data){
 *              Object.defineProperty(self,"period", {
 *                  value: DateHelper.getPeriod(new Date(data.date), data.step),
 *                  writable: false
 *              });
 *              Object.defineProperty(self,"step", {
 *                  get: function(){return this.period.step;}
 *                  writable: false
 *              });
 *              Object.defineProperty(self,"date", {
 *                  get: function(){return this.period.begin;}
 *                  writable: false
 *              });
 *              delete data.date;
 *              delete data.step;
 *              angular.extend(self, data);
 *          },
 *          serialize: function(self){
 *              self.constructor.prototype.call(self)
 *              var data = angular.extend({},self);
 *              delete data.period;
 *              return data;
 *          },
 *          primary: ['step', 'date']
 *      });
 *      return OpStat;
 * }]);
 * myApp.controller("Something", function($scope, OperationalStatistics){
 *      $scope.$watch("something", function(){
 *          var data = [{
 *              step: 'day',
 *              date: '2014-04-07',
 *              proceeds: 12,
 *              profit: 123.33,
 *              clients: 33,
 *              workload: 70
 *           }, {...}, {...
 *           }];
 *           var result = {};
 *           angular.forEach(data, function(key, value){
 *              var key = OperationalStatistics.key(value);
 *              result[key] = new OpStat(value);
 *           });
 *           $scope.somethingElse = result;
 *      });
 * }]);
 *</pre>
 */
myApp.factory("Model", function () {
    return function (className, options) {
        options = options || {};
        if (!options.deserialize) {
            options.deserialize = angular.extend;
        }
        if (!options.primary) {
            options.primary = ['id'];
        }
        if (!options.serialize) {
            options.serialize = function (self) {
                var data = {};
                angular.forEach(self, function (key, value) {
                    if (value.json instanceof Function) {
                        data[key] = value.json();
                    } else {
                        data[key] = value;
                    }
                });
                data.__class__ = className;
                return data;
            };
        }

        var clz = function (data) {
            options.deserialize(this, data);
        };
        clz.prototype = {
            __class__: className,
            __primary__: options.primary,
            /**
             *  @ngdoc method
             *  @name getKey
             *  @methodOf myApp.service:Model
             *  @return {Array}  массив значений первичного ключа
             */
            getKey: function () {
                var res = [];
                for (var i = 0; i < clz.__primary__.length; i++) {
                    res.push(this[clz.__primary__[i]]);
                }
                return res;
            },
            getClass: function () {
                return this.__class__;
            },
            json: function () {
                return options.serialize(this);
            }
        };

        Object.defineProperty(clz.prototype, "__primary__", {
            get: function () {
                return this.getKey().join(":");
            }
        });
        clz.__primary__ = options.primary;
        clz.__class__ = className;

        clz.getIndexes = function () {
            return options.indexes;
        };


//        clz.initializeIndexedDb = function (db) {
//            var objectStore = db.createObjectStore(clz.__class__, {
//                keyPath: "__primary__"
//            });
//
//            var indexes = [];
//            angular.forEach(clz.getIndexes(), function (value, name) {
//                objectStore.createIndex(name, name, {
//                    unique: value
//                });
//                this.push(name.toString());
//            }, indexes);
//
//            var compositeIndex = indexes.join(":");
//            if (compositeIndex != indexes) {
//                objectStore.createIndex(compositeIndex, indexes, {
//                    unique: false
//                });
//            }
//
//        }

        /**
         *  @ngdoc method
         *  @name key
         *  @param {Object|Array} data JSON-данные для определения первичного
         *  ключа либо массив значений первичного ключа
         *  @methodOf myApp.service:Model
         *  @return {String}  строковое представление первичного  ключа
         *  @type {Array}
         *  @description статический метод, который может "посчитать"
         *  первичный ключ без создания объекта
         *  @example
         *  <pre>
         *  var Something = Model("Something",{primary:['date','step']});
         *  var key = Something.key([new Date(), 'day']);
         *  var key = Something.key({date: new Date(), step: 'day'});
         *  </pre>
         */
        clz.key = function (data) {
            if (!(data instanceof Array)) {
                data = clz.prototype.getKey.call(data);
            }
            return data.join(":");
        };
        return clz;
    };
});



/*
 * @ngdoc object
 * @description Объект "статистика салона"
 * @name myApp.object:OperationalStatistic
 * @returns {Function} конструктор класса OperationalStatistics
 * @ property DateTime date дата за которую получаем все данные
 * @ property Number proceeds выручка
 * @ property Number profit; //прибыль
 * @ property Number clients; //количество клиентов
 * @ property Number workload; //загруженность
myApp.factory("OperationalStatistics", ["Model",function(Model){
    var OS = function(data){
        angular.extend(this, data);
    }
    OS.prototype = Model.prototype;
    return OS;
}]);

myApp.service("Loader", ["$http", function($http){
    return {
        get: function(modelClass, primaryKey, callback){

        },
        search: function(search, callback){
            $
        }
    }
}]);

myApp.controller('OperationalStatisticController',
function ($scope, $location, OperationalStatisticLoader, DateHelper) {
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#updatePages
     * @methodOf myApp.controller:OperationalStatisticController
     * @description Метод для обновления данных статистики на
     * текущей, левой и правой страницах.
     *
    $scope.updatePages = function(){

        Loader.search("OperationalStatistics",{
            dateFrom: min($scope.period.getPrev().begin(),
            p.getComparison().begin()),
            dateTill: p.getNext().end(),
            step: $scope.step,
        }, function(data){
        //  Для получения объектов  вида
        //  {currentData: {...}, prevData: {...}}
        //  здесь самое время сделать нужный препроцессинг
        $scope.pages = data;
        });
    }
        $scope.changePeriod = function(){
            $scope.period = DateHelper.getPeriod($scope.date, $scope.step);
        }
        $scope.$watch('period', $scope.updatePages2);
        $scope.$watch("step", $scope.changePeriod);
        $scope.$watch("date.toDateString()", $scope.changePeriod);


        
         *
         * @ngdoc method
         * @name myApp.controller:OperationalStatisticController#updatePages
         * @methodOf myApp.controller:OperationalStatisticController
         * @description Метод для обновления данных статистики на
         * текущей, левой и правой страницах.
         *
        $scope.updatePages2 = function(){
            var p = DatHelper.getPeriod($scope.date, $scope.step);

            Loader.search("OperationalStatistics",{
                dateFrom: p.getPrev().begin,
                dateTill: p.getNext().end,
                step: $scope.step,
            }, function(data){
            //  Для получения объектов  вида
            //  {currentData: {...}, prevData: {...}}
            //  здесь самое время сделать нужный препроцессинг
                $scope.pages = data;
            });
        }
        
         * $scope.$watch('step', function(){
         *      $scope.
         *      $scope.updatePages2();
         * });
        */
