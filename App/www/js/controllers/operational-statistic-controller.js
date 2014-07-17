//контроллер отвечающий за загрузку 4  плиток и переключателей между периодами
myApp.controller('OperationalStatisticController', function ($scope, OperationalStatisticLoader,
    DateHelper) {
    $scope.date = new Date();
    $scope.step = "day";

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
        $scope.prevData = OperationalStatisticLoader(DateHelper.getPrev($scope.date, $scope.step), $scope.step);
    });

    $scope.$watch('step', function () {
        $scope.data = OperationalStatisticLoader($scope.date, $scope.step);
        $scope.prevData = OperationalStatisticLoader(DateHelper.getPrev($scope.date, $scope.step), $scope.step);
    });

    $scope.data = OperationalStatisticLoader($scope.date, $scope.step);
    $scope.prevData = OperationalStatisticLoader(DateHelper.getPrev($scope.date, $scope.step), $scope.step);
});