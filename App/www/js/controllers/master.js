/**
 * @description Контроллер, содержащий данные о визите. Получает данные из пути к странице
 * @ngdoc controller
 * @name myApp.controller:MasterController
 * @requires myApp.service:VisitsLoader
 * @requires myApp.service:MastersPerDayLoader
 */
myApp.controller('MasterController', function ($scope, $routeParams, VisitsLoader, $filter, MastersPerDayLoader) {
    $scope.id = $routeParams.id;
    $scope.date = new Date($routeParams.date);

    // * @param {Number} id ID Мастера
    // * @param {Date} date Текущая дата
    // * @param {String} step Шаг для директивы DateChanger
    // * @param {Array} masters Списов мастеров с их визитами
    updatePages();

    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#hasPrevData
     * @methodOf myApp.controller:MasterController
     * @returns {Boleean} Возвращает true
     * @description Метод для проверки существования данных за прошлое
     */
    $scope.hasPrevData = function () {
        return true;
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#hasFutureData
     * @methodOf myApp.controller:MasterController
     * @returns {Boleean} Возвращает true
     * @description Метод для проверки существования данных за будущее
     */
    $scope.hasFutureData = function () {
        return true;
    };
    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#getNeededVisits
     * @methodOf myApp.controller:MasterController
     * @param {Array} masterAndVisits Массив с мастерами и их визитами. Каждыйэлемент массива объект, где 1 поле-мастер,2 -список его визитов за определенную дату
     * @returns {Array} Возвращает массив визитов для нужного мастера
     * @description Метод для получения списка визитов для конкретного мастера
     */
    function getNeededVisits(masterAndVisits) {
        for (var i = 0; i < masterAndVisits.length; i++) {
            if (masterAndVisits[i].master.id == $scope.id) {
                $scope.master = masterAndVisits[i].master;
                return masterAndVisits[i].visList;
            }
        }
        return [];
    };


    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#getVisitByMasterInfo
     * @methodOf myApp.controller:MasterController
     * @param {Object} visit Объект визит
     * @description Метод, формирующий данные в виде, нужном для отображения мастера и списки визитов к нему
     */
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
     * @name myApp.controller:MasterController#updatePages
     * @methodOf myApp.controller:MasterController
     * @description Метод для обновления массива данных $scope.pages, содержащий визиты к мастеру за текущий, прошлый и будущий дни, необходим для анимации.
     */
    function updatePages() {
        var prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
        var nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);
        var masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
        var prevMasters = MastersPerDayLoader.getAllMastersPerDay(prevdate, VisitsLoader);
        var nextMasters = MastersPerDayLoader.getAllMastersPerDay(nextdate, VisitsLoader);
        $scope.pages = [getNeededVisits(prevMasters), getNeededVisits(masters), getNeededVisits(nextMasters)];
        $scope.pageIndex = 1;
    }


    $scope.$watch('date.toDateString()', function () {
        updatePages();
    });
});