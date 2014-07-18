/**
 * @description Контроллер, отвечающий за загрузку статистических
 * данных.
 * @ngdoc controller
 * @name myApp.controller:OperationalStatisticController
 */
myApp.controller('OperationalStatisticController', function ($scope, OperationalStatisticLoader,
    DateHelper) {
    $scope.date = new Date();
    $scope.step = DateHelper.steps.DAY;

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
        $scope.data = OperationalStatisticLoader($scope.date, $scope.step);
        $scope.prevData = OperationalStatisticLoader(DateHelper.getPrev($scope.date, $scope.step),
            $scope.step);
        $scope.hasPrevData();
        $scope.hasFutureData();
    });

    $scope.$watch('step', function () {
        $scope.data = OperationalStatisticLoader($scope.date, $scope.step);
        $scope.prevData = OperationalStatisticLoader(DateHelper.getPrev($scope.date, $scope.step),
            $scope.step);
        $scope.hasPrevData();
        $scope.hasFutureData();
    });
});