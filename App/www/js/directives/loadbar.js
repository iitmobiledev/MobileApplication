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
        template: '<div id="loading-image"><img style="position:absolute;left:50%; margin-left: -32px;top: 50%;margin-top: -32px;z-index: 100;" src="images/loading2.gif"><div style="height:100%;width:100%;position:fixed;opacity:0.5;background:white;z-index: 90;top: 0%;"></div></div>',
        link: function (scope, element, attrs) {
            /*
             *wath, следящий за изменением параметра loading в контроллере
             */
            scope.$watch(attrs.paramName, function (newValue) {
                if (newValue) {
                    //                    $("#content").css("opacity", "0.5");
                    //                    $("#content").css("background", "white");
                    //                    $("#content").css("z-index", "90");
                    $("#loading-image").fadeIn("slow");
                } else {
                    //                    $("#content").css("opacity", "");
                    //                    $("#content").css("background", "");
                    //                    $("#content").css("z-index", "");
                    $("#loading-image").fadeOut("slow");
                }
            }, true);

        }
    }
});