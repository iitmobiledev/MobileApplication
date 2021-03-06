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
            var backButtonLink, show; // = scope.$eval(attrs.backButtonLink);

            //            setTitle();
            //            setBackButton();
            //            var show = scope.$eval(attrs.show);
            //            showHeader();

            var updateBackButtonLink = function () {
                backButtonLink = scope.$eval(attrs.backButtonLink);
                setTitle();
                setBackButton();
                show = scope.$eval(attrs.show);
                showHeader();
            };
            scope.$watch(attrs.backButtonLink, updateBackButtonLink);
            updateBackButtonLink();

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
                        $("#header").fadeIn();
                    }
                } else {
                    setTimeout(showHeader, 100);
                }
            }

            scope.$watch(attrs.show, function () {
                if (show) {
                    $(element).hide().html();
                    $("#header").fadeIn();
                } else {
                    $(element).hide().html();
                    $("#header").fadeOut();
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
                    $(element).find("a").replaceWith('<a class="button" href="' + backButtonLink + '">Назад</a>');
                }
            }

            function listenHardBack() {
                document.addEventListener("intel.xdk.device.hardware.back", function () {
                    console.log("back");
                    navigator.app.exitApp();
                }, false);
            }



            //            $("#backButton").click(function (ev) {
            //                console.log('backButton clicked');
            //                if ($.verticalScrolling || $.horizontalScrolling) {
            //                    ev.preventDefault();
            //                    ev.stopPropagation();
            //                    ev.stopImmediatePropagation();
            //                    return false;
            //                }
            //            });
        },
        template: '<div style="height:100%" id="header-content" class="header-content">' +
            '<h1></h1>' +
            '<div class="widget-container wrapping-col single-centered">' +
            '</div>' +
            '<div id="divForBackButton" class="widget-container content-area horiz-area wrapping-col left" style="width: 100%; height: 40px;">' +
            '<a style="display: none !important"></a>' +
            '</div>' +
            '<div class="widget-container content-area horiz-area wrapping-col right" >' +
            '</div>' +
            '</div>'
    };
})