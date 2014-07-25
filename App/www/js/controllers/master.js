/**
 * @description Контроллер, содержащий данные о визите. Получает данные из пути к странице
 * @ngdoc controller
 * @name myApp.controller:MasterController
 * @param {Number} id ID Мастера
 * @param {Date} date Текущая дата
 * @param {String} step Шаг для директивы DateChanger
 * @param {Array} masters Списов мастеров с их визитами
 * @requires myApp.service:VisitsLoader
 * @requires myApp.service:MastersPerDayLoader
 */
myApp.controller('MasterController', function ($scope, $routeParams, VisitsLoader, $filter) {
    $scope.id = $routeParams.id;
    $scope.date = new Date();
    $scope.step = 'day';
    $scope.masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);

    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#showMaster
     * @methodOf myApp.controller:MasterController
     * @description Отображает всю информацию о мастере(занятость мастера за день)
     */
    $scope.showMaster = function () {
        $scope.neededMaster = $.grep($scope.masters, function (e) {
            return e.id == id
        });
        $scope.masterInfo = $scope.neededMaster.lastName + ' ' + $scope.neededMaster.firstName;

        var master = $scope.neededMaster;
        for (var i = 0; i < master.visList.length; i++) {
            var visit = master.visList[i];
            var services
            var visitItem = {};
            visitItem.id = visit.id;
            visitItem.status = visit.status;
            visitItem.clientInfo = visit.client.lastName + " " + visit.client.firstName[0];
            for (var j = 0; j < visit.serviceList.length; j++) {
                var service = visit.serviceList[j];
                if (service.master.id === master.id) {
                    services.push(service.description);
                    coast += service.cost
                    startTimes.push(service.startTime);
                    endTimes.push(service.endTime);
                }
            }


        }
    }


    $scope.$watch('date.toDateString()', function () {
        $scope.masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
        $scope.showMaster();
    });
});