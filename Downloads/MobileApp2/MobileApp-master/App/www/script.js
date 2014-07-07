function getSumDataFromArray(dataArray){
    var date, proceeds=0, profit=0, clients=0, workload=0, tillMoney=0, morningMoney=0, credit=0, debit=0;
    for (var i =0; i < dataArray.length; i++)
    {
        date = dataArray[i].date;
        proceeds += dataArray[i].proceeds;
        profit += dataArray[i].profit;
        clients += dataArray[i].clients;
        workload += dataArray[i].workload;
        tillMoney += dataArray[i].tillMoney;
        morningMoney += dataArray[i].morningMoney;
        credit += dataArray[i].credit;
        debit += dataArray[i].debit;
    }
    workload = Math.round(workload/dataArray.length);
    return new Data(date, proceeds, profit, clients, workload, tillMoney, morningMoney, credit, debit);
}


angular.module('myService', []).
factory('notify', function () {
    return function (startDay, endDay) {
        var manyData = getData();
        manyData = manyData.filter(function (d) {
            return (d.date.getDate() <= startDay.getDate() && d.date.getDate() >= endDay.getDate());
        });
        return manyData;
    };
}).
controller('MyController', function ($scope, notify) {
    $scope.date = new Date();
    var endDay = $scope.date;
    $scope.hasPreviousData = function () {
        return true;
    };
    $scope.hasFutureData = function () {
        if ($scope.date.getDate() == new Date().getDate()) {
            return false;
        } else {
            return true;
        }
    };
    $scope.forward = function () {
        $scope.date.setDate($scope.date.getDate() + 1);   
        endDay = $scope.date;
        $scope.data = getSumDataFromArray(notify($scope.date, $scope.date));
    };
    $scope.back = function () {
        $scope.date.setDate($scope.date.getDate() - 1);
        endDay = $scope.date;
        $scope.data = getSumDataFromArray(notify($scope.date, $scope.date));
    };

    $scope.getTitle = function () {
        if ($scope.date.getDate() == endDay.getDate())
            return $scope.date.toUTCString();
        return $scope.date.toUTCString() + " - " + endDay.toUTCString();
    };
    
    $scope.forDay = function() {
        endDay = $scope.date;
        $scope.data = getSumDataFromArray(notify($scope.date, endDay));
    }
    $scope.forWeek = function() {
        endDay = new Date($scope.date.getDate() - 7);
        $scope.data = getSumDataFromArray(notify($scope.date, endDay));
    }
    $scope.forMonth = function() {
        endDay = new Date($scope.date.getFullYear(), $scope.date.getMonth() - 1, $scope.date.getDay());
        $scope.data = getSumDataFromArray(notify($scope.date, endDay));
    }
    
    //var dataArray = notify($scope.date, $scope.date);// new Date($scope.date.getDate() - 7));
    $scope.data = getSumDataFromArray(notify($scope.date, endDay));
});