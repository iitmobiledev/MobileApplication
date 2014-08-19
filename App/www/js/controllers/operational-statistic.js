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
myApp.controller('OperationalStatisticController', function ($scope, $location, DateHelper, Loader, Finder) {
    //    var getStatistic = OperationalStatisticLoader.getData;
    //    var minDate = OperationalStatisticLoader.getMinDate();
    //    var maxDate = OperationalStatisticLoader.getMaxDate();

    var today = new Date();
    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    $scope.step = DateHelper.steps.DAY;

    var steps = [DateHelper.steps.DAY, DateHelper.steps.WEEK, DateHelper.steps.MONTH];
    var titles = ["За день", "За неделю", "За месяц"];

    for (var i = 0; i < steps.length; i++) {
        var classValue = "button widget uib_w_6 d-margins";
        if (i == 0)
            classValue += ' active';
        $("#periodButtons").append(
            $("<a>", {
                "class": classValue,
                "data-uib": "app_framework/button",
                "data-ver": "1",
                text: titles[i],
                "id": steps[i],
                click: function () {
                    $scope.step = this.id;
                    $scope.$apply();
                    for (var j = 0; j < steps.length; j++)
                        $("#" + steps[j]).removeClass('active');
                    $(this).addClass("active");
                }
            })
        );
    }

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
    $scope.hasPrevData = function (date) {
        return date > minDate;
    };


    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#hasFutureData
     * @methodOf myApp.controller:OperationalStatisticController
     * @returns {Boleean} Возвращает `true`, если есть данные за будущее.
     * @description Метод для проверки наличия данных за будущий
     * период.
     */
    $scope.hasFutureData = function (date) {
        var period = DateHelper.getPeriod(date, $scope.step);
        return period.end < maxDate && period.end.toDateString() != maxDate.toDateString();
    };

    $scope.updatePages = function (date, forward, count) {
        var resultArr = [];

        if (!date)
            date = $scope.date;
        var beginDate = date,
            endDate = date;
        if (!$scope.hasPrevData(date) || !$scope.hasFutureData(date))
            return resultArr;

        for (var i = 0; i < count; i++) {
            if (forward) {
                endDate = DateHelper.getNextPeriod(endDate, $scope.step).end;
                // resultArr.push(getStatistic(date, $scope.step));
                if (!$scope.hasFutureData(date))
                    break;
                // return resultArr;
            } else {
                beginDate = DateHelper.getPrevPeriod(beginDate, $scope.step).end;
                // resultArr.push(getStatistic(date, $scope.step));
                if (!$scope.hasPrevData(date))
                    break;
                // return resultArr;
            }
        }

        Finder.getPerDates(beginDate, endDate, $scope.step, "date", "OperationalStatistics", function (data) {
            $scope.pages = data;
        });

    };

//    /**
//     *
//     * @ngdoc method
//     * @name myApp.controller:OperationalStatisticController#updatePages
//     * @methodOf myApp.controller:OperationalStatisticController
//     * @description Метод для обновления данных статистики на
//     * текущей, левой и правой страницах.
//     */
//    function updatePages() {
//        var prevPeriod = DateHelper.getPrevPeriod($scope.date, $scope.step);
//        var nextPeriod = DateHelper.getNextPeriod($scope.date, $scope.step);
//        $scope.pages = [];
//
//        Finder.getPerDates(prevPeriod.begin, nextPeriod.end, $scope.step, "date", "OperationalStatistics", function (data) {
//            console.log("pages ", data);
//            $scope.pages = data;
//            $scope.pageIndex = 1;
//        });
//        //            if (!$scope.hasFutureData()) {
//        //
//        //            }
//        //            $scope.pages = [getStatistic($scope.prevdate, $scope.step), getStatistic($scope.date, $scope.step)];
//        //            $scope.pageIndex = 1;
//        //        } else {
//        //            if ($scope.hasPrevData()) {
//        //                $scope.pages = [getStatistic($scope.prevdate, $scope.step), getStatistic($scope.date, $scope.step), getStatistic($scope.nextdate, $scope.step)];
//        //                //                $scope.pageIndex = 1;
//        //            } else {
//        //                $scope.date = OperationalStatisticLoader.getMinDate();
//        //            }
//        //        }
//    }

//    $scope.$watch('date.toDateString()', updatePages);

    $scope.page = getStatistic($scope.date, $scope.step);

    $scope.$watch('step', function (newValue, oldValue) {
        var period = DateHelper.getPeriod($scope.date, $scope.step);
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

        $scope.page = getStatistic($scope.date, $scope.step);
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
    }


    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#toExpenditures
     * @methodOf myApp.controller:OperationalStatisticController
     * @description Метод для перехода на страницу расходов.
     */
    $scope.toExpenditures = function () {
        $location.path('expenditures');
    }

    $scope.hasFinance = function (statistics) {
        if (statistics.financeStat) {
            return typeof (statistics.financeStat.credit) !== 'undefined';
        }
        return false;
    }

});