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
            self.date = new Date(data.date);
            self.tillMoney = data.tillMoney;
            self.morningMoney = data.morningMoney;
            self.credit = data.credit;
            self.debit = data.debit;
            self.name = data.name;
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
myApp.factory('OperationalStatistics', function (Model, FinanceStatistics, DateHelper) {

    var opStat = Model("OperationalStatistics", {
        deserialize: function (self, data) {
            var date = new Date(data.date);
            self.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            self.step = data.step;
            self.proceeds = data.proceeds;
            self.profit = data.profit;
            self.clients = data.clients;
            self.workload = data.workload;
            if (data.financialStat)
                self.financialStat = new FinanceStatistics(data.financialStat);
            else
                self.financialStat = null;
        },
        primary: ['date', 'step']
    });
    opStat.searchInLocalStorage = function (params, callback) {
        var keys = [];
        var startDate = new Date(params.dateFrom);
        var endDate = new Date(params.dateTill);
        for (var i = startDate; i < endDate || i.toDateString() == endDate.toDateString(); i = DateHelper.getNextPeriod(new Date(i), params.step).begin) {
            var item = [];
            item.push("OperationalStatistics");
            item.push(i);
            item.push(params.step);
            keys.push(item);
        }
        return keys;
    }

    opStat.keysByDates = {};
    opStat.onUpdate = function (obj) {
    }
    //    opStat.searchIndexedDb = function (trans, params, callback) {
    //        var result = [];
    //        var store = trans.objectStore("OperationalStatistics"); //найдем хранилище для объектов данного класса
    //        var keyRange = IDBKeyRange.bound([params.step, new Date(params.dateFrom)], [params.step, new Date(params.dateTill)]);
    //        console.log(keyRange);
    //        var request = store.index("step_date").openCursor(keyRange);
    //        request.onerror = function (event) {
    //            callback(null);
    //        };
    //        request.onsuccess = function (event) {
    //            var cursor = event.target.result;
    //            if (cursor) {
    //                result.push(cursor.value);
    //                cursor.continue();
    //            }
    //        };
    //
    //        trans.oncomplete = function (e) {
    //            if (result.length != 0) {
    //                callback(result);
    //            } else
    //                callback(null);
    //        }
    //    }
    return opStat;
});