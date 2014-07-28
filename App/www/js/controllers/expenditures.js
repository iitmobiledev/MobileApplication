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

    updatePages();

    /**
     * @description Обновляет информацию о затратах, зранящуюся в списке `pages`. В зависимости от даты, хранящейся в `$scope.date` данные будут загружаться за этот день, предыдущий и посдедующий.
     * @ngdoc method
     * @name myApp.controller:ExpendituresController#updatePages
     * @methodOf myApp.controller:ExpendituresController
     */
    function updatePages() {
        var prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
        var nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
        if ($scope.hasFutureData()) {
            $scope.pages = [ExpendituresLoader(prevdate), ExpendituresLoader($scope.date), ExpendituresLoader(nextdate)];
        } else {
            $scope.pages = [ExpendituresLoader(prevdate), ExpendituresLoader($scope.date)];
        }

        $scope.pageIndex = 1;
    }


    $scope.$watch('date.toDateString()', function () {
        updatePages();
    });

    $scope.hasExpenditures = function (expendit) {
        return expendit.length != 0;
    }
});