/**
 * Директива для отображения анимации загрузки
 * @ngdoc directive
 * @name loadBar
 * @restrict C
 */

myApp.directive('loadBar', function () {
    return {
        restrict: 'C',
        replace: true,
        template: '<img id="loading-image" src="images/loading2.gif/" ng-show="loading">',
        link: function (scope, element, attrs) {


            /**Функция, отображающая анимацию загрузки*/
            function showLoading() {
                //отцентровываем анимацию загрузки
                $("#loading-image").load(function () {
                    var left = ($(window).width() - $("#loading-image").width()) / 2;
                    var top = ($(window).height() - $("#loading-image").height()) / 2;
                    $("#loading-image").css("left", left + "px");
                    $("#loading-image").css("top", top + "px");
                    $("#loading-image").css("position", "fixed");
                });
            }

            window.addEventListener("resize", showLoading);

            /**wath, следящий за изменением параметра loading в контроллере*/
            scope.$watch("loading", function (newValue) {
                if (newValue) {
                    $("#loading-image").fadeIn("slow");
                } else {
                    $("#loading-image").fadeOut("slow");
                }
            }, true);

        }
    }
});