var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'angulartics', 'angulartics.google.analytics']); //, 'angulartics'

myApp.run(function ($templateCache, Storage, storageSupport) {
    Storage.clearStorage();
    if(Storage.isSupported())
    {
        console.log("localStorage is supported!");
        storageSupport = true;
    }
    else
    {
        console.log("localStorage not supported!");
        storageSupport = false;
    }
    $templateCache.put('statistic-content');
    $templateCache.put('visits');
})


myApp.config(['$routeProvider', '$analyticsProvider',
    function ($routeProvider, $analyticsProvider) {
        $routeProvider.
        when('/index', {
            templateUrl: 'views/statistic.html',
            controller: 'OperationalStatisticController'
        }).
        when('/index/:date', {
            templateUrl: 'views/statistic.html',
            controller: 'OperationalStatisticController'
        }).
        when('/chart/:type/:date', {
            templateUrl: 'views/chart.html',
            controller: 'GraphicController'
        }).
        when('/expenditures/:date', {
            templateUrl: 'views/expenditures.html',
            controller: 'ExpendituresController'
        }).
        when('/visits/:date', {
            templateUrl: 'views/visits.html',
            controller: 'VisitsController'
        }).
        when('/visits', {
            templateUrl: 'views/visits.html',
            controller: 'VisitsController'
        }).
        when('/visits-master/:date', {
            templateUrl: 'views/visits-master.html',
            controller: 'VisitsMasterController'
        }).
        when('/visit/:id/:backLink', {
            templateUrl: 'views/visit.html',
            controller: 'VisitController'
        }).
        when('/settings', {
            templateUrl: 'views/settings.html',
            controller: 'SettingsController'
        }).
        when('/authorization', {
            templateUrl: 'views/authorization.html',
            controller: 'AuthentificationController'
        }).
        when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutController'
        }).
        otherwise({
            redirectTo: 'authorization'
        });
    }]);


//(function () {
//    "use strict";

//        console.log = function (msg) {
//            $('#console').append($("<p>", {
//                text: msg
//            }));
//        };
//        console.error = function (msg) {
//            $('#console').append($("<p>", {
//                text: msg
//            }));
//        };

//    }
//$.ui.useInternalRouting = false;
//        document.addEventListener("intel.xdk.device.ready", function () {
//            //lock the application in portrait orientation
//            intel.xdk.device.setRotateOrientation("landscape");
//            intel.xdk.device.setAutoRotate(false);
//
//            //hide splash screen
//            intel.xdk.device.hideSplashScreen();
//        }, false);
//
//
//        function register_event_handlers() {}
//        $(document).ready(register_event_handlers);
//})();