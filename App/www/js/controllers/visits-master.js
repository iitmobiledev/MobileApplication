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
    //    new Date($routeParams.date) || 
    var today = new Date($routeParams.date) || new Date();
    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    //    console.log($routeParams.date);
    $scope.step = DateHelper.steps.DAY;
    $scope.loading = true;

    $scope.loadedSlideCount = 3;
    $scope.maxSlideCount = 10;

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

    $rootScope.$on('synchEndVisit', function () {
        console.log('synchEndVisit');
        setMinMax();
        $scope.needUpdating = true;
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
        $scope.loading = true;
        $location.path('visits/' + $scope.date);
    }

    $scope.toVisit = function (id) {
        $scope.loading = true;
        $location.path('visit/' + id + '/visits-master');
    };

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
        $scope.needUpdating = false;
        //        $scope.loading = true;
        var resultArr = [];
        var date;
        if (key) {
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
                list = list.filter(function (page) {
                    return page.list.length != 0;
                });
                $scope.loading = false;
                callback(list);
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
                    var todayPeriod = DateHelper.getPeriod($scope.date, $scope.step);
                    var curIndex;
                    for (var i = 0; i < list.length; i++) {
                        var curPeriod = DateHelper.getPeriod(list[i].date, $scope.step);

                        if (curPeriod.begin.toDateString() == todayPeriod.begin.toDateString()) {
                            curIndex = $scope.getKey(list[i]);
                        }
                    }

                    $scope.loading = false;
                    callback(list, curIndex);
                });
            } else {
                console.log("else")
                $scope.loading = false;
            }
        }
    };

    $scope.hasFutureData = function (obj) {
        return obj.date < $scope.max;
    }

    $scope.hasPastData = function (obj) {
        return obj.date > $scope.min;
    }


    $scope.getKey = function (obj) {
        return obj && obj.date.toDateString();
    };

    $scope.$watch('date', function (newValue, oldValue) {
        var period = DateHelper.getPeriod(new Date($scope.date), $scope.step);
        $scope.past = false, $scope.future = false;
        if (period.begin > $scope.min || $scope.min == null)
            $scope.past = true;
        if (period.end < $scope.max || $scope.max == null)
            $scope.future = true;
    });

    $scope.updateDate = function (curScope) {
        if (curScope && curScope.page && curScope.page.date)
            $scope.date = new Date(curScope.page.date);
    }

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
        $scope.master = "(нет мастера)";
        if (master.lastName && master.firstName) {
            $scope.hasMaster = true;
            $scope.master = master.lastName + " " + master.firstName;
        } else
            $scope.hasMaster = false;

        if (master.photo == null)
            $scope.hasMaster = false;
    };

    $scope.hasMaster = true;

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
            coast = 0;
        for (var j = 0; j < visit.serviceList.length; j++) {
            var service = visit.serviceList[j];
            if (service.master.id == $scope.masterId) {
                if (service.description != "") {
                    services.push(service.description);
                }
                coast += service.cost;
            }
        }
        $scope.downTime = visit.downTime;
        $scope.isDownTime = visit.isDownTime;
        $scope.masterVisitInfo.id = visit.id;
        $scope.masterVisitInfo.status = visit.status;
        $scope.masterVisitInfo.client = visit.client.lastName + ' ' + visit.client.firstName;
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
        $scope.masterVisitInfo.time = time;
        if (services.length > 0)
            $scope.masterVisitInfo.service = services.join(", ") + " —";
        else
            $scope.masterVisitInfo.service = "";
        $scope.masterVisitInfo.cost = coast;
    };

    $rootScope.$on('serverError', function () {
        $scope.correct = false;
        $scope.errorText = "Не удается подключиться к серверу. Пожалуйста, попробуйте зайти еще раз.";
    });
});