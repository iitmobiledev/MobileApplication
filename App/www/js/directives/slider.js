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

            var min, max;
            scope.future = true;
            scope.past = true;

            var updateMin = function () {
                min = scope.$eval(attrs.min);
            };
            scope.$watch(attrs.min, updateMin);
            updateMin();

            var updateMax = function () {
                max = scope.$eval(attrs.max);
            };
            scope.$watch(attrs.max, updateMax);
            updateMax();

            //            var loadBar = $compile(angular.element("<load-bar param-name='true'></load-bar>"));

            var contentData;
            var step = DateHelper.steps.DAY;
            var count = 2;


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
                var width = $(".content").width()
                if (width !== 0) {
                    $('.my-slider').slick({
                        infinite: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        slideWidth: width,
                        touchThreshold: 100,
                        onAfterChange: function () {
                            if (ready) {
                                var key = getCurrentKey();
                                var period;
                                var pk = angular.element('.slick-active').attr('contentkey');
                                var splitPk = pk.split(':');
                                //                                console.log("splitPk ", splitPk);
                                if (splitPk.length < 4) {
                                    period = DateHelper.getPeriod(new Date(splitPk[0]), DateHelper.steps.DAY);
                                } else {
                                    var step = splitPk[splitPk.length - 1];
                                    period = DateHelper.getPeriod(new Date(splitPk[0]), step);
                                }
                                //                                console.log("period ", period);
                                scope.past = false, scope.future = false;
                                if (period.begin > min || min == null)
                                    scope.past = true;
                                if (period.end < max || max == null)
                                    scope.future = true;
                                if ($('.my-slider').slickCurrentSlide() == 0 && scope.past) {
                                    dataCallback(key, count, false, addPastData);
                                    //scope.$apply();
                                } else if ($('.my-slider').slickCurrentSlide() == ($('.my-slider').getSlick().slideCount - 1) && scope.future) {
                                    dataCallback(key, count, true, addFutureData);
                                    //scope.$apply();
                                }
                                scope.$apply();
                            }
                        },
                        useCSS: false
                    });
                } else {
                    setTimeout(toSlick, 10);
                }
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
                         //newscope.$apply();
                    }
                }
                //scope.$apply();
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

                            clonedElement.attr("contentkey", keyFunc(contentData[i]))
                            $('.my-slider').slickAdd(clonedElement);
                            //                            newscope.$apply();
                        });
                        //newscope.$apply();
                    }
                }
                //                scope.$apply();
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
                if (contentData) {
                    for (var i = 0; i < contentData.length; i++) {
                        var now = scope.date;
                        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        var todayPeriod = DateHelper.getPeriod(today, scope.step);
                        var curPeriod = DateHelper.getPeriod(contentData[i].date, scope.step);
                        if (contentData[i].date &&
                            curPeriod.begin.toDateString() == todayPeriod.begin.toDateString()) {
                            curIndex = i;
                        }
                        newscope = scope.$new();
                        newscope.page = contentData[i];
                        compiled(newscope, function (clonedElement, scope) {
                            clonedElement.attr("contentkey", keyFunc(contentData[i]))
                            $('.my-slider').slickAdd(clonedElement);
                            //                            newscope.$apply();
                        });
                        //newscope.$apply();
                    }

                    $('.my-slider').slickSetOption('speed', 0).slickGoTo(curIndex).slickSetOption('speed', 300);

                    //                    scope.$apply();
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