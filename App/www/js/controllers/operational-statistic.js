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
myApp.controller('OperationalStatisticController', function ($scope, $location, DateHelper, Loader, Finder, Storage) {
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
        if (i === 0)
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
    
    
    
    
    $scope.getChildScope = function (){
        var childScope = $scope.$new();
        childScope.step = $scope.step;
        childScope.toChart = $scope.toChart;
        return childScope;
    };


    $scope.getData = function (key, quantity, forward, callback) {
        var resultArr = [];
        var date;
        if (key) {
            Storage.get("OperationalStatistics", key, function (obj) {
                if (obj) {
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
                    Finder.getPerDates(beginDate, endDate, $scope.step, "date", "OperationalStatistics", callback);
                }
            });

        } else {
            date = new Date();
            var beginDate = date,
                endDate = date;
            for (var i = 0; i < quantity; i++) {
                if (forward) {
                    endDate = DateHelper.getNextPeriod(endDate, $scope.step).end;
                } else {
                    beginDate = DateHelper.getPrevPeriod(beginDate, $scope.step).begin;
                }
            }
            Finder.getPerDates(beginDate, endDate, $scope.step, "date", "OperationalStatistics", callback);
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
    $scope.hasPrevData = function (date) {
        //        return date > minDate;
        return true;
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
        //        var period = DateHelper.getPeriod(date, $scope.step);
        //        return period.end < maxDate && period.end.toDateString() != maxDate.toDateString();
        return true;
    };

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

});