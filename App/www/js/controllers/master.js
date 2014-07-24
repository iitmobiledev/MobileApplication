//контроллер страницы мастера 
myApp.controller('MasterController', function ($scope, $routeParams, VisitsLoader) {
    $scope.id = $routeParams.id;
    $scope.date = new Date();
    $scope.step = 'day';
    $scope.type = 'time';

    $scope.masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);




    $scope.$watch('date.toDateString()', function () {
        $scope.masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
    });
});