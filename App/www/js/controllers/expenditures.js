/**
 * @description <p>Контроллер для получения данных о расходах за
 * текущий день.</p>
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `Date` date - текущая дата;
 * - `Array` pages - список из объектов `ExpenditureItem` за 3 дня:
 * вчерашний, текущий, завтрашний (если существует);
 * - `Number` pageIndex - индекс массива `pages`, выбранной страницы.
 * @ngdoc controller
 * @name myApp.controller:ExpendituresController
 * @requires myApp.service:ExpendituresLoader
 * @requires myApp.service:DateHelper
 */
myApp.controller('ExpendituresController', function ($scope, $filter, Loader, DateHelper, $routeParams, $rootScope) {
    var today = new Date($routeParams.date) || new Date();
    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    $scope.step = $routeParams.step || DateHelper.steps.DAY;

    $scope.backLink = '#/index/' + $scope.date + '/' + $scope.step;

    $scope.min = null;
    $scope.max = null;

    $scope.future = true;
    $scope.past = true;

    $scope.needUpdating = false;

    function setMinMax() {
        $scope.min = Loader.getMinDate("Visit");
        $scope.max = Loader.getMaxDate("Visit");
    }

    $rootScope.$on('minMaxGet', setMinMax);

    setMinMax();

    $rootScope.$on('synchEndExpenditure', function (event, newObjs) {
        console.log('synchEndExpenditure ', newObjs);
        setMinMax();
        $scope.needUpdating = true;
    });

    var ExpenditurePage = function (date, list) {
        this.date = new Date(date);
        this.list = list;
    };

    $scope.getData = function (key, quantity, forward, callback) {
        $scope.needUpdating = false;
        var resultArr = [];
        var date;
        if (key) {
            date = new Date(key);
            if (forward) {
                date = DateHelper.getNextPeriod(date, $scope.step).end;
            } else {
                date = DateHelper.getPrevPeriod(date, $scope.step).end;
            }
            var beginDate = date,
                endDate = date;
            for (var i = 0; i < quantity; i++) {
                if (forward) {
                    endDate = DateHelper.getNextPeriod(endDate, DateHelper.steps.DAY).end;
                } else {
                    beginDate = DateHelper.getPrevPeriod(beginDate, DateHelper.steps.DAY).begin;
                }
            }
            if (endDate > $scope.max) {
                endDate = new Date($scope.max)
            } else if (beginDate < $scope.min) {
                beginDate = new Date($scope.min)
            }
            Loader.search("Expenditure", {
                dateFrom: beginDate,
                dateTill: endDate,
                step: DateHelper.steps.DAY,
                index: "date"
            }, function (data) {
                var expsByDate = {};
                angular.forEach(data, function (exp) {
                    var key = exp.date.toDateString();
                    if (!expsByDate[key]) {
                        expsByDate[key] = [];
                    }
                    expsByDate[key].push(exp);
                });
                var list = [];
                for (var tmpdate = new Date(beginDate); tmpdate < endDate || tmpdate.toDateString() == endDate.toDateString(); tmpdate.setDate(tmpdate.getDate() + 1)) {
                    var page;
                    if (expsByDate[tmpdate.toDateString()]) {
                        page = new ExpenditurePage(new Date(tmpdate), expsByDate[tmpdate.toDateString()].sort(function (a, b) {
                            return new Date(a.date).getTime() - new Date(b.date).getTime();
                        }));
                    } else
                        page = new ExpenditurePage(new Date(tmpdate), []);
                    list.push(page);
                }
                callback(list);
            });
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
                    endDate = DateHelper.getNextPeriod(endDate, $scope.step).end;
                    beginDate = DateHelper.getPrevPeriod(beginDate, $scope.step).begin;
                }
                if (beginDate == endDate && $scope.step != DateHelper.steps.DAY) {
                    var period = DateHelper.getPeriod(beginDate, $scope.step);
                    beginDate = period.begin;
                    endDate = period.end;

                }
                Loader.search("Expenditure", {
                    dateFrom: beginDate,
                    dateTill: endDate,
                    step: DateHelper.steps.DAY,
                    index: "date"
                }, function (data) {
                    var expsByDate = {};
                    angular.forEach(data, function (exp) {
                        var key = exp.date.toDateString();
                        if (!expsByDate[key]) {
                            expsByDate[key] = [];
                        }
                        expsByDate[key].push(exp);
                    });
                    var list = [];
                    for (var tmpdate = new Date(beginDate); tmpdate < endDate || tmpdate.toDateString() == endDate.toDateString(); tmpdate.setDate(tmpdate.getDate() + 1)) {
                        if (expsByDate[tmpdate.toDateString()]) {
                            var page = new ExpenditurePage(new Date(tmpdate), expsByDate[tmpdate.toDateString()].sort(function (a, b) {
                                return new Date(a.date).getTime() - new Date(b.date).getTime();
                            }));
                        } else
                            page = new ExpenditurePage(new Date(tmpdate), []);
                        list.push(page);
                    }

                    var todayPeriod = DateHelper.getPeriod($scope.date, $scope.step);
                    var curIndex;
                    for (var i = 0; i < list.length; i++) {
                        var curPeriod = DateHelper.getPeriod(list[i].date, $scope.step);
                        if (curPeriod.begin.toDateString() == todayPeriod.begin.toDateString()) {

                            curIndex = $scope.getKey(list[i]);
                        }
                    }
                    callback(list, curIndex);
                });
            }
        }
    };

    $scope.hasFutureData = function (obj) {
        if (!obj)
            return false;
        var result = obj.date.toDateString() != $scope.max.toDateString() && obj.date < $scope.max;
        return result;
    }

    $scope.hasPastData = function (obj) {
        if (!obj)
            return false;
        return obj.date > $scope.min;
    }

    $scope.getKey = function (obj) {
        //        console.log(obj, obj.list[0].__primary__);
        return obj && obj.date.toDateString();
    };


    $scope.$watch('date', function (newValue, oldValue) {
        var period = DateHelper.getPeriod(new Date($scope.date), DateHelper.steps.DAY);

        //        console.log("minmaxx", $scope.min, $scope.max, period.begin, period.end, newValue)
        $scope.past = false, $scope.future = false;
        if (period.begin > $scope.min || $scope.min === null)
            $scope.past = true;
        if (period.end < $scope.max || $scope.max === null)
            $scope.future = true;
    });

    $scope.updateDate = function (curScope) {
        if (curScope && curScope.page && curScope.page.date)
            $scope.date = new Date(curScope.page.date);
    }


    //    /**
    //     * @description Обновляет информацию о затратах, хранящуюся в списке `pages`. В зависимости от даты, хранящейся в `$scope.date` данные будут загружаться за этот день, предыдущий и посдедующий.
    //     * @ngdoc method
    //     * @name myApp.controller:ExpendituresController#updatePages
    //     * @methodOf myApp.controller:ExpendituresController
    //     */
    //    function updatePages() {
    //        $scope.prevdate = DateHelper.getPrevPeriod($scope.date, DateHelper.steps.DAY).begin;
    //        $scope.nextdate = DateHelper.getNextPeriod($scope.date, DateHelper.steps.DAY).end;
    //        Loader.search("Expenditure", {
    //            dateFrom: $scope.prevdate,
    //            dateTill: $scope.nextdate,
    //        }, function (data) {
    //
    //            $scope.pages = data;
    ////            $scope.$apply();
    //        });
    //    }

    //    $scope.$watch('date.toDateString()', updatePages);

    /**
     * @description Функция для определения наличия данных за
     * текущий день.
     * @returns {Boleean} Возвращает `true`, если есть данные, иначе `else`.
     * @ngdoc method
     * @name myApp.controller:ExpendituresController#hasExpenditures
     * @methodOf myApp.controller:ExpendituresController
     */
    $scope.hasExpenditures = function (list) {
        return list.length != 0;
    }

    $rootScope.$on('serverError', function () {
        $scope.correct = false;
        $scope.errorText = "Не удается подключиться к серверу. Пожалуйста, попробуйте зайти еще раз.";
    });
});