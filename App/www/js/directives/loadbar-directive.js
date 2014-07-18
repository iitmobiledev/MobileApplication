/**
 * @description Директива добавляет на страницу приложения анимацию загрузки(loaderBar)
 * @ngdoc directive
 * @name myApp.directive:loadBar
 * @restrict C
 */

myApp.directive('loadBar', function () {
    return {
        restrict: 'C',
        replace: true,
        template: '<table id="loading-image" valign="middle" style="opacity: 0.5; background: white;"><tr><td align="center"><img  src="images/loading2.gif/"></td></tr></table>',
        link: function (scope, element, attrs) {
            /*
             *wath, следящий за изменением параметра loading в контроллере
             */
            scope.$watch("loading", function (newValue) {
                if (newValue) {
                    $("#loading-image").fadeIn("slow");
                } else {
                    $("#loading-image").fadeOut("slow");
                }
            }, true);

        }
    }
});