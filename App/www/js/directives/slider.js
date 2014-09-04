/**
 * @description Директива добавляет на страницу приложения "слайдер",
 * который позволяет листать страницы заданные шаблоном

 * @ngdoc directive
 * @name myApp.directive:slider
 * @restrict E
 * @param {String} contentId id шаблона, в котором хранится контент слайдера
 * <pre><script type="text/ng-template" id="content-id">...</script></pre>
 * Так же необходимо указать id шаблона в routes.js:
 * <pre>myApp.run(function ($templateCache) {
 *      $templateCache.put('content-id');</pre>
 * @param {function} dataCallback Получение данных, функция имеет следующий вид:
 * <pre>
 * function (key, quantity, forward, callback){...} // где:
 * // key - ключ объкта, от которого получаем новые данные
 * // quantity - количество, получаемых данных
 * // forward - направление, в котором движемся, если `true`, то вперед, иначе назад
 * // callback - колбек. В него передаются полученные данные
 * </pre>
 * @param {function} keyExpression Функция, возвращающая ключ объекта, который передается в функцию параметром.
 * <pre>function (obj) {
 *      return obj && obj.__primary__;
 *  };
 *  </pre>
 */
myApp.directive('slider', function (DateHelper, $compile, $rootScope, $templateCache) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var dataCallback = scope.$eval(attrs.getData);
            var keyFunc = scope.$eval(attrs.keyExpression);

            var contentID = attrs.contentId;
            var content = $templateCache.get(contentID);
            var compiled = $compile(angular.element(content));

            //            var loadBar = $compile(angular.element("<load-bar param-name='true'></load-bar>"));

            var contentData;
            var step = DateHelper.steps.DAY;
            var count = 5;


            var ready = false;

            initSlider();

            /**
             * @ngdoc method
             * @name myApp.directive:slider#toSlick
             * @methodOf myApp.directive:slider
             * @description Функция объявляет что div - элемент с классом `my-slider`
             * является слайдером, библиотеки slick
             */
            function toSlick() {
                $('.my-slider').slick({
                    infinite: false,
                    speed: 300,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    onAfterChange: function () {
                        if (ready) {
                            var key = getCurrentKey();
                            //                            console.log("key", key)
                            if ($('.my-slider').slickCurrentSlide() == 0) {
                                dataCallback(key, count, false, addPastData);
                            } else if ($('.my-slider').slickCurrentSlide() == ($('.my-slider').getSlick().slideCount - 1)) {
                                dataCallback(key, count, true, addFutureData);
                            }
                        }
                    },
                    onBeforeChange: function () {
                        if (ready) {
                            var key = getCurrentKey();
                            if ($('.my-slider').slickCurrentSlide() == 1) {
                                scope.loading = true;
                                scope.$apply();
                            } else if ($('.my-slider').slickCurrentSlide() == ($('.my-slider').getSlick().slideCount - 2)) {
                                scope.loading = true;
                                scope.$apply();
                            }
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

            /**
             * @ngdoc method
             * @name myApp.directive:slider#initSlider
             * @methodOf myApp.directive:slider
             * @description Первоначальная инициализация слайдера, добавляются первые данные
             */
            function initSlider() {
                $('.my-slider').unslick();
                $('.my-slider').html("")
                toSlick($('.my-slider'));
                dataCallback(null, count, true, addCurrentDayData);
            }

            /**
             *
             * @ngdoc method
             * @name myApp.directive:slider#addPastData
             * @methodOf myApp.directive:slider
             * @description Функция, добавляет слайды в начало, слайдера
             * @param {Array} contentData Список объектов, чьи данные будут отображаться на слайдах
             */
            function addPastData(contentData) {
                ready = false;
                //                $('.my-slider').slickRemove(true);
                if (contentData) {
                    for (var i = contentData.length - 1; i >= 0; i--) {
                        newscope = scope.$new();
                        newscope.page = contentData[i];
                        // костыль, до тех пор пока разраб библиотеки slick
                        // не реализует эту фичу
                        // (оставаться на текущем слайде при добавлении слайда в начало)
                        compiled(newscope, function (clonedElement, scope) {
                            var ind = $('.my-slider').slickCurrentSlide();
                            if ($('.my-slider').getSlick().slideCount !== 0) {
                                c = 1;
                            } else {
                                c = 0;
                            }
                            $('.my-slider').unslick();
                            $('.my-slider').prepend(clonedElement);
                            toSlick();
                            $('.my-slider').slickSetOption('speed', 0).slickGoTo(ind + c).slickSetOption('speed', 300);
                            $('.my-slider').getSlick().$slides[0].setAttribute("contentkey", keyFunc(contentData[i]));
                        });
                        newscope.$apply();
                    }
                }
                scope.loading = false;
                scope.$apply();
                ready = true;
            }

            /**
             *
             * @ngdoc method
             * @name myApp.directive:slider#addFutureData
             * @methodOf myApp.directive:slider
             * @description Функция, добавляет слайды в конец, слайдера
             * @param {Array} contentData Список объектов, чьи данные будут отображаться на слайдах
             */
            function addFutureData(contentData) {
                ready = false;
                //                $('.my-slider').slickRemove(false);
                if (contentData) {
                    for (var i = 0; i < contentData.length; i++) {
                        newscope = scope.$new();
                        newscope.page = contentData[i];

                        compiled(newscope, function (clonedElement, scope) {
                            $('.my-slider').slickAdd(clonedElement);
                            $('.my-slider').getSlick().$slides[$('.my-slider').getSlick().slideCount - 1].setAttribute("contentkey", keyFunc(contentData[i]));

                        });
                        newscope.$apply();
                    }
                }
                scope.loading = false;
                scope.$apply();
                ready = true;
            }

            /**
             *
             * @ngdoc method
             * @name myApp.directive:slider#addCurrentDayData
             * @methodOf myApp.directive:slider
             * @description Функция, добавляет первый слайд на слайдер,
             * используется для первоначальной инициализации слайдера
             * @param {Array} contentData Список объектов, чьи данные будут отображаться на слайдах
             */
            function addCurrentDayData(contentData) {
                ready = false;
                var curIndex = 0;
                console.log("addCurentDayData", contentData)
                if (contentData) {
                    for (var i = 0; i < contentData.length; i++) {
                        var now = new Date()
                        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        var curDate = new Date(contentData[i].date);
                        curDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
                        if (contentData[i].date && curDate.toDateString() == today.toDateString()) {
                            curIndex = i;
                        }
                        newscope = scope.$new();
                        newscope.page = contentData[i];
                        //                        console.log(i, contentData[i])
                        compiled(newscope, function (clonedElement, scope) {
                            clonedElement.attr("contentkey", keyFunc(contentData[i]))
                            $('.my-slider').slickAdd(clonedElement);
                            if (i == 0) {
                                $('.my-slider').slickRemove(true);
                            }

                        });
                        newscope.$apply();
                    }

                    $('.my-slider').slickSetOption('speed', 0).slickGoTo(curIndex).slickSetOption('speed', 300);

                    scope.loading = false;
                    scope.$apply();
                    ready = true;
                }
            }

            $('.slider-back-button').on('click', function () {
                $('.my-slider').slickPrev();
            });

            $('.slider-next-button').on('click', function () {
                $('.my-slider').slickNext();
            });


            scope.$watch('step', function (newValue, oldValue) {
                if (oldValue != newValue) {
                    scope.loading = true;
//                    scope.$apply();
                    initSlider();
                }
            })

            /**
             * @ngdoc method
             * @name myApp.directive:slider#getCurrentKey
             * @methodOf myApp.directive:slider
             * @description Функция, возвращает ключ объекта,
             * чьи данные отображаеются на текущем слайде
             * @returns {Number} ключ объекта
             */
            function getCurrentKey() {
                if ($('.my-slider').getSlick().slideCount !== 0) {
                    return $('.my-slider').getSlick().$slides[$('.my-slider').slickCurrentSlide()].getAttribute("contentkey");
                } else {
                    return null;
                }
            }


        },
        templateUrl: 'views/slider.html'

    };
});