var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'angular-carousel', 'ngTouch']);

myApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/index', {
            templateUrl: 'statistic.html',
            controller: 'OperationalStatisticController'
        }).
        when('/chart/:type', {
            templateUrl: 'chart.html',
            controller: 'GraphicController'
        }).
        when('/expenditures', {
            templateUrl: 'expenditures.html',
            controller: 'ExpendituresController'
        }).
        when('/visits', {
            templateUrl: 'visits.html',
            controller: 'VisitsController'
        }).
        when('/visits-master', {
            templateUrl: 'visits-master.html',
            controller: 'VisitsMasterController'
        }).
        when('/visit/:id', {
            templateUrl: 'visit.html',
            controller: 'VisitController'
        }).
        when('/master/:id/:date', {
            templateUrl: 'master.html',
            controller: 'MasterController'
        }).
        when('/settings', {
            templateUrl: 'settings.html',
            controller: 'SettingsController'
        }).
        when('/login', {
            templateUrl: 'login.html',
            controller: 'LoginController'
        }).
        when('/authorization', {
            templateUrl: 'authorization.html',
            controller: 'AuthorizationController'
        }).
        otherwise({
            redirectTo: '/index'
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