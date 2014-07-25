/**
 * @description Директива добавляет на страницу приложения график
 * @ngdoc directive
 * @name myApp.directive:chart
 * @restrict E
 * @param {String} chart-data имя параметра со списком данных для отображения графика: массив из списков, где 1 элемент-объект {Data}, 2 элемент-величина в зависимости от типа графика
 */

myApp.directive('chart', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="container"></div>',
        link: function (scope, element, attrs) {

            /*
             *функция, рисующая график
             */
            var drawChart = function () {
                Highcharts.setOptions({
                    lang: {
                        shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                    }
                });
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container',
                        type: 'spline',
                        zoomType: 'x',
                        width: $("#content").width(),
                        height: $("#content").height(),
                        animation: true,
                    },
                    title: "",
                    loading: {
                        hideDuration: 3000,
                        showDuration: 3000
                    },
                    xAxis: {
                        type: 'datetime',
                        minRange: 3 * 24 * 3600000,
                        dateTimeLabelFormats: { //don't display the dummy year
                            month: '%e %b %y'
                        },
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + Highcharts.dateFormat('%b, %e', this.x) + '</b>' + '<br>' + this.y + scope.yFormat;
                        }
                    },
                    yAxis: {
                        maxPadding: 0.25,
                        title: {
                            text: scope.yFormat,
                        },
                    },
                    legend: {
                        enabled: false,
                    },
                    series: [{
                        name: scope.title,
                }]
                });
            }

            window.addEventListener("resize", drawChart);

            /*
             *watch, смотрящий за изменением данных для графика
             */
            scope.$watch(attrs.chartData, function (newValue) {
                var chart = $('#container').highcharts();
                if (chart) {
                    chart.series[0].update({
                        data: newValue
                    });
                }
            }, true);

        }
    }
});