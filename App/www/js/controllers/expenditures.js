/**
 * @description <p>Контроллер, получающий данные для отображения расходов за день.</p>
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `date` - начальная дата, за которую должны отображаться расходы
 * - `step` - период за который отображаются расход
 * - `expList` - список расходов, состоит из объектов `ExpenditureItem`
 * - `hasPrevData` и `hasFutureData` - проверка необходимости, перехода на предыдущую или следующую дату, необходимо для для `date-directive`
 * @requires myApp.directive:dateChanger
 * @ngdoc controller
 * @name myApp.controller:ExpendituresController
 */
myApp.controller('ExpendituresController', function ($scope, $filter, ExpendituresLoader, DateHelper) {
    var minDate = ExpendituresLoader.getMinDate();
    var maxDate = ExpendituresLoader.getMaxDate();

    $scope.date = new Date();

    $scope.pageIndex = 1;

    /**
     *
     * @ngdoc method
     * @name myApp.controller:ExpendituresController#hasPrevData
     * @methodOf myApp.controller:ExpendituresController
     * @returns {Boleean} Возвращает true, если есть данные за прошлое.
     * @description Метод для проверки наличия данных за прошлый
     * период.
     */
    $scope.hasPrevData = function () {
        return $scope.date > minDate;
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:ExpendituresController#hasFutureData
     * @methodOf myApp.controller:ExpendituresController
     * @returns {Boleean} Возвращает true, если есть данные за будущее.
     * @description Метод для проверки наличия данных за будущий
     * период.
     */
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
            $scope.pages = [ExpendituresLoader.getData($scope.prevdate), ExpendituresLoader.getData($scope.date)];
            //            $scope.pageIndex = 1;
        } else {
            if ($scope.hasPrevData()) {
                $scope.pages = [ExpendituresLoader.getData($scope.prevdate), ExpendituresLoader.getData($scope.date), ExpendituresLoader.getData($scope.nextdate)];
                //                $scope.pageIndex = 1;
            }
        }
    }

    $scope.$watch('date.toDateString()', updatePages);

    $scope.hasExpenditures = function (expendit) {
        return expendit.length != 0;
    }
});