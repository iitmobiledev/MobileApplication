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
    $scope.step
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


            //            setTimeout(function(){
            ////                 console.log($("#container").width() + "|" + $("#container").height());
            ////                $("#container").css('border','solid 1px green');
            //                chart.setSize($("#content").width(), $("#content").height(), true);
            //            },1000)
            //                        chart.setSize($("#container").width(), $("#container").height(), true);

            chart.tooltip.options.formatter = function () {
                console.log("scope:", JSON.stringify(scope));
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