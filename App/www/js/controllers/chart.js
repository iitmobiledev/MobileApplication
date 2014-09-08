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

myApp.controller('GraphicController', function ($scope, $routeParams, Loader, DateHelper) {
    $scope.type = $routeParams.type;
    $scope.step;
    $scope.title = '';
    $scope.yFormat = '';

    var goodData = [];
    var today = new Date();
    $scope.loading = true;
    Loader.search("OperationalStatistics", {
            dateFrom: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
            dateTill: today,
            step: DateHelper.steps.DAY,
        },
        function (data) {
            for (var i = 0; i < data.length; i++) {
                var item = [];
                item.push(Date.UTC(data[i].date.getFullYear(), data[i].date.getMonth(), data[i].date.getDate()));
                item.push(data[i][$scope.type.toString()]);
                goodData.push(item);
            }
            goodData = goodData.sort();
            $scope.loading = false;
            $scope.data = goodData;
            $scope.$apply();
        });

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
});