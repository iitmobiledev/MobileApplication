/**
 * @description <p>Контроллер, отвечающий за загрузку данных о визитах,
 * т.е. записей с указанием времени, мастера и клиента.</p>
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `Date` date - текущая дата;
 * - `Array` pages - список из объектов `Visit` за 3 дня:
 * вчерашний, текущий, завтрашний (если существует);
 * - `Number` pageIndex - индекс массива `pages`, выбранной страницы.
 * @ngdoc controller
 * @ngdoc controller
 * @name myApp.controller:VisitsController
 * @requires myApp.service:VisitsLoader
 * @requires myApp.service:DateHelper
 */
myApp.controller('VisitsController', function ($scope, $filter, $location, Loader, DateHelper, Visit) {
    var today = new Date();
    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    $scope.step = DateHelper.steps.DAY;
    $scope.pageIndex = 1;
    $scope.loading = true;
    //        updatePages();
    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsController#hasPrevData
     * @methodOf myApp.controller:VisitsController
     * @returns {Boleean} Возвращает true, если есть данные за прошлое.
     * @description Метод для проверки существования данных за прошлое
     */
    $scope.hasPrevData = function () {
        return true;
        //        return $scope.date > minDate;
    };

    $scope.statuses = Visit.statuses;

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsController#hasFutureData
     * @methodOf myApp.controller:VisitsController
     * @returns {Boleean} Возвращает true, если есть данные за будущее.
     * @description Метод для проверки существования данных за будущее
     */
    $scope.hasFutureData = function () {
        return true;
        //        return $scope.date < maxDate && $scope.date.toDateString() != maxDate.toDateString();
    };

    $scope.onMasters = function () {
        $location.path('visits-master/' + $scope.date);
//        $location.path('visits-master');
    };
    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsController#hasVisits
     * @methodOf myApp.controller:VisitsController
     * @param {Object} visit Объект визит
     * @returns {Boleean} Возвращает true, если визит есть
     * @description Метод для проверки существования визита
     */
    $scope.hasVisits = function (visit) {
        return visit.length !== 0;
    };

    var VisitsPage = function (date, list) {
        this.date = new Date(date);
        this.list = list;
    };

    $scope.getData = function (key, quantity, forward, callback) {
        $scope.loading = true;
//        console.log("scope.visit",$scope.visit);
        var resultArr = [];
        var date;
        if (key) {
            Loader.get("Visit", key, function (obj) {
                if (obj) {
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
                    Loader.search("Visit", {
                        dateFrom: beginDate,
                        dateTill: endDate,
                        step: DateHelper.steps.DAY,
                        index: "date"
                    }, function (data) {
                        var visitsByDate = {};
                        angular.forEach(data, function (visit) {
                            //                console.log("visit", visit);
                            var key = visit.date.toDateString();
                            if (!visitsByDate[key]) {
                                visitsByDate[key] = [];
                            }
                            visitsByDate[key].push(visit);
                        });
                        var list = [];
                        for (var tmpdate = new Date(beginDate); tmpdate < endDate || tmpdate.toDateString() == endDate.toDateString(); tmpdate.setDate(tmpdate.getDate() + 1)) {
                            //                            console.log("date ", tmpdate);
                            var page = new VisitsPage(new Date(tmpdate), visitsByDate[tmpdate.toDateString()].sort(function (a, b) {
                                return new Date(a.date).getTime() - new Date(b.date).getTime();
                            }));
                            list.push(page);
                        }
                        $scope.loading = false;
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
            Loader.search("Visit", {
                dateFrom: beginDate,
                dateTill: endDate,
                step: DateHelper.steps.DAY,
                index: "date"
            }, function (data) {
                var visitsByDate = {};
                angular.forEach(data, function (visit) {
                    var key = visit.date.toDateString();
                    if (!visitsByDate[key]) {
                        visitsByDate[key] = [];
                    }
                    visitsByDate[key].push(visit);
                });
                var list = [];
                for (var tmpdate = new Date(beginDate); tmpdate < endDate || tmpdate.toDateString() == endDate.toDateString(); tmpdate.setDate(tmpdate.getDate() + 1)) {
                    //                    console.log("date ", tmpdate);
                    if (visitsByDate[tmpdate.toDateString()]) {
                        var page = new VisitsPage(new Date(tmpdate), visitsByDate[tmpdate.toDateString()].sort(function (a, b) {
                            return new Date(a.date).getTime() - new Date(b.date).getTime();
                        }));
                        list.push(page);
                    }
                    else
                        list.push(new VisitsPage(new Date(tmpdate), []));
                }
                $scope.loading = false;
                console.log("list", list);
                callback(list);
            });
        }
    };


    $scope.getKey = function (obj) {
        return obj && obj.date.toDateString();
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsController#getVisitInfo
     * @methodOf myApp.controller:VisitsController
     * @param {Object} visit Объект визит
     * @description Метод, формирующий данные в виде, нужном для отображения визитов по времени
     */
    $scope.getVisitInfo = function (visit) {
        var services = [],
            masters = [],
            startTimes = [],
            endTimes = [],
            coast = 0;
        for (var j = 0; j < visit.serviceList.length; j++) {
            var service = visit.serviceList[j];
            services.push(service.description);
            masters.push(service.master.lastName);
            coast += service.cost;
            startTimes.push(service.startTime);
            endTimes.push(service.endTime);
            $scope.noVisit = false;
        }
        masters = $.unique(masters);
        $scope.visitInfo = {};
        $scope.visitInfo.id = visit.id;
        $scope.visitInfo.status = visit.status;
        $scope.visitInfo.client = visit.client.lastName + ' ' + visit.client.firstName;
        $scope.visitInfo.time = $filter('date')(Math.min.apply(null, startTimes), "HH:mm") + '-' +
            $filter('date')(Math.max.apply(null, endTimes), "HH:mm");
        $scope.visitInfo.masters = masters.join(",");
        $scope.visitInfo.services = services.join(", ");
        $scope.visitInfo.cost = coast;
    };
});