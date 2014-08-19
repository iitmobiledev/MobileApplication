myApp.directive('slider', function (DateHelper, $compile, $rootScope, $templateCache) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var contentID = attrs.contentId;
            var content = $templateCache.get(contentID);
            var compiled = $compile(angular.element(content));
            initSlider();

            var index;
            var maxIndex;
            var contentData;
            var step = DateHelper.steps.DAY;



            function toSlick(slider) {
                slider.slick({
                    infinite: false,
                    speed: 300,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    onAfterChange: function () {
//                        console.log($('.my-slider').getSlick());
//                        console.log(getCurrentDate());
                        scope.date = new Date(getCurrentDate());
                        scope.$apply();
                        if ($('.my-slider').slickCurrentSlide() == 0) {
                            addPastData(new Date(getCurrentDate()))
                        } else if ($('.my-slider').slickCurrentSlide() == ($('.my-slider').getSlick().slideCount - 1)) {
                            addFutureData(new Date(getCurrentDate()))
                        }
                    },
                    responsive: [{
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                            }]
                });
            }

            function initSlider() {

                compiled(scope, function (clonedElement, scope) {
                    $('.my-slider').html(clonedElement);
                });

                maxIndex = 0;

                toSlick($('.my-slider'));

                addPastData(scope.date);
                addFutureData(scope.date);

            }

            function addPastData(date) {
                scope.updatePages(date, false, 5);
                var contentData = scope.pages;
                maxIndex += contentData.length;
                var oldScope = scope;
                for (var i = 0; i < contentData.length; i++) {
                    scope = $rootScope.$new();
                    scope.page = contentData[i];
                    scope.step = oldScope.step;
                    slickAddToStart($('.my-slider'), scope);
                    console.log("date", contentData[i].date.toDateString())
                }
                scope = oldScope;
            }

            function addFutureData(date) {
                scope.updatePages(date, true, 5);
                var contentData = scope.pages;
                console.log("contentData", contentData);
                maxIndex += contentData.length;
                var oldScope = scope;
                for (var i = 0; i < contentData.length; i++) {
                    scope = $rootScope.$new();
                    scope.step = oldScope.step;
                    scope.page = contentData[i];
                    compiled(scope, function (clonedElement, scope) {
                        $(('.my-slider')).slickAdd(clonedElement);
                    });
                }
                scope = oldScope;
            }

            function slickAddToStart(slider, scope) {
                compiled(scope, function (clonedElement, scope) {
                    var ind = slider.slickCurrentSlide();
                    slider.unslick();
                    slider.prepend(clonedElement);
                    toSlick(slider);

                    slider.slickSetOption('speed', 0).slickGoTo(ind + 1).slickSetOption('speed', 300);
                });
            }

            $('#slider-back-button').on('click', function () {
                $('.my-slider').slickPrev();
            });

            $('#slider-next-button').on('click', function () {
                $('.my-slider').slickNext();
            });


            scope.$watch('step', function () {
                $('.my-slider').unslick();
                initSlider();
            })

            function getCurrentDate() {
                return $('.my-slider').getSlick().$slides[$('.my-slider').slickCurrentSlide()].getAttribute("contentDate");
            }


        },
        templateUrl: 'views/slider.html'

    };
});