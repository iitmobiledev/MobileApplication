/**
 * @description Директива добавляет на страницу приложения
 * навигационную панель (футер), содержащую кнопки переходов на страницы отчетности, визитов и настроек
 * @ngdoc directive
 * @name myApp.directive:footerContent
 * @restrict E
 * @param {Boolean} show если true - показывает навигационную панель(футер), иначе - скрывает
 */
myApp.directive('footerContent', function () {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope, element, attrs) {
            var show = scope.$eval(attrs.show);
            showFooter();
            function showFooter() {
                if (intel.xdk && intel.xdk.device) {
                    if (show) {
                        $(element).hide().html();
                        $("#navbar").show();
                    } else {
                        $(element).hide().html();
                        $("#navbar").hide();
                    }
                } else {
                    setTimeout(showFooter, 100);
                }
            }

            scope.$watch(attrs.show, function () {
                if (show) {
                    $(element).hide().html();
                    $("#navbar").show();
                } else {
                    $(element).hide().html();
                    $("#navbar").hide();
                }
            })
        }
    }

});