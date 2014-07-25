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
    $scope.date = new Date();
    $scope.step = 'day';
    $scope.masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
    //    var sss = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
    alert("mastersLength:", MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader).length);
    //    $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
    //    $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
    //    $scope.pages = [MastersPerDayLoader.getAllMastersPerDay($scope.prevdate, VisitsLoader), MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader), MastersPerDayLoader.getAllMastersPerDay($scope.nextdate, VisitsLoader)];
    //
    $scope.pages = []
    //    $scope.pageIndex = 1;

    $scope.hasPrevData = function () {
        return true;
    };

    $scope.hasFutureData = function () {
        return true;
    };


    $scope.getNeededMaster = function () {
        //        alert("mastersLength:", $scope.masters.length);
        for (var i = 0; i <= $scope.masters.length; i++) {
            //            alert($scope.masters[i].master.id);
            if ($scope.masters[i].master.id == $scope.id) {
                return master[i];
            }
        }
        return null;
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#showMaster
     * @methodOf myApp.controller:MasterController
     * @description Отображает всю информацию о мастере(занятость мастера за день)
     */
    $scope.showMaster = function () {
        //        alert("mastersLength:", $scope.masters.length);
        $scope.neededMaster = $scope.getNeededMaster();
        if ($scope.neededMaster != null) {
            $scope.masterInfo = $scope.neededMaster.master.lastName + ' ' + $scope.neededMaster.master.firstName;
            console.log($scope.masterInfo);
            var master = $scope.neededMaster;
            //        for (var i = 0; i < master.visList.length; i++) {
            //            var visit = master.visList[i];
            //            var services
            //            var visitItem = {};
            //            visitItem.id = visit.id;
            //            visitItem.status = visit.status;
            //            visitItem.clientInfo = visit.client.lastName + " " + visit.client.firstName[0];
            //            for (var j = 0; j < visit.serviceList.length; j++) {
            //                var service = visit.serviceList[j];
            //                if (service.master.id === master.id) {
            //                    services.push(service.description);
            //                    coast += service.cost
            //                    startTimes.push(service.startTime);
            //                    endTimes.push(service.endTime);
            //                }
            //            }
            //
            //
            //        }
        }
    }


    $scope.$watch('date.toDateString()', function () {
        $scope.masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
        $scope.showMaster();
    });
});