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
    console.log("$scope.date", $scope.date);
    
    $scope.backLink = '#/index/' + $scope.date;

    $scope.loading = true;

//    $scope.min = null;
//    $scope.max = null;
    
    $scope.future = true;
    $scope.past = true;

    $rootScope.$on('minMaxGet', function () {
        $scope.min = Loader.getMinDate("Expenditure");
        $scope.max = Loader.getMaxDate("Expenditure");
    });

    var ExpenditurePage = function (date, list) {
        this.date = new Date(date);
        this.list = list;
    };

    $scope.getData = function (key, quantity, forward, callback) {
        $scope.loading = true;
        var resultArr = [];
        var date;
        console.log("get")
        if (key) {
            //            Loader.get("Expenditure", key, function (obj) {
            //                if (obj) {
            //                    console.log(obj);
            date = new Date(key);
            console.log("date ", date);
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
                //                console.log("list ", list);
                $scope.loading = false;
                callback(list);
            });
            //                }
            //            });
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
            console.log(beginDate, endDate);
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
                        list.push(page);
                    }
                }
                $scope.loading = false;
                callback(list);
            });
        }
    };


    $scope.getKey = function (obj) {
        //        console.log(obj, obj.list[0].__primary__);
        return obj && obj.date;
    };
    
    
    $scope.$watch('date', function (newValue, oldValue) {
        var period = DateHelper.getPeriod(new Date($scope.date), DateHelper.steps.DAY);
        
        console.log("minmaxx", $scope.min, $scope.max, period.begin, period.end, newValue)
        $scope.past = false, $scope.future = false;
        if (period.begin > $scope.min || $scope.min === null)
            $scope.past = true;
        if (period.end < $scope.max || $scope.max === null)
            $scope.future = true;
    });


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
});