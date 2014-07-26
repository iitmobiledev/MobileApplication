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
myApp.controller('OperationalStatisticController', function ($scope, $location, OperationalStatisticLoader, DateHelper) {

    $scope.date = new Date();

    $scope.step = DateHelper.steps.DAY;

    $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
    $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
    $scope.pages = [OperationalStatisticLoader($scope.prevdate, $scope.step), OperationalStatisticLoader($scope.date, $scope.step), OperationalStatisticLoader($scope.nextdate, $scope.step)];
    $scope.pageIndex = 1;
    
     /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#hasPrevData
     * @methodOf myApp.controller:OperationalStatisticController
     * @returns {Boleean} Возвращает true, если есть данные за прошлое.
     * @description Метод для проверки наличия данных за прошлый
     * период.
     */
    $scope.hasPrevData = function () {
        return true;
    };

     /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#hasFutureData
     * @methodOf myApp.controller:OperationalStatisticController
     * @returns {Boleean} Возвращает true, если есть данные за будущее.
     * @description Метод для проверки наличия данных за будущий
     * период.
     */
    $scope.hasFutureData = function () {
        var period = DateHelper.getPeriod($scope.date, $scope.step);
        return !(period.end > new Date() || period.end.toDateString() == new Date().toDateString());
    };

    $scope.$watch('date.toDateString()', function () {
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

    $scope.$watch('step', function () {
        $scope.data = OperationalStatisticLoader($scope.date, $scope.step);
        $scope.prevData = OperationalStatisticLoader(DateHelper.getPrev($scope.date, $scope.step),
            $scope.step);
        $scope.hasPrevData();
        $scope.hasFutureData();
    });
    
    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#toChart
     * @methodOf myApp.controller:OperationalStatisticController
     * @params {String} type тип графика, поле объекта OperationalStatistics.
     * @description Метод для перехода на страницу графика.
     */
    $scope.toChart = function (type) {
        $location.path('chart/' + type);
    }
});