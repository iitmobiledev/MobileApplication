/**
 * @description Контроллер, содержащий данные о визите. Получает данные из пути к странице.
 * @ngdoc controller
 * @ngdoc controller
 * @name myApp.controller:VisitController
 * @requires myApp.service:VisitLoader
 */
myApp.controller('VisitController', function ($scope, $filter, $routeParams, Storage, Visit) {
    Storage.get("Visit", $routeParams.id, function (data) {
        console.log("dataVisit:", data, "id:", $routeParams.id);
        $scope.visit = data;
    });

    /**
     *
     * @ngdoc method
     * @name myApp.controller:VisitController#showVisit
     * @methodOf myApp.controller:VisitController
     * @description Загружает в переменные `$scope` всю информацию о
     * визите.
     */
    //    $scope.showVisit = function () {
    //        console.log("showVisit()-Visit:", $scope.visit);
    //        if ($scope.visit) {
    //            $scope.status = $scope.visit.status;
    //            $scope.date = $scope.visit.date;
    //            $scope.clientName = $scope.visit.client.lastName + " " + $scope.visit.client.firstName + " " + $scope.visit.client.middleName;
    //            $scope.clientPhoneNumber = $scope.visit.client.phoneNumber;
    //            $scope.comment = $scope.visit.comment;
    //            $scope.balColor = "red";
    //            if ($scope.visit.client.balance >= 0) {
    //                $scope.balColor = "green";
    //            }
    //            $scope.clientBalance = $scope.visit.client.balance;
    //            $scope.clientDiscount = $scope.visit.client.discount + "%"
    //
    //            $scope.servList = [];
    //            $scope.sum = 0;
    //            for (var i = 0; i < $scope.visit.serviceList.length; i++) {
    //                var service = $scope.visit.serviceList[i];
    //                $scope.sum += $scope.visit.serviceList[i].cost;
    //                var serviceItem = {};
    //                serviceItem.description = service.description;
    //                serviceItem.time = $filter('date')(service.startTime, "H:mm") + " - " + $filter('date')(service.endTime, "H:mm");
    //                serviceItem.cost = service.cost;
    //                serviceItem.master = 'Мастер: ' + service.master.lastName + " " + service.master.firstName[0];
    //                $scope.servList.push(serviceItem);
    //            }
    //            $scope.comment = $scope.visit.comment;
    //        }
    //    };
    //
    //    $scope.$watch('visit', function () {
    //        $scope.showVisit();
    //    });
});