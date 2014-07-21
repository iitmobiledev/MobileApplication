/**
 * @description Контроллер, содержащий данные о визите. Получает данные из пути к странице
 * @ngdoc controller
 * @name myApp.controller:VisitController
 * @param {Visit} visit Визит
 */
myApp.controller('VisitController', function ($scope, $route, $routeParams) { 
    $scope.visit = $routeParams.visit;
 });

/**
 * @description Директива добавляет на страницу информацию о визите
 * @ngdoc directive
 * @name myApp.directive:visitPageContent
 * @restrict E
 */
myApp.directive('visitPageContent', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        link: function (scope, element, attrs) {
            
            
        },
        template: '<div></div>'