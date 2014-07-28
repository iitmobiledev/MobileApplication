/**
 * @description Контроллер, получающий данные для отрисовки графика
 * @ngdoc controller
 * @name myApp.controller:GraphicController
 */

myApp.controller('GraphicController', function ($scope, $routeParams) {
    /**
     * @param {String} type тип графика(что отображает график)
     * @param {Number} period период в месяцах, за который должен быть отрисован график
     * @param {Array} data данные для отображения графика:массив из списков, где 1 элемент-объект {Data}, 2 элемент-величина в зависимости от типа графика
     */
    $scope.type = $routeParams.type;
    $scope.period = 3;
    getGoodData($scope.type, $scope.period, function (data) {
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
        getGoodData($scope.type, $scope.period, function (data) {
            $scope.loading = false;
            $scope.data = data;
            $scope.$apply();
        });
    });
});

function getGoodData(needValue, period, callback) {
    var manyData = getOperationalStatisticsData();
    var goodData = [];
    var nowDay = new Date();
    var endDay = new Date(nowDay.getFullYear(), nowDay.getMonth() - period, nowDay.getDate());
    for (i = 0; i < manyData.length; i++) {
        if (manyData[i].date > endDay && manyData[i].date < nowDay) {
            var item = [];
            item.push(Date.UTC(manyData[i].date.getFullYear(), manyData[i].date.getMonth(), manyData[i].date.getDate()));
            item.push(manyData[i][needValue]);
            goodData.push(item);
        }
    }
    goodData = goodData.sort();
    setTimeout(function () {
        callback(goodData);
    }, 8000);
}