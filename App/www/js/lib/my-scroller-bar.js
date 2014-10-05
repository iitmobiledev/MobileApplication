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
                function MyScrollerBar(element, settings) {}
                return MyScrollerBar;
            }
            ());

    }));