myApp.directive('visitStatus', function () {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var statuses = scope.$eval(attrs.statuses);

            var updateStatus = function () {
                var status = scope.$eval(attrs.status);
                var classes = scope.$eval(attrs.classes);
                for (var i = 0; i < statuses.length; i++) {
                    if (status == statuses[i]) {
                        element.append(
                            $("<div>", {
                                "class": classes[i],
                                text: status
                            }));
                        break;
                    }
                }
            }
            scope.$watch(attrs.status, updateStatus);
        },
        template: "<div id='stat'></div>"
    }
});