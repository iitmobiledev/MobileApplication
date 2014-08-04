/**
 * @description Директива для добавления на страницу приложения
 * графика.
 * @ngdoc directive
 * @name myApp.directive:chart
 * @restrict E
 * @param {String} chart-data Список данных, которые будут отображены
 * на графике: массив из списков, где 1-ый элемент - объект `Date`, 2-ой элемент - величина в зависимости от типа графика
 */

myApp.directive('chart', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="container"></div>',
        link: function (scope, element, attrs) {

            /**
             *
             * @ngdoc method
             * @name myApp.directive:chart#drawChart
             * @methodOf myApp.directive:chart
             * @description Метод для отрисовки графика.
             */
            var drawChart = function () {
                Highcharts.setOptions({
                    lang: {
                        shortMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                        weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
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
                    xAxis: {
                        type: 'datetime',
                        minRange: 3 * 24 * 3600000,
                        dateTimeLabelFormats: { //don't display the dummy year
                            month: '%e %b %y'
                        },
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

                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },

                    series: [{
                        type: 'area',
                        name: scope.title
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