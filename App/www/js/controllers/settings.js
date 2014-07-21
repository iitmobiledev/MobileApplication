/**
 * @ngdoc controller
 * @name myApp.controller:SettingsController
 * @description <p> Контроллер, отвечающий за загрузку данных о текущем
 * пользователе.</p>
 * <p>`$scope` содержит следующие поля:</p>
 *
 * - `user` - текущий пользователь,
 * - `exit` - функция для выхода пользователя из системы и перехода на
 * страницу авторизации.
 * @requires myApp.service:UserLoader
 */
myApp.controller('SettingsController', function ($scope, UserLoader, $location) {
     //$scope.user = UserLoader();
     $scope.exit = function(){
         $location.path('authorization');
     };
 });