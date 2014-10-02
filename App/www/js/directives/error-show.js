myApp.directive('errorShow', function () {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            scope.correct = true;
            var errorText = "";
            
            var updateErrorText = function () {
                errorText = scope.$eval(attrs.error);
                element.find("#errorText").html(errorText);
            };
            scope.$watch(attrs.error, updateErrorText);
            updateErrorText();  
            
            var updateCorrect = function () {
                scope.correct = scope.$eval(attrs.correct);
            };
            scope.$watch(attrs.correct, updateCorrect);
            updateCorrect();
        },
        template: '<div style="background-color: rgb(255,66,91); color: white; margin: 4% 10%;padding:15px 10px;position:relative" ng-hide="correct">'+
                '<img src="images/auth_error.png" style="max-height: 15px;position: absolute;left: 15px;">'+
                '<div id="errorText" style="text-align: left;padding: 0 30px;">'+
                '</div>'+
            '</div>'
    };
});