var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'angular-carousel', 'ngTouch']);

myApp.run(function (Storage) {
    if (Storage.checkSupport()) {
        var master = new Master(1, "Петр", "Михайлович", "Яковлев");
        var serviceList = [];
        var client = new Client("Марина", "Андреевна", "Иванова", "+79227062050", 2000, 0);
        serviceList.push(new Service("Мелирование", new Date(2014, 6, 20, 15, 00), new Date(2014, 6, 20, 16, 00), master, 2000));
        var visit = new Visit(3, client, serviceList, "Очень плохие волосы", new Date(2014, 6, 20, 16, 00), "Клиент опаздывает");
        Storage.update(visit);
        Storage.get("visit", 3);
        Storage.del("3");
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