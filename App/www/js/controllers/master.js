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
myApp.controller('MasterController', function ($scope, $routeParams, VisitsLoader, $filter, MastersPerDayLoader) {
    $scope.id = $routeParams.id;
    $scope.date = new Date($routeParams.date);

    updatePages();

    $scope.hasPrevData = function () {
        return true;
    };

    $scope.hasFutureData = function () {
        return true;
    };

    function getNeededMaster(masters) {
        for (var i = 0; i < masters.length; i++) {
            if (masters[i].master.id == $scope.id) {
                return masters[i];
            }
        }
        return [];
    };


    $scope.getVisitByMasterInfo = function (visit) {
        $scope.masterVisitInfo = {};
        var services = [],
            startTimes = [],
            endTimes = [],
            coast = 0;
        for (var j = 0; j < visit.serviceList.length; j++) {
            var service = visit.serviceList[j];
            services.push(service.description);
            coast += service.cost
            startTimes.push(service.startTime);
            endTimes.push(service.endTime);
        }

        $scope.masterVisitInfo.id = visit.id;
        $scope.masterVisitInfo.status = visit.status;
        $scope.masterVisitInfo.client = visit.client.lastName + ' ' + visit.client.firstName;
        $scope.masterVisitInfo.time = $filter('date')(Math.min.apply(null, startTimes), "HH:mm") + '-' +
            $filter('date')(Math.max.apply(null, endTimes), "HH:mm");
        $scope.masterVisitInfo.service = services.join(",");
        $scope.masterVisitInfo.cost = coast + ' р.';
    }

    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#showMaster
     * @methodOf myApp.controller:MasterController
     * @description Отображает всю информацию о мастере(занятость мастера за день)
     */
//    $scope.showMaster = function (masterAndVisits) {
//        if (masterAndVisits != []) {
//            $scope.masterInfo = masterAndVisits.master.lastName + ' ' + masterAndVisits.master.firstName;
//            console.log('name ', masterAndVisits.master.firstName);
//
//            //            var master = $scope.neededMaster;
//            //        for (var i = 0; i < master.visList.length; i++) {
//            //            var visit = master.visList[i];
//            //            var services
//            //            var visitItem = {};
//            //            visitItem.id = visit.id;
//            //            visitItem.status = visit.status;
//            //            visitItem.clientInfo = visit.client.lastName + " " + visit.client.firstName[0];
//            //            for (var j = 0; j < visit.serviceList.length; j++) {
//            //                var service = visit.serviceList[j];
//            //                if (service.master.id === master.id) {
//            //                    services.push(service.description);
//            //                    coast += service.cost
//            //                    startTimes.push(service.startTime);
//            //                    endTimes.push(service.endTime);
//            //                }
//            //            }
//            //
//            //
//            //        }
//        }
//    }

    function updatePages() {
        var prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
        var nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);

        var masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
        var prevMasters = MastersPerDayLoader.getAllMastersPerDay(prevdate, VisitsLoader);
        var nextMasters = MastersPerDayLoader.getAllMastersPerDay(nextdate, VisitsLoader);

        $scope.pages = [getNeededMaster(prevMasters), getNeededMaster(masters), getNeededMaster(nextMasters)];

        $scope.pageIndex = 1;
    }


    $scope.$watch('date.toDateString()', function () {
        updatePages();

        //$scope.masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
        //$scope.showMaster();

    });
});