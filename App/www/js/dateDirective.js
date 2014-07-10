myApp.directive('dateChanger', function ($routeParams, $scope) {
    return {
         restrict: 'C',
      replace: false,
      transclude: true,
      template: '<div class="grid urow uib_row_3 row-height-3 daysPadding" data-uib="layout/row" data-ver="0">' +
                                '<div class="col uib_col_8 col-0_2-12_2-2" data-uib="layout/col" data-ver="0">' +
                                    '<div class="widget-container content-area vertical-col">' +

                                        '<a href="#/index/{{-step}}/{{date.toString()}}" class="button widget uib_w_8 smallNavigationButton d-margins icon left" ng-show="hasPreviousData()" data-uib="app_framework/button" data-ver="1" id="PrevDay"></a>'+
                                        '<span class="uib_shim"></span>'+
                                    '</div>'+
                               '</div>'+
                                '<div class="col uib_col_7 col-0_8-12_8-10" data-uib="layout/col" data-ver="0">'+
                                    '<div class="widget-container content-area vertical-col">'+

                                        '<div class="widget uib_w_10 d-margins header3" data-uib="media/text" data-ver="0">'+
                                            '<div class="widget-container left-receptacle"></div>'+
                                            '<div class="widget-container right-receptacle"></div>'+
                                            '<div>'+
                                                '<p ng-model="getTitle()"></p>'+
                                            '</div>'+
                                        '</div>'+
                                        '<span class="uib_shim"></span>'+
                                    '</div>'+
                                '</div>'+
        '<div class="col uib_col_6 col-0_2-12_2-10" data-uib="layout/col" data-ver="0">'+
                                    '<div class="widget-container content-area vertical-col">'+
                                        '<a href="#/index/{{step}}/{{date.toString()}}" class="button widget uib_w_8 smallNavigationButton d-margins icon right" data-uib="app_framework/button" data-ver="1" id="NextDay" ng-show="hasFutureData()"></a>'+
                                        '<span class="uib_shim"></span>'+
                                    '</div>'+
                                '</div>'+
                                '<span class="uib_shim"></span>'+
                            '</div>',
        
        link: function(scope, element, attrs) {
            
            var date = new Date(attrs.dateChanger);
            var endDay;

//            getDataForSelectPeriod();
//            function getDataForSelectPeriod() {
//                if (Math.abs($scope.step) == 1)
//                    return dataForDay();
//                if (Math.abs($scope.step) == 7)
//                    return dataForWeek();
//                if (Math.abs($scope.step) == 30)
//                    return dataForMonth();
//            }
//            
//            $scope.forDay = dataForDay;
//
//            $scope.forWeek = dataForWeek;
//
//            $scope.forMonth = dataForMonth;

            function dataForDay() {
                $scope.step = 1;
                endDay = date;
                $scope.data = getSumDataFromArray(OperationalStatisticLoader(date, endDay));
            };

            function dataForWeek() {
                $scope.step = 7;
                endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
                $scope.data = getSumDataFromArray(OperationalStatisticLoader(date, endDay));
            };

            function dataForMonth() {
                $scope.step = 30;
                endDay = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
                $scope.data = getSumDataFromArray(OperationalStatisticLoader(date, endDay));
            };

            activeButtonHandling();

            $scope.hasPreviousData = function () {
                return true;
            };

            $scope.hasFutureData = function () {
                if (date > new Date().setDate(new Date().getDate() - 1)) {
                    return false;
                } else {
                    return true;
                }
            };
            
                $scope.getTitle = function () {
                    if (date == endDay) {
                        return $filter('date')(date, "dd.MM.yyyy");
                    } else {
                        return $filter('date')(endDay, "dd.MM.yyyy") + " - " + $filter('date')(date, "dd.MM.yyyy");
                    }
                };
        }
    }
})