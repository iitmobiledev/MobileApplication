myApp.directive('password', function () {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            element.find("#password").attr('type', 'password');
            element.find("#passwordEye").bind('click', function () {
                if (element.find("#password").attr('type') == 'password') {
                    element.find("#password").attr('type', 'text');
                    element.find('#passwordEye').attr('src', 'images/closeEye.png');
                } else {
                    element.find("#password").attr('type', 'password');
                    element.find('#passwordEye').attr('src', 'images/eye.png');
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
            '<input id="password" placeholder="Ваш пароль" type="password" value="demo" style="width:80%;">' +
            '<img id="passwordEye" src="images/eye.png" style="position: fixed;right: 12%;margin-top: 10px;height: 20px;"' +
            '</div>'
    }
});