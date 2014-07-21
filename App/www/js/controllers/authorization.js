/**
 * @ngdoc controller
 * @name myApp.controller:AuthorizationController
 * @description <p> Контроллер, отвечающий за авторизацию
 * пользователя. </p>
 */
myApp.controller('AuthorizationController', function ($scope, $location, UserAuthorization) {
    $scope.enter = function () {
        var login = document.getElementById('login').value;
        var password = document.getElementById('password').value;
        $scope.$parent.user = UserAuthorization(login, password);
        if ($scope.user)
            $location.path('index');
        else
            alert("Такой пользователь незарегистрирован");
    };
});