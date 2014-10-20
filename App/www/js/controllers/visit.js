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

    $scope.listID;

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

                    data = $filter('orderBy')(data, 'startTime', false);
                    $scope.minTime = data[0].startTime;
                    $scope.maxTime = data[data.length - 1].startTime;

                    for (var i = 0; i < data.length; i++) {
                        data[i].visitTime = $filter('date')(data[i].startTime, "H:mm");
                        data[i].servList = [];
                        data[i].sum = 0;
                        data[i].client.phone = formatLocal("RU", data[i].client.phone);
                        data[i].client.hasPhone = true;
                        if (data[i].client.phone == "") {
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
                    setListID(data);
                    callback(data, $routeParams.id);
                });
            }
        });
    };

    function setListID(data) {
        $scope.listID = [];
        for (var i = 0; i < data.length; i++) {
            $scope.listID.push($scope.getKey(data[i]));
        }
    }

    $scope.getKey = function (obj) {
        return obj && obj.__primary__;
    };

    $scope.hasFutureData = function (obj) {
        if (!obj && listID.length > 1)
            return false;
        return $scope.listID.indexOf($scope.getKey(obj)) < $scope.listID.length - 1;
    }

    $scope.hasPastData = function (obj) {
        if (!obj && listID.length > 1)
            return false;
        return $scope.listID.indexOf($scope.getKey(obj)) > 0;
    }

});