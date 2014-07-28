/**
 * @description Контроллер, получающий данные для отрисовки графика
 * @ngdoc controller
 * @name myApp.controller:GraphicController
 */

myApp.controller('GraphicController', function ($scope, $routeParams, ChartDataLoader) {
    /**
     * @param {String} type тип графика(что отображает график)
     * @param {Number} period период в месяцах, за который должен быть отрисован график
     * @param {Array} data данные для отображения графика:массив из списков, где 1 элемент-объект {Data}, 2 элемент-величина в зависимости от типа графика
     */
    $scope.type = $routeParams.type;
    $scope.period = 3;
    $scope.chartStep = 7;
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