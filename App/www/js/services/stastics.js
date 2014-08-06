/**
 * @ngdoc service
 * @description Сервис для загрузки статистики за период.
 * @name myApp.service:OperationalStatisticLoader
 * @requires myApp.service:DateHelper
 * @requires myApp.service:OperatonalStatisticsDataSumming
 */
myApp.factory('OperationalStatisticLoader', function (DateHelper, OperatonalStatisticsDataSumming, GetOperationalStatistics) {
    /**
     *
     * @ngdoc method
     * @name myApp.service:OperationalStatisticLoader#getData
     * @methodOf myApp.service:OperationalStatisticLoader
     * @description Функция для получения статистических данных за
     * период.
     * @param {Date} date Дата, за которую необходимо получить данные.
     * @param {String} step Название периода, допустимые значения
     * параметра описаны в DateHelper.steps.
     * @returns {OperationalStatistics} Объект, содержищий статистические
     * данные.
     */
    function getData(date, step) {
        step = step || 'day';
        var period = DateHelper.getPeriod(date, step);
        var statistics = GetOperationalStatistics(period.begin, period.end);
        //        var allStatistic = getOperationalStatisticsData();
        //        var period = DateHelper.getPeriod(date, step);
        //        allStatistic = allStatistic.filter(function (statistic) {
        //            return (statistic.date <= period.end && statistic.date >= period.begin || statistic.date.toDateString() == period.end.toDateString());
        //        });
        return statistics || {};
        //return OperatonalStatisticsDataSumming(allStatistic);
    }

    /**
     *
     * @ngdoc method
     * @name myApp.service:OperationalStatisticLoader#getMinDate
     * @methodOf myApp.service:OperationalStatisticLoader
     * @description Функция для получения минимальной даты (самой
     * прошлой), за которую есть статистические данные.
     * @returns {Date} Дата самых давних данных статистики.
     */
    function getMinDate() {
        var allStatistic = GetOperationalStatistics();
        var minDate = new Date();
        for (var i = 0; i < allStatistic.length; i++) {
            if (allStatistic[i].date < minDate)
                minDate = new Date(allStatistic[i].date.getFullYear(), allStatistic[i].date.getMonth(), allStatistic[i].date.getDate());
        }
        return minDate;
    }

    /**
     *
     * @ngdoc method
     * @name myApp.service:OperationalStatisticLoader#getMaxDate
     * @methodOf myApp.service:OperationalStatisticLoader
     * @description Функция для получения максимальной даты (самой
     * будущей), за которую есть статистические данные.
     * @returns {Date} Дата, за которую внесены максимально будущие
     * статистические данны.
     */
    function getMaxDate() {
        var allStatistic = GetOperationalStatistics();
        var maxDate = new Date();
        for (var i = 0; i < allStatistic.length; i++) {
            if (allStatistic[i].date > maxDate)
                maxDate = new Date(allStatistic[i].date.getFullYear(), allStatistic[i].date.getMonth(), allStatistic[i].date.getDate());
        }
        return maxDate;
    }

    return {
        getData: getData,
        getMinDate: getMinDate,
        getMaxDate: getMaxDate
    }
});


/**
 * @ngdoc service
 * @description Сервис для суммирования статистических данных за
 * период.
 * @name myApp.service:OperatonalStatisticsDataSumming
 * @param {Array} statisticForPeriod Статические данные за период, список
 * объектов `OperationalStatistics`.
 * @returns {OperationalStatistics} объект статистики, содержащий все
 * полученные статистические данные за весь период.
 */
myApp.factory('OperatonalStatisticsDataSumming', function () {
    return function (statisticForPeriod) {
        var date, proceeds = 0,
            profit = 0,
            clients = 0,
            workload = 0;
        for (var i = 0; i < statisticForPeriod.length; i++) {
            date = statisticForPeriod[i].date;
            proceeds += statisticForPeriod[i].proceeds;
            profit += statisticForPeriod[i].profit;
            clients += statisticForPeriod[i].clients;
            workload += statisticForPeriod[i].workload;
        }
        workload = Math.round(workload / statisticForPeriod.length);
        return new OperationalStatistics(date, Math.round(proceeds, 2), Math.round(profit), clients,
            workload);
    };
});


/**
 * @ngdoc service
 * @description Сервис для загрузки финансовой статистики за
 * сегодня
 * @name myApp.service:FinanceStatisticsLoader
 * @returns {FinanceStatistics} Объект финансовой статистики.
 */
myApp.factory('FinanceStatisticsLoader', function () {
    return function () {
        return new getFinanceStatistics();
    };
});

myApp.factory('OperationalStatistics', function (Model, DateHelper) {
    return Model("OperationalStatistics", {
        deserialize: function (self, data) {
            Object.defineProperty(self, "dateFrom", {
                value: new Date(data.dateFrom),
                writable: true
            });
            Object.defineProperty(self, "dateTill", {
                value: new Date(data.dateTill),
                writable: true
            });
            Object.defineProperty(self, "proceeds", {
                value: data.proceeds,
                writable: true
            });
            Object.defineProperty(self, "profit", {
                value: data.profit,
                writable: true
            });
            Object.defineProperty(self, "clients", {
                value: data.clients,
                writable: true
            });
            Object.defineProperty(self, "workload", {
                value: data.workload,
                writable: true
            });
        },
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['dateFrom', 'dateTill']
    });
});

myApp.factory('GetOperationalStatistics', function (Model, OperationalStatistics) {
    return function (dateFrom, dateTill) {
        var data = getOperationalStatisticsData();
        var result = [];
        for (var i = 0; i < data.length; i++) {
            var opstat = new OperationalStatistics(data[i]);
            result.push(opstat);
        }
        if (dateFrom && dateTill) {
            result = result.filter(function (statistic) {
                return (statistic.dateFrom.toDateString() == dateFrom.toDateString() && statistic.dateTill.toDateString() == dateTill.toDateString());
            });
        }
        return result[0];
    }
});