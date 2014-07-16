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

    //    $scope.checkLoad= function (){
    //        if($('#container').loaded){
    //            return true;
    //        }
    //        else{
    //            return false;
    //        }
    //    }
    //    
    //функция,изменяющая период для отображения
    $scope.changePeriod = function (p) {
        $scope.period = p;
    };
    //watch, следящий за изменением период, в случае изменения подгружает новые данные
    $scope.$watch('period', function (newValue) {
        $scope.data = getGoodData($scope.type, $scope.period);
    });
});


//директива для построения графика
myApp.directive('Graphic', function () {
    return {
        restrict: 'C',
        replace: true,
        template: '<div id="container"></div>',
        link: function (scope, element, attrs) {


            //            $(window).load(function () {
            //                $(".loader").fadeOut("slow");
            //                alert("loader");
            //            })

            //функция, рисующая график
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
                        events: {
                            load: function (event) {
                                $("#loading").hide();
                            }
                        },
                        loading: 'Загрузка данных...',
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


            //watch, смотрящий за изменением данных для графика
            scope.$watch("data", function (newValue) {
                var chart = $('#container').highcharts();
                if (chart) {
                    chart.showLoading('Загрузка данных...');
                    chart.series[0].update({
                        data: newValue
                    });
                    //                    setTimeout(function () {
                    chart.hideLoading();
                    //                    }, 2000);
                }
            }, true);

        }
    }
});