/**
 * @description Директива добавляет на страницу приложения анимацию загрузки (loaderBar)
 * @ngdoc directive
 * @name myApp.directive:loadBar
 * @restrict E
 * @param {Boolean} paramName Параметр, указывающий необходимо или нет отображать анимацию загрузки.
 */

myApp.directive('loadBar', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="loading-image"><img style="position:absolute;left:50%; margin-left: -32px;top: 50%;margin-top: -32px;z-index: 1;" src="images/loading2.gif"><div style="height:100%;width:100%;position:fixed;opacity:0.5;background:white;z-index: 1;top: 0%;"></div></div>',
        link: function (scope, element, attrs) {
            /*
             *wath, следящий за изменением параметра loading в контроллере
             */
            scope.$watch(attrs.paramName, function (newValue) {
                if (newValue) {
//                    $(".loading-image").fadeIn("fast");
                    $(".loading-image").show();
                } else {
//                    $(".loading-image").fadeOut("fast");
                    $(".loading-image").hide();
                }
            }, true);

        }
    }
});