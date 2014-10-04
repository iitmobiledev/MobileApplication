/**
 * @ngdoc controller
 * @name myApp.controller:SettingsController
 * @description <p> Контроллер, отвечающий за загрузку данных о текущем пользователе и выходе пользователя из системы.</p>
 * @requires myApp.service:UserLoader
 * @requires myApp.service:UserLogout
 */
myApp.controller('SettingsController', function ($scope, authService, $location) {
    authService.getUserInfo(sessvars.token, function (userInfo) {
        if (userInfo){
            console.log(userInfo);
            $scope.user = userInfo;
        }
    });

//    $scope.console = "";
    var counter = 0;

    $scope.showConsole = function () {
        counter++;
        if (counter > 14) {
            $('#console').html("");
            counter = 0;
            console.log = function (msg) {
                $('#console').append(msg+' ');
//                $scope.console += msg;
            };
            console.error = function (msg) {
                $('#console').append(msg+' ');
//                $scope.console += msg;
            };
        }
    }

    /**
     *
     * @ngdoc method
     * @name myApp.controller:SettingsController#exit
     * @methodOf myApp.controller:SettingsController
     * @description Метод для выхода пользователя из системы.
     * При успешном логауте система забывает
     * аутентифицированного пользователя и выполняет
     * переход на страницу авторизации.
     */
    $scope.exit = function () {
        authService.logout(sessvars.token, function () {
            sessvars.$.clearMem();
            $location.path('authorization');
        });
    };
});