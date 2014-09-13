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
myApp.controller('ExpendituresController', function ($scope, $filter, Loader, DateHelper) {
    //    var minDate = ExpendituresLoader.getMinDate();
    //    var maxDate = ExpendituresLoader.getMaxDate();

    var today = new Date(2014,8,7);
    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    /**
     *
     * @ngdoc method
     * @name myApp.controller:ExpendituresController#hasPrevData
     * @methodOf myApp.controller:ExpendituresController
     * @returns {Boleean} Возвращает true, если есть данные за прошлое.
     * @description Метод для проверки наличия данных за прошлый
     * период.
     */
    $scope.hasPrevData = function () {
        return true;
        //        return $scope.date > minDate;
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:ExpendituresController#hasFutureData
     * @methodOf myApp.controller:ExpendituresController
     * @returns {Boleean} Возвращает `true`, если есть данные за будущее.
     * @description Метод для проверки наличия данных за будущий
     * период.
     */
    $scope.hasFutureData = function () {
        return true;
        //        return $scope.date < maxDate && $scope.date.toDateString() != maxDate.toDateString();
    };
    
    var ExpenditurePage = function (date, list) {
        this.date = new Date(date);
        this.list = list;
    };
    
    $scope.getData = function (key, quantity, forward, callback) {
        var resultArr = [];
        var date;
        if (key) {
            Loader.get("Expenditure", key, function (obj) {
                if (obj) {
                    console.log(obj);
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
                            var page = new ExpenditurePage(new Date(tmpdate), expsByDate[tmpdate.toDateString()].sort(function (a, b) {
                                return new Date(a.date).getTime() - new Date(b.date).getTime();
                            }));
                            list.push(page);
                        }
                        callback(list);
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
                callback(list);
            });
        }
    };


    $scope.getKey = function (obj) {
        console.log(obj, obj.list[0].__primary__);
        return obj && obj.list[0].__primary__;
    };
    

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
