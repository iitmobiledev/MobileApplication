//сервис для загрузки статистики за период
myApp.factory('OperationalStatisticLoader', function () {
    return function (startDay, endDay, step) {
        var manyData = getData();

        if (startDay == endDay) {
            manyData = manyData.filter(function (d) {
                return (d.date.toDateString() == startDay.toDateString());
            });
        } else {
            manyData = manyData.filter(function (d) {
                return (d.date <= startDay && d.date >= endDay);

            });
        }
        return manyData;
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
        getedData = getedData.filter(function (d){
            return (d.date == neededDate);
        });
        return getedData;
    };
});

//сервис для загрузки данных о текущем пользователе
myApp.factory('UserLoader', function () {
    return function () {
        var user = getCurrentUser();
        return user;
    };
});