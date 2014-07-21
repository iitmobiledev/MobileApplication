/**
 * @description Контроллер, содержащий данные о визите. Получает данные из пути к странице
 * @ngdoc controller
 * @name myApp.controller:VisitController
 * @param {Visit} visit Визит
 */
myApp.controller('VisitController', function ($scope, $route, $routeParams) { 
    $scope.client = $routeParams.visit.client; //клиент
    $scope.serviceList = $routeParams.visit.serviceList; //список услуг
    $scope.comment = $routeParams.visit.comment; //коментарий
    $scope.date = $routeParams.visit.date; //дата оказания услуги
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
            $(element).append('<div style="text-align: /"center/"">Запись на ' + scope.date.getHours() + ":" + scope.date.getMinutes() +'</div>')
        },
        template: '<div></div>'