/**
 * @description <p>Контроллер, отвечающий за загрузку данных о визитах,
 * т.е. записей с указанием времени, мастера и клиента.</p>
 * @ngdoc controller
 * @name myApp.controller:VisitsController
 */
myApp.controller('VisitsController', function ($scope, $filter, VisitsLoader, DateHelper) {
    $scope.date = new Date();
    $scope.step = 'day';
    $scope.type = 'time';
    $scope.VisitsPerDay = VisitsLoader($scope.date);

    $scope.hasPrevData = function () {
        return true;
    };

    $scope.hasFutureData = function () {
        var period = DateHelper.getPeriod($scope.date, $scope.step);
        if (period.end > new Date() || period.end.toDateString() == new Date().toDateString())
            return false;
        else
            return true;
    };

    $scope.$watch('date.toDateString()', function () {
        $scope.VisitsPerDay = VisitsLoader($scope.date);
    });

    $scope.$watch('step', function () {
        $scope.VisitsPerDay = VisitsLoader($scope.date);
    });


    $scope.hasVisitsList = function () {
        if ($scope.VisitsPerDay != null) {
            return true;
        }
        return false;
    }
    /*
     *функция, проверяющая, есть ли мастер в списке мастеров
     *если есть, то возвращает индекс в списке
     *если нет, то возвращает null
     */
    $scope.checkMasterInList = function (master, masters) {
        for (var i = 0; i < masters.length; i++) {
            if (master === masters[i].master) {
                return i;
            }
        }
        return null;
    }

    $scope.perMaster = function (master, visit) {
        this.master = master;
        this.visList = [];
        if (visit) {
            this.visList.push(visit);
        }
    }

    /*
     *функция, возвращающая список отсортированных по фамилии мастера объектов perMaster
     */
    $scope.getAllMastersPerDay = function () {
        var masters = [];
        for (var i = 0; i < $scope.VisitsPerDay.length; i++) {
            for (var j = 0; j < $scope.VisitsPerDay[i].serviceList.length; j++) {
                var usl = $scope.checkMasterInList($scope.VisitsPerDay[i].serviceList[j].master, masters);
                if (usl !== null) {
                    masters[usl].visList.push($scope.VisitsPerDay[i]);
                } else {
                    masters.push(new $scope.perMaster($scope.VisitsPerDay[i].serviceList[j].master, $scope.VisitsPerDay[i]));
                }
            }
        }
        masters = masters.sort(function (a, b) {
            if (a.master.lastName.toLowerCase() < b.master.lastName.toLowerCase())
                return -1;
            if (nameA = a.master.lastName.toLowerCase() > b.master.lastName.toLowerCase())
                return 1;
            return 0;
        });
        return masters;
    }

    $scope.isPerTime = function () {
        return $scope.type == 'time' && $scope.hasVisitsList();
    };

    $scope.isPerMasters = function () {
        return $scope.type == 'masters' && $scope.hasVisitsList();
    };


    $scope.showVisits = function () {
        $scope.itemsPerTime = [];
        $scope.itemsPerMasters = [];
        if ($scope.VisitsPerDay !== null) {
            if ($scope.type == "time") {
                for (var i = 0; i < $scope.VisitsPerDay.length; i++) {
                    var visit = $scope.VisitsPerDay[i],
                        services = [],
                        masters = [],
                        startTimes = [],
                        endTimes = [],
                        coast = 0;
                    for (var j = 0; j < visit.serviceList.length; j++) {
                        var service = visit.serviceList[j];
                        services.push(service.description);
                        masters.push(service.master.lastName);
                        coast += service.cost
                        startTimes.push(service.startTime);
                        endTimes.push(service.endTime);
                    }
                    masters = $.unique(masters);

                    var itemPerTime = {};
                    itemPerTime.id = visit.id;
                    itemPerTime.status = visit.status;
                    itemPerTime.client = visit.client.lastName + ' ' + visit.client.firstName;
                    itemPerTime.time = $filter('date')(Math.min.apply(null, startTimes), "HH:mm") + '-' +
                        $filter('date')(Math.max.apply(null, endTimes), "HH:mm");
                    itemPerTime.masters = masters.join(",");
                    itemPerTime.services = services.join(",");
                    itemPerTime.cost = coast + ' р.';
                    $scope.itemsPerTime.push(itemPerTime);
                }
            } else {
                var masters = $scope.getAllMastersPerDay();
                for (var i = 0; i < masters.length; i++) {
                    var itemPerMaster = {};
                    itemPerMaster.visits = [];
                    itemPerMaster.master = masters[i].master.lastName + ' ' + masters[i].master.firstName;
                    for (var k = 0; k < masters[i].visList.length; k++) {
                        var visitItem = {},
                            services = [],
                            startTimes = [],
                            endTimes = [],
                            coast = 0;
                        var visits = $scope.VisitsPerDay[k];
                        for (var j = 0; j < visits.serviceList.length; j++) {
                            var service = visits.serviceList[j];
                            if (visits.serviceList[j].master === masters[i].master) {
                                services.push(service.description);
                                coast += service.cost
                                startTimes.push(service.startTime);
                                endTimes.push(service.endTime);
                            }
                        }
                        visitItem.id = visits.id;
                        visitItem.status = visits.status;
                        visitItem.client = visits.client.lastName + ' ' + visits.client.firstName;
                        visitItem.time = $filter('date')(Math.min.apply(null, startTimes), "HH:mm") + '-' +
                            $filter('date')(Math.max.apply(null, endTimes), "HH:mm");
                        visitItem.service = services.join(",");
                        console.log(visitItem.service);
                        visitItem.cost = coast + ' р.';
                        itemPerMaster.visits.push(visitItem);
                    }
                    $scope.itemsPerMasters.push(itemPerMaster);
                }
            }
        }
    };

    $scope.$watch('VisitsPerDay', function () {
        $scope.showVisits();
    });

    $scope.$watch('type', function () {
        $scope.showVisits();
    });
});