(function (factory) {
        'use strict';
        if (typeof define === 'function' && define.amd) {
            define(['jquery'], factory);
        } else {
            factory(jQuery);
        }

    }
    (function ($) {
        var MyScrollBar = window.MyScrollBar || {};

        MyScrollBar = (function () {
                function MyScrollBar(element, settings) {
                    this.defaults = {
                        width: 5,
                    };

                    this.initials = {
                        posX: null,
                        posY: null,
                        top: null,
                        screenHeight: null,
                        percentOfScroll: null,
                        height: null,
                        width: null,
                    };

                    $.extend(this, this.initials);

                    this.$scrollBar = $(element);
                    this.$sBar = $('<div class="scrollBar"/>').appendTo(this.$scrollBar);
                    this.options = $.extend({}, this.defaults, settings);

                    this.initEvents();
                }
                return MyScrollBar;
            }
            ());


        MyScrollBar.prototype.initEvents = function () {
            this.$scroller.on('scroll start', {
                action: 'scrollStart'
            }, this.scrollHandler);
            this.$scroller.on('scroll end', {
                action: 'scrollEnd'
            }, this.scrollHandler);
        };


        MyScrollBar.prototype.scrollHandler = function (event) {
            switch (event.data.action) {
            case 'scrollStart':
                this.showScrollBar();
                break;

            case 'scrollEnd':
                this.hideScrollBar();
                break;

            }
        };

        MyScrollBar.prototype.setPosition = function (position) {
            this.$sBar.css({
                'top': position + 'px'
            });
        };

        MyScrollBar.prototype.showScrollBar = function () {
            this.show();
            this.setPosition(( /*высота экрана*/ -this.height) * this.percentOfScroll);
        };

        MyScrollBar.prototype.hideScrollBar = function () {
            this.hide();
        };


        $.fn.setPercentOfScroll = function (percent) {
            this.percentOfScroll = percent;
        }

        $.fn.setScreenHeight = function (height) {
            this.screenHeight = height;
        }
        
        $.fn.setScrollBarHeight = function (height) {
            this.height = height;
        }


    }));