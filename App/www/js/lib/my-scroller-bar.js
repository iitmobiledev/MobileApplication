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
            this.$scroller.on('scroll down', {
                action: 'scrollDown'
            }, this.scrollHandler);
            this.$scroller.on('scroll up', {
                action: 'scrollUp'
            }, this.scrollHandler);
        };


        MyScrollBar.prototype.scrollHandler = function (event) {
            switch (event.data.action) {
            case 'scrollDown':
                //вычислять top=(высота экрана- this.height)*this.percentOfScroll
                this.setPosition(( /*высота экрана*/ -this.height) * this.percentOfScroll);
                break;

            case 'scrollUp':
                this.setPosition(( /*высота экрана*/ -this.height) * this.percentOfScroll);
                break;

            }
        };

        MyScrollBar.prototype.setPosition = function (position) {
            this.$sBar.css({
                'top': position + 'px'
            });
        };

    }));