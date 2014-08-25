/**
 * @ngdoc service
 * @description Сервис - конструктор класса Визит
 * @name myApp.service:FinanceStatistics
 * @requires myApp.service:Model 
 * @param {Object} data Данные в формате ключ: значение.
 */
myApp.factory('FinanceStatistics', function (Model, DateHelper) {
    return Model("FinanceStatistics", {
        deserialize: function (self, data) {
            Object.defineProperty(self, "date", {
                value: new Date(data.date),
                writable: true
            });
            Object.defineProperty(self, "tillMoney", {
                value: data.tillMoney,
                writable: true
            });
            Object.defineProperty(self, "morningMoney", {
                value: data.morningMoney,
                writable: true
            });
            Object.defineProperty(self, "credit", {
                value: data.credit,
                writable: true
            });
            Object.defineProperty(self, "debit", {
                value: data.debit,
                writable: true
            });
        },
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['date']
    });
});

/**
 * @ngdoc service
 * @description Сервис - конструктор класса Визит
 * @name myApp.service:OperationalStatistics
 * @requires myApp.service:Model 
 * @requires myApp.service:FinanceStatistics 
 * @param {Object} data Данные в формате ключ: значение.
 */
myApp.factory('OperationalStatistics', function (Model, FinanceStatistics) {

    var opStat = Model("OperationalStatistics", {
        deserialize: function (self, data) {
            self.date = new Date(data.date);
            self.step = data.step;
            self.proceeds = data.proceeds;
            self.profit = data.profit;
            self.clients = data.clients;
            self.workload = data.workload;
            self.financeStat = new FinanceStatistics(data.financeStat);
        },
        serialize: function (self) {
            self.constructor.prototype.call(self);
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['date', 'step'],
        indexes: {
            date: false,
            step: false
        }
    });

    opStat.searchIndexedDb = function (trans, params, callback) {
        var result = [];
        var store = trans.objectStore("OperationalStatistics"); //найдем хранилище для объектов данного класса
        var keyRange = IDBKeyRange.bound(new Date(params.dateFrom), new Date(params.dateTill));
        var request = store.index(params.index).openCursor(keyRange);
        request.onerror = function (event) {
            callback(null);
        };
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                result.push(cursor.value);
                cursor.
                continue ();
            }
        };

        trans.oncomplete = function (e) {
            if (result.length != 0) {
                callback(result);
            } else
                callback(null);
        }
    }
    return opStat;
});