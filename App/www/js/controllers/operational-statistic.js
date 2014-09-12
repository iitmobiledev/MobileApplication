/**
 * @ngdoc controller
 * @name myApp.controller:OperationalStatisticController
 * @description <p> Контроллер, отвечающий за загрузку статистических
 * данных. </p>
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `Date` date - текущая дата;
 * - `String` step - текущий период, допустимые значения определены
 * в DateHelper.steps;
 * - `Array` pages - список из объектов `OperationalStatistics` за 3 дня:
 * вчерашний, текущий, завтрашний (если существует);
 * - `Number` pageIndex - индекс массива `pages`, выбранной страницы.
 * @requires myApp.service:OperationalStatisticLoader
 * @requires myApp.service:DateHelper
 */
myApp.controller('OperationalStatisticController', function ($scope, $location, DateHelper, Loader, $rootScope) {

    var today = new Date(2014, 8, 7);
    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    $scope.step = DateHelper.steps.DAY;
    $scope.loading = true;

    $scope.getData = function (key, quantity, forward, callback) {
        $scope.loading = true;
        var resultArr = [];
        var date;
        if (key) {
            console.log("key", key);
//            var newKey = key.split(':');
//            var objDate = new Date(newKey[0]);
//            var month = objDate.getMonth().toString();
//            if (month.length < 2)
//                month = "0"+month;
//            var day = objDate.getDate().toString();
//            if (day.length < 2)
//                day = "0"+day;
//            var strDate = objDate.getFullYear() + "-" + month + "-" + day;
//            key = strDate + ":" + newKey[3];
//            console.log("key", key);
            Loader.get("OperationalStatistics", key, function (obj) {
                if (obj) {
                    console.log("obj", obj)
                    date = obj.date;
                    if (forward) {
                        date = DateHelper.getNextPeriod(date, $scope.step).end;
                    } else {
                        date = DateHelper.getPrevPeriod(date, $scope.step).end;
                    }
                    var beginDate = date,
                        endDate = date;
                    for (var i = 0; i < quantity; i++) {
                        if (forward) {
                            endDate = DateHelper.getNextPeriod(endDate, $scope.step).end;
                        } else {
                            beginDate = DateHelper.getPrevPeriod(beginDate, $scope.step).begin;
                        }
                    }
                    if (beginDate == endDate && $scope.step != DateHelper.steps.DAY) {
                        var period = DateHelper.getPeriod(beginDate, $scope.step);
                        beginDate = period.begin;
                        endDate = period.end;
                    }
                    console.log("begend", beginDate, endDate)
                    Loader.search("OperationalStatistics", {
                        dateFrom: beginDate,
                        dateTill: endDate,
                        step: $scope.step,
                    }, function (data) {
                        $scope.loading = false;
                        callback(data)
                    });
                }
            });

        } else {
            date = $scope.date;
            var beginDate = date,
                endDate = date;
            for (var i = 0; i < quantity; i++) {
                endDate = DateHelper.getNextPeriod(endDate, $scope.step).end;
                beginDate = DateHelper.getPrevPeriod(beginDate, $scope.step).begin;
            }
            if (beginDate == endDate && $scope.step != DateHelper.steps.DAY) {
                var period = DateHelper.getPeriod(beginDate, $scope.step);
                beginDate = period.begin;
                endDate = period.end;

            }
            console.log("begend", beginDate, endDate)
            Loader.search("OperationalStatistics", {
                dateFrom: beginDate,
                dateTill: endDate,
                step: $scope.step,
                index: "date"
            }, function (data) {
                $scope.loading = false;
                callback(data)
            });
        };
    }

    $scope.getKey = function (obj) {
        return obj && obj.__primary__;
    };

    //    $scope.pageIndex = 1;

    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#hasPrevData
     * @methodOf myApp.controller:OperationalStatisticController
     * @returns {Boleean} Возвращает `true`, если есть данные за прошлое.
     * @description Метод для проверки наличия данных за прошлый
     * период.
     */
    $scope.hasPrevData = function (currentDate) {
        Loader.hasPastData("OperationalStatistics", currentDate);
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#hasFutureData
     * @methodOf myApp.controller:OperationalStatisticController
     * @returns {Boleean} Возвращает `true`, если есть данные за будущее.
     * @description Метод для проверки наличия данных за будущий период.
     */
    $scope.futureData = function (currentDate) {
        Loader.hasFutureData("OperationalStatistics", currentDate);
    }

    $rootScope.$on('received', function () {
        //updatePage
        //        console.log('received on');
    });

    //    document.addEventListener('received', function () {
    //        //updatePage
    //
    //        //        console.log("past ", Loader.hasPastData("OperationalStatistics", new Date()));
    //        //        console.log("future ", Loader.hasFutureData("OperationalStatistics", "2014-10-04 09:00:00"));
    //    }, false);

    $scope.$watch('step', function (newValue, oldValue) {
        var period = DateHelper.getPeriod($scope.date, newValue);
        if (oldValue == DateHelper.steps.WEEK) {
            if (period.end < new Date()) {
                $scope.date = new Date(period.end.getFullYear(), period.end.getMonth(),
                    period.end.getDate());
            } else {
                $scope.date = new Date();
            }
        } else {
            $scope.date = new Date(period.begin.getFullYear(), period.begin.getMonth(),
                period.begin.getDate());
            //        $scope.$apply();
        }

        //        $scope.page = getStatistic($scope.date, $scope.step);
    });

    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#toChart
     * @methodOf myApp.controller:OperationalStatisticController
     * @params {String} type тип графика, поле объекта `OperationalStatistics`.
     * @description Метод для перехода на страницу графика.
     */
    $scope.toChart = function (type) {
        $location.path('chart/' + type);
    };


    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#toExpenditures
     * @methodOf myApp.controller:OperationalStatisticController
     * @description Метод для перехода на страницу расходов.
     */
    $scope.toExpenditures = function () {
        $location.path('expenditures');
    };

    $scope.hasFinance = function (statistics) {
        if (statistics.financeStat) {
            return typeof (statistics.financeStat.credit) !== 'undefined';
        }
        return false;
    };

    $scope.goForDay = function () {
        $(".periodButtons a").removeClass('active');
        $(".day").addClass("active");
        $scope.step = DateHelper.steps.DAY;
    };

    $scope.goForWeek = function () {
        $(".periodButtons a").removeClass('active');
        $(".week").addClass("active");
        $scope.step = DateHelper.steps.WEEK;
    };

    $scope.goForMonth = function () {
        $(".periodButtons a").removeClass('active');
        $(".month").addClass("active");
        $scope.step = DateHelper.steps.MONTH;
    };

});