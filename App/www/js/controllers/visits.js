/**
 * @description <p>Контроллер, отвечающий за загрузку данных о визитах,
 * т.е. записей с указанием времени, мастера и клиента.</p>
 * @ngdoc controller
 * @name myApp.controller:VisitsController
 */
myApp.controller('VisitsController', function ($scope, $filter, VisitsLoader, DateHelper, $location) {
    $scope.date = new Date();
    $scope.step = 'day';
    $scope.type = 'time';
    $scope.VisitsPerDay = VisitsLoader($scope.date);

    $scope.hasPrevData = function () {
        return true;
    };

    $scope.hasFutureData = function () {
        var period = DateHelper.getPeriod($scope.date, $scope.step);
        if (period.end > new Date() || period.end.toDateString() == new Date().toDateString())
            return false;
        else
            return true;
    };

    $scope.$watch('date.toDateString()', function () {
        $scope.VisitsPerDay = VisitsLoader($scope.date);
    });

    $scope.$watch('step', function () {
        $scope.VisitsPerDay = VisitsLoader($scope.date);
    });
});

/**
 * @description Директива добавляет на страницу приложения список, отображающий визиты
 * @ngdoc directive
 * @name myApp.directive:VisitsPerDay
 * @restrict E
 */
myApp.directive('visitsList', function ($filter) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<ul class="list inset"></ul>',
        link: function (scope, element, attrs) {

            scope.$watch('VisitsPerDay', showVisits);

            function showVisits() {
                $(element).html("");
                if (scope.VisitsPerDay != null) {
                    for (var i = 0; i < scope.VisitsPerDay.length; i++) {
                        var services = [];
                        var masters = [];
                        var startTimes = [];
                        var endTimes = [];
                        var coast = 0;
                        for (var j = 0; j < scope.VisitsPerDay[i].serviceList.length; j++) {
                            services.push(scope.VisitsPerDay[i].serviceList[j].description);
                            masters.push(scope.VisitsPerDay[i].serviceList[j].master.lastName);
                            coast += scope.VisitsPerDay[i].serviceList[j].cost
                            startTimes.push(scope.VisitsPerDay[i].serviceList[j].startTime);
                            endTimes.push(scope.VisitsPerDay[i].serviceList[j].endTime);
                        }
                        masters = $.unique(masters);
                        $(element).append(
                            '<li>' +
                            '<a href="#/visit/' + scope.VisitsPerDay[i].id + '">' +
                                '<div>' +
                                    '<div>' + scope.VisitsPerDay[i].status + '</div>' +
                                    '<div style="font-weight:bold;">' +
                                        '<span style=" text-align:left; max-width:65%;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;">' +
                                        scope.VisitsPerDay[i].client.lastName + ' ' + scope.VisitsPerDay[i].client.firstName +
                                        '</span>' +
                                        '<span style="float:right; text-align:right; max-width:35%;white-space:nowrap;text-overflow:ellipsis">' +
                                        $filter('date')(new Date(Math.min.apply(null, startTimes)), "HH:mm") + '-' +
                                        $filter('date')(new Date(Math.max.apply(null, endTimes)), "HH:mm") +
                                        '</span>' +
                                    '</div>' +
                                    '<div>' +
                                        '<span style=" text-align:left; max-width:65%;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;">' +
                                        masters.join(",") + ', ' + services.join(",") +
                                        '</span>' +
                                        '<span style="float:right; text-align:right; max-width:35%;white-space:nowrap;text-overflow:ellipsis">' +
                                        coast + ' р.' +
                                        '</span>' +
                                    '</div>' +
                                '</div>' +
                            '</a>' +
                            '</li>');
                    }
                } else {
                    $(element).html("<li style='text-align: center; font-size: 14pt'>Нет визитов</li>");
                }
            }



            //            scope.$watch('type', function () {
            //                showVisits();
            //            });
        },

    };
});