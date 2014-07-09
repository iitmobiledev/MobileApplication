 myApp.controller('ExpendituresController', function ($scope, ExpendituresLoader) {
    $scope.date = new Date();
    $scope.hasPreviousData = function () {
        return true;
    };

    $scope.hasFutureData = function () {
        if ($scope.date > new Date().setDate(new Date().getDate() - 1)) {
            return false;
        } else {
            return true;
        }
    };

    $scope.forward = function () {
        $scope.date.setDate($scope.date.getDate() + $scope.step);
        getDataForSelectPeriod();
    };

    $scope.back = function () {
        $scope.date.setDate($scope.date.getDate() - $scope.step);
        getDataForSelectPeriod();
    };

    $scope.getTitle = function () {
        return $filter('date')($scope.date, "dd.MM.yyyy");
    };
    
     $scope.getExpenditureList = function (){
         $scope.expenditureList = ExpendituresLoader($scope.date);
     };
         
 });