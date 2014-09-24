myApp.directive('password', function () {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            scope.show = false;
            element.find("#passwordEye").bind('click', function () {
                if (element.find("#passwordEye").attr('src') == 'images/eye.png') {
                    element.find('#passwordEye').attr('src', 'images/closeEye.png');
                    scope.show = true;
                    scope.$apply();
                } else {
                    element.find('#passwordEye').attr('src', 'images/eye.png');
                    scope.show = false;
                    scope.$apply();
                }
            });

            scope.$watch(attrs.correct, function (value) {
                if (value) {
                    element.find("#password").css("outline-color", "-webkit-focus-ring-color");
                } else {
                    element.find("#password").css("outline-color", "rgb(255,66,91)");
                }
            });

        },
        template: '<div>' +
        '<div style="position:relative">' +
            '<input id="password" placeholder="Ваш пароль" type="password" value="demo" style="width:80%;position:relative" ng-hide="show">' +
            '<input id="passwordShow" placeholder="Ваш пароль" type="text" value="demo" style="width:80%;position:relative" ng-show="show">' +
            '<img id="passwordEye" src="images/eye.png" style="position: absolute;right: 12%; top: 10px;height: 20px;z-index:100"' +
            '</div>'
    }
});
//'<input id="password" placeholder="Ваш пароль" type="password" value="demo" style="width:80%; margin-left: 29px;" ng-hide="show">' +
//            '<input id="passwordShow" placeholder="Ваш пароль" type="text" value="demo" style="width:80%; margin-left: 29px;" ng-show="show">' +
//            '<img id="passwordEye" src="images/eye.png" style="position: relative;right: 12%;margin-top: 10px;height: 20px;"' +
//
//'<div style="position:relative">' +
//            '<input id="password" placeholder="Ваш пароль" type="password" value="demo" style="width:80%;position:relative" ng-hide="show">' +
//            '<input id="passwordShow" placeholder="Ваш пароль" type="text" value="demo" style="width:80%;position:relative" ng-show="show">' +
//            '<img id="passwordEye" src="images/eye.png" style="position: absolute;right: 12%;margin-top: 10px;height: 20px;z-index:100"' +