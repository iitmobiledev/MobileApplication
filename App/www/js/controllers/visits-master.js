/**
 * @description <p>Контроллер, отвечающий за загрузку данных о визитах,
 * т.е. записей с указанием времени, мастера и клиента.</p>
 * @ngdoc controller
 * @name myApp.controller:VisitsMasterController
 */
myApp.controller('VisitsMasterController', function ($scope, $filter, $location, VisitsLoader, DateHelper, MastersPerDayLoader) {
    $('#mastersButton').addClass('pressed');
    
    $scope.date = new Date();
    $scope.step = 'day';

    $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
    $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
    $scope.pages = [MastersPerDayLoader.getAllMastersPerDay($scope.prevdate, VisitsLoader), MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader), MastersPerDayLoader.getAllMastersPerDay($scope.nextdate, VisitsLoader)];

    $scope.pageIndex = 1;

    $scope.hasPrevData = function () {
        return true;
    };

    $scope.hasFutureData = function () {
        return true;
    };

    $scope.onTime = function () {
        $location.path('visits');
    }
    
    
    $scope.hasVisits = function(visit){
        return visit.length != 0;
    }

    $scope.$watch('date.toDateString()', function () {
        $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
            $scope.date.getDate() - 1);
        $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
            $scope.date.getDate() + 1);

        $scope.pages = [MastersPerDayLoader.getAllMastersPerDay($scope.prevdate, VisitsLoader), MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader), MastersPerDayLoader.getAllMastersPerDay($scope.nextdate, VisitsLoader)];

        $scope.pageIndex = 1;
    });
    
    $scope.getMasterInfo = function(master){
        return master.lastName + " " + master.firstName;
    }

    $scope.getVisitByMasterInfo = function (visit) {
        $scope.masterVisitInfo = {};
        var services = [],
            startTimes = [],
            endTimes = [],
            coast = 0;
        for (var j = 0; j < visit.serviceList.length; j++) {
            var service = visit.serviceList[j];
            services.push(service.description);
            coast += service.cost
            startTimes.push(service.startTime);
            endTimes.push(service.endTime);
        }

        $scope.masterVisitInfo.id = visit.id;
        $scope.masterVisitInfo.status = visit.status;
        $scope.masterVisitInfo.client = visit.client.lastName + ' ' + visit.client.firstName;
        $scope.masterVisitInfo.time = $filter('date')(Math.min.apply(null, startTimes), "HH:mm") + '-' +
            $filter('date')(Math.max.apply(null, endTimes), "HH:mm");
        $scope.masterVisitInfo.service = services.join(",");
        $scope.masterVisitInfo.cost = coast + ' р.';
    }

});