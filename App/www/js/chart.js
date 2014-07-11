var format = ' '

    function getGoodData(needValue, period) {
        var manyData = getData();
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
        return goodData.sort();
    }

    //контроллер, получающий данные для отрисовки графика
myApp.controller('GraphicController', function ($scope, $routeParams) {
    $scope.type = $routeParams.type;
    $scope.period = 3;
    $scope.data = getGoodData($scope.type, $scope.period);
    $scope.step;
    $scope.yFormat = ' ';
    switch ($scope.type) {
    case 'proceeds':
        $scope.yFormat = ' р.';
        break;
    case 'profit':
        $scope.yFormat = ' р.';
        break;
    case 'workload':
        $scope.yFormat = '%';
        break;
    default:
        break;
    }
    $scope.setFormat = function () {
        format = $scope.yFormat;
    };
    $scope.setFormat();

    $scope.changePeriod = function (p) {
        $scope.period = p;
    };

    $scope.$watch('period', function (newValue) {
        $scope.data = getGoodData($scope.type, $scope.period);
    });
});


//директива для построения графика
myApp.directive('Graphic', function () {
    return {
        restrict: 'C',
        replace: true,
        template: '<div id="container" style="height:100%;">not working</div>',
        link: function (scope, element, attrs) {
            intel.xdk.device.setRotateOrientation("landscape");
            intel.xdk.device.setAutoRotate(false);
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    type: 'spline',
                    zoomType: 'x',
                    width: $("#content").width(),
                    height: $("#content").height()

                },
                xAxis: {
                    type: 'datetime',
                    minRange: 3 * 24 * 3600000, // fourteen days
                    dateTimeLabelFormats: { // don't display the dummy year
                        month: '%e %b %y'
                    },
                },
//                lang: {
//                    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
//                    shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
//                    weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
//                },
//                legend: {
//                    enabled: false
//                },
                series: [{
                    name: 'df',
            }]

            });

            chart.tooltip.options.formatter = function () {
                var s = '<b>' + Highcharts.dateFormat('%e %b', this.x) + '</b>' + '<br>' + this.y + format;
                return s;
            }

            scope.$watch("type", function (newValue) {
                var title = '';
                switch (newValue) {
                case 'proceeds':
                    title = 'Выручка';
                    break;
                case 'profit':
                    title = 'Прибыль';
                    break;
                case 'clients':
                    title = 'Клиенты';
                    break;
                case 'workload':
                    title = 'Загруженность';
                    break;
                default:
                    break;
                }
                chart.setTitle({
                    text: title
                }, true);
            }, true);

            scope.$watch("data", function (newValue) {
                chart.series[0].setData(newValue, true);
            }, true);

        }
    }
});