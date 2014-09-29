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
            var updateDate = scope.$eval(attrs.updateDate) || function () {
                return;
            };

            var contentID = attrs.contentId;
            var content = $templateCache.get(contentID);
            var compiled = $compile(angular.element(content));

            var contentData;
            var step = DateHelper.steps.DAY;
            var count = scope.$eval(attrs.loadedSlideCount) || 10;
            var maxCount = scope.$eval(attrs.maxSlideCount) || 15;


            var ready = false;

            var checkWidth = function () {
                if ($(".content").width() < $(".content").height()) {
                    initSlider();
                } else {
                    setTimeout(checkWidth, 10);
                }
            }

            checkWidth();

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
                    console.log(width)
                    $('.my-slider').initSlider({
                        width: width,
                        maxSlideCount: maxCount,
                        onAfterChange: function () {
                            if (ready) {
                                var key = getCurrentKey();
                                var curScope = angular.element($('.my-slider').getCurrentSlide()).scope();
                                console.log(curScope)
                                updateDate(curScope);
                                if ($('.my-slider').whichFromLeft($('.my-slider').getCurrentSlide()) == 0 && scope.past) {
                                    dataCallback(key, count, false, addPastData);
                                } else if ($('.my-slider').whichFromRight($('.my-slider').getCurrentSlide()) == 0 && scope.future) {
                                    dataCallback(key, count, true, addFutureData);
                                }
                                scope.$apply();
                            }
                        }
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
                //$('.my-slider').destroySlider();
                $(window).scrollTop(0);
                $('.my-slider').html("")
                toSlick();
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
                        compiled(newscope, function (clonedElement, scope) {
                            clonedElement.attr("contentkey", keyFunc(contentData[i]))
                            $('.my-slider').addSlideLeft(clonedElement);
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
                            $('.my-slider').addSlideRight(clonedElement);
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
            function addCurrentDayData(contentData, startPageKey) {
                if (!startPageKey) {
                    startPageKey = null;
                }
                console.log("contentData", contentData)
                ready = false;
                var curIndex = null;
                if (contentData) {
                    for (var i = 0; i < contentData.length; i++) {
                        newscope = scope.$new();
                        newscope.page = contentData[i];
                        var k = keyFunc(contentData[i])

                        console.log("startPageKey", startPageKey, k)
                        compiled(newscope, function (clonedElement, scope) {
                            clonedElement.attr("contentkey", k)
                            if (k == startPageKey || (startPageKey == null && i == contentData.length)) {
                                $('.my-slider').addSlideRight(clonedElement, true);
                            } else {
                                $('.my-slider').addSlideRight(clonedElement);
                            }
                            //                            newscope.$apply();
                        });
                        //newscope.$apply();
                    }

                    //                    scope.$apply();
                    $(window).scrollTop(0);
                    ready = true;
                }
                var curScope = angular.element($('.my-slider').getCurrentSlide()).scope();
                if (curScope)
                    updateDate(curScope);
            }

            $('.slider-back-button').on('click', function () {
                $('.my-slider').shiftLeft();
            });

            $('.slider-next-button').on('click', function () {
                $('.my-slider').shiftRight();
            });


            scope.$watch('step', function (newValue, oldValue) {
                if (oldValue != newValue) {
                    scope.loading = true;
                    initSlider();
                }
            })

            scope.$watch('reinit', function (newValue, oldValue) {
                if (newValue == true) {
                    scope.loading = true;
                    //scope.reinit = false;
                    initSlider();
                }
            })

            //            function updateDate() {
            //                var key = getCurrentKey();
            //                
            //                console.log("key", key)
            //                var splitPk = key.split(':');
            //                console.log("splitPk", splitPk)
            //                var step = splitPk[splitPk.length - 1];
            //                if (step == DateHelper.steps.DAY || step == DateHelper.steps.WEEK || step == DateHelper.steps.MONTH){
            //                    var period = DateHelper.getPeriod(new Date(splitPk[0]), step);
            //                }
            //                else {
            //                    var period = DateHelper.getPeriod(new Date(key), DateHelper.steps.DAY);
            //                }
            //                
            //                console.log("period.begin", period.begin)
            //                scope.date = period.begin;
            //                //scope.$apply();
            //            }

            /**
             * @ngdoc method
             * @name myApp.directive:slider#getCurrentKey
             * @methodOf myApp.directive:slider
             * @description Функция, возвращает ключ объекта,
             * чьи данные отображаеются на текущем слайде
             * @returns {Number} ключ объекта
             */
            function getCurrentKey() {
                return $($('.my-slider').getCurrentSlide()).attr('contentkey');
            }


        },
        templateUrl: 'views/slider.html'

    };
});