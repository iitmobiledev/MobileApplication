myApp.directive('slider', function (DateHelper, $compile, $rootScope, $templateCache) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var dataCallback = scope.$eval(attrs.dataCallback);
            var keyFunc = scope.$eval(attrs.keyExpression);

            var contentID = attrs.contentId;
            var content = $templateCache.get(contentID);
            var compiled = $compile(angular.element(content));

            var contentData;
            var step = DateHelper.steps.DAY;

            initSlider();

            function toSlick() {
                $('.my-slider').slick({
                    infinite: false,
                    speed: 300,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    onAfterChange: function () {
                        //                        console.log($('.my-slider').getSlick());
                                                console.log(getCurrentKey());
                        if ($('.my-slider').slickCurrentSlide() == 0) {
                            dataCallback(getCurrentKey(), 5, false, addPastData);
                        } else if ($('.my-slider').slickCurrentSlide() == ($('.my-slider').getSlick().slideCount - 1)) {
                            dataCallback(getCurrentKey(), 5, true, addFutureData);
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
//                compiled(scope, function (clonedElement, scope) {
//                    $('.my-slider').html(clonedElement);
//                });
                toSlick($('.my-slider'));
                dataCallback(null, 5, false, addPastData);
                dataCallback(getCurrentKey(), 5, true, addFutureData);
            }

            function addPastData(contentData) {
                var oldScope = scope;
                for (var i = 0; i < contentData.length; i++) {
                    scope = $rootScope.$new();
                    scope.page = contentData[i];
                    
                    //
                    compiled(scope, function (clonedElement, scope) {
                        var ind = slider.slickCurrentSlide();
                        $('.my-slider').unslick();

                        clonedElement.attr("contentKey", keyFunc(data[i]));
                        $('.my-slider').prepend(clonedElement);
                        
                        toSlick();

                        $('.my-slider').slickSetOption('speed', 0).slickGoTo(ind + 1).slickSetOption('speed', 300);
                    });
                }
                scope = oldScope;
            }

            function addFutureData(contentData) {
                var oldScope = scope;
                for (var i = 0; i < contentData.length; i++) {
                    scope = $rootScope.$new();
                    scope.page = contentData[i];
                    compiled(scope, function (clonedElement, scope) {
                        clonedElement.attr("contentKey", keyFunc(data[i]));
                        $(('.my-slider')).slickAdd(clonedElement);
                    });
                }
                scope = oldScope;
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
            
            function getCurrentKey() {
                return $('.my-slider').getSlick().$slides[$('.my-slider').slickCurrentSlide()].getAttribute("contentKey").value;
            }


        },
        templateUrl: 'views/slider.html'

    };
});