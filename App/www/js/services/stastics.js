///**
// * @ngdoc service
// * @description Сервис для загрузки статистики за период.
// * @name myApp.service:OperationalStatisticLoader
// * @requires myApp.service:DateHelper
// * @requires myApp.service:OperatonalStatisticsDataSumming
// */
//myApp.factory('OperationalStatisticLoader', function (DateHelper, OperatonalStatisticsDataSumming) {
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:OperationalStatisticLoader#getData
//     * @methodOf myApp.service:OperationalStatisticLoader
//     * @description Функция для получения статистических данных за
//     * период.
//     * @param {Date} date Дата, за которую необходимо получить данные.
//     * @param {String} step Название периода, допустимые значения
//     * параметра описаны в DateHelper.steps.
//     * @returns {OperationalStatistics} Объект, содержищий статистические
//     * данные.
//     */
//    //    function getData(dateFrom, dateTill) {
//    //        return getOperationalStatisticsData(dateFrom, dateTill, DateHelper.getPrevPeriod);
//    ////        var statistics = GetOperationalStatistics(period.begin, period.end);
//    ////        return statistics || {};
//    //    }
//
//    //    function getDataForChart(date){
//    //        var endDate = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
//    //        var statistics = GetStatisticsForChart(date, endDate);
//    //        return statistics || [];
//    //    }
//
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:OperationalStatisticLoader#getMinDate
//     * @methodOf myApp.service:OperationalStatisticLoader
//     * @description Функция для получения минимальной даты (самой
//     * прошлой), за которую есть статистические данные.
//     * @returns {Date} Дата самых давних данных статистики.
//     */
//    function getMinDate() {
//        var allStatistic = GetOperationalStatistics();
//        var minDate = new Date();
//        for (var i = 0; i < allStatistic.length; i++) {
//            if (allStatistic[i].date < minDate)
//                minDate = new Date(allStatistic[i].date.getFullYear(), allStatistic[i].date.getMonth(), allStatistic[i].date.getDate());
//        }
//        return minDate;
//    }
//
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:OperationalStatisticLoader#getMaxDate
//     * @methodOf myApp.service:OperationalStatisticLoader
//     * @description Функция для получения максимальной даты (самой
//     * будущей), за которую есть статистические данные.
//     * @returns {Date} Дата, за которую внесены максимально будущие
//     * статистические данны.
//     */
//    function getMaxDate() {
//        var allStatistic = GetOperationalStatistics();
//        var maxDate = new Date();
//        for (var i = 0; i < allStatistic.length; i++) {
//            if (allStatistic[i].date > maxDate)
//                maxDate = new Date(allStatistic[i].date.getFullYear(), allStatistic[i].date.getMonth(), allStatistic[i].date.getDate());
//        }
//        return maxDate;
//    }
//
//    return {
//        getMinDate: getMinDate,
//        getMaxDate: getMaxDate
//    }
//});


///**
// * @ngdoc service
// * @description Сервис для суммирования статистических данных за
// * период.
// * @name myApp.service:OperatonalStatisticsDataSumming
// * @param {Array} statisticForPeriod Статические данные за период, список
// * объектов `OperationalStatistics`.
// * @returns {OperationalStatistics} объект статистики, содержащий все
// * полученные статистические данные за весь период.
// */
//myApp.factory('OperatonalStatisticsDataSumming', function () {
//    return function (statisticForPeriod) {
//        var date, proceeds = 0,
//            profit = 0,
//            clients = 0,
//            workload = 0;
//        for (var i = 0; i < statisticForPeriod.length; i++) {
//            date = statisticForPeriod[i].date;
//            proceeds += statisticForPeriod[i].proceeds;
//            profit += statisticForPeriod[i].profit;
//            clients += statisticForPeriod[i].clients;
//            workload += statisticForPeriod[i].workload;
//        }
//        workload = Math.round(workload / statisticForPeriod.length);
//        return new OperationalStatistics(date, Math.round(proceeds, 2), Math.round(profit), clients,
//            workload);
//    };
//});


/**
 * @ngdoc service
 * @description Сервис для загрузки финансовой статистики за
 * сегодня
 * @name myApp.service:FinanceStatisticsLoader
 * @returns {FinanceStatistics} Объект финансовой статистики.
 */
//myApp.factory('FinanceStatisticsLoader', function () {
//    return function () {
//        return new getFinanceStatistics();
//    };
//});

myApp.factory('OperationalStatistics', function (Model, DateHelper, FinanceStatistics) {

    var opStat = new Model("OperationalStatistics", {
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
        console.log(keyRange);
        var request = store.index(params.index).openCursor(keyRange);
        request.onerror = function (event) {
            callback(null);
        };
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                result.push(cursor.value);
                cursor.continue();
            }
        };

        trans.oncomplete = function (e) {
            if (result.length != 0) {
                callback(result);
            }
        }
    }
    return opStat;
});



myApp.factory('GetOpStatObjects', function (Model, OperationalStatistics, DateHelper) {
    return function (statisticsForPeriod) {
        var statObjs = [];
        for (var i = 0; i < statisticsForPeriod.length; i++)
            statObjs.push(new OperationalStatistics(statisticsForPeriod[i]));
        return statObjs;
    }
});

//myApp.factory('GetStatisticsForChart', function (Model, OperationalStatistics, DateHelper) {
//    return function (dateFrom, dateTill) {
//        var data = getOperationalStatisticsData(DateHelper.getPeriod);
//        var result = [];
//        for (var i = 0; i < data.length; i++) {
//            var opstat = new OperationalStatistics(data[i]);
//            result.push(opstat);
//        }
//        if (dateFrom && dateTill) {
//            result = result.filter(function (statistic) {
//                return (statistic.dateFrom < dateFrom || statistic.dateFrom.toDateString() == dateFrom.toDateString() && statistic.dateTill > dateTill || statistic.dateTill.toDateString() == dateTill.toDateString());
//            });
//        }
//        return result;
//    }
//});