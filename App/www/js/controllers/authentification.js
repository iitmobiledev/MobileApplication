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
myApp.controller('AuthentificationController', function ($scope, $location, authService, Synchronizer, Loader) {
    sessvars.$.clearMem();
    $scope.loading = false;
    $scope.correct = true;
//    if (sessvars.token) {
//        $location.path('index');
//    }

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
        $scope.loading = true;
        var login = document.getElementById('login').value;
        var password = document.getElementById('password').value;
        authService.login(login, password, function (token) {
//            console.log("token ", token);
            $scope.loading = false;
            if (token == 'error') {
                $scope.errorText = "Не удается подключиться к интернету.";
                $scope.correct = false;
            } else {
                if (token) {
                    sessvars.token = token;
                    Loader.getFieldStat();
                    Synchronizer.beginSynch();
                    $location.path('index');
                } else {
                    $scope.errorText = "Вы указали неправильный пароль, попробуйте повторить попытку.";
                    $scope.correct = false;
                }
            }
        });
    };
});