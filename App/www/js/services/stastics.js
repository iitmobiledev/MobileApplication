/**
 * @ngdoc service
 * @description Сервис для загрузки статистики за период.
 * @name myApp.service:OperationalStatisticLoader
 * @requires myApp.service:DateHelper
 * @requires myApp.service:OperatonalStatisticsDataSumming
 */
myApp.factory('OperationalStatisticLoader', function (DateHelper, OperatonalStatisticsDataSumming) {
    /**
     *
     * @ngdoc method
     * @name myApp.service:OperationalStatisticLoader#getData
     * @methodOf myApp.service:OperationalStatisticLoader
     * @description Функция для получения статистических данных за
     * период.
     * @param {Date} date дата, за которую необходимо получить данные.
     * @param {String} step название периода, допустимые значения
     * параметра описаны в DateHelper.steps.
     * @returns {OperationalStatistics} объект, содержищий статистические
     * данные.
     */
    function getData(date, step) {
        var allStatistic = getOperationalStatisticsData();
        var period = DateHelper.getPeriod(date, step);
        allStatistic = allStatistic.filter(function (statistic) {
            return (statistic.date <= period.end && statistic.date >= period.begin || statistic.date.toDateString() == period.end.toDateString());
        });
        return OperatonalStatisticsDataSumming(allStatistic);
    }

    /**
     *
     * @ngdoc method
     * @name myApp.service:OperationalStatisticLoader#getMinDate
     * @methodOf myApp.service:OperationalStatisticLoader
     * @description Функция для получения минимальной даты (самой
     * прошлой), за которую есть статистические данные.
     * @returns {Date} дата самых давних данных статистики.
     */
    function getMinDate() {
        var allStatistic = getOperationalStatisticsData();
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
     * @returns {Date} дата, за которую внесены максимально будущие
     * статистические данны.
     */
    function getMaxDate() {
        var allStatistic = getOperationalStatisticsData();
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
 * @param {Array} statisticForPeriod статические данные за период, объекты
 * `OperationalStatistics`.
 * @returns {OperationalStatistics} объект статистики, содержащий все
 * полученные статистические данные за весь период.
 */
myApp.factory('OperatonalStatisticsDataSumming', function () {
    return function (statisticForPeriod) {
        var date, proceeds = 0,
            profit = 0,
            clients = 0,
            workload = 0,
            tillMoney = 0,
            morningMoney = 0,
            credit = 0,
            debit = 0;
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


//сервис для загрузки финансовой статистики за сегодня
/**
 * @ngdoc service
 * @description Сервис для загрузки финансовой статистики за
 * сегодня
 * @name myApp.service:FinanceStatisticsLoader
 * @returns {FinanceStatistics} объект финансовой статистики.
 */
myApp.factory('FinanceStatisticsLoader', function () {
    return function () {
        return new getFinanceStatistics();
    };
});

