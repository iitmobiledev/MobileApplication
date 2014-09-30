/**
 * @ngdoc controller
 * @name myApp.controller:About
 * @description <p> Контроллер, отвечающий за загрузку данных о текущем пользователе и выходе пользователя из системы.</p>
 * @requires myApp.service:UserLoader
 * @requires myApp.service:UserLogout
 */
myApp.controller('AboutController', function ($scope) {

    /**
     *
     * @ngdoc method
     * @name myApp.controller:AboutController#openUrl
     * @methodOf myApp.controller:AboutController
     * @description Метод для открытия ссылки в нативных браузерах
     */
    $scope.openUrl = function () {
        intel.xdk.device.launchExternal("http://www.google.com");
    };
});