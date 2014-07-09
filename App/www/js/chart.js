function getGoodData() {
    var manyData = getData();
    var goodData = [];
    for (i = 0; i < manyData.length; i++) {
        var item = [];
        item.push(Date.UTC(manyData[i].date.getFullYear(), manyData[i].date.getMonth(), manyData[i].date.getDate()));
        item.push(manyData[i].proceeds);
        console.log(item[0] + "|" + item[1])
        goodData.push(item);
    }
    return goodData.sort();
}

//контроллер, получающий данные для отрисовки графика
myApp.controller('GraphicController', function ($scope) {
    $scope.data = getGoodData();
});


//директива для построения графика
myApp.directive('Graphic', function () {
    return {
        restrict: 'C',
        replace: true,
        scope: {
            items: '='
        },
//        controller: function ($scope, $element, $attrs) {
//           height:100%;width:100%;position:absolute;
//        },
        template: '<div id="container" style="height:100%;width:100%;position:absolute;">not working</div>',
        link: function (scope, element, attrs) {
            console.log(3);
//            intel.xdk.device.setRotateOrientation("landscape");
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    type: 'spline',
                    zoomType: 'x'
                },
                title: {
                    text: 'Browser market shares at a specific website, 2010'
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
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{point.x:%e. %b}: {point.y:.2f}р.'
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: '',
                    data: scope.data,
            }]

            });
            scope.$watch("items", function (newValue) {
                chart.series[0].setData(newValue, true);
            }, true);
        }
    }
});