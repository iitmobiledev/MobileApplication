/**
 * @ngdoc service
 * @description Сервис для загрузки данных для графика.
 * @name myApp.service:ChartDataLoader
 * @requires myApp.service:OperatonalStatisticsDataSumming
 */
myApp.factory('ChartDataLoader', function (OperatonalStatisticsDataSumming) {
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
    //     * @param {
    //        Number
    //    }
    //    step Количество дней, за которые суммируются
    //     * данные.
    //     * суммированных по шагу `step`.
    function getGoodData(needValue, period, callback) {
        var manyData = getOperationalStatisticsData();
        var goodData = [];
        var summedData = [];
        var nowDay = new Date();
        var endDay = new Date(nowDay.getFullYear(), nowDay.getMonth() - period, nowDay.getDate());

        //        var tempData = [];
        //        for (i = 0; i < manyData.length; i++) {
        //            if (manyData[i].date >= endDay && manyData[i].date <= nowDay) {
        //                tempData.push(manyData[i]);
        //                if (tempData.length % step == 0 && i != 0) {
        //                    summedData.push(OperatonalStatisticsDataSumming(tempData));
        //                    tempData = [];
        //                }
        //            }
        //        }
        //        if (tempData.length != 0) {
        //            summedData.push(OperatonalStatisticsDataSumming(tempData));
        //            tempData = [];
        //        }
        for (i = 0; i < manyData.length; i++) {
            var item = [];
            item.push(Date.UTC(manyData[i].date.getFullYear(), manyData[i].date.getMonth(), manyData[i].date.getDate()));
            item.push(manyData[i][needValue]);
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