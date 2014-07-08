 myApp.controller('todayController', function ($scope, loader) { //контроллер  нижней   плитки
            $scope.date = new Date();
            $scope.data = getSumDataFromArray(loader($scope.date, $scope.date));
        });
