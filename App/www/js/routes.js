var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);

myApp.run(function ($templateCache, Storage) {
    $templateCache.put('statistic-content');
    $templateCache.put('visits');
    if (!Storage.checkSupport()) {
        alert("indexedDB not support!");
    }
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
        when('/visits-master', {
            templateUrl: 'views/visits-master.html',
            controller: 'VisitsMasterController'
        }).
        when('/visit/:id', {
            templateUrl: 'views/visit.html',
            controller: 'VisitController'
        }).
        when('/master/:id/:date', {
            templateUrl: 'views/master.html',
            controller: 'MasterController'
        }).
        when('/settings', {
            templateUrl: 'views/settings.html',
            controller: 'SettingsController'
        }).
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        }).
        when('/authorization', {
            templateUrl: 'views/authorization.html',
            controller: 'AuthentificationController'
        }).
        when('/about', {
            templateUrl: 'views/about.html'
        }).
        otherwise({
            redirectTo: 'index'
            //            '/authorization'
        });
    }]);


(function () {
    "use strict";
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