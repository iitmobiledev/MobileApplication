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
    $scope.masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);

    $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
    $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
    $scope.pages = [VisitsLoader($scope.prevdate), VisitsLoader($scope.date), VisitsLoader($scope.nextdate)];
    $scope.pageIndex = 1;

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
        $scope.masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
        $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
            $scope.date.getDate() - 1);
        $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
            $scope.date.getDate() + 1);
        if ($scope.type == "time") {
            $scope.pages = [VisitsLoader($scope.prevdate), VisitsLoader($scope.date), VisitsLoader($scope.nextdate)];
        } else {
            $scope.pages = [MastersPerDayLoader.getAllMastersPerDay($scope.prevdate, VisitsLoader), MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader), MastersPerDayLoader.getAllMastersPerDay($scope.nextdate, VisitsLoader)];
        }

        $scope.pageIndex = 1;
    });

    $scope.hasVisitsList = function () {
        if ($scope.VisitsPerDay.length == 0) {
            return false;
        }
        return true;
    }

    $scope.isPerTime = function () {
        return $scope.type == 'time' && $scope.hasVisitsList();
    };

    $scope.isPerMasters = function () {
        return $scope.type == 'masters' && $scope.hasVisitsList();
    };

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
        }
        masters = $.unique(masters);
        $scope.visitInfo = {};
        $scope.visitInfo.id = visit.id;
        $scope.visitInfo.status = visit.status;
        $scope.visitInfo.client = visit.client.lastName + ' ' + visit.client.firstName;
        $scope.visitInfo.time = $filter('date')(Math.min.apply(null, startTimes), "HH:mm") + '-' +
            $filter('date')(Math.max.apply(null, endTimes), "HH:mm");
        $scope.visitInfo.masters = masters.join(",");
        $scope.visitInfo.services = services.join(",");
        $scope.visitInfo.cost = coast + ' р.';
        
        if (visit.serviceList.length == 0)
        {
            console.log("ssss");
            $scope.visitInfo.status = 'Нет визитов';
//            console.log("has");
//            $('#visitsPerTime').show();
//            $('#noVisitMessage').hide();
        }
        else{
//            console.log("!has");
//            $('#visitsPerTime').hide();
//            $('#noVisitMessage').show();
        }
    }

    $scope.showVisits = function () {
        $scope.itemsPerTime = [];
        $scope.itemsPerMasters = [];
        if ($scope.VisitsPerDay !== []) {
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
                console.log("mastr");

                for (var i = 0; i < $scope.masters.length; i++) {
                    var itemPerMaster = {};
                    itemPerMaster.visits = [];
                    itemPerMaster.master = $scope.masters[i].master.lastName + ' ' + $scope.masters[i].master.firstName;
                    for (var k = 0; k < $scope.masters[i].visList.length; k++) {
                        var visitItem = {},
                            services = [],
                            startTimes = [],
                            endTimes = [],
                            coast = 0;
                        var visits = $scope.masters[i].visList[k];
                        for (var j = 0; j < visits.serviceList.length; j++) {
                            var service = visits.serviceList[j];
                            if (visits.serviceList[j].master.id === $scope.masters[i].master.id) {
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
        $scope.VisitsPerDay = VisitsLoader($scope.date);
        $scope.masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
        $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
            $scope.date.getDate() - 1);
        $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
            $scope.date.getDate() + 1);
        if ($scope.type == "time") {
            $scope.pages = [VisitsLoader($scope.prevdate), VisitsLoader($scope.date), VisitsLoader($scope.nextdate)];
        } else {
            $scope.pages = [MastersPerDayLoader.getAllMastersPerDay($scope.prevdate, VisitsLoader), MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader), MastersPerDayLoader.getAllMastersPerDay($scope.nextdate, VisitsLoader)];
        }
        $scope.showVisits();

        $scope.pageIndex = 1;
    });
});