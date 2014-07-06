

angular.module('myService', []).
factory('notify', function () {
    return function (startDay, endDay) {
        var manyData = getData();
        manyData = manyData.filter(function (d) {
            return (d.date.getDate() <= startDay.getDate() && d.date.getDate() >= endDay.getDate());
        });
//        if ( manyData.length > 1)
//        {
//            throw new Error("Дате " + manyData[0].date.toDateString() + " соответствует > 1 объекта"); 
//        }
        return manyData;//[0];
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
        $scope.data = notify($scope.date);          
    };
    $scope.back = function () {
        $scope.date.setDate($scope.date.getDate() - 1);
        $scope.data = notify($scope.date);                 
    };

    $scope.getTitle = function () {
        return $scope.date.toUTCString();
    }
    
    $scope.data = notify($scope.date, $scope.date);// new Date($scope.date.getDate() - 7));

});