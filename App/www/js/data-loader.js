/**
 * @ngdoc service
 * @description Сервис для авторизации пользователя.
 * @name myApp.service:UserAuthorization
 * @param {String} login логин пользователя.
 * @param {String} password пароль пользователя.
 * @returns {Token} токен
 */
myApp.factory('UserAuthorization', function ($http) {
    return function (login, password, callback) {
        $http({
            method: 'POST',
            url: 'http://auth.test.arnica.pro/rest/login',
            data: {
                v: '1.0',
                appID: 'test',
                rand: '11',
                sign: hex_md5(hex_md5('appidtestrand11v1.0test') + 'login' + 'WatchThatStupidLeech'),
                email: login,
                password: password
            },
            responseType: 'json'
        }).
        success(function (data, status, headers, config) {
            callback(data);
        });
    };
});

/**
 * @ngdoc service
 * @description Сервис для авторизации пользователя.
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


/**
 * @ngdoc service
 * @description Сервис для выхода пользователя из системы.
 * @name myApp.service:UserLogout
 * @param {Token} token токен пользователя.
 */
myApp.factory('UserLogout', function ($http) {
    return function (token) {
        $http({
            method: 'POST',
            url: 'http://auth.test.arnica.pro/rest/logout',
            params: {
                token: token
            }
        }).
        success(function (data, status, headers, config) {
            console.log("Пользователь разлогинен.");
        });
    }
});


/**
 * @ngdoc service
 * @description Сервис для загрузки статистики за период.
 * @name myApp.service:OperationalStatisticLoader
 * @param {Date} date дата, за которую будут подгружаться данные.
 * @param {String} step шаг периода (этап, например, 'day'), за который будут
 * получены данные, должен быть прописан в DateHelper.steps
 * @returns {OperationalStatistics} объект статистики
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
        return [];
    };
});

/**
 * @ngdoc service
 * @description Сервис для получения данных о визитах
 * @name myApp.service:VisitsLoader
 * @param {Date} neededDate дата, за которую нужно получить список визитов
 * @returns {Array} список визитов за нужную дату
 */
myApp.factory('VisitsLoader', function () {
    return function (neededDate) {
        var getedData = getVisits();
        getedData = getedData.filter(function (visit) {
            return (visit.date.toDateString() == neededDate.toDateString());
        });
        if (getedData.length != 0) {
            return getedData.sort(function (a, b) {
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            });
        }
        return [];
    };
});



/**
 * @ngdoc service
 * @description Сервис для получения списка мастеров с их визитами за нужную дату
 * @name myApp.service:MastersPerDayLoader
 * @param {Date} neededDate Дата, за которую нужно получить список мастеров с их визитами
 * @param {Service} VisitsLoader Сервис для загрузки списка визитов
 * @returns {method}  getAllMastersPerDay Метод для получения  списка отсортированных по фамилии мастера объектов perMaster
 */
myApp.factory('MastersPerDayLoader', function () {

    /**
     *
     * @ngdoc method
     * @name myApp.service:MastersPerDayLoader#checkMasterInList
     * @methodOf myApp.service:MastersPerDayLoader
     * @description Проверяет есть ли мастер в списке мастеров
     * @param {String} master Объект мастер
     * @param {Array}  masters Список мастеров
     * @returns {Null or Number}  Индекс мастера, если он есть в списке; null если нет.
     */

    function checkMasterInList(master, masters) {
        for (var i = 0; i < masters.length; i++) {
            if (master.id === masters[i].master.id) {
                return i;
            }
        }
        return null;
    }

    function perMaster(master, visit) {
        this.master = master;
        this.visList = [];
        if (visit) {
            this.visList.push(visit);
        }
    }


    /**
     *
     * @ngdoc method
     * @name myApp.service:MastersPerDayLoader#getAllMastersPerDay
     * @methodOf myApp.service:MastersPerDayLoader
     * @description Метод для получения списка отсортированных по фамилии мастера объектов perMaster
     * @param {Date} neededData  Дата, за которую требуется получить список объектов
     * @param {Service} VisitsLoader  Сервис для загрузки списка визитов
     * @returns {Array} allMasters Список отсортированных по фамилии мастера объектов perMaster
     */
    function getAllMastersPerDay(neededDate, VisitsLoader) {
        var getedData = VisitsLoader(neededDate);
        var allMasters = [];
        for (var i = 0; i < getedData.length; i++) {
            for (var j = 0; j < getedData[i].serviceList.length; j++) {
                var usl = checkMasterInList(getedData[i].serviceList[j].master, allMasters);
                if (usl !== null) {
                    allMasters[usl].visList.push(getedData[i]);
                } else {
                    allMasters.push(new perMaster(getedData[i].serviceList[j].master, getedData[i]));
                }
            }
        }

        allMasters = allMasters.sort(function (a, b) {
            if (a.master.lastName.toLowerCase() < b.master.lastName.toLowerCase())
                return -1;
            if (nameA = a.master.lastName.toLowerCase() > b.master.lastName.toLowerCase())
                return 1;
            return 0;
        });
        return allMasters;
    }

    return {
        getAllMastersPerDay: getAllMastersPerDay
    };
});




/**
 * @ngdoc service
 * @description Сервис для получения визита по указанному id
 * @name myApp.service:VisitLoader
 * @param {Number} neededID id визита
 * @returns {Visit} объект "Визит"
 */
myApp.factory('VisitLoader', function () {
    return function (neededID) {
        var getedData = getVisits();
        getedData = getedData.filter(function (visit) {
            return (visit.id == neededID);
        });
        if (getedData.length == 1)
            return getedData[0];
        else
            return null;
    };
});

/**
 * @ngdoc service
 * @description Сервис для получения текущего пользователя.
 * @name myApp.service:UserLoader
 * @returns {UserInfo} объект пользователя
 */
myApp.factory('UserLoader', function ($http) {
    return function (token) {
        $http({
            method: 'POST',
            url: 'http://auth.test.arnica.pro/rest/getUserInfo',
            params: {
                token: token
            }
        }).
        success(function (data, status, headers, config) {
            return data;
        }).
        error(function () {
            return null;
        });

        //        var user = getCurrentUser();
        //        return user;
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

    /**
     *
     * @ngdoc method
     * @name myApp.serviceDateHelper#getPrev
     * @methodOf myApp.service:DateHelper
     * @param {Date} date дата, для которой будет вычислена предыдущая
     * дата.
     * @param {String} step шаг, показывающий за какой период
     * необходимо вычислить предыдущую дату.
     * @returns {Date} предыдущая дата.
     * @description Метод предназначен для получения того же дня на
     * прошлой неделе или прошлой недели, или прошлого месяца.
     * Необходимое указывается параметром step.
     */
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

    /**
     *
     * @ngdoc method
     * @name myApp.serviceDateHelper#getPeriod
     * @methodOf myApp.service:DateHelper
     * @param {Date} date дата, по которой будет определяться период.
     * @param {String} step шаг, показывающий какой период необходимо
     * вернуть, должен быть определен в DateHelper.steps.
     * @returns {Period} объект с полями {Date} begin и {Date} end, обозначающими
     * начальную и конечную даты периода.
     * @description Метод предназначен для получения периода, т.е.
     * начальной даты и конечной даты.
     */
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

    /**
     *
     * @ngdoc method
     * @name myApp.serviceDateHelper#getMonthTitle
     * @methodOf myApp.service:DateHelper
     * @param {Number} monthNumber номер месяца, начиная с 0
     * @returns {String} название месяца
     * @description Метод для получения названия месяца по его номеру
     */
    function getMonthTitle(monthNumber) {
        switch (monthNumber + '') {
        case '0':
            return 'Январь';
        case '1':
            return 'Февраль';
        case '2':
            return 'Март';
        case '3':
            return 'Апрель';
        case '4':
            return 'Май';
        case '5':
            return 'Июнь';
        case '6':
            return 'Июль';
        case '7':
            return 'Август';
        case '8':
            return 'Сентябрь';
        case '9':
            return 'Октябрь';
        case '10':
            return 'Ноябрь';
        case '11':
            return 'Декабрь';
        default:
            return '';
        }
    };

    return {
        steps: steps,
        getPrev: getPrev,
        getPeriod: getPeriod,
        getMonthTitle: getMonthTitle
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