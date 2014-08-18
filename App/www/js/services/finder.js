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