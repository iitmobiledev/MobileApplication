/**
 * @ngdoc controller
 * @name myApp.controller:AuthorizationController
 * @description <p> Контроллер, отвечающий за авторизацию
 * пользователя. </p>
 */
myApp.controller('AuthorizationController', function ($scope, $location, UserAuthorization) {
    if (sessvars.user)
            $location.path('index');
    $scope.enter = function () {
        var login = document.getElementById('login').value;
        var password = document.getElementById('password').value;
        sessvars.user = UserAuthorization(login, password);
        if (sessvars.user)
            $location.path('index');
        else
            alert("Такой пользователь незарегистрирован");
    };
});