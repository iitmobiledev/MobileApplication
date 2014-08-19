/**
 * @ngdoc service
 * @description Сервис для отправки запросов в loader по пораметрам
 * @name myApp.service:Finder
 */
myApp.factory('Finder', function (Loader) {

    var getPerDates = function (date1, date2, step, indexName, className, callback) {
        var periodObj = {
            dateFrom: new Date(date1),
            dateTill: new Date(date2),
            step: step,
            index: indexName
        }
        Loader.search(className, periodObj, callback);
    }
    return {
        getPerDates: getPerDates,
    };
});



//$scope.getData = function (date, forward, count) {
//    if (!date)
//        date = $scope.date;
//    var beginDate = date,
//        endDate = date;
//    if (!$scope.hasPrevData(date) || !$scope.hasFutureData(date))
//        return resultArr;
//
//    for (var i = 0; i < count; i++) {
//        if (forward) {
//            endDate = DateHelper.getNextPeriod(endDate, $scope.step).end;
//            if (!$scope.hasFutureData(date))
//                break;
//        } else {
//            beginDate = DateHelper.getPrevPeriod(beginDate, $scope.step).end;
//            if (!$scope.hasPrevData(date))
//                break;
//        }
//    }
//
//    Finder.getPerDates(beginDate, endDate, $scope.step, "date", "OperationalStatistics", function (data) {
//        //        return data;
//    });
//
//};