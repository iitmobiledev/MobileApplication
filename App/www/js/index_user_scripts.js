    var myApp = angular.module('myApp', []);

    (function () {
        "use strict";

//        myApp.factory('loader', function () {
//            return function (startDay, endDay) {
//                var manyData = getData();
//                if (startDay == endDay) {
//                    manyData = manyData.filter(function (d) {
//                        return (d.date.toDateString() == startDay.toDateString());
//                    });
//                } else {
//                    manyData = manyData.filter(function (d) {
//                        return (d.date <= startDay && d.date >= endDay);
//                    });
//                }
//                return manyData;
//            };
//        })

//        myApp.controller('todayController', function ($scope, loader) { //контроллер  нижней   плитки
//            $scope.date = new Date();
//            $scope.data = getSumDataFromArray(loader($scope.date, $scope.date));
//        });



        function register_event_handlers() {}
        $(document).ready(register_event_handlers);
    })();



    function activeButtonHandling() {
        $('#buttonForDay').click(function () {
            $(this).css('border', '1px solid black');
            $('#buttonForWeek').css('border', '');
            $('#buttonForMonth').css('border', '');
        });
        $('#buttonForWeek').click(function () {
            $(this).css('border', '1px solid black');
            $('#buttonForDay').css('border', '');
            $('#buttonForMonth').css('border', '');
        });
        $('#buttonForMonth').click(function () {
            $(this).css('border', '1px solid black');
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
            tillMoney += dataArray[i].tillMoney;
            morningMoney += dataArray[i].morningMoney;
            credit += dataArray[i].credit;
            debit += dataArray[i].debit;
        }
        workload = Math.round(workload / dataArray.length);
        return new Data(date, proceeds, profit, clients, workload, tillMoney, morningMoney, credit, debit);
    }