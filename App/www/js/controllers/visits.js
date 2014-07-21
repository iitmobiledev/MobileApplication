/**
 * @description <p>Контроллер, отвечающий за загрузку данных о визитах,
 * т.е. записей с указанием времени, мастера и клиента.</p>
 * @ngdoc controller
 * @name myApp.controller:VisitsController
 */
myApp.controller('VisitsController', function ($scope, $filter, VisitsLoader, DateHelper) {
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
        template: '<ul class="list inset">' + '</ul>',
        link: function (scope, element, attrs) {

            scope.$watch('VisitsPerDay', showVisits);

            function showVisits() {
                $(element).html("");
                if (scope.VisitsPerDay != null) {
                    for (var i = 0; i < scope.VisitsPerDay.serviceList.length; i++) {
                        if (scope.type = "time") {
                            $(element).append("<li><span>" + scope.VisitsPerDay.serviceList[i].status + "<br>" + scope.VisitsPerDay.client.lastName + '  ' + scope.VisitsPerDay.client.firstName + "</span><span style='float: right; text-align: center;'>" + $filter('date')(scope.VisitsPerDay.serviceList[i].startTime, "HH:mm") + '-' + $filter('date')(scope.VisitsPerDay.serviceList[i].endTime, "HH:mm") + "</span>" + '<br>' + scope.VisitsPerDay.serviceList[i].description + '<br>' + scope.VisitsPerDay.serviceList[i].master.lastName + '  ' + scope.VisitsPerDay.serviceList[i].master.firstName + "</span><span style='float: right; text-align: center;'>" + scope.VisitsPerDay.serviceList[i].cost + "</span></li>");
                        }
                        else{
                            
                        }
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