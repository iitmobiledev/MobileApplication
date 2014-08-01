/**
 * @description Директива добавляет на страницу приложения хедер,
 * содержащий заголовок, и если указано, кнопку перехода на
 * предыдущую страницу.
 * @ngdoc directive
 * @name myApp.directive:headerContent
 * @restrict E
 * @param {String} title Заголовок окна, отображаемый в хедере
 * @param {Boolean} show-back-button Указание необходимости отображения кнопки "Назад".
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

            show();

            /**
             * @description Отображает хедер на странице. Пытается выполнится до тех пор, пока не будет подгружена библиотека `intel.xdk`.
             * @ngdoc method
             * @name myApp.directive:headerContent#show
             * @methodOf myApp.directive:headerContent
             */
            function show() {
                if (intel.xdk && intel.xdk.device) {
                    listenHardBack();
                    var hC = $(element).hide().html();
                    $("#header").html(hC);
                    $("#header").show();
                } else {
                    setTimeout(show, 100);
                }
            }


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
            '<a style:"display: none !important"></a>' +
            '</div>' +
            '<div class="widget-container content-area horiz-area wrapping-col right" >' +
            '</div>' +
            '</div>'
    };
})