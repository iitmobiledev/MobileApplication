/**
 * @description Директива для отображения анимации загрузки
 * @ngdoc directive
 * @name loadBar
 * @restrict C
 */

myApp.directive('loadBar', function () {
    return {
        restrict: 'C',
        replace: true,
        template: '<table valign="middle"><tr><td align="center"><img id="loading-image" src="images/loading2.gif/"></td></tr></table>',
        //         ng-show="loading" style="border:solid 3px green;" 
        link: function (scope, element, attrs) {
            /**wath, следящий за изменением параметра loading в контроллере*/
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