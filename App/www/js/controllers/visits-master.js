/**
 * @description <p>Контроллер, отвечающий за загрузку данных о визитах с сортировкой по мастерам.</p>
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `Date` date - текущая дата;
 * - `Array` pages - список из объектов `perMaster` за 3 дня:
 * вчерашний, текущий, завтрашний (если существует);
 * - `Number` pageIndex - индекс массива `pages`, выбранной страницы.
 * @ngdoc controller
 * @name myApp.controller:VisitsMasterController
 * @requires myApp.service:VisitsLoader
 * @requires myApp.service:MastersPerDayLoader
 * @requires myApp.service:DateHelper
 */
myApp.controller('VisitsMasterController', function ($scope, $filter, $location, MastersLoader, DateHelper) {

    var today = new Date();
    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    $scope.pageIndex = 0;

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#hasPrevData
     * @methodOf myApp.controller:VisitsMasterController
     * @returns {Boleean} Возвращает true, если есть данные за прошлое.
     * @description Метод для проверки существования данных за прошлое.
     */
    $scope.hasPrevData = function () {
        return true;
        //        return $scope.date > minDate;
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#hasFutureData
     * @methodOf myApp.controller:VisitsMasterController
     * @returns {Boleean} Возвращает true, если есть данные за будущее.
     * @description Метод для проверки существования данных за будущее.
     */
    $scope.hasFutureData = function () {
        return true;
        //        return $scope.date < maxDate && $scope.date.toDateString() != maxDate.toDateString();
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#onTime
     * @methodOf myApp.controller:VisitsMasterController
     * @description Метод для перехода на страницу визитов с
     * сортировкой по времени.
     */
    $scope.onTime = function () {
        $location.path('visits');
    }

//    $scope.visits = [];
    $scope.getVisits = function (masters) {
        console.log("getVisits ", masters);
        $scope.visits = [];
        for (var i = 0; i < masters.length; i++) {
            if (masters[i].visList) {
                $scope.visits = $scope.visits.concat(masters[i].visList);
            }
        }
//        console.log($scope.visits);
        return $scope.visits;
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#hasVisits
     * @methodOf myApp.controller:VisitsMasterController
     * @param {Array} visits визиты всех мастеров за выбранный день.
     * @returns {Boleean} Возвращает true, если визиты есть.
     * @description Метод для проверки существования визитов.
     */
    $scope.hasVisits = function (visit) {
        return visit.length != 0;
    }

    $scope.$watch('date.toDateString()', function () {
        $scope.prevdate = DateHelper.getPrevPeriod($scope.date, DateHelper.steps.DAY).begin;
        $scope.nextdate = DateHelper.getNextPeriod($scope.date, DateHelper.steps.DAY).end;
        $scope.pages = [];
        var period = {
            begin: $scope.prevdate,
            end: $scope.nextdate
        };
        MastersLoader.getAllMastersPerDay(period, function (masters) {
            $scope.page = masters[0];
            $scope.visits = $scope.getVisits($scope.page);
        });
    });

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#getMasterInfo
     * @methodOf myApp.controller:VisitsMasterController
     * @param {Object} master Объект мастер
     * @returns {String} masterInfo Фамилия и имя мастера одной строкой.
     * @description Метод для получения фамилии и имени мастера.
     */
    $scope.getMasterInfo = function (master) {
        $scope.masterId = master.id;
        return master.lastName + " " + master.firstName;
    };

    $scope.log = function (str) {
        console.log("log:", str);
    }

    $scope.downTime;
    $scope.isDownTime;
    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsMasterController#getVisitByMasterInfo
     * @methodOf myApp.controller:VisitsMasterController
     * @param {Object} visit Объект визит.
     * @description Метод, формирующий данные в виде, нужном для отображения визитов, отсортированных по мастерам.
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
                coast += service.cost;
                startTimes.push(service.startTime);
                endTimes.push(service.endTime);
            }
        }
        $scope.downTime = visit.downTime;
        $scope.isDownTime = visit.isDownTime;
        $scope.masterVisitInfo.id = visit.id;
        $scope.masterVisitInfo.status = visit.status;
        $scope.masterVisitInfo.client = visit.client.lastName + ' ' + visit.client.firstName;
        $scope.masterVisitInfo.time = $filter('date')(Math.min.apply(null, startTimes), "HH:mm") + '-' + $filter('date')(Math.max.apply(null, endTimes), "HH:mm");
        $scope.masterVisitInfo.service = services.join(", ");
        $scope.masterVisitInfo.cost = coast;
    };



});