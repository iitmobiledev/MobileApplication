//контроллер  страницы визитов
myApp.controller('VisitsController', function ($scope) {
    $(window).load(function () {
        alert("stoop!");
    });
    $scope.date = new Date();
    $scope.step = 'day';
    $scope.$watch('date.toDateString()', function () {
        $scope.data = OperationalStatisticLoader($scope.date, $scope.step);
    });
});