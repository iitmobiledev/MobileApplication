myApp.directive('headerContent', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        link: function (scope, element, attrs) {

            //переворот экрана, возможно стоит сделать отдельную директиву
            var orientation = scope.$eval(attrs.orientation) || "any";
            intel.xdk.device.setRotateOrientation(orientation);

            var showBut = scope.$eval(attrs.showBackButton);
            setTitle();
            setBackButton();
            var hC = $(element).hide().html();
            $("#header").html(hC);
            $("#header").show();

            scope.$watch(attrs.title, function () {
                setTitle();
            });

            scope.$watch(attrs.showBackButton, function () {
                setBackButton();
            });

            function setTitle() {
                $(element).find("h1").html(scope.$eval(attrs.title));
            }

            function setBackButton() {
                if (showBut) {
                    $(element).find("a").replaceWith('<a class="button" id="backButton" onclick="history.go(-1);">Назад</a>');
                }
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