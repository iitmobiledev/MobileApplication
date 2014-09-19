/**
 * @description <p>Контроллер, отвечающий за загрузку данных о визитах с сортировкой по мастерам.</p>
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `Date` date - текущая дата;
 * - `Array` pages - список из объектов `perMaster` за 3 дня:
 * вчерашний, текущий, завтрашний (если существует);
 * - `Number` pageIndex - индекс массива `pages`, выбранной страницы.
 * @ngdoc controller
 * @name myApp.controller:VisitsMasterController
 * @requires myApp.service:VisitsLoader
 * @requires myApp.service:MastersPerDayLoader
 * @requires myApp.service:DateHelper
 */
myApp.controller('VisitsMasterController', function ($scope, $filter, $location, DateHelper, $routeParams, MastersForPeriod, Loader, $rootScope) {

    var today = new Date($routeParams.date) || new Date();
    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    $scope.step = DateHelper.steps.DAY;
    $scope.loading = true;
    $scope.pageIndex = 0;

    $scope.min = null;
    $scope.max = null;

    $rootScope.$on('minMaxGet', function () {
        //        console.log('received on');
        $scope.min = Loader.getMinDate("Visit");
        $scope.max = Loader.getMaxDate("Visit");
    });

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#onTime
     * @methodOf myApp.controller:VisitsMasterController
     * @description Метод для перехода на страницу визитов с
     * сортировкой по времени.
     */
    $scope.onTime = function () {
        var pk = angular.element('.slick-active').attr('contentkey');
        $location.path('visits/' + pk);
    }

    //    $scope.visits = [];
    $scope.getVisits = function (visitsByMaster) {
        var v = [];
        for (var i = 0; i < visitsByMaster.length; i++) {
            for (var j = 0; j < visitsByMaster[i].length; j++) {
                if (visitsByMaster[i][j].visList) {
                    v = v.concat(visitsByMaster[i][j].visList);
                }
            }
        }
        $scope.visits = v;
        //        console.log($scope.visits);
        //        return $scope.visits;
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#hasVisits
     * @methodOf myApp.controller:VisitsMasterController
     * @param {Array} visits визиты всех мастеров за выбранный день.
     * @returns {Boleean} Возвращает true, если визиты есть.
     * @description Метод для проверки существования визитов.
     */
    $scope.hasVisits = function (visit) {
        return visit && visit.length != 0;
    }

    var VisitsPage = function (date, list) {
        this.date = new Date(date);
        this.list = list;
    };

    function sortByDate(data, beginDate, endDate) {
        var visitsByDate = {};
        angular.forEach(data, function (visit) {
            var key = visit.date.toDateString();
            if (!visitsByDate[key]) {
                visitsByDate[key] = [];
            }
            visitsByDate[key].push(visit);
        });
        var pages = [];
        for (var tmpdate = new Date(beginDate); tmpdate < endDate || tmpdate.toDateString() == endDate.toDateString(); tmpdate.setDate(tmpdate.getDate() + 1)) {
            var page;
            if (visitsByDate[tmpdate.toDateString()]) {
                page = new VisitsPage(new Date(tmpdate), visitsByDate[tmpdate.toDateString()].sort(function (a, b) {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                }));
            } else
                page = new VisitsPage(new Date(tmpdate), []);
            pages.push(page);
        }
        pages = pages.sort(function (a, b) {
            return a.date > b.date;
        });
        //        console.log('visits pages ', pages);
        return pages;
    }

    var VisitsMasterPage = function (date, list, visits) {
        this.date = new Date(date);
        this.list = list;
        this.visits = visits;
    };

    $scope.getData = function (key, quantity, forward, callback) {
        $scope.loading = true;
        var resultArr = [];
        var date;
        if (key) {
            //            Loader.get("Visit", key, function (obj) {
            //                if (obj) {
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
                var visits = sortByDate(data, beginDate, endDate);
                data = MastersForPeriod(data, {
                    begin: new Date(beginDate),
                    end: new Date(endDate)
                });
                var list = [];
                var i = 0;
                for (var tmpdate = new Date(beginDate); tmpdate < endDate || tmpdate.toDateString() == endDate.toDateString(); tmpdate.setDate(tmpdate.getDate() + 1)) {
                    var dayVisit = visits.filter(function (vis) {
                        return vis.date.toDateString() == tmpdate.toDateString();
                    })[0];
                    var page = new VisitsMasterPage(new Date(tmpdate), data[i], dayVisit.list);
                    list.push(page);
                    i++;
                }
                $scope.loading = false;
                console.log("list ", list);
                callback(list);
            });
            //                }
            //            });
        } else {
            date = $scope.date;
            var beginDate = date,
                endDate = date;
            //            console.log("beginEnd", beginDate, endDate);
            for (var i = 0; i < quantity; i++) {
                endDate = DateHelper.getNextPeriod(endDate, $scope.step).end;
                beginDate = DateHelper.getPrevPeriod(beginDate, $scope.step).begin;
            }
            if (beginDate == endDate && $scope.step != DateHelper.steps.DAY) {
                var period = DateHelper.getPeriod(beginDate, $scope.step);
                beginDate = period.begin;
                endDate = period.end;
            }
            //            console.log("beginEnd", beginDate, endDate);
            Loader.search("Visit", {
                dateFrom: beginDate,
                dateTill: endDate,
                step: DateHelper.steps.DAY,
                index: "date"
            }, function (data) {
                var visits = sortByDate(data, beginDate, endDate);
                data = MastersForPeriod(data, {
                    begin: new Date(beginDate),
                    end: new Date(endDate)
                });
                //                console.log(data)
                var list = [];
                var i = 0;

                //                console.log("beginEnd", beginDate, endDate);
                for (var tmpdate = new Date(beginDate); tmpdate < endDate || tmpdate.toDateString() == endDate.toDateString(); tmpdate.setDate(tmpdate.getDate() + 1)) {
                    var dayVisit = visits.filter(function (vis) {
                        return vis.date.toDateString() == tmpdate.toDateString();
                    })[0];
                    //                    console.log(dayVisit, tmpdate);
                    var page = new VisitsMasterPage(new Date(tmpdate), data[i], dayVisit.list);
                    list.push(page);
                    i++;
                }
                $scope.loading = false;
                //                console.log("list", list)
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
     * @name myApp.controller:VisitsMasterController#getMasterInfo
     * @methodOf myApp.controller:VisitsMasterController
     * @param {Object} master Объект мастер
     * @returns {String} masterInfo Фамилия и имя мастера одной строкой.
     * @description Метод для получения фамилии и имени мастера.
     */
    $scope.getMasterInfo = function (master) {
        $scope.masterId = master.id;
        if (master.lastName && master.firstName)
            return master.lastName + " " + master.firstName;
        return "(нет мастера)";
    };

    $scope.log = function (str) {
        console.log("log:", str);
    }

    $scope.downTime;
    $scope.isDownTime;
    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#getVisitByMasterInfo
     * @methodOf myApp.controller:VisitsMasterController
     * @param {Object} visit Объект визит.
     * @description Метод, формирующий данные в виде, нужном для отображения визитов, отсортированных по мастерам.
     */
    $scope.getVisitByMasterInfo = function (visit) {
        $scope.masterVisitInfo = {};
        var services = [],
            startTimes = [],
            endTimes = [],
            coast = 0;
        for (var j = 0; j < visit.serviceList.length; j++) {
            var service = visit.serviceList[j];
            if (service.master.id == $scope.masterId) {
                services.push(service.description);
                coast += service.cost;
                if (service.startTime != "")
                    startTimes.push(service.startTime);
                if (service.endTime != "")
                    endTimes.push(service.endTime);
            }
        }
        $scope.downTime = visit.downTime;
        $scope.isDownTime = visit.isDownTime;
        $scope.masterVisitInfo.id = visit.id;
        $scope.masterVisitInfo.status = visit.status;
        $scope.masterVisitInfo.client = visit.client.lastName + ' ' + visit.client.firstName;
        $scope.hasTime = false;
        if (startTimes.length > 0 && endTimes.length > 0) {
            $scope.masterVisitInfo.time = $filter('date')(Math.min.apply(null, startTimes), "HH:mm") + '-' + $filter('date')(Math.max.apply(null, endTimes), "HH:mm");
            $scope.hasTime = true;
        }
        $scope.masterVisitInfo.service = services.join(", ");
        $scope.masterVisitInfo.cost = coast;
    };



});