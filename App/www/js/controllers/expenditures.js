/**
 * @description <p>Контроллер, получающий данные для отображения расходов за день.</p>
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `date` - начальная дата, за которую должны отображаться расходы
 * - `step` - период за который отображаются расход
 * - `expList` - список расходов, состоит из объектов `ExpenditureItem`
 * - `hasPrevData` и `hasFutureData` - проверка необходимости, перехода на предыдущую или следующую дату, необходимо для для `date-directive`
 * @requires myApp.directive:expList
 * @requires myApp.directive:dateChanger
 * @ngdoc controller
 * @name myApp.controller:ExpendituresController
 */
myApp.controller('ExpendituresController', function ($scope, $filter, ExpendituresLoader, DateHelper) {
    var getExpenditures = ExpendituresLoader.getData;
    var minDate = ExpendituresLoader.getMinDate();
    var maxDate = ExpendituresLoader.getMaxDate();

    $scope.date = new Date();

    $scope.pageIndex = 1;

    $scope.hasPrevData = function () {
        return $scope.date > minDate;
    };

    $scope.hasFutureData = function () {
        return $scope.date < maxDate && $scope.date.toDateString() != maxDate.toDateString();
    };

    /**
     * @description Обновляет информацию о затратах, хранящуюся в списке `pages`. В зависимости от даты, хранящейся в `$scope.date` данные будут загружаться за этот день, предыдущий и посдедующий.
     * @ngdoc method
     * @name myApp.controller:ExpendituresController#updatePages
     * @methodOf myApp.controller:ExpendituresController
     */
    function updatePages() {
        $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
        $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);

        if (!$scope.hasFutureData()) {
            $scope.pages = [getExpenditures($scope.prevdate), getExpenditures($scope.date)];
            $scope.pageIndex = 1;
        } else {
            if ($scope.hasPrevData()) {
                $scope.pages = [getExpenditures($scope.prevdate), getExpenditures($scope.date), getExpenditures($scope.nextdate)];
                $scope.pageIndex = 1;
            }
        }
    }


    $scope.$watch('date.toDateString()', updatePages);

    $scope.hasExpenditures = function (expendit) {
        return expendit.length != 0;
    }
});