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
        template: '<table id="loading-image" valign="middle" style="opacity: 0.5; height:100%;width:100%; background: white;"><tr><td align="center"><img  src="images/loading2.gif/"></td></tr></table>',
        link: function (scope, element, attrs) {
            /*
             *wath, следящий за изменением параметра loading в контроллере
             */
            scope.$watch(attrs.paramName, function (newValue) {
                if (newValue) {
                    $("#loading-image").fadeIn("slow");
                } else {
                    $("#loading-image").fadeOut("slow");
                }
            }, true);

        }
    }
});