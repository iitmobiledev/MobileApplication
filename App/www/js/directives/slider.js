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

            var loadslider = $("<div style='height:100%;width:100%;'/>");
            loadslider.append($("<div id='loading' class='square spin' style='position:relative;'/>"));

            var contentID = attrs.contentId;
            var content = $templateCache.get(contentID);
            var compiled = $compile(angular.element(content));

            var contentData;
            var step = DateHelper.steps.DAY;
            var count = scope.$eval(attrs.loadedSlideCount) || 5;
            var maxCount = scope.$eval(attrs.maxSlideCount) || 15;

            var needUpdating;
            var updateNeedUpdating = function () {
                needUpdating = scope.$eval(attrs.needUpdating);
                if (needUpdating)
                    updateSlider();
            };
            scope.$watch(attrs.needUpdating, updateNeedUpdating);
            updateNeedUpdating();

            var ready = false;

            var checkWidth = function () {
                if ($(".content").width() < $(".content").height()) {
                    //                    var sliderTop = element.find('.my-slider').offset().top;
                    //                    var pageTop = element.closest(".upage-content").offset().top;
                    //                    console.log("HEIGHT", $('body').height(), sliderTop, pageTop, $("#navbar").outerHeight())
                    var subtractionHeight = 0;
                    console.log("HEIGHT element", $(attrs.heightElements))
                    $(attrs.heightElements).each(function () {
                        subtractionHeight += $(this).outerHeight();
                        console.log("HEIGHT", subtractionHeight)
                    })
                    element.outerHeight(
                        $('body').height() - subtractionHeight)
                    initSlider();
                } else {
                    setTimeout(checkWidth, 50);
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
                    //console.log(width)
                    $('.my-slider').initSlider({
                        width: width,
                        maxSlideCount: maxCount,
                        onAfterChange: function () {
                            if (ready) {

                                var curScope = angular.element($('.my-slider').getCurrentSlide()).scope();
                                //console.log(curScope)
                                updateDate(curScope);
                                if ($('.my-slider').whichFromLeft(
                                    $('.my-slider').getCurrentSlide()) <= 1) {
                                    var key = getCurrentKey($('.my-slider').getFirstSlide());
                                    var first = $('.my-slider').getFirstSlide();
                                    var obj = angular.element(first).scope().page;
                                    if (scope.$eval(attrs.hasPastData)(obj)) {
                                        ready = false;
                                        $('.my-slider').addLoadBarLeft(loadslider);
                                        dataCallback(key, count, false, function (content) {
                                            ready = true;
                                            addPastData(content);
                                            setTimeout(function () {
                                                $('.my-slider').removeLoadBarLeft()
                                            }, 0);
                                        });
                                    }
                                } else if ($('.my-slider').whichFromRight($('.my-slider').getCurrentSlide()) <= 1) {
                                    var key = getCurrentKey($('.my-slider').getLastSlide());
                                    var last = $('.my-slider').getLastSlide();
                                    var obj = angular.element(last).scope().page;
                                    if (scope.$eval(attrs.hasFutureData)(obj)) {
                                        ready = false;
                                        $('.my-slider').addLoadBarRight(loadslider);
                                        dataCallback(key, count, true, function (content) {
                                            ready = true;
                                            addFutureData(content);
                                            setTimeout(function () {
                                                $('.my-slider').removeLoadBarRight()
                                            }, 0);
                                        });
                                    }
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
                ready = false;
                $('.my-slider').addLoadBarRight(loadslider);
                dataCallback(null, count, true, function (content, pageKey) {
                    ready = true;
                    addCurrentDayData(content, pageKey);
                    $('.my-slider').removeLoadBarRight();
                });
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
                var setupElement = function (newscope, obj) {
                    compiled(newscope, function (clonedElement, scope) {
                        setTimeout(function () {
                            clonedElement.attr("contentkey", keyFunc(obj))
                            $('.my-slider').addSlideLeft(clonedElement);
                        }, 0);
                    });
                }
                if (contentData) {
                    for (var i = contentData.length - 1; i >= 0; i--) {
                        newscope = scope.$new();
                        newscope.page = contentData[i];
                        setupElement(newscope, contentData[i]);
                    }
                }
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
                var setupElement = function (newscope, obj) {
                    compiled(newscope, function (clonedElement, scope) {
                        setTimeout(function () {
                            clonedElement.attr("contentkey", keyFunc(obj))
                            $('.my-slider').addSlideRight(clonedElement);
                        });
                    }, 0);
                }
                if (contentData) {
                    for (var i = 0; i < contentData.length; i++) {
                        newscope = scope.$new();
                        newscope.page = contentData[i];
                        setupElement(newscope, contentData[i]);
                    }
                }
                //                scope.$apply();
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
                var curIndex = null;
                var setUpSlide = function (newscope, k) {
                    compiled(newscope, function (clonedElement, scope) {
                        setTimeout(function () {
                            clonedElement.attr("contentkey", k);
                            if (k == startPageKey || (startPageKey == null && i == contentData.length)) {
                                console.log("startPageKey", k);
                                element.find('.my-slider').addSlideRight(clonedElement, true);
                            } else {
                                element.find('.my-slider').addSlideRight(clonedElement);
                            }
                            //                            newscope.$apply();
                        }, 0)
                    });
                }
                if (contentData) {
                    for (var i = 0; i < contentData.length; i++) {
                        newscope = scope.$new();
                        newscope.page = contentData[i];
                        var k = keyFunc(contentData[i]);
                        setUpSlide(newscope, k)
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
                $.scrolling = true;
                $('.my-slider').shiftLeft();
            });

            $('.slider-next-button').on('click', function () {
                $.scrolling = true;
                $('.my-slider').shiftRight();
            });

            scope.$watch(attrs.reinit, function (newValue, oldValue) {
                if (oldValue != newValue) {
                    //                    scope.loading = true;
                    initSlider();
                }
            })

            //            scope.$watch('reinit', function(newValue, oldValue){
            //                if (newValue == true){
            //                    scope.loading = true;
            //                    //scope.reinit = false;
            //                    initSlider();
            //                }
            //            })

            //            function updateDate() {
            //                var key = getCurrentKey();
            //                
            //                //console.log("key", key)
            //                var splitPk = key.split(':');
            //                //console.log("splitPk", splitPk)
            //                var step = splitPk[splitPk.length - 1];
            //                if (step == DateHelper.steps.DAY || step == DateHelper.steps.WEEK || step == DateHelper.steps.MONTH){
            //                    var period = DateHelper.getPeriod(new Date(splitPk[0]), step);
            //                }
            //                else {
            //                    var period = DateHelper.getPeriod(new Date(key), DateHelper.steps.DAY);
            //                }
            //                
            //                //console.log("period.begin", period.begin)
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
            function getCurrentKey(slide) {
                if (!slide) {
                    slide = $('.my-slider').getCurrentSlide();
                }
                return $(slide).attr('contentkey');
            }

            //            $("#slides").height($(".upage-content").height() - $("#header").height());

            //            console.log("HEIGHT", intel.xdk.display.window.landheight, $('.my-slider').offset().top)
            //            
            //            $("#slides").height(intel.xdk.display.window.landheight - $('.my-slider').offset().top)

            function updateSlider() {
                console.log(getCurrentKey());
                dataCallback(null, count, true, addCurrentDayData);
            }
        },
        templateUrl: 'views/slider.html'

    };
});