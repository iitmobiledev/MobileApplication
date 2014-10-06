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
myApp.controller('OperationalStatisticController', function ($scope, $location, DateHelper, Loader, $rootScope, $routeParams) {
    //    setMinMax();
    var today;
    if (typeof ($routeParams.date) != 'undefined')
        today = new Date($routeParams.date);
    else
        today = new Date();
    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    $scope.step = DateHelper.steps.DAY;
    $scope.loading = true;

    $scope.future = true;
    $scope.past = true;

    $scope.needUpdating = false;

    $scope.reinit = false;

    $scope.getData = function (key, quantity, forward, callback) {
        $scope.needUpdating = false; //???
        //        $scope.loading = true;
        var resultArr = [];
        var date;
        if (key) {
            //            Loader.get("OperationalStatistics", key, function (obj) {
            //                if (obj) {
            //                    //console.log("obj", obj)
            //date = new Date(getCurrentPeriod().begin);
            date = new Date(key.split(':')[0]);
            //console.log("date", date)
            if (forward) {
                date = DateHelper.getNextPeriod(date, $scope.step).end;
            } else {
                date = DateHelper.getPrevPeriod(date, $scope.step).end;
            }
            var beginDate = date,
                endDate = date;
            for (var i = 0; i < quantity; i++) {
                if (endDate.toDateString() !== $scope.max.toDateString() && endDate < $scope.max && forward)
                    endDate = DateHelper.getNextPeriod(endDate, $scope.step).end;
                if (beginDate.toDateString() !== $scope.min.toDateString() && beginDate > $scope.min && !forward)
                    beginDate = DateHelper.getPrevPeriod(beginDate, $scope.step).begin;
            }
            if (beginDate == endDate && $scope.step != DateHelper.steps.DAY) {
                var period = DateHelper.getPeriod(beginDate, $scope.step);
                beginDate = period.begin;
                endDate = period.end;
            }
            //console.log("begend", beginDate, endDate);
            Loader.search("OperationalStatistics", {
                dateFrom: beginDate.toDateString(),
                dateTill: endDate.toDateString(),
                step: $scope.step,
            }, function (data) {
                $scope.loading = false;
                data.reverse();
                callback(data)
            });
            //                }
            //            });

        } else {
            if ($scope.min !== null && $scope.max !== null) {
                if ($scope.date > $scope.max) {
                    $scope.date = new Date($scope.max)
                } else if ($scope.date < $scope.min) {
                    $scope.date = new Date($scope.min)
                }
                date = $scope.date;
                var beginDate = date,
                    endDate = date;
                for (var i = 0; i < quantity; i++) {
                    if (endDate.toDateString() !== $scope.max.toDateString() && endDate < $scope.max)
                        endDate = DateHelper.getNextPeriod(endDate, $scope.step).end;
                    if (beginDate.toDateString() !== $scope.min.toDateString() && beginDate > $scope.min)
                        beginDate = DateHelper.getPrevPeriod(beginDate, $scope.step).begin;
                }
                if (beginDate == endDate && $scope.step != DateHelper.steps.DAY) {
                    var period = DateHelper.getPeriod(beginDate, $scope.step);
                    beginDate = period.begin;
                    endDate = period.end;

                }
                //console.log("begend", beginDate, endDate)
                Loader.search("OperationalStatistics", {
                    dateFrom: beginDate.toDateString(),
                    dateTill: endDate.toDateString(),
                    step: $scope.step,
                    index: "date"
                }, function (data) {
                    $scope.loading = false;
                    data.reverse();
                    var todayPeriod = DateHelper.getPeriod($scope.date, $scope.step);
                    var curIndex;
                    for (var i = 0; i < data.length; i++) {
                        var curPeriod = DateHelper.getPeriod(data[i].date, $scope.step);

                        if (curPeriod.begin.toDateString() == todayPeriod.begin.toDateString()) {
                            curIndex = $scope.getKey(data[i]);
                        }
                    }
                    callback(data, curIndex);
                });
            } else {
                $scope.loading = false;
            }
        };
    }

    $scope.getKey = function (obj) {
        return obj && obj.__primary__;
    };

    var errorHandling = function () {
        console.log('serverError');
        $scope.correct = false;
        $scope.errorText = "Не удается подключиться к серверу. Пожалуйста, попробуйте зайти еще раз.";
    }

    $rootScope.$on('serverError', errorHandling);

    function setMinMax() {
        var min = Loader.getMinDate("OperationalStatistics");
        var max = Loader.getMaxDate("OperationalStatistics");
        if (min == 'error' || max == 'error') {
            $scope.min = null;
            $scope.max = null;
            errorHandling();
        } else {
            $scope.min = min;
            $scope.max = max;
            $scope.loading = true;
            $scope.reinit = true;
        }
        //console.log("setMinMax", $scope.min, $scope.max);
    }
    $scope.reinitStamp = function () {
        return [
            $scope.min, $scope.max, $scope.step
            ].join("##");
    }

    $rootScope.$on('minMaxGet', setMinMax);

    setMinMax();

    $rootScope.$on('synchEndOperationalStatistics', function () {
        console.log('synchEndOperationalStatistics');
        setMinMax();
        $scope.needUpdating = true;
    });


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

    $scope.$watch('date', function (newValue, oldValue) {
        //console.log('watchDate')
        var period = DateHelper.getPeriod(new Date($scope.date), $scope.step);
        $scope.past = false, $scope.future = false;
        if (period.begin > $scope.min || $scope.min == null)
            $scope.past = true;
        if (period.end < $scope.max || $scope.max == null)
            $scope.future = true;

    });

    $scope.$watch('min', function (newValue) {
        var period = DateHelper.getPeriod(new Date($scope.date), $scope.step);
        $scope.past = false;
        if (period.begin > newValue || newValue == null)
            $scope.past = true;
    });

    $scope.$watch('max', function (newValue) {
        var period = DateHelper.getPeriod(new Date($scope.date), $scope.step);
        $scope.future = false;
        if (period.end < $scope.max || $scope.max == null)
            $scope.future = true;
    });

    $scope.updateDate = function (curScope) {
        if (curScope.page && curScope.page.date)
            $scope.date = new Date(curScope.page.date);
    }

    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#toChart
     * @methodOf myApp.controller:OperationalStatisticController
     * @params {String} type тип графика, поле объекта `OperationalStatistics`.
     * @description Метод для перехода на страницу графика.
     */
    $scope.toChart = function (type) {
        $location.path('chart/' + type + '/' + $scope.date);
    };


    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#toExpenditures
     * @methodOf myApp.controller:OperationalStatisticController
     * @description Метод для перехода на страницу расходов.
     */
    $scope.toExpenditures = function () {
        $location.path('expenditures/' + $scope.date);
    };

    $scope.hasFinance = function (statistics) {
        if (statistics.financialStat) {
            return typeof (statistics.financialStat.credit) !== 'undefined';
        }
        return false;
    };
    /*
    function getCurrentPeriod() {
        var pk = angular.element('.slick-active').attr('contentkey');
        var splitPk = pk.split(':');
        var step = splitPk[splitPk.length - 1];
        return DateHelper.getPeriod(new Date(splitPk[0]), step);
    }
*/
    $scope.goForDay = function () {
        if ($scope.step != DateHelper.steps.DAY) {
            $scope.loading = true;
            $(".periodButtons a").removeClass('active');
            $(".day").addClass("active");
            $scope.step = DateHelper.steps.DAY;
        }
        //$scope.date = new Date(getCurrentPeriod().begin);
    };

    $scope.goForWeek = function () {
        if ($scope.step != DateHelper.steps.WEEK) {
            $scope.loading = true;
            $(".periodButtons a").removeClass('active');
            $(".week").addClass("active");
            $scope.step = DateHelper.steps.WEEK;
        }
        //$scope.date = new Date(getCurrentPeriod().begin);
    };

    $scope.goForMonth = function () {
        if ($scope.step != DateHelper.steps.MONTH) {
            $scope.loading = true;
            $(".periodButtons a").removeClass('active');
            $(".month").addClass("active");
            $scope.step = DateHelper.steps.MONTH;
        }
        //$scope.date = new Date(getCurrentPeriod().begin);
    };
});