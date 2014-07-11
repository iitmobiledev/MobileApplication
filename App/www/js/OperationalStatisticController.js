//контроллер отвечающий за загрузку 4  плиток и переключателей между периодами
myApp.controller('OperationalStatisticController', function ($scope, OperationalStatisticLoader) {

    $scope.date = new Date();
    $scope.step = 1;
    $scope.dateIsChange = false;
    $scope.endDay = $scope.date;

    $scope.setD = function (value) {
        $scope.date.setDate(value);
        $scope.dateIsChange = true;
    };

    $scope.setStep = function (value) {
        $scope.step = value;
    };

    $scope.setEndDay = function (value) {
        $scope.endDay = value;
    }

    $scope.$watch('dateIsChange', function () {
        $scope.dateIsChange = false;
        console.log("date watcher " + $scope.date);
        getDataForSelectPeriod();
    });

    $scope.forDay = function () {
        $scope.step = 1;
        getDataForSelectPeriod();
    };

    $scope.forWeek = function () {
        $scope.step = 7;
         getDataForSelectPeriod();
    };

    $scope.forMonth = function () {
        $scope.step = 30;
        getDataForSelectPeriod();
    };
    
    getDataForSelectPeriod();

    function getDataForSelectPeriod() {
        if (Math.abs($scope.step) == 1)
            return dataForDay();
        if (Math.abs($scope.step) == 7)
            return dataForWeek();
        if (Math.abs($scope.step) == 30)
            return dataForMonth();
    };

    function dataForDay() {
        $scope.step = 1;
        $scope.endDay = $scope.date;
        $scope.data = getSumDataFromArray(OperationalStatisticLoader($scope.date, $scope.endDay));
    }

    function dataForWeek() {
        $scope.step = 7;
        $scope.endDay = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 7);
        $scope.data = getSumDataFromArray(OperationalStatisticLoader($scope.date, $scope.endDay));
    }

    function dataForMonth() {
        $scope.step = 30;
        $scope.endDay = new Date($scope.date.getFullYear(), $scope.date.getMonth() - 1, $scope.date.getDate());
        $scope.data = getSumDataFromArray(OperationalStatisticLoader($scope.date, $scope.endDay));
    }

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
}

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