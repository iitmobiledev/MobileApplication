/**
 * Директива для футера
 * @ngdoc directive
 * @name footerContent
 * @restrict E
 */
myApp.directive('footerContent', function () {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope, element, attrs) {
            var show = scope.$eval(attrs.show);
            console.log("show" + show)
            if (show) {
                $(element).hide().html();
                $("#navbar").show();
            } else {
                $(element).hide().html();
                $("#navbar").hide();
            }

            scope.$watch(attrs.show, function () {
                if (show) {
                    $(element).hide().html();
                    $("#navbar").show();
                } else {
                    $(element).hide().html();
                    $("#navbar").hide();
                }
            })
        }
    }

});