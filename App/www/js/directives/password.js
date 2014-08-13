myApp.directive('password', function () {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var updateCorrect = function () {
                if (!scope.$eval(attrs.correct))
                    element.append($("<div>", {
                        "style": "background-color: #FF0066; color: white;",
                        text: "Вы указали неправильный пароль, попробуйте повторить попытку.",
                        id: "incorrect"
                    }));
                else
                    element.find("#incorrect").remove();
            };
            scope.$watch(attrs.correct, updateCorrect);
            
            element.find("#eye").bind('click', function () {
                if (element.find("#password").attr('type') == "password") {
                    element.find("#password").attr('type', 'text');
                    element.find("#eye").attr('src', 'images/passwordShow.png');
                } else {
                    element.find("#password").attr('type', 'password');
                    element.find("#eye").attr('src', 'images/password.png');
                }
            });
        },
        template: '<div>'+
        '<img id="eye" src="images/password.png" width="38" height="38" align="right">' +
            '<input id="password" class="wide-control" placeholder="Ваш пароль" type="password" style="width:80%;">'+
        '</div>'
    }
});

//background:url(images/password.png); background-repeat: no-repeat; background-position:4px; outline:none;