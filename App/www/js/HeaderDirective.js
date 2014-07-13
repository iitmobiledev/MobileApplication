myApp.directive('headerContent', function () {
    return {
        restrict: 'C',
        replace: true,
        transclude: false,
        scope: {
            title: '@title',
            showBackButton: '@showBackButton'
        },
        link: function (scope, attrs) {
            console.log("back: " + scope.showBackButton + " title: " + scope.title);
            if (scope.showBackButton == "true") {
                scope.backStyle = "display: inline-block !important;"
            } else {
                scope.backStyle = "display:none !important;"
 
            }
        },
        template: '<div style="height:100%">' +
            '<h1>{{ title }}</h1>' +
            '<div class="widget-container wrapping-col single-centered">' +
            '</div>' +
            '<div class="widget-container content-area horiz-area wrapping-col left">' +
            '<a style={{backStyle}} class="button" id="backButton" onclick="history.go(-1);">Назад</a>' +
            '</div>' +
            '<div class="widget-container content-area horiz-area wrapping-col right" >' +
            '</div>' +
            '</div>'
    };
})