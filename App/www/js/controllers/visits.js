/**
 * @description <p>Контроллер, отвечающий за загрузку данных о визитах,
 * т.е. записей с указанием времени, мастера и клиента.</p>
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `Date` date - текущая дата;
 * - `Array` pages - список из объектов `Visit` за 3 дня:
 * вчерашний, текущий, завтрашний (если существует);
 * - `Number` pageIndex - индекс массива `pages`, выбранной страницы.
 * @ngdoc controller
 * @ngdoc controller
 * @name myApp.controller:VisitsController
 * @requires myApp.service:VisitsLoader
 * @requires myApp.service:DateHelper
 */
myApp.controller('VisitsController', function ($scope, $filter, $location, VisitsLoader, DateHelper) {
    var minDate = VisitsLoader.getMinDate();
    var maxDate = VisitsLoader.getMaxDate();

    $scope.date = new Date();

    $scope.pageIndex = 1;

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsController#hasPrevData
     * @methodOf myApp.controller:VisitsController
     * @returns {Boleean} Возвращает true, если есть данные за прошлое.
     * @description Метод для проверки существования данных за прошлое
     */
    $scope.hasPrevData = function () {
        return true;
//        return $scope.date > minDate;
    };

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsController#hasFutureData
     * @methodOf myApp.controller:VisitsController
     * @returns {Boleean} Возвращает true, если есть данные за будущее.
     * @description Метод для проверки существования данных за будущее
     */
    $scope.hasFutureData = function () {
        return true;
//        return $scope.date < maxDate && $scope.date.toDateString() != maxDate.toDateString();
    };

    $scope.onMasters = function () {
        $location.path('visits-master');
    }
    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsController#hasVisits
     * @methodOf myApp.controller:VisitsController
     * @param {Object} visit Объект визит
     * @returns {Boleean} Возвращает true, если визит есть
     * @description Метод для проверки существования визита
     */
    $scope.hasVisits = function (visit) {
        return visit.length != 0;
    }

    $scope.$watch('date.toDateString()', function () {
        $scope.prevdate = DateHelper.getPrevPeriod($scope.date, DateHelper.steps.DAY).begin;
        $scope.nextdate = DateHelper.getNextPeriod($scope.date, DateHelper.steps.DAY).end;

        if (!$scope.hasFutureData()) {
            $scope.pages = [VisitsLoader.getData($scope.prevdate), VisitsLoader.getData($scope.date)];
//            $scope.pageIndex = 1;
        } else {
            if ($scope.hasPrevData()) {
                $scope.pages = [VisitsLoader.getData($scope.prevdate), VisitsLoader.getData($scope.date), VisitsLoader.getData($scope.nextdate)];
//                $scope.pageIndex = 1;
            }
        }
    });

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitsController#getVisitInfo
     * @methodOf myApp.controller:VisitsController
     * @param {Object} visit Объект визит
     * @description Метод, формирующий данные в виде, нужном для отображения визитов по времени
     */
    $scope.getVisitInfo = function (visit) {
        var services = [],
            masters = [],
            startTimes = [],
            endTimes = [],
            coast = 0;
        for (var j = 0; j < visit.serviceList.length; j++) {
            var service = visit.serviceList[j];
            services.push(service.description);
            masters.push(service.master.lastName);
            coast += service.cost;
            startTimes.push(service.startTime);
            endTimes.push(service.endTime);
            $scope.noVisit = false;
        }
        masters = $.unique(masters);
        $scope.visitInfo = {};
        $scope.visitInfo.id = visit.id;
        $scope.visitInfo.status = visit.status;
        //$('#status').css('background-color', 'blue');
        $scope.visitInfo.client = visit.client.lastName + ' ' + visit.client.firstName;
        $scope.visitInfo.time = $filter('date')(Math.min.apply(null, startTimes), "HH:mm") + '-' +
            $filter('date')(Math.max.apply(null, endTimes), "HH:mm");
        $scope.visitInfo.masters = masters.join(",");
        $scope.visitInfo.services = services.join(",");
        $scope.visitInfo.cost = coast + ' р.';
    }
});