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


myApp.controller('GraphicController', function ($scope) {
    $(function () {
        Highcharts.setOptions({
            lang: {
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
            }
        });
        showChart(getGoodData());

        document.addEventListener("intel.xdk.device.ready", function () {
            //lock the application in portrait orientation
            intel.xdk.device.setRotateOrientation("landscape");
            intel.xdk.device.setAutoRotate(false);

            //hide splash screen
            intel.xdk.device.hideSplashScreen();
        }, false);


        function register_event_handlers() {}
        $(document).ready(register_event_handlers);
    });

    function showChart(dataList) {
        $('#container').highcharts({
            chart: {
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
            tooltip: {
                headerFormat: '',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f}р.'
            },
            legend: {
                enabled: false
            },
            series: [{
                name: '',
                data: dataList
            }]
        });
    }
});