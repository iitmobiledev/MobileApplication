function getGoodData(needValue) {
    var manyData = getData();
    var goodData = [];
    for (i = 0; i < manyData.length; i++) {
        var item = [];
        item.push(Date.UTC(manyData[i].date.getFullYear(), manyData[i].date.getMonth(), manyData[i].date.getDate()));
        item.push(manyData[i][needValue]);
        goodData.push(item);
    }
    return goodData.sort();
}

//контроллер, получающий данные для отрисовки графика
myApp.controller('GraphicController', function ($scope, $routeParams) {
    $scope.type = $routeParams.type;
    $scope.data = getGoodData($scope.type);
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
});


//директива для построения графика
myApp.directive('Graphic', function () {
    return {
        restrict: 'C',
        replace: true,
        scope: {
            items: "=",
            dimension: "=",
            //            yFormat: "="
        },
        //style="height:100%;width:100%;position:relative;
        template: '<div id="container">not working</div>',
        link: function (scope, element, attrs) {
            //            intel.xdk.device.setRotateOrientation("landscape");
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    type: 'spline',
                    zoomType: 'x'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    minRange: 3 * 24 * 3600000, // fourteen days
                    dateTimeLabelFormats: { // don't display the dummy year
                        month: '%e %b %y'
                    },
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                },
                lang: {
                    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                    shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                    weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: '',
                    data: scope.data,
            }]

            });

//            console.log($("#container").width() + "|" + $("#container").height());
//            chart.setSize($("#container").width(), $("#container").height(), true);
            chart.tooltip.options.formatter = function () {
                var s = '<b>' + Highcharts.dateFormat('%e %b', this.x) + '</b>' + '<br>' + this.y + scope.yFormat;
                return s;
            }


            scope.$watch("items", function (newValue) {
                //                console.log(scope.items)
                chart.series[0].setData(newValue, true);
            }, true);

        }
    }
});