/**
 * @description Директива добавляет на страницу приложения "слайдер",
 * который позволяет листать страницы заданные шаблоном
 * <pre><script type="text/ng-template" id="content-id">...</script></pre>
 * Так же необходимо указать id шаблона (routes.js):
 * <pre>myApp.run(function ($templateCache) {
 *      $templateCache.put('content-id');</pre>
 * @ngdoc directive
 * @name myApp.directive:slider
 * @restrict E
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
 * @param {function} getChildScope Функция, возвращающая scope, являющийся потомком скоупа контроллера.
 */
myApp.directive('slider', function (DateHelper, $compile, $rootScope, $templateCache) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var dataCallback = scope.$eval(attrs.getData);
            var keyFunc = scope.$eval(attrs.keyExpression);
            var getChildScope = scope.$eval(attrs.getChildScope);

            var contentID = attrs.contentId;
            var content = $templateCache.get(contentID);
            var compiled = $compile(angular.element(content));

            var contentData;
            var step = DateHelper.steps.DAY;


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
                            if ($('.my-slider').slickCurrentSlide() == 0) {
                                dataCallback(getCurrentKey(), 5, false, addPastData);
                            } else if ($('.my-slider').slickCurrentSlide() == ($('.my-slider').getSlick().slideCount - 1)) {
                                dataCallback(getCurrentKey(), 5, true, addFutureData);
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
                toSlick($('.my-slider'));
                dataCallback(null, 0, true, addCurrentDayData);

                goloop()

                function goloop() {
                    if (ready) {
                        dataCallback(getCurrentKey(), 5, false, addPastData);
                        dataCallback(getCurrentKey(), 5, true, addFutureData);
                    } else {
                        setTimeout(goloop, 100);
                    }
                }
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
                for (var i = contentData.length - 1; i >= 0; i--) {
                    newscope = getChildScope();
                    newscope.page = contentData[i];
                    newscope.$apply();
                    // костыль, до тех пор пока разраб библиотеки slick
                    // не реализует эту фичу
                    // (оставаться на текущем слайде при добавлении слайда в начало)
                    compiled(newscope, function (clonedElement, scope) {
                        var ind = $('.my-slider').slickCurrentSlide();
                        if ($('.my-slider').getSlick().slideCount !== 0) {
                            count = 1;
                        } else {
                            count = 0;
                        }
                        $('.my-slider').unslick();
                        $('.my-slider').prepend(clonedElement);
                        toSlick();
                        $('.my-slider').slickSetOption('speed', 0).slickGoTo(ind + count).slickSetOption('speed', 300);
                        $('.my-slider').getSlick().$slides[0].setAttribute("contentKey", keyFunc(contentData[i]));
                    });
                }
                tryKey();
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
                for (var i = 0; i < contentData.length; i++) {
                    newscope = getChildScope();
                    newscope.page = contentData[i];
                    newscope.$apply();
                    compiled(newscope, function (clonedElement, scope) {
                        $('.my-slider').slickAdd(clonedElement);
                        $('.my-slider').getSlick().$slides[$('.my-slider').getSlick().slideCount - 1].setAttribute("contentKey", keyFunc(contentData[i]));

                    });

                }
                tryKey();
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
                console.log("contentData ", contentData);
                ready = false;

                tmpData = contentData[0];
                newscope = getChildScope();
                newscope.page = tmpData;
                newscope.$apply();
                compiled(newscope, function (clonedElement, scope) {
                    $('.my-slider').html(clonedElement);
                    $('.my-slider').html(clonedElement);
                    $('.my-slider').getSlick().$slides[0].setAttribute("contentKey", keyFunc(tmpData));
                });
                tryKey();


            }

            function tryKey() {
                if (getCurrentKey()) {
                    ready = true;
                } else {
                    setTimeout(tryKey, 100);
                }
            }


            $('#slider-back-button').on('click', function () {
                $('.my-slider').slickPrev();
            });

            $('#slider-next-button').on('click', function () {
                $('.my-slider').slickNext();
            });


            scope.$watch('step', function (newValue, oldValue) {
                if (oldValue != newValue) {
                    $('.my-slider').unslick();
                    $('.my-slider').html("")
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
                    return $('.my-slider').getSlick().$slides[$('.my-slider').slickCurrentSlide()].getAttribute("contentKey");
                } else {
                    return null;
                }
            }


        },
        templateUrl: 'views/slider.html'

    };
});