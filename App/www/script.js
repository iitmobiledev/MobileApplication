function MyCtrl($scope) {
    $scope.action = function() {
        if ($scope.name == 'Вчера')
        {
            $scope.name = 'Сегодня';
            $scope.classButtonNext = 'buttonHide';
        }
        else //if ($scope.name == 'Позавчера')
        {
            $scope.name = 'Вчера';
            $scope.classButtonNext = 'button widget uib_w_8 smallNavigationButton d-margins icon right';
            $scope.classButtonPrev = 'button widget uib_w_8 smallNavigationButton d-margins icon left';
        }
    }
    
    $scope.name = 'Вчера';
    
    $scope.reaction = function() {
        if ($scope.name == 'Вчера')
        {
            $scope.name = 'Позавчера';
            $scope.classButtonPrev = 'buttonHide';
        }
        else //if ($scope.name == 'Сегодня')
        {
            $scope.name = 'Вчера';
            $scope.classButtonPrev = 'button widget uib_w_8 smallNavigationButton d-margins icon left';
            $scope.classButtonNext = 'button widget uib_w_8 smallNavigationButton d-margins icon right';
        }
    }
    
    $scope.classButtonNext = 'button widget uib_w_8 smallNavigationButton d-margins icon right';
    $scope.classButtonPrev = 'button widget uib_w_8 smallNavigationButton d-margins icon left';
}