/**
 * @ngdoc service
 * @description Сервис для отправки запросов в loader по пораметрам
 * @name myApp.service:Finder
 */
myApp.factory('Finder', function (Loader) {

    var getPerDates = function (date1, date2, className, callback) {
        var periodObj = {
            dateFrom: date1,
            dateTill: date2
        }
        Loader.search(className, periodObj, callback);
    }
    return {
        getPerDates: getPerDates,
    };
});