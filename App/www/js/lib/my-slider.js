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

        MySlider = (function () {
                function MySlider(element, settings) {
                    this.defaults = {
                        width: 300,
                        maxSlideCount: 50,
                        onAfterChange: null,
                        onInit: null
                    }

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
                        currentLeft: 0
                    };

                    $.extend(this, this.initials);

                    this.$slider = $(element);

                    this.options = $.extend({}, this.defaults, settings);

                    this.swipeHandler = $.proxy(this.swipeHandler, this);

                    this.init();
                }
                return MySlider;
            }
            ())

        MySlider.prototype.init = function () {
            this.$slider.addClass('slider');

            this.$slideTrack = $('<div class="slide-track"/>').appendTo(this.$slider);

            this.initEvents();

            if (this.options.onInit !== null) {
                this.options.onInit.call(this, this);
            }

        }

        //����� �������� ��� ������
        MySlider.prototype.swipeHandler = function (event) {
            this.minSwipe = this.options.width / 20; //touchThreshold;
            switch (event.data.action) {
            case 'start':
                if (!this.swipe) {
                    this.swipe = true;
                    this.swipeStart(event);
                    break;
                }

            case 'move':
                if (this.swipe) {
                    this.swipeMove(event);
                    break;
                }

            case 'end':
                if (this.swipe) {
                    this.swipe = false;
                    this.swipeEnd(event);
                    break;
                }

            }

        };

        //���������� ����� �������� ����� (������ ���� ��� �����)
        MySlider.prototype.swipeEnd = function (event) {
            if (this.curX === undefined) {
                return false;
            }

            if (this.swipeLength >= this.minSwipe) {
                $(event.target).on('click', function (event) {
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                    event.preventDefault();
                    $(event.target).off('click');
                });

                switch (this.swipeDirection()) {
                case 'left':
                    this.slideHandler(this.currentSlide + 1);
                    this.startX = null;
                    this.startY = null;
                    break;

                case 'right':
                    this.slideHandler(this.currentSlide - 1);
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

        };

        //�� ���� �������������� �� ��������� �����
        MySlider.prototype.slideHandler = function (index) {
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
            this.animateSlide(targetLeft, function () {
                _.postSlide(targetSlide);
            });
            this.currentSlide = targetSlide;
        };

        //������������ ��������
        MySlider.prototype.animateSlide = function (targetLeft, callback) {
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
                    $('.slide-track').css(animProps);
                },
                complete: function () {
                    if (callback) {
                        callback.call();
                    }
                }
            });
        };

        //���������� �� ��������� �������� (callback)
        MySlider.prototype.postSlide = function (index) {
            if (this.options.onAfterChange !== null) {
                this.options.onAfterChange.call();
            }
            this.setCSS(this.getLeft(this.currentSlide));
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

        //�������� ��� �������� ������� �� ������
        MySlider.prototype.swipeMove = function (event) {
            var curLeft,
                positionOffset,
                touches;

            touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

            curLeft = this.getLeft(this.currentSlide);

            if (!this.swipe || touches && touches.length !== 1) {
                return false;
            }

            this.curX = touches !== undefined ? touches[0].pageX : event.clientX;
            this.curY = touches !== undefined ? touches[0].pageY : event.clientY;

            this.swipeLength = Math.round(Math.sqrt(
                Math.pow(this.curX - this.startX, 2)));

            if (this.swipeDirection() === 'vertical') {
                return;
            }

            if (event.originalEvent !== undefined && this.swipeLength > 4) {
                event.preventDefault();
            }

            positionOffset = this.curX > this.startX ? 1 : -1;

            this.swipeLeft = curLeft + this.swipeLength * positionOffset;

            this.setCSS(this.swipeLeft);

        };

        //�������� ��� ������ ������ (������� �����, �������)
        MySlider.prototype.swipeStart = function (event) {
            var touches;
            if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
                touches = event.originalEvent.touches[0];
            }

            this.startX = touches !== undefined ? touches.pageX : event.clientX;
            this.startY = touches !== undefined ? touches.pageY : event.clientY;
        }

        // ������ ������� ��� ����� ��������
        MySlider.prototype.setCSS = function (position) {
            this.$slideTrack.css({
                'transform': 'translate(' + position + 'px,0)'
            });
        };

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

        }

        //���������� ������ (element - ������� ������; toRight - ���� true - � ����� ��������, false - � ������ ��������)
        MySlider.prototype.addSlide = function (element, toRight, isCurrent) {
            this.slideCount++;

            //var slider = $(this).data("slider");
            if (toRight) {
                $(element).css("width", this.options.width);
                $(element).addClass("slide");
                this.$slideTrack.append(element);
                this.$slideTrack.css("width", this.options.width * this.slideCount)
                if (this.currentSlide === null) {
                    this.currentSlide = 0;
                }
                if (this.slideCount > this.options.maxSlideCount) {
                    $('.slide').get(0).remove();

                    this.slideCount--;
                    this.currentSlide--;
                    this.setCSS(this.getLeft(this.currentSlide));
                }
                if (isCurrent) {
                    this.currentSlide = this.slideCount - 1;
                    this.setCSS(this.getLeft(this.currentSlide))
                }
            } else {
                //this.index(this.getCurrentSlide())
                $(element).css("width", this.options.width);
                $(element).addClass("slide");
                this.$slideTrack.prepend(element);
                this.$slideTrack.css("width", this.options.width * this.slideCount)
                if (this.currentSlide === null) {
                    this.currentSlide = 0;
                } else {
                    this.currentSlide += 1;
                    this.setCSS(this.getLeft(this.currentSlide));
                }

                if (this.slideCount > this.options.maxSlideCount) {
                    $('.slide').get(this.slideCount - 1).remove();
                    this.slideCount--;
                }
                if (isCurrent) {
                    this.currentSlide = 0;
                    this.setCSS(this.getLeft(this.currentSlide))
                }
            }
            //setActive();
        }

        MySlider.prototype.shiftSlide = function (toRight) {
            if (toRight) {
                if (this.currentSlide !== null) {
                    if (this.currentSlide + 1 < this.slideCount) {
                        this.slideHandler(this.currentSlide + 1);
                        return $('.slide').get(this.currentSlide + 1);
                    }
                }
                return null;
            } else {
                if (this.currentSlide !== null) {
                    if (this.currentSlide - 1 >= 0) {
                        this.slideHandler(this.currentSlide - 1);
                        return $('.slide').get(this.currentSlide - 1);
                    }
                }
            }
            return null;
        }

        MySlider.prototype.whichFrom = function (current, right) {
            if (right) {
                return this.slideCount - $('.slide').index(current) - 1;
            } else {
                return $('.slide').index(current);
            }
        }

        MySlider.prototype.getCurrent = function () {
            return $('.slide').get(this.currentSlide);
        }

        $.fn.addSlideLeft = function (content, isCurrent) {
            return this.each(function (index, element) {
                element.slider.addSlide(content, false, isCurrent);
            });
        }

        $.fn.addSlideRight = function (content, isCurrent) {
            return this.each(function (index, element) {
                element.slider.addSlide(content, true, isCurrent);
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

        $.fn.initSlider = function (options) {
            return this.each(function (index, element) {
                element.slider = new MySlider(element, options);
            });
        };

        $.fn.destroySlider = function () {
            return this.each(function (index, element) {
                if (element.slider) {
                    element.slider.destroy();
                }

            });
        };
    }))