myApp.controller('ExpendituresController', function ($scope, $filter, ExpendituresLoader, DateHelper) {
    $scope.date = new Date();
    $scope.step = 'day';
    $scope.expList = ExpendituresLoader($scope.date);

    $scope.hasPrevData = function () {
        return true;
    };

    $scope.hasFutureData = function () {
        var period = DateHelper.getPeriod($scope.date, $scope.step);
        if (period.end > new Date() || period.end.toDateString() == new Date().toDateString())
            return false;
        else
            return true;
    };

    $scope.$watch('date.toDateString()', function () {
        $scope.expList = ExpendituresLoader($scope.date);
    });

    $scope.$watch('step', function () {
        $scope.expList = ExpendituresLoader($scope.date);
    });
});

myApp.directive('expList', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        link: function (scope, element, attrs) {
            showExp();
            scope.$watch('expList', showExp);

            function showExp() {
                $(element).html("");
                if (scope.expList != null) {
                    for (var i = 0; i < scope.expList.length; i++) {
                        $(element).append("<li><span>" + scope.expList[i].description + "</span><span style='float: right; text-align: right;'>" + scope.expList[i].cost + "</span></li>");
                    }
                } else {
                    $(element).html("<li style='text-align: center; font-size: 14pt'>Нет расходов</li>");
                }
            }


        },
        template: '<ul class="list inset">' +
            '</ul>'
    };
});