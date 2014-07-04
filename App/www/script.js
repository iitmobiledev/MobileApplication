angular.module('myService', []).
factory('notify', function () {
    return function (day) {
        var manyData = [];
        var date = new Date();
        var data = new Data(date.setDate(date.getDate()), 1000, 3000, 12, 705, 5000, 3000, 2500, -500);
        manyData.push(data);
        data = new Data(date.setDate(date.getDate() - 1), 18000, 35000, 12, 80, 5000, 3000, 2500, -500);
        manyData.push(data);
        data = new Data(date.setDate(date.getDate()) - 2, 2000, 3000, 12, 70, 5000, 3000, 2500, -500);
        manyData.push(data);
        //        manyData.filter(function (data) {
        //            return data.date == day;
        //        });
        return manyData;
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
        } else {
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

    $scope.callNotify = function () {
        $scope.test = {};
        $scope.test = notify($scope.date);

    };
    //    $scope.callNotify('ffff');
});