/**
 * @description Директива добавляет на страницу приложения
 * навигационную панель (футер), содержащую кнопки переходов
 * на страницы отчетности, визитов и настроек
 * @ngdoc directive
 * @name myApp.directive:footerContent
 * @restrict E
 * @param {Boolean} show Указание необходимости отображения футера.
 */
myApp.directive('footerContent', function () {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope, element, attrs) {
            var show = true; // = scope.$eval(attrs.show);
            var activePage = attrs.activePage;
            var inactivePages = scope.$eval(attrs.inactivePages) || [];

            var updateShow = function () {
                if (intel.xdk && intel.xdk.device) {
                    show = scope.$eval(attrs.show);
                    if (show) {
                        $(element).hide();
                        $("#navbar").show();
                        $('#' + activePage).addClass('pressed');
                        for (var i = 0; i < inactivePages.length; i++) {
                            $('#' + inactivePages[i]).removeClass('pressed');
                        }
                    } else {
                        $(element).hide();
                        $("#navbar").hide();
                    }
                } else {
                    setTimeout(updateShow, 100);
                }
            };

            scope.$watch(attrs.show, updateShow);
            updateShow();

            /**
             * @description Отображает футер на странице в зависимости от
             * значения атрибута `show`. Пытается выполнится до тех пор, пока
             * не будет подгружена библиотека `intel.xdk`.
             * @ngdoc method
             * @name myApp.directive:footerContent#showFooter
             * @methodOf myApp.directive:footerContent
             */
            //            function showFooter() {
            //                //                console.log(show);
            //                //                if (intel.xdk && intel.xdk.device) {
            //                if (show) {
            //                    $(element).hide();
            //                    $("#navbar").show();
            //
            //                    $('#' + activePage).addClass('pressed');
            //                    for (var i = 0; i < inactivePages.length; i++) {
            //                        $('#' + inactivePages[i]).removeClass('pressed');
            //                    }
            //                } else {
            //                    $(element).hide();
            //                    $("#navbar").hide();
            //                }
            //                //                } else {
            //                //                    setTimeout(showFooter, 100);
            //                //                }
            //            }
            //
            //            showFooter();
        }
    }

});