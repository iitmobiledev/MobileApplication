/**
 * Сервис для загрузки статистики за период
 * @params day - дата, step - необходимый период
 * @return массив из объектов OperationalStatistic за выбранный период
 */
myApp.factory('OperationalStatisticLoader', function (GetPeriod, OperatonalStatisticsDataSumming) {
    return function (date, step) {
        var allStatistic = getData();
        if (step == 'day') {
            allStatistic = allStatistic.filter(function (stats) {
                return (stats.date.toDateString() == date.toDateString());
            });
        } else {
            var period = GetPeriod(date, step);
            allStatistic = allStatistic.filter(function (d) {
                return (d.date <= period.end && d.date >= period.begin);
            });
        }
        return OperatonalStatisticsDataSumming(allStatistic);
    };
});


//сервис для загрузки финансовой статистики за сегодня
myApp.factory('FinanceStatisticsLoader', function () {
    return function () {
        return new getFinanceStatistics();
    };
});

//сервис для загрузки данных о расходах
myApp.factory('ExpendituresLoader', function () {
    return function (neededDate) {
        var getedData = getExpenditures();
        var filteredData = getedData.filter(function (d){
            return (d.date.valueOf() == neededDate.valueOf());
        });
        console.log("filt " + filteredData);
        return filteredData;
    };
});

//сервис для загрузки данных о текущем пользователе
myApp.factory('UserLoader', function () {
    return function () {
        var user = getCurrentUser();
        return user;
    };
});

/**
 *@description Сервис для суммирования данных
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

/**
 * Сервис предназначен для получения периода
 * @params day - дата, step - нужный период
 * @return объект с полями begin - начальная дата и end - конечная дата
 */
myApp.factory('GetPeriod', function () {
    return function (day, step) {
        var period = new function () {
                switch (step) {
                case 'day':
                    this.begin = day;
                    this.end = day;
                    break;
                case 'week':
                    var weekDay = day.getDay() - 1; // для начала недели с понедельника
                    if (weekDay < 0)
                        weekDay = 6;
                    this.begin = new Date(day.getFullYear(), day.getMonth(), day.getDate() - weekDay);
                    this.end = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 6);
                    break;
                case 'month':
                    var begin = new Date(day.getFullYear(), day.getMonth(), 1);
                    this.begin = begin;
                    var d = new Date(day.getFullYear(), day.getMonth() + 1, 0);
                    this.end = new Date(day.getFullYear(), day.getMonth(), d.getDate());
                    break;
                }
            };
        return period;
    };
});