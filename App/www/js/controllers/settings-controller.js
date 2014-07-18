/**
 * @ngdoc controller
 * @name myApp.controller:SettingsController
 * @description <p> Контроллер, отвечающий за загрузку данных о текущем
 * пользователе.</p>
 * <p>Переменные в scope:<br>
 * {User} user текущий пользователь,<br>
 * {Function} exit функция для выхода пользоателя из системы и
 * перехода на страницу авторизации.
 * </p>
 */
myApp.controller('SettingsController', function ($scope, UserLoader) {
     $scope.user = UserLoader();
     $scope.exit = function(){
         // log out
         //переход на страницу авторизации
     };
 });