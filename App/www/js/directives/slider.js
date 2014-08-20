/**
 * @description Директива добавляет на страницу приложения "слайдер",
 * который позволяет листать страницы заданные шаблоном
 * `<script type="text/ng-template" id="content-id">...</script>`
 * Так же необходимо указать id шаблона: 
 * ```  myApp.run(function ($templateCache) {
 *      $templateCache.put('content-id');```
 * @ngdoc directive
 * @name myApp.directive:slider
 * @restrict E
 * @param {function} dataCallback Заголовок окна, отображаемый в хедере
 * @param {function} keyExpression Указание необходимости отображения кнопки "Назад".
 */
myApp.directive('slider', function (DateHelper, $compile, $rootScope, $templateCache) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var dataCallback = scope.$eval(attrs.getData);
            console.log("dc", scope.$eval(attrs.dataCallback))
            var keyFunc = scope.$eval(attrs.keyExpression);
            console.log("kf", scope.$eval(attrs.keyExpression))

            var contentID = attrs.contentId;
            var content = $templateCache.get(contentID);
            var compiled = $compile(angular.element(content));

            var contentData;
            var step = DateHelper.steps.DAY;

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

            /**
             * @ngdoc method
             * @name myApp.directive:slider#initSlider
             * @methodOf myApp.directive:slider
             * @description Первоначальная инициализация слайдера, добавляются первые данные
             */
            function initSlider() {
//                compiled(scope, function (clonedElement, scope) {
//                    $('.my-slider').html(clonedElement);
//                });
                toSlick($('.my-slider'));
                dataCallback(getCurrentKey(), 5, false, addPastData);
                dataCallback(getCurrentKey(), 5, true, addFutureData);
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
                var oldScope = scope;
                for (var i = 0; i < contentData.length; i++) {
                    scope = $rootScope.$new();
                    scope.page = contentData[i];
                    
                    // костыль, до тех пор пока разраб библиотеки slick
                    // не реализует эту фичу
                    // (оставаться на текущем слайде при добавлении слайда в начало)
                    compiled(scope, function (clonedElement, scope) {
                        var ind = $('.my-slider').slickCurrentSlide();
                        $('.my-slider').unslick();

                        clonedElement.attr("contentKey", keyFunc(contentData[i]));
                        $('.my-slider').prepend(clonedElement);
                        
                        toSlick();

                        $('.my-slider').slickSetOption('speed', 0).slickGoTo(ind + 1).slickSetOption('speed', 300);
                    });
                }
                scope = oldScope;
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
                var oldScope = scope;
                for (var i = 0; i < contentData.length; i++) {
                    scope = $rootScope.$new();
                    scope.page = contentData[i];
                    compiled(scope, function (clonedElement, scope) {
                        clonedElement.attr("contentKey", keyFunc(contentData[i]));
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
            
            /**
             * @ngdoc method
             * @name myApp.directive:slider#getCurrentKey
             * @methodOf myApp.directive:slider
             * @description Функция, возвращает ключ объекта, 
             * чьи данные отображаеются на текущем слайде
             * @returns {Number} ключ объекта
             */
            function getCurrentKey() {
                var key = $('.my-slider').getSlick().$slides[$('.my-slider').slickCurrentSlide()].getAttribute("contentKey");
                if (key)
                {
                    return key.value;
                }
                else{
                    return null;
                }
            }


        },
        templateUrl: 'views/slider.html'

    };
});