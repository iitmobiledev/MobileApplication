/**
 * @description Контроллер, получающий данные для отрисовки графика.
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `String` type - тип графика (что отображает график),
 * - `Number` period - период в месяцах, за который должен быть
 * отрисован график,
 * - `Number` chartStep - количество дней, за которые будут
 * просуммированы данные и отображены на графике,
 * - `Array` data - данные для отображения графика: массив из списков, где 1-ый элемент - объект {Data}, 2-ой элемент - величина в зависимости от типа графика,
 * - `Boolean` loader - переменная для показа или скрытия анимации
 * загрузки графика.
 * @ngdoc controller
 * @name myApp.controller:GraphicController
 * @requires myApp.service:ChartDataLoader
 */

myApp.controller('GraphicController', function ($scope, $routeParams, ChartDataLoader) {
    $scope.type = $routeParams.type;
    $scope.period = 12;
    $scope.chartStep = 1;
    ChartDataLoader.getGoodData($scope.type, $scope.period, $scope.chartStep, function (data) {
        $scope.loading = false;
        $scope.data = data;
        $scope.$apply();
    });
    $scope.step;
    $scope.title = '';
    $scope.yFormat = '';
    switch ($scope.type) {
    case 'proceeds':
        $scope.yFormat = ' руб.';
        $scope.title = 'Выручка';
        break;
    case 'profit':
        $scope.yFormat = ' руб.';
        $scope.title = 'Прибыль';
        break;
    case 'clients':
        $scope.title = 'Клиенты';
        break;
    case 'workload':
        $scope.yFormat = '%';
        $scope.title = 'Загруженность';
        break;
    default:
        break;
    }


    /**
     *
     * @ngdoc method
     * @name myApp.controller:GraphicController#changePeriod
     * @methodOf myApp.controller:GraphicController
     * @param {Number} p Период, на который нужно изменить в месяцах
     * @description Метод изменяющий период для отображения
     */
    $scope.changePeriod = function (p) {
        $scope.period = p;
    };
    /*
     *watch, следящий за изменением период, в случае изменения подгружает новые данные
     */
    $scope.$watch('period', function (newValue) {
        $scope.loading = true;
        ChartDataLoader.getGoodData($scope.type, $scope.period, $scope.chartStep, function (data) {
            $scope.loading = false;
            $scope.data = data;
            $scope.$apply();
        });
    });
});