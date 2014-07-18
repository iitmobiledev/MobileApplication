//контроллер  страницы визитов
myApp.controller('VisitsController', function ($scope, DateHelper) {
    $scope.date = new Date();
    $scope.step = 'day';
    
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