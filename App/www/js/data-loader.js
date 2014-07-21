/**
 * @ngdoc service
 * @description Сервис для авторизации пользователя.
 * @name myApp.service:UserAuthorization
 * @param {String} login логин пользователя.
 * @param {String} password пароль пользователя.
 * @returns {User} пользоыватель
 */
myApp.factory('UserAuthorization', function () {
    return function (login, password) {
        var users = getUsers();
        for (var i = 0; i < users.length; i++) {
            if (users[i].login == login && users[i].password == password)
                return users[i];
        }
        return null;
    };
});

/**
 * @ngdoc service
 * @description Сервис для загрузки статистики за период.
 * @name myApp.service:OperationalStatisticLoader
 * @param {Date} date дата, за которую будут подгружаться данные.
 * @param {String} step шаг периода (этап, например, 'day'), за который будут
 * получены данные, должен быть прописан в DateHelper.steps
 * @returns {OperationalStatistics} объект статистики
 */
myApp.factory('OperationalStatisticLoader', function (DateHelper, OperatonalStatisticsDataSumming) {
    return function (date, step) {
        var allStatistic = getData();
        var period = DateHelper.getPeriod(date, step);
        allStatistic = allStatistic.filter(function (statistic) {
            return (statistic.date <= period.end && statistic.date >= period.begin || statistic.date.toDateString() == period.end.toDateString());
        });
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

//сервис для загрузки данных о визитах
myApp.factory('VisitsLoader', function () {
    return function (neededDate) {
        var getedData = getVisits();
        for (var i = 0; i < getedData.length; i++) {
            if (getedData[i].date.toDateString() == neededDate.toDateString()) {
                return getedData[i];
            }
        }
        return null;
    };
});

/**
 * @ngdoc service
 * @description Сервис для получения текущего пользователя.
 * @name myApp.service:UserLoader
 * @returns {User} объект пользователя
 */
myApp.factory('UserLoader', function () {
    return function () {
        var user = getCurrentUser();
        return user;
    };
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

/**
 * @ngdoc service
 * @description Сервис для работы с датами. Позволяет получить
 * предыдущую дату с помощью метода `getPrev`, получить период методом
 * `getPeriod`, получить возможные шаги полем `steps`.
 * @name myApp.service:DateHelper
 */
myApp.factory('DateHelper', function () {
    var steps = {
        DAY: "day",
        WEEK: "week",
        MONTH: "month"
    }


    //    /**
    //     * @ngdoc method
    //     * @name myApp#service:getPrev
    //     * @param {Date} date дата, для которой будет вычислена предыдущая
    //     * дата.
    //     * @param {String} step шаг, показывающий за какой период
    //     * необходимо вычислить предыдущую дату.
    //     * @returns {Date} предыдущая дата.
    //     * @description Метод предназначен для получения того же дня на
    //     * прошлой неделе или прошлой недели, или прошлого месяца.
    //     * Необходимое указывается параметром step.
    //     */
        function getPrev(date, step) {
            switch (step) {
            case steps.DAY:
                return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
            case steps.WEEK:
                return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
            case steps.MONTH:
                return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
            default:
                return null;
            }
        };

    //    /**
    //     * @ngdoc method
    //     * @name myApp#service:getPeriod
    //     * @param {Date} date дата, по которой будет определяться период.
    //     * @param {String} step шаг, показывающий какой период необходимо
    //     * вернуть, должен быть определен в DateHelper.steps.
    //     * @returns {Period} объект с полями {Date} begin и {Date} end, обозначающими
    //     * начальную и конечную даты периода.
    //     * @description Метод предназначен для получения периода, т.е.
    //     * начальной даты и конечной даты.
    //     */
    function getPeriod(date, step) {
        var period = new function () {
                switch (step) {
                case steps.DAY:
                    this.begin = date;
                    this.end = date;
                    break;
                case steps.WEEK:
                    var weekDay = date.getDay() - 1; // для начала недели с понедельника
                    if (weekDay < 0)
                        weekDay = 6;
                    this.begin = new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekDay);
                    this.end = new Date(date.getFullYear(), date.getMonth(), this.begin.getDate() + 6);
                    break;
                case steps.MONTH:
                    var begin = new Date(date.getFullYear(), date.getMonth(), 1);
                    this.begin = begin;
                    var tempDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    this.end = new Date(date.getFullYear(), date.getMonth(), tempDate.getDate());
                    break;
                }
            };
        return period;
    };
    return {
        steps: steps,
        getPrev: getPrev,
        getPeriod: getPeriod
    };
});

/**
DateHelper.steps = {
  DAY: "day"
  WEEK: "week"
}

DateHelper.getNext(date, step) -> date
DateHelper.getStart(date, step) -> date
getPrev
getEnd


*/