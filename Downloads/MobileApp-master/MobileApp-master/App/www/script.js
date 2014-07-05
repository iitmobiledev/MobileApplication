angular.module('myService', []).
  factory('notify', function() {
    return function() {
        var allData = new MyData(new Date(14,2,15), 1000, 3000, 12, 70, 5000, 3000, 2500, -500);
        return allData;
        
        //allData.push(new Data(new Date(14,2,15), 1000, 3000, 12, 70, 5000, 3000, 2500, -500));
        //allData.push(new Data(new Date(15,2,15), 4500, 3000, 2, 35, 4500, 1000, 5500, -2000));
        //allData.push(new Data(new Date(16,2,15), 900, 5000, 5, 80, 4000, 3000, 1500, -500));
        
        //return allData[;
    };
  }).
  controller('MyController', function($scope, notify, $http) 
{
     $scope.action = function () {
        if ($scope.name == 'Вчера') {
            $scope.name = 'Сегодня';
            $scope.classButtonNext = 'buttonHide';
        } else //if ($scope.name == 'Позавчера')
        {
            $scope.name = 'Вчера';
            $scope.classButtonNext = 'button widget uib_w_8 smallNavigationButton d-margins icon right';
            $scope.classButtonPrev = 'button widget uib_w_8 smallNavigationButton d-margins icon left';
        }
    }

    $scope.name = 'Вчера';

    $scope.reaction = function () {
        if ($scope.name == 'Вчера') {
            $scope.name = 'Позавчера';
            $scope.classButtonPrev = 'buttonHide';
        } else
        {
            $scope.name = 'Вчера';
            $scope.classButtonPrev = 'button widget uib_w_8 smallNavigationButton d-margins icon left';
            $scope.classButtonNext = 'button widget uib_w_8 smallNavigationButton d-margins icon right';
        }
    }

    $scope.classButtonNext = 'button widget uib_w_8 smallNavigationButton d-margins icon right';
    $scope.classButtonPrev = 'button widget uib_w_8 smallNavigationButton d-margins icon left';
    
    /////
    $scope.callNotify = function() {
        //$scope.myData = {};
        $scope.myData = notify().proceeds;
    };
  });
