/**
 * @description Директива добавляет на страницу приложения анимацию загрузки (loaderBar)
 * @ngdoc directive
 * @name myApp.directive:loadBar
 * @restrict E
 * @param {Boolean} paramName Параметр, указывающий необходимо или нет отображать анимацию загрузки.
 */
myApp.directive('loadBar', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="loading-image"><div id="loading"> </div></div>',
        link: function (scope, element, attrs) {
            /*
             *wath, следящий за изменением параметра loading в контроллере
             */
            scope.$watch(attrs.paramName, function (newValue) {
                if (newValue) {
                    $(".loading-image").show();
                } else {
                    $(".loading-image").hide();
                }
            }, true);

        }
    }
});