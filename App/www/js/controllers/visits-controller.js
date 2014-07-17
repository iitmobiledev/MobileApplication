//контроллер  страницы визитов
myApp.controller('VisitsController', function ($scope) {
    $scope.date = new Date();
    $scope.step = 'day';
    
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