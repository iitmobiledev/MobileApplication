myApp.directive('currency', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (!myAppRegional || !/^RU/.test(myApp.regional)){
                element.removeClass('price');
            }
            element.html(myApp.currency());
        }    
    }
});
