/**
 * @ngdoc service
 * @description Сервис для загрузки данных для графика.
 * @name myApp.service:ChartDataLoader
 * @requires myApp.service:OperatonalStatisticsDataSumming
 */
myApp.factory('ChartDataLoader', function (DateHelper, Finder) {
    /**
     *
     * @ngdoc method
     * @name myApp.service:ChartDataLoader#getGoodData
     * @methodOf myApp.service:ChartDataLoader
     * @description Функция для выборки необходимых данных за
     * требуемый период.
     * @param {String} needValue Поле статистики, которое нужно выбрать.
     * @param {Number} period Количество месяцев, за которые отображается статистика.
     * @param {Function} callback Функция, которая будет вызвана после
     * обработки всех данных.
     * @returns {Array} Массив из объектов `OperationalStatistics`,
     */
    function getGoodData(needValue, period, callback) {
        var goodData = [];
        var today = new Date();
        Finder.getPerDates(new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()), today, DateHelper.steps.DAY, "date", "OperationalStatistics", function (data) {
            for (var i = 0; i < data.length; i++) {
                var item = [];
                item.push(Date.UTC(data[i].date.getFullYear(), data[i].date.getMonth(), data[i].date.getDate()));
                item.push(data[i][needValue.toString()]);
                goodData.push(item);
            }
            goodData = goodData.sort();
            callback(goodData);
        });

    }
    return {
        getGoodData: getGoodData
    }

});