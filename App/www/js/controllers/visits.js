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


    /*
     *функция, проверяющая, есть ли мастер в списке мастеров
     *если есть, то возвращает индекс в списке
     *если нет, то возвращает null
     */
    $scope.checkMasterInList = function (master, masters) {
        for (var i = 0; i < masters.length; i++) {
            if (master === masters[i].master) {
                return i;
            }
        }
        return null;
    }

    $scope.perMaster = function (master, visit) {
        this.master = master;
        this.visList = [];
        if (visit) {
            this.visList.push(visit);
        }
    }

    /*
     *функция, возвращающая список отсортированных по фамилии мастера объектов perMaster
     */
    $scope.getAllMastersPerDay = function () {
        var masters = [];
        for (var i = 0; i < $scope.VisitsPerDay.length; i++) {
            for (var j = 0; j < $scope.VisitsPerDay[i].serviceList.length; j++) {
                var usl = $scope.checkMasterInList($scope.VisitsPerDay[i].serviceList[j].master, masters);
                if (usl !== null) {
                    masters[usl].visList.push($scope.VisitsPerDay[i]);
                } else {
                    masters.push(new $scope.perMaster($scope.VisitsPerDay[i].serviceList[j].master, $scope.VisitsPerDay[i]));
                }
            }
        }
        masters = masters.sort(function (a, b) {
            if (a.master.lastName.toLowerCase() < b.master.lastName.toLowerCase())
                return -1;
            if (nameA = a.master.lastName.toLowerCase() > b.master.lastName.toLowerCase())
                return 1;
            return 0;
        });
        return masters;
    }
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
                    if (scope.type == "time") {
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
                                '<span style="float:left;  width:65%;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;">' +
                                scope.VisitsPerDay[i].client.lastName + ' ' + scope.VisitsPerDay[i].client.firstName +
                                '</span>' +
                                '<span style=" text-align:right; width:35%;white-space:nowrap;text-overflow:ellipsis">' +
                                $filter('date')(new Date(Math.min.apply(null, startTimes)), "HH:mm") + '-' +
                                $filter('date')(new Date(Math.max.apply(null, endTimes)), "HH:mm") +
                                '</span>' +
                                '</div>' +
                                '<div>' +
                                '<span style="float:left;  width:65%;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;">' +
                                masters.join(",") + ': ' + services.join(",") +
                                '</span>' +
                                '<span style=" text-align:right; width:35%;white-space:nowrap;text-overflow:ellipsis">' +
                                coast + ' р.' +
                                '</span>' +
                                '</div>' +
                                '</div>' +
                                '</a>' +
                                '</li>');
                        }
                    } else { //по мастерам
                        var masters = scope.getAllMastersPerDay();
                        for (var i = 0; i < masters.length; i++) {
                            $(element).append(
                                '<div style="background-color: #6666FF">' +
                                ' <h2 style="margin: 2px;">' + masters[i].master.lastName + ' ' + masters[i].master.firstName + '</h2>' +
                                '</div>'
                            );
                            for (var k = 0; k < masters[i].visList.length; k++) {
                                var services = [];
                                var startTimes = [];
                                var endTimes = [];
                                var coast = 0;
                                for (var j = 0; j < scope.VisitsPerDay[k].serviceList.length; j++) {
                                    if (scope.VisitsPerDay[k].serviceList[j].master === masters[i].master) {
                                        services.push(scope.VisitsPerDay[k].serviceList[j].description);
                                        coast += scope.VisitsPerDay[k].serviceList[j].cost
                                        startTimes.push(scope.VisitsPerDay[k].serviceList[j].startTime);
                                        endTimes.push(scope.VisitsPerDay[k].serviceList[j].endTime);
                                    }
                                }
                                $(element).append(
                                    '<li>' +
                                    '<a href="#/visit/' + scope.VisitsPerDay[k].id + '">' +
                                    '<div>' +
                                    '<div>' + scope.VisitsPerDay[k].status + '</div>' +
                                    '<div style="font-weight:bold;">' +
                                    '<span style="float:left;  width:65%;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;">' +
                                    scope.VisitsPerDay[k].client.lastName + ' ' + scope.VisitsPerDay[k].client.firstName +
                                    '</span>' +
                                    '<span style=" text-align:right; width:35%;white-space:nowrap;text-overflow:ellipsis">' +
                                    $filter('date')(new Date(Math.min.apply(null, startTimes)), "HH:mm") + '-' +
                                    $filter('date')(new Date(Math.max.apply(null, endTimes)), "HH:mm") +
                                    '</span>' +
                                    '</div>' +
                                    '<div>' +
                                    '<span style="float:left;  width:65%;white-space:nowrap;text-overflow:ellipsis;overflow: hidden;">' +
                                    services.join(",") +
                                    '</span>' +
                                    '<span style=" text-align:right; width:35%;white-space:nowrap;text-overflow:ellipsis">' +
                                    coast + ' р.' +
                                    '</span>' +
                                    '</div>' +
                                    '</div>' +
                                    '</a>' +
                                    '</li>');
                            }
                        }
                    }
                } else {
                    $(element).html("<li style='text-align: center; font-size: 14pt'>Нет визитов</li>");
                }
            }

            scope.$watch('type', function () {
                showVisits();
            });
        },

    };
});
7410