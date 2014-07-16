myApp.directive('orient', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        link: function (scope, element, attrs) {

            //переворот экрана, возможно стоит сделать отдельную директиву
            var orientation = scope.$eval(attrs.orientation) || "any";
            intel.xdk.device.setRotateOrientation(orientation);
        }
    }
});