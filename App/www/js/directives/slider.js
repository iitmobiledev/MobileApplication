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

            element.find('.prevButtonBlack').show();
            element.find('.prevButtonGrey').hide();

            element.find('.nextButtonBlack').show();
            element.find('.nextButtonGrey').hide();

            var loadslider = $("<div style='height:100%;width:100%;'/>");
            loadslider.append($("<div id='loading' class='square spin' style='position:relative;'/>"));

            var contentID = attrs.contentId;
            var content = $templateCache.get(contentID);
            var compiled = $compile(angular.element(content));

            var count = scope.$eval(attrs.loadedSlideCount) || 5;
            var maxCount = scope.$eval(attrs.maxSlideCount) || 15;

            var needUpdating;
            var updateNeedUpdating = function () {
                needUpdating = scope.$eval(attrs.needUpdating);
                if (needUpdating)
                    init();
            };
            scope.$watch(attrs.needUpdating, updateNeedUpdating);


            var checkWidth = function () {
                if ($(".content").width() < $(".content").height()) {
                    var subtractionHeight = 0;
                    $(attrs.heightElements).each(function () {
                        subtractionHeight += $(this).outerHeight();
                    })
                    element.outerHeight(
                        $('body').height() - subtractionHeight);
                    init();
                } else {
                    setTimeout(checkWidth, 50);
                }
            }

            checkWidth();



            var ready = true;
            
            var canLoadLeft = false;
            var canLoadRight = false;

            /**
             * @ngdoc method
             * @name myApp.directive:slider#toSlick
             * @methodOf myApp.directive:slider
             * @description Функция объявляет что div - элемент с классом `my-slider`
             * является слайдером, библиотеки slick
             */
            function toSlick() {
                var width = $("body").width();

                element.find('.my-slider').initSlider({
                    width: width,
                    maxSlideCount: maxCount,
                    onAfterChange: function () {
                        var curScope = angular.element(element.find('.my-slider').getCurrentSlide()).scope();
                        updateDate(curScope);
                        if (curScope){
                            curScope.$digest();
                        }
                        if (ready && curScope) {
                            ready = false;
                            if (canLoadLeft) {
                                console.log("READY = FALSE");
                                addNewSlides(element.find('.my-slider').getFirstSlide(), "Left", addPastData);
                            } else if (canLoadRight) {
                                console.log("READY = FALSE");
                                addNewSlides(element.find('.my-slider').getLastSlide(), "Right", addFutureData);
                            } else {
                                ready = true;
                            }

                        } else {
                            console.log("IGNORE AFTER CHANGE", ready)
                        }
                    },
                    onBeforeChange: function (nextSlide) {
                        checkCanLoad(nextSlide);
                        setButtonState(nextSlide);
                    }
                });
            }

            function addNewSlides(keySlide, side, addCallback) {
                console.log("addNewSlides" + side)
                var key = getCurrentKey(keySlide);
                element.find('.my-slider')['addLoadBar' + side](loadslider);
                dataCallback(key, count, side == "Right", function (content) {
                    addCallback(content);
                    setTimeout(function () {
                        element.find('.my-slider')['removeLoadBar' + side]();
                        var curScope = angular.element(element.find('.my-slider').getCurrentSlide()).scope();
                        updateDate(curScope);
                        setButtonState(element.find('.my-slider').getCurrentSlide());
                        console.log("READY = TRUE (SLIDES ADDED)");
                        ready = true;
                    }, 0);
                });
            }

            function setButtonState(nextSlide) {
                var nextScope = angular.element(nextSlide).scope();
                if (!scope.$eval(attrs.hasPastData)(nextScope ? nextScope.page : null)) {
                    element.find('.prevButtonBlack').hide();
                    element.find('.prevButtonGrey').show();
                } else {
                    element.find('.prevButtonBlack').show();
                    element.find('.prevButtonGrey').hide();
                }
                if (!scope.$eval(attrs.hasFutureData)(nextScope ? nextScope.page : null)) {
                    element.find('.nextButtonBlack').hide();
                    element.find('.nextButtonGrey').show();
                } else {
                    element.find('.nextButtonBlack').show();
                    element.find('.nextButtonGrey').hide();
                }
            }

            function checkCanLoad(currentSlide) {
                console.log("checkCanLoad LEFT", element.find('.my-slider').whichFromLeft(currentSlide), "RIGHT",
                                            element.find('.my-slider').whichFromRight(currentSlide));
                canLoadLeft = false;
                canLoadRight = false;
                if (element.find('.my-slider').whichFromLeft(currentSlide) <= 1) {
                    var first = element.find('.my-slider').getFirstSlide();
                    var curScope = angular.element(first).scope()
                    if (curScope) {
                        if (scope.$eval(attrs.hasPastData)(curScope.page)) {
                            canLoadLeft = true;
                        }
                    }
                } else if (element.find('.my-slider').whichFromRight(currentSlide) <= 1) {
                    var last = element.find('.my-slider').getLastSlide();
                    var curScope = angular.element(last).scope()
                    if (curScope) {
                        if (scope.$eval(attrs.hasFutureData)(curScope.page)) {
                            canLoadRight = true;
                        }
                    }
                }
                //}
            }

            /**
             * @ngdoc method
             * @name myApp.directive:slider#init
             * @methodOf myApp.directive:slider
             * @description Первоначальная инициализация слайдера, добавляются первые данные
             */
            function init() {
                console.log("INIT")
                $(window).scrollTop(0);
                element.find('.my-slider').html("")
                toSlick();
                ready = false;
                element.find('.my-slider').addLoadBarLeft(loadslider);
                dataCallback(null, count, true, function (content, pageKey) {
                    console.log("dataCallback")
                    ready = true;
                    addCurrentDayData(content, pageKey);
                    setTimeout(function () {
                            element.find('.my-slider').removeLoadBarLeft();
                            var curSlide = element.find('.my-slider').getCurrentSlide();
                            var curScope = angular.element(curSlide).scope();
                            if (curScope) {
                                updateDate(curScope);
                            }
                            setButtonState(curSlide)
                        },
                        0);
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
                var setupElement = function (obj) {
                    var newscope = scope.$new();
                    newscope.page = $.extend(true, {}, obj);
                    compiled(newscope, function (clonedElement, scope) {
                        setTimeout(function () {
                            element.find('.my-slider').addSlideLeft(clonedElement, destroyScope);
                        }, 0);
                    });
                }
                if (contentData) {
                    for (var i = contentData.length - 1; i >= 0; i--) {
                        setupElement(contentData[i]);
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
                var setupElement = function (obj) {
                    var newscope = scope.$new();
                    newscope.page = $.extend(true, {}, obj);
                    compiled(newscope, function (clonedElement, scope) {
                        setTimeout(function () {
                            element.find('.my-slider').addSlideRight(clonedElement, destroyScope);
                        });
                    }, 0);
                }
                if (contentData) {
                    for (var i = 0; i < contentData.length; i++) {
                        setupElement(contentData[i]);
                    }
                }
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
                var curIndex = null;
                var setUpSlide = function (newscope, k) {
                    compiled(newscope, function (clonedElement, scope) {
                        setTimeout(function () {
                            if (k == startPageKey || (startPageKey == null && i == contentData.length)) {
                                element.find('.my-slider')
                                    .addSlideRight(clonedElement, destroyScope, true);
                            } else {
                                element.find('.my-slider')
                                    .addSlideRight(clonedElement, destroyScope);
                            }
                        }, 0)
                    });
                }
                if (contentData) {
                    for (var i = 0; i < contentData.length; i++) {
                        newscope = scope.$new();
                        newscope.$on("pingpong", function () {
                            console.log("SCOPEEEE!");
                        });
                        newscope.page = $.extend(true, {}, contentData[i]);
                        var k = keyFunc(contentData[i]);
                        setUpSlide(newscope, k)
                    }
                    $(window).scrollTop(0);
                    ready = true;
                }

            }

            function destroyScope(obj) {
                var objScope = angular.element(obj).scope()
                if (objScope) {
                    objScope.$destroy();
                }
            }


            $('.slider-back-button').on('click', function () {
                element.find('.my-slider').shiftLeft();
            });

            $('.slider-next-button').on('click', function () {
                element.find('.my-slider').shiftRight();
            });

            scope.$watch(attrs.reinit, function (newValue, oldValue) {
                if (oldValue != newValue) {
                    init();
                }
            })
            
            scope.$on('$routeChangeStart', function(routeChangeStartObject, current) {
//                console.log("$routeChangeStart", routeChangeStartObject.currentScope, current)
                element.find('.my-slider').destroySlider(destroyScope);
                
            });


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
                    slide = element.find('.my-slider').getCurrentSlide();
                }
                var curScope = angular.element(slide).scope();
                if (!curScope) {
                    return null;
                }
                return keyFunc(curScope.page);
            }
        },
        templateUrl: 'views/slider.html'

    };
});