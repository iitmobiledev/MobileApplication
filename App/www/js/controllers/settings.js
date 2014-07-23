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
myApp.controller('SettingsController', function ($scope, UserLoader, UserLogout, $location) {
     $scope.user = UserLoader(sessvars.token);
    //$scope.user = sessvars.user;
     $scope.exit = function(){
         UserLogout(sessvars.token);
         sessvars.$.clearMem();
         $location.path('authorization');
     };
 });