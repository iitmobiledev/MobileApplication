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
    $scope.date = new Date();
    $scope.step = 'day';
    $scope.expList = ExpendituresLoader($scope.date);

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
        $scope.expList = ExpendituresLoader($scope.date);
    });

    $scope.$watch('step', function () {
        $scope.expList = ExpendituresLoader($scope.date);
    });


    $scope.hasExpenditures = function () {
        return $scope.expList != null;
    }

    /*
     *функция, отображающая список расходов салона за день. Текущий день указывается в `scope`
     */
    $scope.showExp = function () {
        $scope.expenList = [];
        if ($scope.expList != null) {
            for (var i = 0; i < $scope.expList.length; i++) {
                var expItem = {};
                expItem.description = $scope.expList[i].description;
                expItem.cost = $scope.expList[i].cost;
                $scope.expenList.push(expItem);
            }
        }
    }
    $scope.$watch('expList', $scope.showExp);
});