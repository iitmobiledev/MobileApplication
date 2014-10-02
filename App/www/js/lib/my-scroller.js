(function (factory) {
        'use strict';
        if (typeof define === 'function' && define.amd) {
            define(['jquery'], factory);
        } else {
            factory(jQuery);
        }

    }
    (function ($) {
        var MyScroller = window.MyScroller || {};

        MyScroller = //(function () {
        function MyScroller(element, settings) {
            this.defaults = {
                height: null
            };

            this.initials = {
                swipe: false,
                curX: null,
                curY: null,
                startX: null,
                startY: null,
                minSwipe: null,
                swipeLength: null,
                swipeTop: 0,
                scrollerEnable: true,
                verticalSwipe: false,
                scrollerHeight: null
            };

            $.extend(this, this.initials);

            this.options = $.extend({}, this.defaults, settings);

            this.$scroller = $(element);
            
//            console.log("this.scrollerHeight", this.$scroller, this.scrollerHeight)

            this.swipeHandler = $.proxy(this.swipeHandler, this);

            this.initEvents();

        }
        //});
        
        MyScroller.prototype.getScrollerHeight = function(){
            if (!this.scrollerHeight){
                this.scrollerHeight = this.$scroller.height();
            }
            return this.scrollerHeight;
        }

        MyScroller.prototype.initEvents = function () {
            //            this.$scroller.on('click', function(event){
            //                if (this.verticalSwipe){
            //                    event.stopImmediatePropagation();
            //                    event.stopPropagation();
            //                    event.preventDefault();
            ////                    $(event.target).off('click');
            //                }
            //            })
            this.$scroller.on('touchstart mousedown', {
                action: 'start'
            }, this.swipeHandler);
            this.$scroller.on('touchmove mousemove', {
                action: 'move'
            }, this.swipeHandler);
            this.$scroller.on('touchend mouseup', {
                action: 'end'
            }, this.swipeHandler);
            this.$scroller.on('touchcancel mouseleave', {
                action: 'end'
            }, this.swipeHandler);
            this.$scroller.on('touchleave', {
                action: 'end'
            }, this.swipeHandler);
        };

        MyScroller.prototype.swipeHandler = function (event) {
            if (!this.scrollerEnable) {
                //console.log("DISABLED!");
                return;
            }
            this.minSwipe = 20 //this.options.width / 20; //touchThreshold;
            switch (event.data.action) {
            case 'start':
                if (!this.swipe) {
                    this.swipe = true;
                    this.swipeStart(event);
                }
                break;

            case 'move':
                if (this.swipe) {
                    this.swipeMove(event);
                }
                break;

            case 'end':
                if (this.swipe) {
                    this.swipe = false;
                    //                    console.log("swipeEnd")
                    this.swipeEnd(event);
                }
                break;
            }

        };

        MyScroller.prototype.swipeStart = function (event) {
            var touches;
            if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
                touches = event.originalEvent.touches[0];
            }

            this.startY = touches !== undefined ? touches.pageY : event.clientY;
            this.distanceFromTop = this.getTop();
        };

        MyScroller.prototype.swipeMove = function (event) {
            var curLeft,
                positionOffset,
                touches;

            touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;


            if (touches && touches.length !== 1) {
                return false;
            }

            this.curY = touches !== undefined ? touches[0].pageY : event.clientY;

            this.swipeLength = this.curY - this.startY;




            if (Math.abs(this.swipeLength) > 20) {
                this.verticalSwipe = true;
                //                if (this.distanceFromTop)
                //                    this.distanceFromTop = this.getTop();
            }

            if (this.verticalSwipe) {
                event.preventDefault();
                event.stopPropagation();

                this.swipeTop = this.distanceFromTop + this.swipeLength;

                
                if (this.swipeTop < this.options.height - this.getScrollerHeight()){
                    this.swipeTop = this.options.height - this.getScrollerHeight();
                }
                if (this.swipeTop > 0) {
                    this.swipeTop = 0;
                }

                this.setTranslatePosition(this.swipeTop);
            }
        };

        MyScroller.prototype.setTranslatePosition = function (position) {
            //            console.log(this)
            this.$scroller.css({
                'top': position + 'px'
            });
        };

        MyScroller.prototype.getTop = function (position) {
            return Number((this.$scroller.css("top") || 0).replace(/[^0-9-]/g, ""));
        }

        MyScroller.prototype.swipeEnd = function (event) {
            //console.log("swipeENDvertical")
            this.verticalSwipe = false;
            if (this.curY === undefined) {
                return false;
            }

            if (Math.abs(this.swipeLength) >= this.minSwipe) {
                $(event.target).on('click', function (event) {
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                    event.preventDefault();
                    $(event.target).off('click');
                });
            } else {
                if (this.startY !== this.curY) {
                    // this.slideHandler(this.currentSlide);
                    this.startX = null;
                    this.startY = null;
                }
            }


        };

        MyScroller.prototype.scrollTop = function (position) {
            this.swipeTop = 0;
            this.setTranslatePosition(this.swipeTop);
        };

        $.fn.scroller = function (settings) {
            return this.each(function (index, element) {
                element.scroller = new MyScroller(element, settings);

            });
        };

        $.fn.scrollerEnable = function () {
            return this.each(function (index, element) {
                //console.log("ENABLED")
                element.scroller.scrollerEnable = true;
            });
        };

        $.fn.scrollerDisable = function () {
            return this.each(function (index, element) {
                element.scroller.scrollerEnable = false;
            });
        };

        $.fn.scrollerRewind = function () {
            return this.each(function (index, element) {
                element.scroller.scrollTop();
            });
        };
    }));