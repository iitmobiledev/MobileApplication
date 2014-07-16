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
            console.log("period.begin " + period.begin + " period.end " + period.end);
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
        for (var i = 0; i < getedData.length; i++) {
            if (getedData[i].date.toDateString() == neededDate.toDateString()) {
                return getedData[i].expenditureList;
            }
        }
        return null;
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
        console.log("day in GetPeriod 84 "+day);
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
                    console.log("weekDay "+weekDay);
                    this.begin = new Date(day.getFullYear(), day.getMonth(), day.getDate() - weekDay);
                    this.end = new Date(day.getFullYear(), day.getMonth(), this.begin.getDate() + 6);
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

/**
 * Сервис предназначен для получения того же дня (недели, месяца)
 * на прошлой неделе (в прошлом месяце, году)
 * @params day - дата, step - нужный период
 * @return объект с полями begin - начальная дата и end - конечная дата
 */
myApp.factory('GetPrevDate', function () {
    return function (day, step) {
        switch (step) {
        case 'day':
            return new Date(day.getFullYear(), day.getMonth(), day.getDate() - 7);
        case 'week':
            return new Date(day.getFullYear(), day.getMonth()-1, day.getDate());
        case 'month':
            return new Date(day.getFullYear()-1, day.getMonth(), day.getDate());
        }
    };
});