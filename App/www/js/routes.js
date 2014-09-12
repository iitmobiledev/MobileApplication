var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);
var flag = true;

myApp.value('dbSupport', {
    value: false,
});


myApp.run(function ($templateCache, Storage, dbSupport) {
    //    if (flag) {
    $templateCache.put('statistic-content');
    $templateCache.put('visits');
    dbSupport.value = Storage.isSupported();
    //        flag = false;
    //    }
    console.log("Storage support:", dbSupport.value);
});

myApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/index', {
            templateUrl: 'views/statistic.html',
            controller: 'OperationalStatisticController'
        }).
        when('/chart/:type', {
            templateUrl: 'views/chart.html',
            controller: 'GraphicController'
        }).
        when('/expenditures', {
            templateUrl: 'views/expenditures.html',
            controller: 'ExpendituresController'
        }).
        when('/visits', {
            templateUrl: 'views/visits.html',
            controller: 'VisitsController'
        }).
        when('/visits-master/:date', {
            templateUrl: 'views/visits-master.html',
            controller: 'VisitsMasterController'
        }).
        when('/visit/:id', {
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
            templateUrl: 'views/about.html'
        }).
        otherwise({
            redirectTo: 'authorization'
        });
    }]);


(function () {
    "use strict";

    //    console.log = function (msg) {
    //        $('#console').append($("<p>", {
    //            text: msg
    //        }));
    //    };
    //    console.error = function (msg) {
    //        $('#console').append($("<p>", {
    //            text: msg
    //        }));
    //    };

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
})();