/**
 * @ngdoc controller
 * @name myApp.controller:OperationalStatisticController
 * @description <p> Контроллер, отвечающий за загрузку статистических
 * данных. </p>
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `date` - текущая дата,
 * - `step` - текущий шаг периода, должен быть определен в DateHelper.steps,
 * - `hasPrevData` - показывает, есть ли данные за предыдущий период,
 * - `hasFutureData` - показывает, есть ли за следующий период.
 * @requires myApp.service:OperationalStatisticLoader
 * @requires myApp.service:DateHelper
 */
myApp.controller('OperationalStatisticController', function ($scope, OperationalStatisticLoader,
    DateHelper) {
    
    if (!$scope.date)
        $scope.date = new Date();

    $scope.step = DateHelper.steps.DAY;


    $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
    $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
    $scope.pages = [OperationalStatisticLoader($scope.prevdate, $scope.step), OperationalStatisticLoader($scope.date, $scope.step), OperationalStatisticLoader($scope.nextdate, $scope.step)];
    $scope.pageIndex = 1;

    $scope.hasPrevData = function () {
        return true;
    };

    $scope.hasFutureData = function () {
        var period = DateHelper.getPeriod($scope.date, $scope.step);
        if (period.end > new Date() || period.end.toDateString() == new Date().toDateString()) {
            //$scope.pages.pop();
            return false;
        } else {
            //                if ($scope.pages.length == 2) {
            //                    $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
            //                    $scope.pages.push(OperationalStatisticLoader($scope.nextdate, $scope.step));
            //            }
            return true;
        }
    };

    $scope.$watch('date.toDateString()', function () {
        console.log("index " + $scope.pageIndex);
        $scope.data = OperationalStatisticLoader($scope.date, $scope.step);
        $scope.prevData = OperationalStatisticLoader(DateHelper.getPrev($scope.date, $scope.step),
            $scope.step);

        $scope.hasPrevData();
        if (!$scope.hasFutureData()) {
            $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
                $scope.date.getDate() - 1);
            $scope.pages = [OperationalStatisticLoader($scope.prevdate, $scope.step),
                        OperationalStatisticLoader($scope.date, $scope.step)];
        } else {

            $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
                $scope.date.getDate() - 1);
            $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
                $scope.date.getDate() + 1);
            $scope.pages = [OperationalStatisticLoader($scope.prevdate, $scope.step),
                        OperationalStatisticLoader($scope.date, $scope.step),
                        OperationalStatisticLoader($scope.nextdate, $scope.step)];
        }
        $scope.pageIndex = 1;
    });

    //    $scope.$watch('pageIndex', function () {
    //        if ($scope.pageIndex !== 1) {
    //            switch ($scope.pageIndex) {
    //            case 2:
    //                $scope.date = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
    //                break;
    //                1
    //            case 0:
    //                $scope.date = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
    //                break;
    //            }
    //        }
    //
    //    });

    $scope.$watch('step', function () {
        $scope.data = OperationalStatisticLoader($scope.date, $scope.step);
        $scope.prevData = OperationalStatisticLoader(DateHelper.getPrev($scope.date, $scope.step),
            $scope.step);
        $scope.hasPrevData();
        $scope.hasFutureData();
    });
});