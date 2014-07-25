/**
 * @description <p>Контроллер, отвечающий за загрузку данных о визитах,
 * т.е. записей с указанием времени, мастера и клиента.</p>
 * @ngdoc controller
 * @name myApp.controller:VisitsController
 */
myApp.controller('VisitsController', function ($scope, $filter, $location, VisitsLoader, DateHelper, MastersPerDayLoader) {
     $('#timeButton').addClass('pressed');
    
    $scope.date = new Date();
    $scope.step = 'day';

    $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
    $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
    $scope.pages = [VisitsLoader($scope.prevdate), VisitsLoader($scope.date), VisitsLoader($scope.nextdate)];
    $scope.pageIndex = 1;

    $scope.hasPrevData = function () {
        return true;
    };

    $scope.hasFutureData = function () {
        return true;
    };
    
    $scope.onMasters = function(){
        $location.path('visits-master');
    }
    

    $scope.$watch('date.toDateString()', function () {
        $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
            $scope.date.getDate() - 1);
        $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
            $scope.date.getDate() + 1);
        $scope.pages = [VisitsLoader($scope.prevdate), VisitsLoader($scope.date), VisitsLoader($scope.nextdate)];

        $scope.pageIndex = 1;
    });

    $scope.hasVisitsList = function () {
        if ($scope.VisitsPerDay.length == 0) {
            return false;
        }
        return true;
    }


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

    }


});