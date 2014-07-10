//контроллер отвечающий за загрузку 4  плиток и переключателей между периодами
myApp.controller('OperationalStatisticController', function ($scope, OperationalStatisticLoader, $filter, $routeParams) {
    if ($routeParams.period)
    {
        $scope.step = $routeParams.period;
    }
    else
        $scope.step = 1;
    
    if ($routeParams.day)
    {        
        $scope.date = new Date($routeParams.day);
        $scope.date = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
                               parseInt($scope.date.getDate(),10) + parseInt($scope.step,10));
    }
    else
        $scope.date = new Date();
    
    getDataForSelectPeriod();
    function getDataForSelectPeriod() {
        if (Math.abs($scope.step) == 1)
            return dataForDay();
        if (Math.abs($scope.step) == 7)
            return dataForWeek();
        if (Math.abs($scope.step) == 30)
            return dataForMonth();
    }
    
    activeButtonHandling();
    
    $scope.hasPreviousData = function () {
        return true;
    };

    $scope.hasFutureData = function () {
        if ($scope.date > new Date().setDate(new Date().getDate() - 1)) {
            return false;
        } else {
            return true;
        }
    };

    $scope.getTitle = function () {
        if ($scope.date == $scope.endDay) {
            return $filter('date')($scope.date, "dd.MM.yyyy");
        } else {
            return $filter('date')($scope.endDay, "dd.MM.yyyy") + " - " + $filter('date')($scope.date, "dd.MM.yyyy");
        }
    };

    $scope.forDay = dataForDay;

    $scope.forWeek = dataForWeek;

    $scope.forMonth = dataForMonth;

    function dataForDay() {
        console.log("forDay");
        $scope.step = 1;
        $scope.endDay = $scope.date;
        $scope.data = getSumDataFromArray(OperationalStatisticLoader($scope.date, $scope.endDay));
    };

    function dataForWeek() {
        console.log("forDay");
        $scope.step = 7;
        $scope.endDay = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 7);
        $scope.data = getSumDataFromArray(OperationalStatisticLoader($scope.date, $scope.endDay));
    };

    function dataForMonth() {
        console.log("forDay");
        $scope.step = 30;
        $scope.endDay = new Date($scope.date.getFullYear(), $scope.date.getMonth() - 1, $scope.date.getDate());
        $scope.data = getSumDataFromArray(OperationalStatisticLoader($scope.date, $scope.endDay));
    };

    $scope.data = getSumDataFromArray(OperationalStatisticLoader($scope.date, $scope.endDay));
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