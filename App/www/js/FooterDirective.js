myApp.directive('footer', function () {
        return {
            restrict: 'C',
            replace: false,
            template: '<footer class="inner-element uib_w_22" data-uib="app_framework/footer" data-ver="1" >'+
                        '<a class="icon calendar" href="#/index">Отчетность</a>'+
                        '<a class="icon clock" href="#/visits">Визиты</a>'+
                        '<a class="icon settings" href="#/settings">Настройки</a>'+
                    '</footer>'
        };
    })
