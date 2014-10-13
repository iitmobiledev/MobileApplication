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
    if (typeof ($routeParams.date) != 'undefined')
        today = new Date($routeParams.date);
    else
        today = new Date();
    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    $scope.step = DateHelper.steps.DAY;
    $scope.loading = true;
    $scope.needUpdating = false;

    $scope.loadedSlideCount = 2;
    $scope.maxSlideCount = 8;

    $scope.statuses = Visit.statuses;

    $scope.future = true;
    $scope.past = true;

    var errorHandling = function () {
//        console.log('serverError');
        $scope.correct = false;
        $scope.errorText = "Не удается подключиться к серверу. Пожалуйста, попробуйте зайти еще раз.";
    }

    $rootScope.$on('serverError', errorHandling);
    
    function setMinMax() {
        var min = Loader.getMinDate("Visit");
        var max = Loader.getMaxDate("Visit");
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
    }

    $rootScope.$on('minMaxGet', setMinMax);

    setMinMax();

    $rootScope.$on('synchEndVisit', function () {
//        console.log('synchEndVisit');
        setMinMax();
        $scope.needUpdating = true;
    });

    $scope.onMasters = function () {
        $scope.loading = true;
        $location.path('visits-master/' + $scope.date);
    };
    
    $scope.toVisit = function(id){
        $scope.loading = true;
        console.log('id ', id);
        $location.path('visit/'+id+'/visits');
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
        $scope.needUpdating = false;
        //        $scope.loading = true;
        //        console.log("scope.visit",$scope.visit);
        var resultArr = [];
        var date;
//        console.log("KEY", key)
        if (key) {
            date = new Date(key);
//            console.log("date ", date);
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
            console.log("begend", beginDate, endDate);
            Loader.search("Visit", {
                dateFrom: beginDate,
                dateTill: endDate,
                step: DateHelper.steps.DAY
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

                list = list.filter(function (page) {
                    return page.list.length != 0;
                });

                $scope.loading = false;
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
                console.log("begend", beginDate, endDate, $scope.max);
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
                        } else {
                            list.push(new VisitsPage(new Date(tmpdate), []));
                        }
                    }

                    var todayPeriod = DateHelper.getPeriod($scope.date, $scope.step);
                    var curIndex;
                    for (var i = 0; i < list.length; i++) {
                        var curPeriod = DateHelper.getPeriod(list[i].date, $scope.step);

                        if (curPeriod.begin.toDateString() == todayPeriod.begin.toDateString()) {
                            curIndex = $scope.getKey(list[i]);
                            console.log("curIndex", curIndex);
                        }
                    }

                    $scope.loading = false;
                    callback(list, curIndex);
                });
            }
            $scope.loading = false;
        }
    };
    
    $scope.hasFutureData = function(obj){
        var result = obj.date.toDateString() != $scope.max.toDateString() && obj.date < $scope.max;
        return result;
    }
    
    $scope.hasPastData = function(obj){
        return obj.date > $scope.min;
    }

    $scope.updateDate = function (curScope) {
        if (curScope && curScope.page && curScope.page.date)
            $scope.date = new Date(curScope.page.date);
    }


    $scope.getKey = function (obj) {
        return obj && obj.date.toDateString();
    };

    $scope.$watch('date', function (newValue, oldValue) {
        var period = DateHelper.getPeriod(new Date($scope.date), $scope.step);
        $scope.past = false, $scope.future = false;
        if (period.begin > $scope.min || $scope.min == null)
            $scope.past = true;
        if (period.end < $scope.max && period.end.toDateString() != $scope.max.toDateString() || $scope.max == null)
            $scope.future = true;
    });


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
            if (service.description != "")
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
        if (time.length > 1 && time[0] == time[1])
            time.pop();
        time = time.join("-");
        $scope.visitInfo.time = time;
        $scope.visitInfo.masters = masters.join(",");
        if (services.length > 0)
            $scope.visitInfo.services = services.join(", ") + " —";
        else
            $scope.visitInfo.services = "";
        $scope.visitInfo.cost = coast;
    };
});