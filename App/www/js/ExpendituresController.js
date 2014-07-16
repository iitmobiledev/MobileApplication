 myApp.controller('ExpendituresController', function ($scope, $filter, ExpendituresLoader) {
     $scope.date = new Date();
     $scope.step = 'day';
     $scope.steps = ['day'];
     $scope.expList = ExpendituresLoader($scope.date);

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
                 }
             }


         },
         template: '<ul class="list inset">' +
             '</ul>'
     };
 });