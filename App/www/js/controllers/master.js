//контроллер страницы мастера 
myApp.controller('MasterController', function ($scope, $routeParams, VisitsLoader, $filter) {
    $scope.id = $routeParams.id;
    $scope.date = new Date();
    $scope.step = 'day';
    $scope.type = 'time';

    $scope.masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);

    $scope.showMaster = function () {
        $scope.neededMaster = $.grep($scope.masters, function (e) {
            return e.id == id
        });
        $scope.masterInfo = $scope.neededMaster.lastName + ' ' + $scope.neededMaster.firstName;

        var master = $scope.neededMaster;
        for (var i = 0; i < master.visList.length; i++) {
            var visit = master.visList[i];
            var services
            var visitItem = {};
            visitItem.id = visit.id;
            visitItem.status = visit.status;
            visitItem.clientInfo = visit.client.lastName + " " + visit.client.firstName[0];
            for (var j = 0; j < visit.serviceList.length; j++) {
                var service = visit.serviceList[j];
                if (service.master.id === master.id) {
                    services.push(service.description);
                    coast += service.cost
                    startTimes.push(service.startTime);
                    endTimes.push(service.endTime);
                }
            }


        }
    }


    $scope.$watch('date.toDateString()', function () {
        $scope.masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
        $scope.showMaster();
    });
});