/**
 * @ngdoc service
 * @description Сервис для загрузки данных для графика.
 * @name myApp.service:ChartDataLoader
 * @requires myApp.service:OperatonalStatisticsDataSumming
 */
myApp.factory('ChartDataLoader', function (OperationalStatisticLoader, DateHelper, OperatonalStatisticsDataSumming) {
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
        var goodData = [];

        var statistics = OperationalStatisticLoader.getDataForChart(new Date());
        for (var i = 0; i < statistics.length; i++)
        {
            var item = [];
            item.push(Date.UTC(statistics[i].dateFrom.getFullYear(), statistics[i].dateFrom.getMonth(), statistics[i].dateFrom.getDate()));
            item.push(statistics[i][needValue.toString()]);
            goodData.push(item);
        }
        goodData = goodData.sort();
        
//        var nowDay = new Date();
//        var endDay = new Date(nowDay.getFullYear(), nowDay.getMonth() - period, nowDay.getDate());
//        for (var day = nowDay; day > endDay; day = DateHelper.getPrevPeriod(day, 'day').begin) {
//            var item = [];
//            item.push(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));
//            item.push(OperationalStatisticLoader.getData(day)[needValue.toString()]);
//            goodData.push(item);
//        }
        


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
        //        for (i = 0; i < manyData.length; i++) {
        //            var item = [];
        //            item.push(Date.UTC(manyData[i].dateFrom.getFullYear(), manyData[i].dateFrom.getMonth(), manyData[i].dateFrom.getDate()));
        //            item.push(manyData[i][needValue]);
        //            goodData.push(item);
        //        }
        //        goodData = goodData.sort();
        setTimeout(function () {
            callback(goodData);
        }, 5000);
    }
    return {
        getGoodData: getGoodData
    }

});