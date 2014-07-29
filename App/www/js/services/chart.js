/**
 * @ngdoc service
 * @description Сервис для загрузки данных для графика.
 * @name myApp.service:ChartDataLoader
 * @param {OperatonalStatisticsDataSumming} Объект статистики(суммированные данные в одном объекте)
 * @returns {Function} getGoodData Функцию, возвращающую массив нужных данных, суммированных по шагу step
 */
myApp.factory('ChartDataLoader', function (OperatonalStatisticsDataSumming) {
    /**
     *
     * @ngdoc method
     * @name myApp.service:ChartDataLoader#getGoodData
     * @methodOf myApp.service:ChartDataLoader
     * @description Функция для выборки нужных данных за нужный период
     * @param {String} needValue Поле статистики, которое требуется выбрать
     * @param {Number} period Количество месяцев, за которые отображается статистика
     * @param {Number} Step Шаг, с которым суммируются данные
     * @param {Function} Callback callback функция
     * @returns {OperationalStatistics} Массив нужных данных, суммированных по шагу step
     */
    function getGoodData(needValue, period, step, callback) {
        var manyData = getOperationalStatisticsData();
        var goodData = [];
        var summedData = [];
        var nowDay = new Date();
        var endDay = new Date(nowDay.getFullYear(), nowDay.getMonth() - period, nowDay.getDate());

        var tempData = [];
        for (i = 0; i < manyData.length; i++) {
            if (manyData[i].date > endDay && manyData[i].date < nowDay) {
                tempData.push(manyData[i]);
                if (i % step == 0) {
                    console.log(i);
                    summedData.push(OperatonalStatisticsDataSumming(tempData));
                    tempData = [];
                }
            }
        }
        for (i = 0; i < summedData.length; i++) {
            var item = [];
            item.push(Date.UTC(summedData[i].date.getFullYear(), summedData[i].date.getMonth(), summedData[i].date.getDate()));
            item.push(summedData[i][needValue]);
            goodData.push(item);
        }
        goodData = goodData.sort();
        setTimeout(function () {
            callback(goodData);
        }, 5000);
    }
    return {
        getGoodData: getGoodData
    }

});