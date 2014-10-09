/**
 * @description Контроллер, содержащий данные о визите. Получает данные из пути к странице.
 * @ngdoc controller
 * @ngdoc controller
 * @name myApp.controller:VisitController
 * @requires myApp.service:VisitLoader
 */
myApp.controller('VisitController', function ($scope, $filter, $routeParams, Loader, DateHelper, $rootScope) {
//    var today = new Date();
//    $scope.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    $scope.step = DateHelper.steps.DAY;

    $scope.loading = true;

    var hasData = false;

    $scope.future = true;
    $scope.past = true;

    $rootScope.$on('synchEndVisit', function () {
        console.log('synchEndVisit');
        $scope.needUpdating = true;
    });
    
    $scope.maxSlideCount = 100;

    $scope.getData = function (key, quantity, forward, callback) {
        $scope.loading = true;
        if (hasData) {
            $scope.loading = false;
            return callback(null);
        }
        var date;
        Loader.get("Visit", $routeParams.id, function (obj) {
            if (obj) {
//                console.log(obj);
//                $scope.id = obj.id;
                hasData = true;
                date = new Date(obj.date.getFullYear(), obj.date.getMonth(), obj.date.getDate(), 0, 0, 0);
                $scope.backLink = "#/" + $routeParams.backLink + "/" + date;
                var beginDate = date,
                    endDate = new Date(obj.date.getFullYear(), obj.date.getMonth(), obj.date.getDate(), 23, 59, 59);
                Loader.search("Visit", {
                    dateFrom: beginDate,
                    dateTill: endDate,
                    step: $scope.step
                }, function (data) {
                    console.log(data);
                    $scope.maxSlideCount = data.length + 1;

                    data = $filter('orderBy')(data, 'id', false);
                    
                    $scope.minId = data[0].id;
                    $scope.maxId = data[data.length-1].id;
                    
                    for (var i = 0; i < data.length; i++) {
                        data[i].servList = [];
                        data[i].sum = 0;
                        data[i].client.phone = formatLocal("RU", data[i].client.phone);
                        data[i].client.hasPhone = true;
                        if (data[i].client.phone == ""){
                            data[i].client.hasPhone = false;
                        }
                        for (var j = 0; j < data[i].serviceList.length; j++) {
                            var service = data[i].serviceList[j];
                            data[i].sum += data[i].serviceList[j].cost;
                            var serviceItem = {};
                            serviceItem.description = service.description;
                            serviceItem.hasTime = false;
                            var time = [];
                            if (service.startTime != "") {
                                time.push($filter('date')(service.startTime, "H:mm"));
                                serviceItem.hasTime = true;
                            }
                            if (service.endTime != "") {
                                time.push($filter('date')(service.endTime, "H:mm"));
                                serviceItem.hasTime = true;
                            }
                            serviceItem.time = time.join("-");
                            serviceItem.cost = service.cost;
                            if (service.master.lastName && service.master.firstName) {
                                serviceItem.master = 'Мастер: ' + service.master.lastName + " " + service.master.firstName;
                            }
                            data[i].servList.push(serviceItem);
                        }
                        data[i].balColor = "red";
                        if (data[i].client.balance >= 0) {
                            data[i].balColor = "green";
                        }
                    }
                    $scope.loading = false;
                    callback(data, $routeParams.id);
                });
            }
        });
    };

    $scope.getKey = function (obj) {
        return obj && obj.__primary__;
    };
    
//    $scope.updateDate = function (curScope) {
//        if (curScope.page && curScope.page.id)
//            $scope.id = curScope.page.id;
//    }
//    
//    $scope.$watch("id", function(){
//        $scope.future = false;
//        $scope.past = false;
//        if ($scope.id > $scope.minId)
//            $scope.past = true;
//        if ($scope.id < $scope.maxId)
//            $scope.future = true;
//        console.log('change id');
//    });
    
    
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