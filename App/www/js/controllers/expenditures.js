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
    //    $scope.expList = ExpendituresLoader($scope.date);

    var prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
    var nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
    $scope.pages = [ExpendituresLoader(prevdate), ExpendituresLoader($scope.date), ExpendituresLoader(nextdate)];
    console.log($scope.pages);
    $scope.pageIndex = 1;

    $scope.hasPrevData = function () {
        return true;
    };

    $scope.hasFutureData = function () {
        var period = DateHelper.getPeriod($scope.date, DateHelper.steps.DAY);
        if (period.end > new Date() || period.end.toDateString() == new Date().toDateString())
            return false;
        else
            return true;
    };

    $scope.$watch('date.toDateString()', function () {
        var prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
        var nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
        if ($scope.hasFutureData()) {
            $scope.pages = [ExpendituresLoader(prevdate), ExpendituresLoader($scope.date), ExpendituresLoader(nextdate)];
        } else {
            $scope.pages = [ExpendituresLoader(prevdate), ExpendituresLoader($scope.date)];
        }

        $scope.pageIndex = 1;
    });

    $scope.hasExpenditures = function (expendit) {
        return expendit.length != 0;
    }

    /*
     *функция, отображающая список расходов салона за день. Текущий день указывается в `scope`
     */
    //    $scope.showExp = function () {
    //        $scope.expenList = [];
    //        for (var i = 0; i < $scope.expList.length; i++) {
    //            var expItem = {};
    //            expItem.description = $scope.expList[i].description;
    //            expItem.cost = $scope.expList[i].cost;
    //            $scope.expenList.push(expItem);
    //        }
    //    }
    //    $scope.$watch('expList', $scope.showExp);
});