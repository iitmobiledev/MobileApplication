(function (factory) {
        'use strict';
        if (typeof define === 'function' && define.amd) {
            define(['jquery'], factory);
        } else {
            factory(jQuery);
        }

    }
    (function ($) {
        var MyScrollerBar = window.MyScrollerBar || {};

        MyScrollerBar = (function () {
                function MyScrollerBar(element, settings) {
                    this.defaults = {

                    };

                    this.initials = {
                        posX: null,
                        posY: null,
                        top: null,
                        screenHeight: null,
                        percentOfScroll: null,
                        height: null,
                    };

                    $.extend(this, this.initials);

                    this.$scrollerBar = $(element);

                    this.options = $.extend({}, this.defaults, settings);

                    this.initEvents();
                }
                return MyScrollerBar;
            }
            ());


        MyScrollerBar.prototype.initEvents = function () {
            this.$scroller.on('scroll down', {
                action: 'scrollDown'
            }, this.scrollHandler);
            this.$scroller.on('scroll up', {
                action: 'scrollUp'
            }, this.scrollHandler);
        };


        MyScrollerBar.prototype.scrollHandler = function (event) {
            switch (event.data.action) {
            case 'scrollDown':
                break;

            case 'scrollUp':
                break;

            }
        };

        MyScrollerBar.prototype.setTranslatePosition = function (position) {
            this.$scroller.css({
                'top': position + 'px'
            });
        };

    }));