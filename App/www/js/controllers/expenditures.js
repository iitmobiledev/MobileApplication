/**
 * @description <p>Контроллер для получения данных о расходах за
 * текущий день.</p>
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `Date` date - текущая дата;
 * - `Array` pages - список из объектов `ExpenditureItem` за 3 дня:
 * вчерашний, текущий, завтрашний (если существует);
 * - `Number` pageIndex - индекс массива `pages`, выбранной страницы.
 * @ngdoc controller
 * @name myApp.controller:ExpendituresController
 * @requires myApp.service:ExpendituresLoader
 * @requires myApp.service:DateHelper
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
     * @returns {Boleean} Возвращает `true`, если есть данные за будущее.
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
        $scope.prevdate = DateHelper.getPrevPeriod($scope.date, DateHelper.steps.DAY).begin;
        $scope.nextdate = DateHelper.getNextPeriod($scope.date, DateHelper.steps.DAY).end;

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

    /**
     * @description Функция для определения наличия данных за
     * текущий день.
     * @returns {Boleean} Возвращает `true`, если есть данные, иначе `else`.
     * @ngdoc method
     * @name myApp.controller:ExpendituresController#hasExpenditures
     * @methodOf myApp.controller:ExpendituresController
     */
    $scope.hasExpenditures = function (expendit) {
        return expendit.length != 0;
    }
});