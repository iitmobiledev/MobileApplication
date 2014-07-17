 myApp.controller('FinanceStatisticsController', function ($scope, FinanceStatisticsLoader) { //контроллер  нижней   плитки
     $scope.FinanceStatistics = FinanceStatisticsLoader();
 });