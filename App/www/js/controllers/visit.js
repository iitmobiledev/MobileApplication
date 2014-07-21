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
myApp.directive('visitPageContent', function ($filter) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        link: function (scope, element, attrs) {
            $(element).append('<div style="text-align: center; background-color: yellow;">' + 
                              'Запись на ' +
                              $filter('date')(date, "H:mm dd.MM.yyyy"); +'</div>');
            
            var balanceColor;
            var balance = scope.client.balance;
            if(balance >= 0)
                balanceColor = "red";
            else
                balanceColor = "green"
                
            $(element).append('<div>' + scope.client.lastName + " " + scope.client.firstName + " " + scope.client.middleName +
                              '<br>' + 
                              '<a style="text-decoration: none;" href="tel:' + 
                              scope.client.phoneNumber + '">' + scope.client.phoneNumber + '</a>' +
                              '<br>' +
                              '<span style="color: ' + balanceColor + ';">Баланс: ' + balance + '</span>' + 
                              '   Скидка: ' + scope.client.discount + '%' +
                              '</div>');
            
            
            $(element).append('<div>Услуги</div>')
            
        },
        template: '<div></div>'