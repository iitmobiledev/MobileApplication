/**
 * @ngdoc controller
 * @name myApp.controller:OperationalStatisticController
 * @description <p> Контроллер, отвечающий за загрузку статистических
 * данных. </p>
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `Date` date - текущая дата;
 * - `String` step - текущий период, допустимые значения определены
 * в DateHelper.steps;
 * - `Array` pages - список из объектов `OperationalStatistics` за 3 дня:
 * вчерашний, текущий, завтрашний (если существует);
 * - `Number` pageIndex - индекс массива `pages`, выбранной страницы.
 * @requires myApp.service:OperationalStatisticLoader
 * @requires myApp.service:DateHelper
 */
myApp.controller('OperationalStatisticController', function ($scope, $location, OperationalStatisticLoader, DateHelper) {
    var getStatistic = OperationalStatisticLoader.getData;
    var minDate = OperationalStatisticLoader.getMinDate();
    var maxDate = OperationalStatisticLoader.getMaxDate();

    $scope.date = new Date();

    $scope.step = DateHelper.steps.DAY;

    $scope.pageIndex = 1;

    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#hasPrevData
     * @methodOf myApp.controller:OperationalStatisticController
     * @returns {Boleean} Возвращает `true`, если есть данные за прошлое.
     * @description Метод для проверки наличия данных за прошлый
     * период.
     */
    $scope.hasPrevData = function () {
        return $scope.date > minDate;
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#hasFutureData
     * @methodOf myApp.controller:OperationalStatisticController
     * @returns {Boleean} Возвращает `true`, если есть данные за будущее.
     * @description Метод для проверки наличия данных за будущий
     * период.
     */
    $scope.hasFutureData = function () {
        var period = DateHelper.getPeriod($scope.date, $scope.step);
        return period.end < maxDate && period.end.toDateString() != maxDate.toDateString();
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#updatePages
     * @methodOf myApp.controller:OperationalStatisticController
     * @description Метод для обновления данных статистики на
     * текущей, левой и правой страницах.
     */
    function updatePages() {
        var period = DateHelper.getPeriod($scope.date, $scope.step);
        $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), period.begin.getDate() - 1);
        $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), period.end.getDate() + 1);

        if (!$scope.hasFutureData()) {
            $scope.pages = [{
                currentData: getStatistic($scope.prevdate, $scope.step),
                prevData: getStatistic(DateHelper.getPrev($scope.prevdate, $scope.step), $scope.step)
            }, {
                currentData: getStatistic($scope.date, $scope.step),
                prevData: getStatistic(DateHelper.getPrev($scope.date, $scope.step), $scope.step)
            }];
//            $scope.pageIndex = 1;
        } else {
            if ($scope.hasPrevData()) {
                $scope.pages = [{
                    currentData: getStatistic($scope.prevdate, $scope.step),
                    prevData: getStatistic(DateHelper.getPrev($scope.prevdate, $scope.step), $scope.step)
                }, {
                    currentData: getStatistic($scope.date, $scope.step),
                    prevData: getStatistic(DateHelper.getPrev($scope.date, $scope.step), $scope.step)
                }, {
                    currentData: getStatistic($scope.nextdate, $scope.step),
                    prevData: getStatistic(DateHelper.getPrev($scope.nextdate, $scope.step), $scope.step)
                }];
//                $scope.pageIndex = 1;
            } else {
                $scope.date = OperationalStatisticLoader.getMinDate();
            }
        }
    }

    $scope.$watch('date.toDateString()', updatePages);

    $scope.$watch('step', updatePages);

    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#toChart
     * @methodOf myApp.controller:OperationalStatisticController
     * @params {String} type тип графика, поле объекта `OperationalStatistics`.
     * @description Метод для перехода на страницу графика.
     */
    $scope.toChart = function (type) {
        $location.path('chart/' + type);
    }
    
    
    /**
     *
     * @ngdoc method
     * @name myApp.controller:OperationalStatisticController#toExpenditures
     * @methodOf myApp.controller:OperationalStatisticController
     * @description Метод для перехода на страницу расходов.
     */
    $scope.toExpenditures = function () {
        $location.path('expenditures');
    }
    
});