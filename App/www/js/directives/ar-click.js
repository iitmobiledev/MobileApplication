myApp.directive('arClick', function ($parse) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, element, attrs) {
            var fn = $parse(attrs.arClick);
            element.on('click', function (event) {
//                console.log('click');
//                if (!$.scrolling) {
//                    console.log('not scrolling');
                    var callback = function () {
                        fn(scope, {
                            $event: event
                        });
                    };
                    scope.$apply(callback);
//                }
            });
        }
    }
});