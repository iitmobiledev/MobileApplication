/**
 * @ngdoc controller
 * @name myApp.controller:AuthorizationController
 * @description <p> Контроллер, отвечающий за авторизацию
 * пользователя. </p>
 * @requires myApp.service:UserAuthorization
 */
myApp.controller('AuthorizationController', function ($scope, $location, UserAuthorization) {
    if (sessvars.user)
        $location.path('index');
    
    /**
     *
     * @ngdoc method
     * @name myApp.controller:AuthorizationController#enter
     * @methodOf myApp.controller:AuthorizationController
     * @description Метод для аутентификации пользователя. В случае
     * успеха переводит на страницу статистики, иначе выводит
     * сообщение об ошибке аутентификации.
     */
    $scope.enter = function () {
        var login = document.getElementById('login').value;
        var password = document.getElementById('password').value;
        UserAuthorization(login, password, function (token) {
            sessvars.token = token;
            if (sessvars.token)
                $location.path('index');
            else
                alert("Ошибка аутентификации. Пожалуйста проверьте правильность введенных данных.");
        });
    };
});