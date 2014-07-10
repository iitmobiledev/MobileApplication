myApp.directive('dateChanger', function () {
    return {
         restrict: 'C',
      // Этот HTML заменит директиву zippy.
      replace: true,
      transclude: true,
//      scope: { title:'@zippyTitle' },
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
                                                '<p>{{ getTitle() }}</p>'+
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
                            '</div>'
    }
})