(function () {
    "use strict";
    /*
   hook up event handlers 
 */
    function getSumDataFromArray(dataArray) {
        console.log(dataArray.length);
        console.log(dataArray.length);
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
            tillMoney += dataArray[i].tillMoney;
            morningMoney += dataArray[i].morningMoney;
            credit += dataArray[i].credit;
            debit += dataArray[i].debit;
        }
        workload = Math.round(workload / dataArray.length);
        return new Data(date, proceeds, profit, clients, workload, tillMoney, morningMoney, credit, debit);
    }


    angular.module('myService', []).
    factory('notify', function () {
        return function (startDay, endDay) {
            var manyData = getData();
            console.log(startDay + "|" + endDay);
            if (startDay == endDay) {
                manyData = manyData.filter(function (d) {
                    return (d.date.getDate() <= startDay.getDate() && d.date.getDate() >= endDay.getDate());
                });
            } else {
                manyData = manyData.filter(function (d) {
                    return (d.date.getDate() <= startDay.getDate() || d.date.getDate() >= endDay.getDate());
                });
            }

            return manyData;
        };
    }).
    controller('MyController', function ($scope, notify) {
        $scope.date = new Date();
        $scope.endDay = $scope.date;
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
            $scope.endDay = $scope.date;
            $scope.data = getSumDataFromArray(notify($scope.date, $scope.date));
        };
        $scope.back = function () {
            $scope.date.setDate($scope.date.getDate() - 1);
            $scope.endDay = $scope.date;
            $scope.data = getSumDataFromArray(notify($scope.date, $scope.date));
        };

        $scope.getTitle = function () {
            if ($scope.date.getDate() == $scope.endDay.getDate())
                return $scope.date.toUTCString();
            else {
                return $scope.date.toUTCString() + " - " + $scope.endDay.toUTCString();
            }
        };

        $scope.forDay = function () {
            $scope.endDay = $scope.date;
            $scope.data = getSumDataFromArray(notify($scope.date, $scope.endDay));
        }

        $scope.forWeek = function () {
            $scope.endDay = new Date($scope.date);
            $scope.endDay.setDate($scope.endDay.getDate() - 7); //console.log("this date - " + $scope.date);console.log("last week - " + $scope.endDay);
            $scope.data = getSumDataFromArray(notify($scope.date, $scope.endDay));
        }

        $scope.forMonth = function () {
            $scope.endDay = new Date($scope.date.getFullYear(), $scope.date.getMonth() - 1, $scope.date.getDay());
            $scope.data = getSumDataFromArray(notify($scope.date, $scope.endDay));
        }

        //var dataArray = notify($scope.date, $scope.date);// new Date($scope.date.getDate() - 7));
        $scope.data = getSumDataFromArray(notify($scope.date, $scope.endDay));

    });



    function register_event_handlers() {}
    $(document).ready(register_event_handlers);
})();