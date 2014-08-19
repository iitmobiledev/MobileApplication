myApp.directive('password', function () {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            element.find("#passwordEye").bind('click', function () {
                if (element.find("#password").attr('type') == "password") {
                    element.find("#password").attr('type', 'text');
                    element.find("#passwordEye").css('background-image', 'url(images/closeEye.png)');
                } else {
                    element.find("#password").attr('type', 'password');
                    element.find("#passwordEye").css('background-image', 'url(images/eye.png)');
                }
            });
        },
        template: '<div>' +

        '<input id="password" placeholder="Ваш пароль" type="password" style="width:65%; border-right: 0px;">' +
            '<input id="passwordEye" type="text" readonly style="width:15%; background-image:url(images/eye.png); background-repeat: no-repeat; border-left: 0px;">' +
            '</div>'
    }
});
//'<img id="eye" src="images/password.png" width="38" height="38" align="right">' +


//background:url(images/password.png); background-repeat: no-repeat; background-position:4px; outline:none;