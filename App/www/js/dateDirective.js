/**
 * Контроллер для директивы dateChanger изменяет текущую дату.
 * @requires $filter для отображения даты в читабельном виде
 * @requires $scope для данных из своей и внешней области видимости
*/
function dateChangerController($scope, $filter) {
    if (!$scope.step || !$scope.endDay){
        $scope.step = 1;
        $scope.endDay = $scope.date;
    }
    
    //функция для кнопки вперед
    //изменяет дату на один день вперед
    $scope.forward = function () {
        $scope.setDate($scope.date.getDate() + $scope.step);
    };

    //функция для кнопки назад
    //изменяет дату на один день назад
    $scope.back = function () {
        $scope.setDate($scope.date.getDate() - $scope.step);
    };

    activeButtonHandling();

    $scope.hasPreviousData = function () {
        return true;
    };

    $scope.hasFutureData = function () {
        if ($scope.date.toDateString() == new Date().toDateString()) //.setDate(new Date().getDate() - 1))
            return false;
        else
            return true;
    };

    $scope.getDate = function () {
        return updateDate();
    };

    function updateDate() {
        if ($scope.date == $scope.endDay) {
            $scope.getTitle = function () {
                return updateTitle();
            };
            return $filter('date')($scope.date, "dd.MM.yyyy");
        } else {
            $scope.getTitle = "";
            return $filter('date')($scope.endDay, "dd.MM.yyyy") + " - " +
                $filter('date')($scope.date, "dd.MM.yyyy");
        }
    }

    function updateTitle() {
        var today = new Date();
        var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        if ($scope.date.toDateString() == today.toDateString())
            return "За сегодня";
        if ($scope.date.toDateString() == yesterday.toDateString())
            return "За вчера";
    }
    
    $('#mainsub').on('swipeLeft', function () {
        $scope.forward();
        $scope.$parent.$apply();
    });

    $('#mainsub').on('swipeRight', function () {
        $scope.back();
        $scope.$parent.$apply();
    });

};

/**
 * Директива в идеале
 * должна быть независима от внешнего контроллера.
 * Изменение даты в директиве приводит к изменению
 * даты во внешнем контроллере.
*/


/**
 * Директива для изменения и отображения даты использует
 * контроллер dateChangerController. Для работы этого контроллера
 * необходимо наличие в области видимости внешнего
 * контроллера функции setDate, которая изменяет дату, общую для
 * обоих контроллеров. Если в области видимости внешнего
 * контроллера находится переменная step, которая показывает
 * с каким шагом изменяется дата, то дата будет изменяться и
 * отображаться в виде промежутка равного этому шагу.
 * Например, step=1, тогда дата изменяется по неделям и 
 * отображается в виде 11.10.2014 - 18.10.2014.
 * По умолчанию дата изменяется с шагом=1, т.е. по дням.
 * @restrict C
*/
myApp.directive('dateChanger', function () {
    return {
        restrict: 'C',
        replace: true,
        transclude: true,
        //        link: function (scope, element, attrs) {
        //            var step, date;
        //            if ($routeParams.period)
        //                step = $routeParams.period;
        //            else
        //                step = 1;
        //
        //            if ($routeParams.day) {
        //                date = new Date($routeParams.day);
        //                date = new Date($scope.date.getFullYear(), $scope.date.getMonth(),
        //                    parseInt($scope.date.getDate(), 10) + parseInt($scope.step, 10));
        //            } else
        //                date = new Date();
        //
        //            //console.log("step "+step);
        //
        //            getDataForSelectPeriod();
        //
        //            function getDataForSelectPeriod() {
        //                if (Math.abs(step) == 1)
        //                    return dataForDay();
        //                if (Math.abs(step) == 7)
        //                    return dataForWeek();
        //                if (Math.abs(step) == 30)
        //                    return dataForMonth();
        //            };
        //
        //            //            function forDay = dataForDay;
        //            //
        //            //            $scope.forWeek = dataForWeek;
        //            //
        //            //            $scope.forMonth = dataForMonth;
        //
        //            function dataForDay() {
        //                step = 1;
        //                endDay = date;
        //                //$scope.data = getSumDataFromArray(OperationalStatisticLoader(date, endDay));
        //            };
        //
        //            function dataForWeek() {
        //                step = 7;
        //                endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
        //                //$scope.data = getSumDataFromArray(OperationalStatisticLoader(date, endDay));
        //            };
        //
        //            function dataForMonth() {
        //                $scope.step = 30;
        //                endDay = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
        //                //$scope.data = getSumDataFromArray(OperationalStatisticLoader(date, endDay));
        //            };
        //
        //            activeButtonHandling();
        //
        //            function hasPreviousData() {
        //                return true;
        //            };
        //
        //            function hasFutureData() {
        //                if (date > new Date().setDate(new Date().getDate() - 1)) {
        //                    return false;
        //                } else {
        //                    return true;
        //                }
        //            };
        //
        //            function getTitle() {
        //                if (date == endDay) {
        //                    return $filter('date')(date, "dd.MM.yyyy");
        //                } else {
        //                    return $filter('date')(endDay, "dd.MM.yyyy") + " - " + $filter('date')(date,
        //                                                                                           "dd.MM.yyyy");
        //                }
        //            };
        //        },
        template: '<div ng-controller="dateChangerController">' +
            '<div class="grid urow uib_row_3 row-height-3 daysPadding" data-uib="layout/row" data-ver="0">' +
            '<div class="col uib_col_8 col-0_2-12_2-2" data-uib="layout/col" data-ver="0">' +
            '<div class="widget-container content-area vertical-col">' +
            '<a class="button widget uib_w_8 smallNavigationButton d-margins icon left" ng-show="hasPreviousData()" data-uib="app_framework/button" data-ver="1" id="PrevDay" ng-click="back()"></a>' +
            '<span class="uib_shim"></span>' +
            '</div>' +
            '</div>' +
            '<div class="col uib_col_7 col-0_8-12_8-10" data-uib="layout/col" data-ver="0">' +
            '<div class="widget-container content-area vertical-col">' +

        '<div class="widget uib_w_10 d-margins header3" data-uib="media/text" data-ver="0">' +
            '<div class="widget-container left-receptacle"></div>' +
            '<div class="widget-container right-receptacle"></div>' +
            '<div>' +
            '<p>{{getTitle()}}<p>' +
            '<p>{{getDate()}}</p>' +
            '</div>' +
            '</div>' +
            '<span class="uib_shim"></span>' +
            '</div>' +
            '</div>' +
            '<div class="col uib_col_6 col-0_2-12_2-10" data-uib="layout/col" data-ver="0">' +
            '<div class="widget-container content-area vertical-col">' +
            '<a class="button widget uib_w_8 smallNavigationButton d-margins icon right" data-uib="app_framework/button" data-ver="1" id="NextDay" ng-show="hasFutureData()" ng-click="forward()"></a>' +
            '<span class="uib_shim"></span>' +
            '</div>' +
            '</div>' +
            '<span class="uib_shim"></span>' +
            '</div>' +
            '</div>'
    }
});