/**
 * @description <p>Контроллер для получения данных о финансовой
 * статистике за сегодня.</p>
 * @ngdoc controller
 * @name myApp.controller:FinanceStatisticsController
 * @requires myApp.service:FinanceStatisticsLoader
 */
myApp.controller('FinanceStatisticsController', function ($scope, FinanceStatisticsLoader) { //контроллер  нижней   плитки
     $scope.FinanceStatistics = FinanceStatisticsLoader();
 });