 myApp.controller('SettingsController', function ($scope, UserLoader) {
     $scope.user = UserLoader();
     $scope.exit = function(){
         alert("closing");
         window.close();
     };
 });