/**
 * @description Контроллер, содержащий данные о визите. Получает данные из пути к странице.
 * @ngdoc controller
 * @ngdoc controller
 * @name myApp.controller:VisitController
 * @requires myApp.service:VisitLoader
 */
myApp.controller('VisitController', function ($scope, $filter, $routeParams, Loader, DateHelper) {

    var today = new Date();
    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    $scope.step = DateHelper.steps.DAY;

    var hasData = false;

    $scope.getData = function (key, quantity, forward, callback) {
        if (hasData) {
            return callback(null);
        }
        Loader.get("Visit", $routeParams.id, function (obj) {
//            console.log("Loader.get ", obj);
            if (obj) {
                hasData = true;
                $scope.date = new Date(obj.date);
                var beginDate = $scope.date,
                    endDate = $scope.date;
                Loader.search("Visit", {
                    dateFrom: beginDate,
                    dateTill: endDate,
                    step: $scope.step
                }, function (data) {

                    data = $filter('orderBy')(data, 'date', false);
//                    console.log('visits ', data);

                    for (var i = 0; i < data.length; i++) {
                        data[i].servList = [];
                        data[i].sum = 0;
                        for (var j = 0; j < data[i].serviceList.length; j++) {
                            var service = data[i].serviceList[j];
                            data[i].sum += data[i].serviceList[j].cost;
                            var serviceItem = {};
                            serviceItem.description = service.description;
                            serviceItem.time = $filter('date')(service.startTime, "H:mm") + " - " + $filter('date')(service.endTime, "H:mm");
                            serviceItem.cost = service.cost;
                            serviceItem.master = 'Мастер: ' + service.master.lastName + " " + service.master.firstName[0];
                            data[i].servList.push(serviceItem);
                        }
                        data[i].balColor = "red";
                        if (data[i].client.balance >= 0) {
                            data[i].balColor = "green";
                        }
                    }

                    callback(data);
                });
            }
        });
    };


    $scope.getKey = function (obj) {
        return obj && obj.date.toDateString();
    };

//    $scope.handlePages = [];
//
//    $scope.getServList = function (visit) {
//        console.log(visit);
//        //
//        //        var newArr = $scope.handlePages.filter(function (elem) {
//        //            return elem.id === visit.id;
//        //        });
//        //        
//        //        console.log('newArr ', newArr);
//        //        
//        //        if (newArr.length > 0 && $scope.servList)
//        //            return;
//        //        console.log('getServList ', visit.serviceList);
//
//        $scope.servList = [];
//        $scope.sum = 0;
//        for (var i = 0; i < visit.serviceList.length; i++) {
//            var service = visit.serviceList[i];
//            $scope.sum += visit.serviceList[i].cost;
//            var serviceItem = {};
//            serviceItem.description = service.description;
//            serviceItem.time = $filter('date')(service.startTime, "H:mm") + " - " + $filter('date')(service.endTime, "H:mm");
//            serviceItem.cost = service.cost;
//            serviceItem.master = 'Мастер: ' + service.master.lastName + " " + service.master.firstName[0];
//            $scope.servList.push(serviceItem);
//        }
//        $scope.balColor = "red";
//        if (visit.client.balance >= 0) {
//            $scope.balColor = "green";
//        }
//
//        //        $scope.handlePages.push(visit);
//    }


    //    $scope.fff = false;
    //    Loader.get("Visit", $routeParams.id, function (data) {
    //        $scope.visit = data;
    //        console.log($scope.visit.status);
    //        $scope.status = $scope.visit.status;
    //        $scope.date = $scope.visit.date;
    //        $scope.clientName = $scope.visit.client.lastName + " " + $scope.visit.client.firstName; // + " " + $scope.visit.client.middleName;
    //        $scope.clientPhoneNumber = $scope.visit.client.phoneNumber;
    //        $scope.comment = $scope.visit.comment;
    //        $scope.balColor = "red";
    //        if ($scope.visit.client.balance >= 0) {
    //            $scope.balColor = "green";
    //        }
    //        $scope.clientBalance = $scope.visit.client.balance;
    //        $scope.clientDiscount = $scope.visit.client.discount + "%"
    //        $scope.paid=$scope.visit.paid;
    //        $scope.servList = [];
    //        $scope.sum = 0;
    //        for (var i = 0; i < $scope.visit.serviceList.length; i++) {
    //            var service = $scope.visit.serviceList[i];
    //            $scope.sum += $scope.visit.serviceList[i].cost;
    //            var serviceItem = {};
    //            serviceItem.description = service.description;
    //            serviceItem.time = $filter('date')(service.startTime, "H:mm") + " - " + $filter('date')(service.endTime, "H:mm");
    //            serviceItem.cost = service.cost;
    //            serviceItem.master = 'Мастер: ' + service.master.lastName + " " + service.master.firstName[0];
    //            $scope.servList.push(serviceItem);
    //        }
    //        $scope.comment = $scope.visit.comment;
    //    });

});