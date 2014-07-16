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
            var date, step, steps;

            var updateDate = function () {
                date = scope.$eval(attrs.date);
            };
            scope.$watch(attrs.date, updateDate);
            updateDate();

            var updateStep = function () {
                step = scope.$eval(attrs.step);
            };
            scope.$watch(attrs.step, updateStep);
            updateStep();

            var updateSteps = function () {
                steps = scope.$eval(attrs.steps);
                if (steps.length > 1)
                    $('#periodChanger').show();
                else
                    $('#periodChanger').hide();
            };
            scope.$watch(attrs.steps, updateSteps);
            updateSteps();


            scope.$watch('step', function () {
                var period = GetPeriod(date, step);
                date.setYear(period.begin.getFullYear());
                date.setMonth(period.begin.getMonth());
                date.setDate(period.begin.getDate());
                $('#Date').html(function () {
                    return updateDateString();
                });
            });

            var hasPrevData, hasPrevData;

            var updatePrevData = function () {
                hasPrevData = true;
                if (hasPrevData)
                    $('#PrevDay').show();
                else
                    $('#PrevDay').hide();
            };

            var updateFutureData = function () {
                console.log("date " + date);
                var period = GetPeriod(date, step);
                if (period.end > new Date() || period.end.toDateString() == new Date().toDateString())
                    hasFutureData = false;
                else
                    hasFutureData = true;

                if (hasFutureData)
                    $('#NextDay').show();
                else
                    $('#NextDay').hide();
            };

            scope.$watch('hasPrevData', updatePrevData);
            updatePrevData();

            scope.$watch('hasFutureData', updateFutureData);
            updateFutureData();


            $('#PrevDay').click(function () {
                getNewDate(-1);
                $('#Date').html(function () {
                    return updateDateString();
                });
                updatePrevData();
                updateFutureData();
            });

            $('#NextDay').click(function () {
                getNewDate(1);
                $('#Date').html(function () {
                    return updateDateString();
                });
                updatePrevData();
                updateFutureData();
            });

            function getNewDate(sign) {
                if (step == 'day') {
                    scope[attrs.date] = new Date(date.getFullYear(), date.getMonth(),
                        date.getDate() + sign * 1);
                    scope.$apply();
                }
                if (step == 'week') {
                    scope[attrs.date] = new Date(date.getFullYear(), date.getMonth(),
                        date.getDate() + sign * 7);
                    scope.$apply();
                }
                if (step == 'month') {
                    scope[attrs.date] = new Date(date.getFullYear(), date.getMonth() + sign * 1,
                        date.getDate());
                    scope.$apply();
                }
            }

            activeButtonHandling();

            function updateDateString() {
                if (step == 'day') {
                    $('#Title').html(function () {
                        return updateTitle();
                    });
                    return $filter('date')(date, "dd.MM.yyyy");
                } else {
                    $('#Title').html(function () {
                        return "";
                    });
                    var period = GetPeriod(date, step);
                    return $filter('date')(period.begin, "dd.MM.yyyy") + " - " +
                        $filter('date')(period.end, "dd.MM.yyyy");
                }
            }

            $('#Date').html(function () {
                return updateDateString();
            });

            function updateTitle() {
                var today = new Date();
                var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                if (date.toDateString() == today.toDateString())
                    return "За сегодня";
                if (date.toDateString() == yesterday.toDateString())
                    return "За вчера";
                return "";
            }

            $('#mainsub').on('swipeLeft', function () {
                if (hasFutureData) {
                    getNewDate(1);
                    $('#Date').html(function () {
                        return updateDateString();
                    });
                    updatePrevData();
                    updateFutureData();
                }
            });

            $('#mainsub').on('swipeRight', function () {
                if (hasPrevData) {
                    getNewDate(-1);
                    $('#Date').html(function () {
                        return updateDateString();
                    });
                    updatePrevData();
                    updateFutureData();
                }
            });

            $("#periodChanger").append('<div class="col uib_col_5 col-0_12-12" data-uib="layout/col" data-ver="0">' +
                '<div class="widget-container content-area vertical-col">' +
                '<div id="periodButtons" class="button-grouped widget uib_w_4 d-margins flex" data-uib="app_framework/button_group" data-ver="1">' +

                '</div><span class="uib_shim"></span>' +
                '</div>' +
                '</div>' +
                '<span class="uib_shim"></span>');

            for (var i = 0; i < steps.length; i++) {
                $("#periodButtons").append(
                    $("<a/>", {
                        "class": "button widget uib_w_6 d-margins gray",
                        "data-uib": "app_framework/button",
                        "data-ver": "1",
                        text: steps[i],
                        "id": "" + steps[i],
                        click: function () {
                            console.log(this.id + "");
                            scope[attrs.step] = this.id;
                            scope.$apply();
                        }
                    })
                );
            }


            //            '<a class="button widget uib_w_6 d-margins gray" data-uib="app_framework/button" data-ver="1" id="buttonForWeek">step[i]</a>'


            //            $("#periodButtons").append('<a class="button widget uib_w_5 d-margins gray" data-uib="app_framework/button" data-ver="1" id="buttonForDay" style="border-left-width: 1px; border-left-style: solid; border-left-color: rgb(102, 102, 102); border-top-left-radius: 6px; border-bottom-left-radius: 6px;"></a>' +
            //                    '<a class="button widget uib_w_6 d-margins gray" data-uib="app_framework/button" data-ver="1"  id="buttonForWeek"></a>' +
            //                    '<a class="button widget uib_w_7 d-margins gray" data-uib="app_framework/button" data-ver="1"  id="buttonForMonth" style="border-top-right-radius: 6px; border-bottom-right-radius: 6px;"></a>');



            //            $('#buttonForDay').html(steps[0]);
            //            $('#buttonForWeek').html(steps[1]);
            //            $('#buttonForMonth').html(steps[2]);


            //            $('#buttonForDay').click(function () {
            //                scope[attrs.step] = "day";
            //                scope.$apply();
            //            });
            //            $('#buttonForWeek').click(function () {
            //                scope[attrs.step] = "week";
            //                scope.$apply();
            //            });
            //            $('#buttonForMonth').click(function () {
            //                scope[attrs.step] = "month";
            //                scope.$apply();
            //            });
        },
        template: '<div>' +
            '<div id="periodChanger" class="grid grid-pad urow uib_row_2 row-height-1" data-uib="layout/row" data-ver="0">' +

        '</div>' +

        '<div class="grid urow uib_row_3 row-height-3 daysPadding" data-uib="layout/row" data-ver="0">' +
            '<div class="col uib_col_8 col-0_2-12_2-2" data-uib="layout/col" data-ver="0">' +
            '<div class="widget-container content-area vertical-col">' +
            '<a class="button widget uib_w_8 smallNavigationButton d-margins icon left" data-uib="app_framework/button" data-ver="1" id="PrevDay"></a>' +
            '<span class="uib_shim"></span>' +
            '</div>' +
            '</div>' +
            '<div class="col uib_col_7 col-0_8-12_8-10" data-uib="layout/col" data-ver="0">' +
            '<div class="widget-container content-area vertical-col">' +

        '<div class="widget uib_w_10 d-margins header3" data-uib="media/text" data-ver="0">' +
            '<div class="widget-container left-receptacle"></div>' +
            '<div class="widget-container right-receptacle"></div>' +
            '<div>' +
            '<p id="Title"><p>' +
            '<p id="Date"></p>' +
            '</div>' +
            '</div>' +
            '<span class="uib_shim"></span>' +
            '</div>' +
            '</div>' +
            '<div class="col uib_col_6 col-0_2-12_2-10" data-uib="layout/col" data-ver="0">' +
            '<div class="widget-container content-area vertical-col">' +
            '<a class="button widget uib_w_8 smallNavigationButton d-margins icon right" data-uib="app_framework/button" data-ver="1" id="NextDay"></a>' +
            '<span class="uib_shim"></span>' +
            '</div>' +
            '</div>' +
            '<span class="uib_shim"></span>' +
            '</div>' +
            '</div>'
    }
});