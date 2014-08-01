/**
 * @description Контроллер для обработки данных о визите. 
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `Date` date - текущая дата;
 * - `Array` pages - список из объектов `VisitInfo` за 3 дня:
 * вчерашний, текущий, завтрашний (если существует);
 * - `Number` pageIndex - индекс массива `pages`, выбранной страницы;
 * - `Number` id - иднтификатора мастера.
 * @ngdoc controller
 * @name myApp.controller:MasterController
 * @requires myApp.service:VisitsLoader
 * @requires myApp.service:MastersPerDayLoader
 */
myApp.controller('MasterController', function ($scope, $routeParams, VisitsLoader, $filter, MastersPerDayLoader) {
    var minDate = VisitsLoader.getMinDate();
    var maxDate = VisitsLoader.getMaxDate();

    $scope.id = $routeParams.id;
    $scope.date = new Date($routeParams.date);


    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#hasPrevData
     * @methodOf myApp.controller:MasterController
     * @returns {Boleean}  Возвращает `true`, если есть данные за прошлое.
     * @description Метод для проверки существования данных за прошлое.
     */
    $scope.hasPrevData = function () {
        return $scope.date > minDate;
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#hasFutureData
     * @methodOf myApp.controller:MasterController
     * @returns {Boleean}  Возвращает `true`, если есть данные за будущее.
     * @description Метод для проверки существования данных за будущее.
     */
    $scope.hasFutureData = function () {
        return $scope.date < maxDate && $scope.date.toDateString() != maxDate.toDateString();
    };

    updatePages();
    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#getNeededVisits
     * @methodOf myApp.controller:MasterController
     * @param {Array} masterAndVisits Массив с мастерами и их визитами.
     * Каждый элемент массива объект, где 1-ое поле - мастер, 
     * 2-оё - список его визитов за определенную дату.
     * @returns {Array} Возвращает массив визитов для нужного мастера
     * @description Метод для получения списка визитов для конкретного мастера.
     */
    function getNeededVisits(masterAndVisits) {
        for (var i = 0; i < masterAndVisits.length; i++) {
            if (masterAndVisits[i].master.id == $scope.id) {
                $scope.master = masterAndVisits[i].master;
                return getGoodVisitsList(masterAndVisits[i].visList);
            }
        }
        return [];
    };


    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#getGoodVisitsList
     * @methodOf myApp.controller:MasterController
     * @param {Array} masterList Список визитов мастера
     * @description Метод, формирующий список объектов "визит" с дополнительными информационными полями
     * @returns {Array} Список объектов "визит" с новыми полями
     */
    function getGoodVisitsList(masterList) {
        var nmav = [];
        for (var i = 0; i < masterList.length; i++) {
            nmav.push(selectVisitInfo(masterList[i]));
        }
        for (var j = 1; j < nmav.length; j++) {
            if (nmav[j].startTime != nmav[j - 1].endTime) {
                nmav[j - 1].downTime = $filter('date')(nmav[j - 1].endTime, "HH:mm") + '-' + $filter('date')(nmav[j].startTime, "HH:mm");
                nmav[j - 1].isDownTime = true;
            }
        }
        return nmav;
    }


    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#selectVisitInfo
     * @methodOf myApp.controller:MasterController
     * @param {Object} visit Объект визит.
     * @description Метод, формирующий объект визит с дополнительными информационными полями.
     * @returns {Object} Объект визит с новыми полями.
     */
    function selectVisitInfo(visit) {
        var services = [],
            startTimes = [],
            endTimes = [],
            coast = 0;
        for (var j = 0; j < visit.serviceList.length; j++) {
            var service = visit.serviceList[j];
            if ($scope.master.id == service.master.id) {
                services.push(service.description);
                coast += service.cost
                startTimes.push(service.startTime);
                endTimes.push(service.endTime);
            }
        }
        var result = {};
        result.id = visit.id;
        result.status = visit.status;
        result.client = visit.client.lastName + ' ' + visit.client.firstName;
        result.service = services.join(",");
        result.cost = coast + ' р.';
        result.startTime = Math.min.apply(null, startTimes);
        result.endTime = Math.max.apply(null, endTimes);
        result.isDownTime = false;
        result.downTime = '';
        return result;
    }

    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#getVisitByMasterInfo
     * @methodOf myApp.controller:MasterController
     * @param {Object} visit Объект визит.
     * @description Метод, формирующий данные в виде, нужном для отображения мастера и списки визитов к нему.
     */
    $scope.getVisitByMasterInfo = function (visit) {
        $scope.masterVisitInfo = {};
        $scope.masterVisitInfo.id = visit.id;
        $scope.masterVisitInfo.status = visit.status;
        $scope.masterVisitInfo.client = visit.client;
        $scope.masterVisitInfo.time = $filter('date')(visit.startTime, "HH:mm") + '-' + $filter('date')(visit.endTime, "HH:mm");
        $scope.masterVisitInfo.service = visit.sevice;
        $scope.masterVisitInfo.cost = visit.cost;
        $scope.masterVisitInfo.isDownTime = visit.isDownTime;
        $scope.masterVisitInfo.downTime = visit.downTime;
    }


    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#updatePages
     * @methodOf myApp.controller:MasterController
     * @description Метод для обновления массива данных `$scope.pages`, содержащий визиты к мастеру за текущий, прошлый и будущий дни, необходим для анимации.
     */
    function updatePages() {
        var prevdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() - 1);
        var nextdate = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate() + 1);

        if (!$scope.hasFutureData()) {
            console.log(1);
            var masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
            var prevMasters = MastersPerDayLoader.getAllMastersPerDay(prevdate, VisitsLoader);
            $scope.pages = [getNeededVisits(prevMasters), getNeededVisits(masters)];
//            $scope.pageIndex = 1;
        } else {
            if ($scope.hasPrevData()) {
                console.log(2);
                var masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
                var prevMasters = MastersPerDayLoader.getAllMastersPerDay(prevdate, VisitsLoader);
                var nextMasters = MastersPerDayLoader.getAllMastersPerDay(nextdate, VisitsLoader);
                $scope.pages = [getNeededVisits(prevMasters), getNeededVisits(masters), getNeededVisits(nextMasters)];
//                $scope.pageIndex = 1;
            } else {
                console.log(3);
                var masters = MastersPerDayLoader.getAllMastersPerDay($scope.date, VisitsLoader);
                var nextMasters = MastersPerDayLoader.getAllMastersPerDay(nextdate, VisitsLoader);
                $scope.pages = [getNeededVisits(masters), getNeededVisits(nextMasters)];
                $scope.pageIndex = 0;
            }
        }
    }


    $scope.$watch('date.toDateString()', function () {
        updatePages();
    });


    /**
     *
     * @ngdoc method
     * @name myApp.controller:MasterController#hasVisits
     * @methodOf myApp.controller:MasterController
     * @param {Array} visits Список визитов.
     * @returns {Boleean} Возвращает `true`, если визиты есть, в противном случае - `else`.
     * @description Метод для проверки существования визитов.
     */
    $scope.hasVisits = function (visits) {
        return visits.length != 0;
    }
});