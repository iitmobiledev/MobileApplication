//контроллер отвечающий за загрузку 4  плиток и переключателей между периодами
myApp.controller('OperationalStatisticController', function ($scope, OperationalStatisticLoader) {
    $scope.date = new Date();
    $scope.step = 'day';
    $scope.steps = ['day', 'week', 'month'];

    $scope.$watch('date.toDateString()', function () {
        console.log("date change");
        $scope.data = OperationalStatisticLoader($scope.date, $scope.step);
    });

    $scope.$watch('step', function () {
        console.log("step change");
        $scope.data = OperationalStatisticLoader($scope.date, $scope.step);
    });

    $scope.data = OperationalStatisticLoader($scope.date, $scope.step);
});