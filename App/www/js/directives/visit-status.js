/**
 * @description Директива для изменения и отображения даты и
 * периода.
 * @ngdoc directive
 * @name myApp.directive:visitStatus
 * @restrict E
 * @param {Date} date Начальная дата для отображения и изменения.
 * @requires myApp.service:VisitsLoader
 */
myApp.directive('visitStatus', function (VisitsLoader) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var statuses = VisitsLoader.statuses;

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
                        //element.find("#status").addClass(classes[i]).html(status);
                        break;
                    }
                }
            }
            scope.$watch(attrs.status, updateStatus);
            //updateStatus();
        },
        template: "<div id='stat'></div>"
    }
});