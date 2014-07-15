/**
 * Контроллер для директивы dateChanger изменяет текущую дату.
 * @requires $filter для отображения даты в читабельном виде
 * @requires $scope для данных из своей и внешней области видимости
 */
//function DateChangerController($scope, $filter) {
//    var date = scope[attr.date];
//    var step = scope[attr.step];
//    var steps = scope[attr.steps];
//
//    //функция для кнопки вперед
//    //изменяет дату на один день вперед
//    $scope.forward = function () {
//        $scope.setDate($scope.date.getDate() + $scope.step);
//    };
//
//    //функция для кнопки назад
//    //изменяет дату на один день назад
//    $scope.back = function () {
//        $scope.setDate($scope.date.getDate() - $scope.step);
//    };
//
//    activeButtonHandling();
//
//    $scope.hasPreviousData = function () {
//        return true;
//    };
//
//    $scope.hasFutureData = function () {
//        if ($scope.date.toDateString() == new Date().toDateString())
//            return false;
//        else
//            return true;
//    };
//
//    $scope.forDay = function () {
//        $scope.step = 'day';
//    };
//
//    $scope.forWeek = function () {
//        $scope.step = 'week';
//    };
//
//    $scope.forMonth = function () {
//        $scope.step = 'month';
//    };
//
//    $scope.getDate = function () {
//        return updateDate();
//    };
//
//    function updateDate() {
//        if ($scope.date == $scope.endDay) {
//            $scope.getTitle = function () {
//                return updateTitle();
//            };
//            return $filter('date')($scope.date, "dd.MM.yyyy");
//        } else {
//            $scope.getTitle = function () {
//                return "";
//            };
//            return $filter('date')($scope.endDay, "dd.MM.yyyy") + " - " +
//                $filter('date')($scope.date, "dd.MM.yyyy");
//        }
//    }
//
//    function updateTitle() {
//        var today = new Date();
//        var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
//        if ($scope.date.toDateString() == today.toDateString())
//            return "За сегодня";
//        if ($scope.date.toDateString() == yesterday.toDateString())
//            return "За вчера";
//    }
//
//    $('#mainsub').on('swipeLeft', function () {
//        if ($scope.hasFutureData) {
//            $scope.forward();
//            $scope.$parent.$apply();
//        }
//    });
//
//    $('#mainsub').on('swipeRight', function () {
//        if ($scope.hasPreviousData) {
//            $scope.back();
//            $scope.$parent.$apply();
//        }
//    });
//
//};

/**
 * Директива в идеале
 * должна быть независима от внешнего контроллера.
 * Изменение даты в директиве приводит к изменению
 * даты во внешнем контроллере.
 */


/**
 * Директива для изменения и отображения даты использует
 * контроллер DateChangerController. Для работы этого контроллера
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
myApp.directive('dateChanger', function (GetPeriod, $filter) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var date = scope.$eval(attrs.date);
            var step = scope.$eval(attrs.step);
            var steps = scope.$eval(attrs.steps);

            scope.forward = function () {
                getNewDate(1);
            };

            scope.back = function () {
                getNewDate(-1);
            };

            function getNewDate(sign) {
                if (step == 'day') {
                    date.setDate(date.getDate() + sign * 1);
                }
                if (step == 'week') {
                    date.setDate(date.getDate() + sign * 7);
                }
                if (step == 'month') {
                    date.setMonth(date.getMonth() + sign * 1);
                }
            }

            activeButtonHandling();

            scope.hasPreviousData = function () {
                return true;
            };

            scope.hasFutureData = function () {
                var period = GetPeriod(date, step);
                if (period.end > new Date() || period.end.toDateString() == new Date().toDateString())
                    return false;
                else
                    return true;
            };

            scope.forDay = function () {
                step = 'day';
                changeDate();
            };

            scope.forWeek = function () {
                step = 'week';
                changeDate();
            };

            scope.forMonth = function () {
                step = 'month';
                changeDate();
            };

            function changeDate() {
                console.log("step" + step)
                var period = GetPeriod(date, step);
                date.setYear(period.begin.getFullYear());
                date.setMonth(period.begin.getMonth());
                date.setDate(period.begin.getDate());
            }

            //            attrs.$observe('step', function () {
            //                console.log("step change in dir");
            //                var period = GetPeriod(date, step);
            //                date.setYear(period.begin.getFullYear());
            //                date.setMonth(period.begin.getMonth());
            //                date.setDate(period.begin.getDate());
            //            });


            //            scope.$watch('step', function(){
            //                console.log("step change");
            //                var period = GetPeriod(date, step);
            //                date = new Date(period.begin.getFullYear(), period.begin.getMonth(),
            //                                period.begin.getDate());
            //            });

            scope.getDateString = function () {
                if (step == 'day') {
                    scope.getTitle = function () {
                        return updateTitle();
                    };
                    return $filter('date')(date, "dd.MM.yyyy");
                } else {
                    scope.getTitle = function () {
                        return "";
                    };
                    var period = GetPeriod(date, step);
                    return $filter('date')(period.begin, "dd.MM.yyyy") + " - " +
                        $filter('date')(period.end, "dd.MM.yyyy");
                }
            };

            function updateTitle() {
                var today = new Date();
                var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                if (date.toDateString() == today.toDateString())
                    return "За сегодня";
                if (date.toDateString() == yesterday.toDateString())
                    return "За вчера";
            }

            $('#mainsub').on('swipeLeft', function () {
                if (scope.hasFutureData()) {
                    scope.forward();
                    scope.$parent.$apply();
                }
            });

            $('#mainsub').on('swipeRight', function () {
                if (scope.hasPreviousData()) {
                    scope.back();
                    scope.$parent.$apply();
                }
            });
        },
        template: '<div>' +
            '<div class="grid grid-pad urow uib_row_2 row-height-1" data-uib="layout/row" data-ver="0">' +
            '<div class="col uib_col_5 col-0_12-12" data-uib="layout/col" data-ver="0">' +
            '<div class="widget-container content-area vertical-col">' +
            '<div class="button-grouped widget uib_w_4 d-margins flex" data-uib="app_framework/button_group" data-ver="1">' +
            '<a class="button widget uib_w_5 d-margins gray" data-uib="app_framework/button" data-ver="1" ng-click="forDay()" id="buttonForDay" style="border-left-width: 1px; border-left-style: solid; border-left-color: rgb(102, 102, 102); border-top-left-radius: 6px; border-bottom-left-radius: 6px;">За день</a>' +
            '<a class="button widget uib_w_6 d-margins gray" data-uib="app_framework/button" data-ver="1" ng-click="forWeek()" id="buttonForWeek">За неделю</a>' +
            '<a class="button widget uib_w_7 d-margins gray" data-uib="app_framework/button" data-ver="1" ng-click="forMonth()" id="buttonForMonth" style="border-top-right-radius: 6px; border-bottom-right-radius: 6px;">За месяц</a>' +
            '</div><span class="uib_shim"></span></div>' +
            '</div>' +
            '<span class="uib_shim"></span>' +
            '</div>' +

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
            '<p>{{getDateString()}}</p>' +
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