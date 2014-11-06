(function (factory) {
        'use strict';
        if (typeof define === 'function' && define.amd) {
            define(['jquery'], factory);
        } else {
            factory(jQuery);
        }

    }
    (function ($) {
        var MySlider = window.MySlider || {};
        //        $.scrolling = false;
        MySlider = (function () {
                function MySlider(element, settings) {
                    this.defaults = {
                        width: 300,
                        maxSlideCount: 50,
                        onAfterChange: null,
                        onBeforeChange: null,
                        onInit: null
                    };

                    this.initials = {
                        swipe: false,
                        curX: null,
                        curY: null,
                        startX: null,
                        startY: null,
                        minSwipe: null,
                        swipeLength: null,
                        currentSlide: null,
                        slideCount: 0,
                        swipeLeft: null,
                        currentLeft: 0,
                        scrolling: false
                    };

                    $.extend(this, this.initials);

                    this.$slider = $(element);

                    this.options = $.extend({}, this.defaults, settings);

                    this.swipeHandler = $.proxy(this.swipeHandler, this);

                    this.init();
                }
                return MySlider;
            }
            ());

        MySlider.prototype.init = function () {
            this.$slider.addClass('slider');

            this.$slideTrack = $('<div class="slide-track"/>').appendTo(this.$slider);

            this.$slideTrack.css("height", "100%");

            this.initEvents();

            if (this.options.onInit !== null) {
                this.options.onInit.call(this, this);
            }

        };

        //����� �������� ��� ������
        MySlider.prototype.swipeHandler = function (event) {
            this.minSwipe = this.options.width / 20; //touchThreshold;
            switch (event.data.action) {
            case 'start':
                if (!this.swipe) {
                    this.swipe = true;
                    this.swipeStart(event);
                }
                break;
            case 'move':

                if (!this.scrolling) {
                    if (this.swipe) {
                        $('.scrollBar').css("opacity", "0");
                        this.swipeMove(event);
                    }
                    break;
                }

            case 'end':
                if (this.swipe) {
                    console.log("swipeEnd")
                    this.swipe = false;
                    this.scrolling = false;
                    this.swipeEnd(event);
                }
                break;
            }

        };

        //���������� ����� �������� ����� (������ ���� ��� �����)
        MySlider.prototype.swipeEnd = function (event) {
            //            this.$slideTrack.find('.slide').scrollerEnable();
            if (this.curX === undefined) {
                return false;
            }
            //            this.curX = null;

            if (this.swipeLength >= this.minSwipe) {
                //                $(event.target).on('click', function (event) {
                //                    event.stopImmediatePropagation();
                //                    event.stopPropagation();
                //                    event.preventDefault();
                //                    $(event.target).off('click');
                //                });
                var current = this.getCurrent();
                //current.scrollerRewind()
                
                var dir = this.swipeDirection();
                if (dir == 'vertical'){
                    dir = this.lastHorisontalDirection;
                }
                switch (dir) {
                case 'left':
                    this.slideHandler(this.currentSlide + 1, function () {
                        current.scrollerRewind();
                        $('.scrollBar').css("opacity", "0.5");
                        //console.log("current after slideHandler", current);
                    });
                    this.startX = null;
                    this.startY = null;
                    break;

                case 'right':
                    this.slideHandler(this.currentSlide - 1, function () {
                        current.scrollerRewind();
                        $('.scrollBar').css("opacity", "0.5");
                        //console.log("current after slideHandler", current);
                    });
                    this.startX = null;
                    this.startY = null;
                    break;
                }
            } else {
                if (this.startX !== this.curX) {
                    this.slideHandler(this.currentSlide);
                    this.startX = null;
                    this.startY = null;
                }
            }

            this.swipeLength = null;
            this.lastHorisontalDirection = null;


        };

        //�� ���� �������������� �� ��������� �����
        MySlider.prototype.slideHandler = function (index, callback) {
            console.log("slideHandler")
            var _ = this;
            var targetSlide,
                animSlide,
                slideLeft,
                targetLeft = null;
            targetSlide = index;
            targetLeft = this.getLeft(targetSlide);
            slideLeft = this.getLeft(this.currentSlide);

            this.currentLeft = this.swipeLeft === null ? slideLeft : this.swipeLeft;


            if (index < 0 || index > (this.slideCount - 1)) {
                targetSlide = this.currentSlide;
                this.animateSlide(slideLeft, function () {
                    _.postSlide(targetSlide);
                });
                return false;
            }


            if (this.options.onBeforeChange !== null) {
                this.options.onBeforeChange(this.$slideTrack.find('.slide').eq(targetSlide));
            }
            this.animateSlide(targetLeft, function () {
                _.postSlide(targetSlide);
                if (callback) {
                    callback.call();
                }
            });
            this.currentSlide = targetSlide;
        };

        //������������ ��������
        MySlider.prototype.animateSlide = function (targetLeft, callback) {
            var self = this;
            var animProps = {};
            $({
                animStart: this.currentLeft
            }).animate({
                animStart: targetLeft
            }, {
                duration: 300,
                easing: 'linear',
                step: function (now) {
                    animProps['transform'] = 'translate(' +
                        now + 'px, 0px)';
                    self.$slideTrack.css(animProps);
                },
                complete: function () {
                    if (callback) {
                        callback.call();
                    }
                    //                    $.scrolling = false;
                }
            });
        };

        //���������� �� ��������� �������� (callback)
        MySlider.prototype.postSlide = function (index) {
            if (this.options.onAfterChange !== null) {
                this.options.onAfterChange.call();
            }
            this.setTranslatePosition(this.getLeft(this.currentSlide));
            this.swipeLeft = null;
        };

        //���������� �� ������ ���� ��������
        MySlider.prototype.getLeft = function (slideIndex) {
            return ((slideIndex * this.options.width) * -1);
        };

        //����������� ����������� ������
        MySlider.prototype.swipeDirection = function () {
            var xDist,
                yDist,
                r,
                swipeAngle;

            //            console.log("swipeDirection", this.startX, this.curX);
            xDist = this.startX - this.curX;
            yDist = this.startY - this.curY;
            r = Math.atan2(yDist, xDist);

            swipeAngle = Math.round(r * 180 / Math.PI);
            if (swipeAngle < 0) {
                swipeAngle = 360 - Math.abs(swipeAngle);
            }

            if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
                return 'left';
            }
            if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
                return 'left';
            }
            if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
                return 'right';
            }

            return 'vertical';

        };

        var current, progression;

        //�������� ��� �������� ������� �� ������
        MySlider.prototype.swipeMove = function (event) {
            var curLeft,
                positionOffset,
                touches;
            //console.log("swipeSlider")
            touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

            curLeft = this.getLeft(this.currentSlide);

            if (!this.swipe || touches && touches.length !== 1) {
                return false;
            }

            current = this.curX;

            this.curX = touches !== undefined ? touches[0].pageX : event.clientX;
            this.curY = touches !== undefined ? touches[0].pageY : event.clientY;

            //            console.log("start", this.startX);
            //            console.log("current", this.curX, current);
            //            if (this.curX != current)
            //                progression = this.curX > current ? 1 : -1;
            //            console.log("progression", progression);
            this.swipeLength = Math.round(Math.sqrt(
                Math.pow(this.curX - this.startX, 2)));

            if (this.swipeDirection() === 'vertical') {
                $('.scrollBar').css("opacity", "0.5");
                if (this.swipeLength > 20) {
                    this.scrolling = true;
                }

                //                positionOffsetY = this.curY > this.startY ? 1 : -1;
                //
                //                this.swipeTop = this.swipeLength * positionOffset;
                //
                //                this.setTranslatePositiony(this.swipeTop);
                return;
            }
            
            this.lastHorisontalDirection = this.swipeDirection();

            if (this.swipeLength > 20) {
                //                $.scrolling = true;
                //                this.$slideTrack.find('.slide').scrollerDisable();
            }

            //            if (this.swipeLength > 20) {
            //                $(".afScrollPanel").css("overflow", "hidden").css("height", "100%");
            //            }

            if (event.originalEvent !== undefined && this.swipeLength > 4) {
                event.preventDefault();
            }

            //            if (this.curX != current)
            //                positionOffset = this.curX > current ? 1 : -1;
            positionOffset = this.curX > this.startX ? 1 : -1;

            this.swipeLeft = curLeft + this.swipeLength * positionOffset;

            this.setTranslatePosition(this.swipeLeft);

        };

        //�������� ��� ������ ������ (������� �����, �������)
        MySlider.prototype.swipeStart = function (event) {
            var touches;
            if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
                touches = event.originalEvent.touches[0];
            }

            this.startX = touches !== undefined ? touches.pageX : event.clientX;
            this.startY = touches !== undefined ? touches.pageY : event.clientY;
        };

        // ������ ������� ��� ����� ��������
        MySlider.prototype.setTranslatePosition = function (position) {
            var e = new Error()
//            console.log("setTranslatePosition", this.currentSlide, this.slideCount, position)
            this.$slideTrack.css({
                'transform': 'translate(' + position + 'px,0)'
            });
        };

        //        // ������ ������� ��� ����� ��������
        //        MySlider.prototype.setTranslatePositiony = function (position) {
        //            this.$slideTrack.css({
        //                'transform': 'translate(0,' + position + 'px)'
        //            });
        //        };

        //�������������� ������� �� ��������
        MySlider.prototype.initEvents = function () {
            this.$slideTrack.on('touchstart mousedown', {
                action: 'start'
            }, this.swipeHandler);
            this.$slideTrack.on('touchmove mousemove', {
                action: 'move'
            }, this.swipeHandler);
            this.$slideTrack.on('touchend mouseup', {
                action: 'end'
            }, this.swipeHandler);
            this.$slideTrack.on('touchcancel mouseleave', {
                action: 'end'
            }, this.swipeHandler);
            this.$slideTrack.on('touchleave', {
                action: 'end'
            }, this.swipeHandler);

        };

        //���������� ������ (element - ������� ������; toRight - ���� true - � ����� ��������, false - � ������ ��������)
        MySlider.prototype.addSlide = function (element, toRight, isCurrent, callback) {
            if (toRight) {
                this.appendSlide(element);
                if (this.slideCount >= this.options.maxSlideCount) {
                    this.removeSlide(callback);
                }
                if (isCurrent) {
                    if (this.currentSlide !== this.slideCount - 1) {
                        this.currentSlide = this.slideCount - 1;
                        this.setTranslatePosition(this.getLeft(this.currentSlide));
                    }
                }
            } else {
                this.prependSlide(element);
                if (this.slideCount >= this.options.maxSlideCount) {
                    this.removeSlide(callback);
                }
                if (isCurrent) {
                    this.currentSlide = 0;
                    this.setTranslatePosition(this.getLeft(this.currentSlide))
                }
            }
            //            console.log("after", this.currentSlide);
            //setActive();
        }

        var removeTimeout;

        MySlider.prototype.removeSlide = function (callback, time) {
            time = time || 500;
            if (this.slideCount >= this.options.maxSlideCount) {
                clearTimeout(removeTimeout);
                var self = this;
                removeTimeout = setTimeout(function () {
                    if (self.currentSlide > self.slideCount / 2) {
                        self.removeSlideLeft(callback);
                    } else {
                        self.removeSlideRight(callback);
                    }
                    self.removeSlide(callback, 50);
                }, time);
            }
        }

        MySlider.prototype.addLoadBar = function (element, toRight) {
            $(element).css("height", "100%");
            var slide = $('<div style="heigth: 100%"/>').append(element);
            if (toRight) {
                if (this.$slideTrack.find('.LoadSlideRight').lenght) {
                    return;
                }
                slide.addClass("LoadSlideRight");
                this.appendSlide(slide);
            } else {
                if (this.$slideTrack.find('.LoadSlideLeft').lenght) {
                    return;
                }
                slide.addClass("LoadSlideLeft");
                this.prependSlide(slide);
            }
        }

        MySlider.prototype.removeLoadBar = function (fromRight) {
            if (fromRight) {
                var loadBarSlideRight = this.$slideTrack.find('.LoadSlideRight');
                if (!loadBarSlideRight.length) {
                    return;
                }
                loadBarSlideRight.remove();
                this.slideCount--;
                if (this.getCurrent().html() == undefined) {
                    this.shiftSlide(false);
                }
            } else {
                var loadBarSlideLeft = this.$slideTrack.find('.LoadSlideLeft');
                if (!loadBarSlideLeft.length) {
                    return;
                }
                loadBarSlideLeft.remove();
                if (this.currentSlide != 0) {
                    this.currentSlide -= 1;
                }
                this.setTranslatePosition(this.getLeft(this.currentSlide));
                this.slideCount--;

            }
        }

        //Добавление слайда в конец слайдера
        MySlider.prototype.appendSlide = function (element) {
            this.slideCount++;
            $(element).css("height", "100%");
            $(element).css("width", this.options.width + 'px');
            $(element).addClass("slide")

            var lb = $(element).find('.LoadSlideRight');
            if (!lb.length) {
                this.$slideTrack.append(element);
            } else {
                element.insertAfter(lb)
            }

            $(element).scroller({
                verticalScroll: true,
                horizontalScroll: false,
                lockBounce: true,
                scrollbars: true
            });

            var slideObj = this;

            $.bind($(element).scroller(), 'scrollend', function () {
                slideObj.scrolling = false;
            });

            this.$slideTrack.css("width", this.options.width * this.slideCount + 'px');
            if (this.currentSlide === null) {
                this.currentSlide = 0;
            }
        }


        //Добавление слайда в начало слайдера
        MySlider.prototype.prependSlide = function (element) {
            this.slideCount++;
            $(element).css("height", "100%");
            $(element).css("width", this.options.width + 'px');

            $(element).addClass("slide")
            var lb = $(element).find('.LoadSlideLeft');
            if (!lb.length) {
                this.$slideTrack.prepend(element);
            } else {
                console.log("prepend", element, lb)
                element.insertAfter(lb)
            }

            $(element).scroller({
                verticalScroll: true,
                horizontalScroll: false,
                scrollbars: true,
                lockBounce: true
            });

            var slideObj = this;

            $.bind($(element).scroller(), 'scrollend', function () {
                slideObj.scrolling = false;
            });

            this.$slideTrack.css("width", this.options.width * this.slideCount + 'px');
            if (this.currentSlide === null) {
                this.currentSlide = 0;
            } else {
                if (lb.length && this.currentSlide == 0) {
                    this.currentSlide = 0;
                } else {
                    this.currentSlide += 1
                }
                this.setTranslatePosition(this.getLeft(this.currentSlide));
            }
        }

        //удаляем слайд справа
        MySlider.prototype.removeSlideRight = function (callback) {
            console.log("removeSlideRight", this.currentSlide, this.slideCount);
            var removingSlide = this.$slideTrack.find('.slide:last').get(0);
            callback(removingSlide);
            removingSlide.remove();
            if (this.currentSlide == this.slideCount - 1) {
                this.currentSlide--;
            }
            this.slideCount--;
        }

        //удаляем слайд слева
        MySlider.prototype.removeSlideLeft = function (callback) {
            console.log("removeSlideLeft", this.currentSlide, this.slideCount);
            var removingSlide = this.$slideTrack.find('.slide:first').get(0);
            callback(removingSlide);
            removingSlide.remove();
            this.slideCount--;
            if (this.currentSlide > 0)
                this.currentSlide--;
            this.setTranslatePosition(this.getLeft(this.currentSlide));
        }
        

        MySlider.prototype.shiftSlide = function (toRight) {
            console.log("shiftSlide", this.currentSlide, this.slideCount, toRight)
            var current = this.getCurrent();

            //если текущий слайд - крайний, то ничего не делать
            if (toRight) {
                if (this.currentSlide !== null) {
                    if (this.currentSlide + 1 < this.slideCount) {
                        this.slideHandler(this.currentSlide + 1, function () {
                            current.scrollerRewind();
                            $('.scrollBar').css("opacity", "0.5");
                        });
                        return this.$slideTrack.find('.slide').get(this.currentSlide + 1);
                    }

                }
                return null;
            } else {
                if (this.currentSlide !== null) {
                    if (this.currentSlide - 1 >= 0) {
                        this.slideHandler(this.currentSlide - 1, function () {
                            current.scrollerRewind();
                            $('.scrollBar').css("opacity", "0.5");
                        });
                        return this.$slideTrack.find('.slide').get(this.currentSlide - 1);
                    }
                }
            }
            return null;
        }

        MySlider.prototype.whichFrom = function (current, right) {
            if (right) {
                return this.slideCount - this.$slideTrack.find('.slide').index(current) - 1;
            } else {
                return this.$slideTrack.find('.slide').index(current);
            }
        }

        MySlider.prototype.getCurrent = function () {
            return this.$slideTrack.find('.slide').eq(this.currentSlide);
        }

        MySlider.prototype.firstSlide = function () {
            return this.$slideTrack.find('.slide').eq(0);
        }

        MySlider.prototype.lastSlide = function () {
            return this.$slideTrack.find('.slide:last');
        }
        
        MySlider.prototype.destroy = function (callback){
            while (this.slideCount !== 0){
                this.removeSlideRight(callback);
            }
        }

        $.fn.addSlideLeft = function (content, callback, isCurrent) {
            return this.each(function (index, element) {
                element.slider.addSlide(content, false, isCurrent, callback);
            });
        }

        $.fn.addSlideRight = function (content, callback, isCurrent) {
            return this.each(function (index, element) {
                element.slider.addSlide(content, true, isCurrent, callback);
            });
        }

        // �������� ������� �����
        $.fn.getCurrentSlide = function () {
            return this.get(0).slider.getCurrent();
        }

        // ���������� ������ ����� �� �������� � ��������� �� ���� �����
        $.fn.shiftLeft = function () {
            return this.get(0).slider.shiftSlide(false);
        }

        //���������� ������ ������ �� �������� � ��������� �� ���� �����
        $.fn.shiftRight = function () {
            return this.get(0).slider.shiftSlide(true);
        }

        $.fn.whichFromLeft = function (current) { // returns number of slides on the left of the current
            return this.get(0).slider.whichFrom(current, false);
        }

        $.fn.whichFromRight = function (current) {
            return this.get(0).slider.whichFrom(current, true);
        }

        $.fn.addLoadBarLeft = function (content) {
            return this.each(function (index, element) {
                element.slider.addLoadBar(content, false);
            });
        }

        $.fn.addLoadBarRight = function (content) {
            return this.each(function (index, element) {
                element.slider.addLoadBar(content, true);
            });
        }

        $.fn.removeLoadBarLeft = function (content) {
            return this.each(function (index, element) {
                element.slider.removeLoadBar(false);
            });
        }

        $.fn.removeLoadBarRight = function (content) {
            return this.each(function (index, element) {
                element.slider.removeLoadBar(true);
            });
        }

        $.fn.getFirstSlide = function () {
            return this.get(0).slider.firstSlide();
        }

        $.fn.getLastSlide = function () {
            return this.get(0).slider.lastSlide();
        }

        $.fn.initSlider = function (options) {
            return this.each(function (index, element) {
                element.slider = new MySlider(element, options);
            });
        };
        $.fn.scrollerRewind = function () {
            if (this.scroller && this.scroller() && this.scroller().scrollToTop) {
                this.scroller().scrollToTop(0);
            }
        }

        $.fn.destroySlider = function (callback) {
            return this.each(function (index, element) {
                if (element.slider) {
                    element.slider.destroy(callback);
                }

            });
        };
    }))