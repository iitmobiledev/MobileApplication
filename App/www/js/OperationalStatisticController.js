//контроллер отвечающий за загрузку 4  плиток и переключателей между периодами
myApp.controller('OperationalStatisticController', function ($scope, OperationalStatisticLoader,
    $routeParams) {
    var date, step, endDay;
    if ($routeParams.period)
        step = $routeParams.period;
    else
        step = 1;

    if ($routeParams.day) {
        date = new Date($routeParams.day);
        date = new Date(date.getFullYear(), date.getMonth(),
            parseInt(date.getDate(), 10) + parseInt(step, 10));
    } else
        date = new Date();
    
    if (Math.abs(step) == 1)
        endDay = date;
    else
        endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - step);
    
    console.log(date);
    console.log(endDay);
    $scope.data = getSumDataFromArray(OperationalStatisticLoader(date, endDay));
});



function activeButtonHandling() {
    $('#buttonForDay').click(function () {
        $(this).css('border', '1px solid gray');
        $('#buttonForWeek').css('border', '');
        $('#buttonForMonth').css('border', '');
    });
    $('#buttonForWeek').click(function () {
        $(this).css('border', '1px solid gray');
        $('#buttonForDay').css('border', '');
        $('#buttonForMonth').css('border', '');
    });
    $('#buttonForMonth').click(function () {
        $(this).css('border', '1px solid gray');
        $('#buttonForWeek').css('border', '');
        $('#buttonForDay').css('border', '');
    });
};

function getSumDataFromArray(dataArray) {
    var date, proceeds = 0,
        profit = 0,
        clients = 0,
        workload = 0,
        tillMoney = 0,
        morningMoney = 0,
        credit = 0,
        debit = 0;
    for (var i = 0; i < dataArray.length; i++) {
        date = dataArray[i].date;
        proceeds += dataArray[i].proceeds;
        profit += dataArray[i].profit;
        clients += dataArray[i].clients;
        workload += dataArray[i].workload;
    }
    workload = Math.round(workload / dataArray.length);
    return new OperationalStatistics(date, proceeds, profit, clients, workload);
}