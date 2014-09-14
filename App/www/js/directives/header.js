/**
 * @description Директива добавляет на страницу приложения хедер,
 * содержащий заголовок, и если указано, кнопку перехода на
 * предыдущую страницу.
 * @ngdoc directive
 * @name myApp.directive:headerContent
 * @restrict E
 * @param {String} title Заголовок окна, отображаемый в хедере
 * @param {Boolean} show-back-button Указание необходимости отображения кнопки "Назад".
 * @param {Boolean} show Указание необходимости отображения хедера.
 */

myApp.directive('headerContent', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        link: function (scope, element, attrs) {
            var backButtonLink = scope.$eval(attrs.backButtonLink);
            setTitle();
            setBackButton();
            var show = scope.$eval(attrs.show);
            showHeader();

            /**
             * @description Отображает хедер на странице. Пытается выполнится до тех пор, пока не будет подгружена библиотека `intel.xdk`.
             * @ngdoc method
             * @name myApp.directive:headerContent#show
             * @methodOf myApp.directive:headerContent
             */
            function showHeader() {
                if (intel.xdk && intel.xdk.device) {
                    if (show) {
                        listenHardBack();
                        var hC = $(element).hide().html();
                        $("#header").html(hC);
                        $("#header").show();
                    }
                } else {
                    setTimeout(showHeader, 100);
                }
            }

            scope.$watch(attrs.show, function () {
                if (show) {
                    $(element).hide().html();
                    $("#header").show();
                } else {
                    $(element).hide().html();
                    $("#header").hide();
                }
            })


            scope.$watch(attrs.title, function () {
                setTitle();
            });

            scope.$watch(attrs.backButtonLink, function () {
                setBackButton();
            });

            function setTitle() {
                $(element).find("h1").html(scope.$eval(attrs.title));
            }

            /**
             * @description Отображает кнопку назад на хедере, при условии, что атрибут `showBackButton` равен `true`.
             * @ngdoc method
             * @name myApp.directive:headerContent#show
             * @methodOf myApp.directive:headerContent
             */
            function setBackButton() {
                if (backButtonLink) {
                    $(element).find("a").replaceWith('<a class="button" id="backButton" href="' + backButtonLink + '">Назад</a>');
                    $(element).find("img").replaceWith('<img id="backArrow" src="images/backArrow.png" style="max-height: 20px;">');
                }
            }

            function listenHardBack() {
                document.addEventListener("intel.xdk.device.hardware.back", function () {
                    console.log("back");
                    navigator.app.exitApp();
                }, false);
            }
        },
        template: '<div style="height:100%">' +
            '<h1></h1>' +
            '<div class="widget-container wrapping-col single-centered">' +
            '</div>' +
            '<div id="divForBackButton" class="widget-container content-area horiz-area wrapping-col left">' +
            '<img style="display: none !important">'+
            '<a style="display: none !important"></a>' +
            '</div>' +
            '<div class="widget-container content-area horiz-area wrapping-col right" >' +
            '</div>' +
            '</div>'
    };
})