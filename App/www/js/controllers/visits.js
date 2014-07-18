/**
 * @ngdoc controller
 * @name myApp.controller:VisitsController
 * @description <p> Контроллер, отвечающий за загрузку данных о визитах,
 * т.е. записей с указанием времени, мастера и клиента.</p>
 */
myApp.controller('VisitsController', function ($scope, DateHelper) {
    $scope.date = new Date();
    $scope.step = DateHelper.steps.DAY;
    
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
    
    $scope.visits = [];
    $scope.visits.push("Запись1");
    $scope.visits.push("Запись2");
    
    $scope.onTime = function(){
        //sorting visits on time
    };
    
    $scope.onMasters = function(){
        //sorting on masters and time
        //show masters
    };
});