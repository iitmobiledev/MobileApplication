/**
 * @description <p>Контроллер, отвечающий за загрузку данных о визитах,
 * т.е. записей с указанием времени, мастера и клиента.</p>
 * @ngdoc controller
 * @name myApp.controller:VisitsMasterController
 * @requires myApp.service:VisitsLoader
 * @requires myApp.service:MastersPerDayLoader
 */
myApp.controller('VisitsMasterController', function ($scope, $filter, $location, VisitsLoader, MastersPerDayLoader) {
    $('#mastersButton').addClass('pressed');

    var minDate = VisitsLoader.getMinDate();
    var maxDate = VisitsLoader.getMaxDate();

    $scope.date = new Date();

    //    $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
    //    $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
    //    $scope.pages = [MastersPerDayLoader.getAllMastersPerDay($scope.prevdate, VisitsLoader), MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader), MastersPerDayLoader.getAllMastersPerDay($scope.nextdate, VisitsLoader)];

    $scope.pageIndex = 1;

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#hasPrevData
     * @methodOf myApp.controller:VisitsMasterController
     * @returns {Boleean} Возвращает true, если есть данные за прошлое.
     * @description Метод для проверки существования данных за прошлое
     */
    $scope.hasPrevData = function () {
        return $scope.date > minDate;
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#hasFutureData
     * @methodOf myApp.controller:VisitsMasterController
     * @returns {Boleean} Возвращает true, если есть данные за будущее.
     * @description Метод для проверки существования данных за будущее
     */
    $scope.hasFutureData = function () {
        return $scope.date < maxDate && $scope.date.toDateString() != maxDate.toDateString();
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#onTime
     * @methodOf myApp.controller:VisitsMasterController
     * @description Метод для перехода на страницу визитов по времени.
     */
    $scope.onTime = function () {
        $location.path('visits');
    }

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#toMaster
     * @methodOf myApp.controller:VisitsMasterController
     * @param {String} id идентификатор мастера.
     * @description Метод для перехода на страницу мастера.
     */
    $scope.toMaster = function (id) {
        $location.path('master/' + id + "/" + $scope.date);
    }

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#hasVisits
     * @methodOf myApp.controller:VisitsMasterController
     * @param {Object} visit Объект визит
     * @returns {Boleean} Возвращает true, если визит есть
     * @description Метод для проверки существования визита
     */
    $scope.hasVisits = function (visit) {
        return visit.length != 0;
    }

    $scope.$watch('date.toDateString()', function () {
        $scope.prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
        $scope.nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);

        if (!$scope.hasFutureData()) {
            $scope.pages = [MastersPerDayLoader.getAllMastersPerDay($scope.prevdate), MastersPerDayLoader.getAllMastersPerDay($scope.date)];
            $scope.pageIndex = 1;
        } else {
            if ($scope.hasPrevData()) {
                $scope.pages = [MastersPerDayLoader.getAllMastersPerDay($scope.prevdate), MastersPerDayLoader.getAllMastersPerDay($scope.date), MastersPerDayLoader.getAllMastersPerDay($scope.nextdate)];
                $scope.pageIndex = 1;
            }
        }
    });


    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#getMasterInfo
     * @methodOf myApp.controller:VisitsMasterController
     * @param {Object} master Объект мастер
     * @returns {String} masterInfo Фамилия и имя мастера одной строкой
     * @description Метод, формирующий данные в виде, нужном для отображения визитов отсортированных по мастерам
     */
    $scope.getMasterInfo = function (master) {
        $scope.masterId = master.id;
        return master.lastName + " " + master.firstName;
    }

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#getVisitByMasterInfo
     * @methodOf myApp.controller:VisitsMasterController
     * @param {Object} visit Объект визит
     * @description Метод, формирующий данные в виде, нужном для отображения визитов отсортированных по мастерам
     */
    $scope.getVisitByMasterInfo = function (visit) {
        $scope.masterVisitInfo = {};
        var services = [],
            startTimes = [],
            endTimes = [],
            coast = 0;
        for (var j = 0; j < visit.serviceList.length; j++) {
            var service = visit.serviceList[j];
            if (service.master.id == $scope.masterId) {
                services.push(service.description);
                coast += service.cost
                startTimes.push(service.startTime);
                endTimes.push(service.endTime);
            }
        }

        $scope.masterVisitInfo.id = visit.id;
        $scope.masterVisitInfo.status = visit.status;
        $scope.masterVisitInfo.client = visit.client.lastName + ' ' + visit.client.firstName;
        $scope.masterVisitInfo.time = $filter('date')(Math.min.apply(null, startTimes), "HH:mm") + '-' +
            $filter('date')(Math.max.apply(null, endTimes), "HH:mm");
        $scope.masterVisitInfo.service = services.join(",");
        $scope.masterVisitInfo.cost = coast + ' р.';
    }

});