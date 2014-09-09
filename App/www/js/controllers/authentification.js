/**
 * @ngdoc controller
 * @name myApp.controller:AuthentificationController
 * @description <p> Контроллер, отвечающий за аутентификацию
 * пользователя. Если пользователь был аутентифицирован
 * в прошлом, то просходит переход на страницу отчетности,
 * иначе выполняется запрос для аутентификации с введенными
 * логином и паролем.</p>
 * @requires myApp.service:UserAuthentification
 */
myApp.controller('AuthentificationController', function ($scope, $location, UserAuthentification) {
    $scope.correct = true;
    if (sessvars.token){
        $location.path('index');
    }

    /**
     *
     * @ngdoc method
     * @name myApp.controller:AuthentificationController#enter
     * @methodOf myApp.controller:AuthentificationController
     * @description Метод для аутентификации пользователя. В случае
     * успеха переводит на страницу статистики, иначе выводит
     * сообщение об ошибке аутентификации.
     */
    $scope.enter = function () {
        var login = document.getElementById('login').value;
        var password = document.getElementById('password').value;
        UserAuthentification(login, password, function (token) {
            sessvars.token = token;
            if (sessvars.token){
                $location.path('index');
            } else {
                $scope.correct = false;
            }
        });
    };
});
