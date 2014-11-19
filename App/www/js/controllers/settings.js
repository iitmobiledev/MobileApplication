/**
 * @ngdoc controller
 * @name myApp.controller:SettingsController
 * @description <p> Контроллер, отвечающий за загрузку данных о текущем пользователе и выходе пользователя из системы.</p>
 * @requires myApp.service:UserLoader
 * @requires myApp.service:UserLogout
 */
myApp.controller('SettingsController', function ($scope, AuthService, $location, Storage) {

    AuthService.getUserInfo(localStorage.getItem("UserToken"), function (userInfo) {
        if (userInfo) {
            console.log(userInfo);
            $scope.user = userInfo;
        }
    });

    var counter = 0;
    
    $scope.showConsole = function () {
        counter++;
        if (counter > 4) {
            $('#console').html("");
            $("#console").show();
            counter = 0;
            console.log = function () {
                var res = [];
                for (var i = 0; i < arguments.length; i++) {
                    var msg = arguments[i];
                    res.push(JSON.stringify(msg));
                }
                $('#console').append('<div>' + res.join(", ") + "</div>");
            };
            console.error = function (msg) {
                $('#console').append(msg + ' ');
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
        AuthService.logout(localStorage.getItem("UserToken"), function () {
            localStorage.setItem("UserToken", null);
            localStorage.setItem("User", null);
            Storage.clearStorage();
            $location.path('authorization');
        });
    };
});