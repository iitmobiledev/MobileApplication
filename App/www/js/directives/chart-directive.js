/**
 * Директива для изменения и отображения даты.
 * @ngdoc directive
 * @name chart
 * @restrict C
 */
myApp.directive('chart', function () {
    return {
        restrict: 'C',
        replace: true,
        template: '<div id="container"></div>',
        link: function (scope, element, attrs) {

            //функция, рисующая график
            var drawChart = function () {
                //отцентровываем анимацию загрузки
                $("#loading-image").load(function () {
                    var left = ($(window).width() - $("#loading-image").width()) / 2;
                    var top = ($(window).height() - $("#loading-image").height()) / 2;
                    $("#loading-image").css("left", left + "px");
                    $("#loading-image").css("top", top + "px");
                    $("#loading-image").css("position", "fixed");
                });
                Highcharts.setOptions({
                    lang: {
                        shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                    }
                });

                $("#container").hide();
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container',
                        type: 'spline',
                        zoomType: 'x',
                        width: $("#content").width(),
                        height: $("#content").height(),
                        animation: true,
                        events: {
                            load: function (event) {
                                //                                setTimeout(function () {
                                $("#loading-image").fadeOut("slow");
                                $("#container").show();
                                //                                }, 7000);
                            }
                        },
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
                        data: scope.data
                }]
                });
            }


            window.addEventListener("resize", drawChart);

            /**
             *
             */
            function updateChartData(newData, callback) {
                //                setTimeout(function () {
                var chart = $('#container').highcharts();
                $("#container").hide();
                $("#loading-image").fadeIn("fast");
                if (chart) {
                    chart.series[0].update({
                        data: newData
                    });
                }
                callback();
                //                }, 10000);
            }

            //watch, смотрящий за изменением данных для графика
            scope.$watch("data", function (newValue) {
                updateChartData(newValue, function () {
                    $("#loading-image").fadeOut("slow");
                    $("#container").show();
                });
            }, true);

        }
    }
});