angular.module('myService', []).
factory('notify', function ($window) {
    return function (msg) {
        $window.alert(msg);
    };
}).
controller('MyController', function ($scope, notify) {
    $scope.date = new Date();
    $scope.hasPreviousData = function () {
        return true;
    };
    $scope.hasFutureData = function () {
        if ($scope.date.getDate() == new Date().getDate()) {
            return false;
        }
        else{
            return true;
        }
    };
    $scope.forward = function () {
        $scope.date.setDate($scope.date.getDate() + 1);
        $scope.action(); // remove                    
    };
    $scope.back = function () {
        $scope.date.setDate($scope.date.getDate() - 1);
        $scope.reaction(); // remove                    
    };

    $scope.getTitle = function () {
        return $scope.date.toUTCString();
    }

    $scope.callNotify = function (msg) {

        notify(msg);

    };
    $scope.callNotify('ffff');
});