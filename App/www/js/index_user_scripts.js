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



   