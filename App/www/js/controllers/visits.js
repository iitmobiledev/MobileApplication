/**
 * @description <p>Контроллер, отвечающий за загрузку данных о визитах,
 * т.е. записей с указанием времени, мастера и клиента.</p>
 * @ngdoc controller
 * @name myApp.controller:VisitsController
 */
myApp.controller('VisitsController', function ($scope, $filter, VisitsLoader, DateHelper, MastersPerDayLoader) {
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
                var masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
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
                            if (visits.serviceList[j].master.id === masters[i].master.id) {
                                console.log(service.description);
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