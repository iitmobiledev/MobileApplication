// Karma configuration
// karma start karma.config.js
//            'js/controllers/operational-statistic-controller.js',
//            'js/controllers/chart-controller.js',
module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'js/lib/angular.js',
            'js/data.js',
            'js/routes.js',
            'js/directives/loadbar.js',
            'js/directives/date-changer.js',
            'js/lib/angular.js',
            'js/lib/angular-mocks.js',
            'js/lib/angular-route.js',
            'js/lib/angular-animate.js',
            'js/lib/angular-carousel.js',
            'js/lib/angular-touch.min.js',
            'js/lib/jquery-1.11.0.min.js',
            'js/lib/jquery.min.js',
            'js/lib/angular.js',
            'js/services/loader.js',
            'js/services/Storage.js',
            'js/services/data.js',
            'js/services/date-helper.js',
            'js/services/finder.js',
            'js/services/model.js',
            'js/services/statistics.js',
            'js/services/finance-statistics.js',
            'js/services/visits-masters.js',
            'js/services/expenditures.js',
            'js/controllers/operational-statistic.js',
            'tests/loader.js',
            'tests/storage.js'
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

        // generate js files from html templates
        preprocessors: {
            'date-navigation.html': ['ng-html2js']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        ngHtml2JsPreprocessor: {
            //            // strip this from the file path
            //            stripPrefix: 'public/',
            //            // prepend this to the
            //            prependPrefix: 'served/',
            //
            //            // or define a custom transform function
            //            cacheIdFromPath: function (filepath) {
            //                return cacheId;
            //            },

            // setting this option will create only a single module that contains templates
            // from all the files, so you can load them all with module('foo')
            //moduleName: 'tmplts'
        },


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};