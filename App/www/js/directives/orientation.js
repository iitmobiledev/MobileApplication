/**
 * @description Директива задает ориентацию экрана устройства
 * @ngdoc directive
 * @name myApp.directive:orient
 * @restrict E
 * @param {String} orientation принимает следующие значения:
 * 'landscape' - ландшафтная ориентация экрана, 
 * 'portrait' - портретная ориентация экрана, 
 * 'any' - автоматическое определения ориентации экрана устройством
 */
myApp.directive('orient', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        link: function (scope, element, attrs) {
            rotate();
            function rotate() {
                if (intel.xdk && intel.xdk.device) {
                    var orientation = scope.$eval(attrs.orientation) || "any";
                    intel.xdk.device.setRotateOrientation(orientation);
                }
                else{
                    setTimeout(rotate,100);
                }
            }
        }
    }
});