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
myApp.controller('VisitsController', function ($scope, $filter, $location, Loader, DateHelper, Visit, $rootScope, $routeParams) {
    var today;
    console.log($routeParams.date);
    //    if ($routeParams.date)
    //        today = new Date($routeParams.date);
    //    else
    today = new Date();
    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    $scope.step = DateHelper.steps.DAY;
    $scope.loading = true;

    $scope.statuses = Visit.statuses;

    $scope.min = null;
    $scope.max = null;

    $scope.future = true;
    $scope.past = true;

    $rootScope.$on('minMaxGet', function () {
        $scope.min = Loader.getMinDate("Visit");
        $scope.max = Loader.getMaxDate("Visit");
    });

    $scope.onMasters = function () {
        console.log('$scope.date ', $scope);
        $location.path('visits-master/' + $scope.date);
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
            //            console.log('key ', key);
            //            Loader.get("Visit", key, function (obj) {
            //                if (obj) {
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
                    var page;
                    if (visitsByDate[tmpdate.toDateString()]) {
                        page = new VisitsPage(new Date(tmpdate), $filter('orderBy')(visitsByDate[tmpdate.toDateString()], 'startTime'));
                    } else
                        page = new VisitsPage(new Date(tmpdate), []);
                    list.push(page);
                }
                $scope.loading = false;
                callback(list);
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
                        var page = new VisitsPage(new Date(tmpdate), $filter('orderBy')(visitsByDate[tmpdate.toDateString()], 'startTime'));
                        list.push(page);
                    } else
                        list.push(new VisitsPage(new Date(tmpdate), []));
                }
                $scope.loading = false;
                callback(list);
            });
        }
    };


    $scope.getKey = function (obj) {
        return obj && obj.date.toDateString();
    };

    //    $scope.$watch('date', function (newValue, oldValue) {
    //        var period = DateHelper.getPeriod(new Date($scope.date), $scope.step);
    //        $scope.past = false, $scope.future = false;
    //        if (period.begin > $scope.min || $scope.min == null)
    //            $scope.past = true;
    //        if (period.end < $scope.max || $scope.max == null)
    //            $scope.future = true;
    //    });


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
            coast = 0;
        for (var j = 0; j < visit.serviceList.length; j++) {
            var service = visit.serviceList[j];
            services.push(service.description);
            masters.push(service.master.lastName);
            coast += service.cost;
            $scope.noVisit = false;
        }
        masters = $.unique(masters);
        $scope.visitInfo = {};
        $scope.visitInfo.id = visit.id;
        $scope.visitInfo.status = visit.status;
        $scope.visitInfo.client = visit.client.lastName + ' ' + visit.client.firstName;
        $scope.hasTime = false;
        var time = [];
        if (visit.startTime != "") {
            time.push($filter('date')(visit.startTime, "H:mm"));
            $scope.hasTime = true;
        }
        if (visit.endTime != "") {
            time.push($filter('date')(visit.endTime, "H:mm"));
            $scope.hasTime = true;
        }
        $scope.visitInfo.time = time.join("-");
        $scope.visitInfo.masters = masters.join(",");
        $scope.visitInfo.services = services.join(", ");
        $scope.visitInfo.cost = coast;
    };
});