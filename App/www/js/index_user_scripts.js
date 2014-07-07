    var myApp = angular.module('myApp', []);

    (function () {
        "use strict";

        myApp.factory('loader', function () {
            return function (startDay, endDay) {
                var manyData = getData();
                if (startDay == endDay) {
                    manyData = manyData.filter(function (d) {
                        return (d.date.toDateString() == startDay.toDateString());
                    });
                } else {
                    manyData = manyData.filter(function (d) {
                        return (d.date <= startDay && d.date >= endDay);
                    });
                }
                return manyData;
            };
        })

        myApp.controller('statisticController', function ($scope, loader, $filter) { //контроллер отвечающий за загрузку 4  плиток 
            //и переключателей между периодами
            activeButtonHandling();
            var isDay = true,
                isWeek = false,
                isMonth = false;
            $scope.date = new Date();
            $scope.endDay = $scope.date;
            $scope.step = 1;
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

            $scope.forward = function () {
                $scope.date.setDate($scope.date.getDate() + $scope.step);
                getDataForSelectPeriod();
            };

            $scope.back = function () {
                $scope.date.setDate($scope.date.getDate() - $scope.step);
                getDataForSelectPeriod();
            };

            $scope.getTitle = function () {
                if ($scope.date == $scope.endDay) {
                    return $filter('date')($scope.date, "dd.MM.yyyy");
                } else {
                    return $filter('date')($scope.endDay, "dd.MM.yyyy") + " - " + $filter('date')($scope.date, "dd.MM.yyyy");
                }
            };

            //            myApp.filter('dateFormat', function myDateFormat($filter) {
            //                return function (date) {
            //                    return $filter('date')(date, "dd.MM.yyyy");
            //                }
            //            })



            $scope.forDay = dataForDay;

            $scope.forWeek = dataForWeek;

            $scope.forMonth = dataForMonth;

            function dataForDay() {
                $scope.step = 1;
                $scope.endDay = $scope.date;
                $scope.data = getSumDataFromArray(loader($scope.date, $scope.endDay));
                isDay = true, isWeek = false, isMonth = false;
            };

            function dataForWeek() {
                $scope.step = 7;
                $scope.endDay = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 7);
                $scope.data = getSumDataFromArray(loader($scope.date, $scope.endDay));
                isDay = false, isWeek = true, isMonth = false;
            };

            function dataForMonth() {
                $scope.step = 30;
                $scope.endDay = new Date($scope.date.getFullYear(), $scope.date.getMonth() - 1, $scope.date.getDate());
                $scope.data = getSumDataFromArray(loader($scope.date, $scope.endDay));
                isDay = false, isWeek = false, isMonth = true;
            };

            function getDataForSelectPeriod() {
                if (isDay)
                    return dataForDay();
                if (isWeek)
                    return dataForWeek();
                if (isMonth)
                    return dataForMonth();
            }

            $scope.data = getSumDataFromArray(loader($scope.date, $scope.endDay));
        });

        myApp.controller('todayController', function ($scope, loader) { //контроллер  нижней   плитки
            $scope.date = new Date();
            $scope.data = getSumDataFromArray(loader($scope.date, $scope.date));
        });



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