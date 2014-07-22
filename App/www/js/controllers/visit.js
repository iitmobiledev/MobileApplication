/**
 * @description Контроллер, содержащий данные о визите. Получает данные из пути к странице
 * @ngdoc controller
 * @name myApp.controller:VisitController
 * @param {Visit} visit Визит
 */
myApp.controller('VisitController', function ($scope, $route, $routeParams, VisitLoader) {
    $scope.id = $routeParams.id;
    getVisitById($scope.id);

    function getVisitById(id) {
        var visit = VisitLoader(id);
        if (visit !== null) {
            $scope.status = visit.status;
            $scope.date = visit.date;
            $scope.client = visit.client;
            $scope.serviceList = visit.serviceList;
            $scope.comment = visit.comment;
        }


    }
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
            $(element).find('#datetime')
                .html('Визит в ' + $filter('date')(scope.date, "H:mm dd.MM.yyyy"))
                .css("font-size", "14pt")
                .css("background-color", "yellow");

            $(element).find('#clientName')
                .html(scope.client.lastName + " " + scope.client.firstName + " " + scope.client.middleName)
                .css("font-size", "14pt");
            $(element).find('#phone').html('<a style="text-decoration: none" href="tel:"' + scope.client.phoneNumber + '">' + scope.client.phoneNumber + '</a>')
                .css("font-size", "13pt");

            var balColor;
            if (scope.client.balance >= 0)
                balColor = "green";
            else
                balColor = "red";
            $(element).find('#balance')
                .html("Баланс: " + scope.client.balance)
                .css("color", balColor);

            $(element).find('#discount')
                .html("Скидка: " + scope.client.discount + "%")
                .css("margin-left", "20%");

            var sum = 0;
            for (var i = 0; i < scope.serviceList.length; i++) {
                sum += scope.serviceList[i].cost;
                $(element).find('#servList')
                    .append('<li>' +
                        '<div>' +
                        '<span>' + scope.serviceList[i].description + '</span>' +
                        '<span style="font-weight:bold; float: right; text-align: right;">' +
                        scope.serviceList[i].cost + '</span>' +
                        '</div>' +
                        '<div>' +
                        $filter('date')(scope.serviceList[i].startTime, "H:mm") + " - " +
                        $filter('date')(scope.serviceList[i].endTime, "H:mm") +
                        '</div>' +
                        '<div>' +
                        'Мастер: ' + scope.serviceList[i].master.lastName + " " +
                        scope.serviceList[i].master.firstName[0] +
                        '.</div>' +
                        '</li>'
                );
            }

            $(element).find('#servList')
                .append('<li><span style="font-weight:bold; font-size: 14pt">Итого:</span>' +
                    '<span style="font-weight:bold; float: right; text-align: right;" id="sum">' +
                    sum + '</span>' +
                    '</li>');

            $(element).find('#comment')
                .html(scope.comment);
        },

        templateUrl: "visit-page-content.html"


    };
});