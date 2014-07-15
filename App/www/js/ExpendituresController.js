 myApp.controller('ExpendituresController', function ($scope, $filter, ExpendituresLoader) {
     $scope.expenditure = ExpendituresLoader(new Date(2014, 6, 9))[0];
 });

 myApp.directive('expList', function () {
     return {
         restrict: 'E',
         replace: true,
         transclude: true,
         link: function (scope, element, attrs) {
             var expPerDay = scope.expenditure;
             for (var i = 0; i < expPerDay.expenditureList.length; i++) {
                 $(element).append("<li><span>" + expPerDay.expenditureList[i].description +"</span><span style='float: right; text-align: right;'>" + expPerDay.expenditureList[i].cost +  "</span></li>");
             }
//             var el = $(element).hide().html();
             
              
         },
         template: '<ul class="list inset">' +
             '</ul>'
     };
 });