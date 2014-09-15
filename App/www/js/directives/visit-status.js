myApp.directive('visitStatus', function (Visit) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var statuses = Visit.statuses;
            var updateStatus = function () {
                var status = statuses.titles[scope.$eval(attrs.status)];
                var classes = scope.$eval(attrs.classes);

                switch (status) {
                case statuses.titles.NEW:
                    element.append(
                        $("<div>", {
                            "class": statuses.classesNames.NEW,
                            text: status
                        }));
                    break;
                case statuses.titles.NOTCOME:
                    element.append(
                        $("<div>", {
                            "class": statuses.classesNames.NOTCOME,
                            text: status
                        }));
                    break;
                case statuses.titles.come:
                    element.append(
                        $("<div>", {
                            "class": statuses.classesNames.COME,
                            text: status
                        }));
                    break;
                case statuses.titles.CONFIRMED:
                    element.append(
                        $("<div>", {
                            "class": statuses.classesNames.CONFIRMED,
                            text: status
                        }));
                    break;
                }
            }
            scope.$watch(attrs.status, updateStatus);
        },
        template: "<div id='stat'></div>"
    }
});