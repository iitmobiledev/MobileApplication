myApp.directive('visitStatus', function (Visit) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var statuses = Visit.statuses;
            var updateStatus = function () {
                var status = statuses.titles[scope.$eval(attrs.status)];
                var classes = scope.$eval(attrs.classes);

                angular.forEach(statuses.titles, function (value, key) {
                    if (status == value)
                    {
                        element.append(
                        $("<div>", {
                            "class": key,
                            text: status
                        }));
                    }
                        
                });
            }
            scope.$watch(attrs.status, updateStatus);
        },
        template: "<div id='stat'></div>"
    }
});