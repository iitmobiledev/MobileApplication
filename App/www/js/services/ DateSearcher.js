/**
 * @ngdoc service
 * @description Сервис, который занимается:1. Индексированием дат;2. Построением запроса по датам (больше меньше)
 * @name myApp.service:Finder
 */
myApp.factory('DateSearcher', function (Loader) {


    var initializeDb = function (className, dbHandle) {

    }

    var applySearch = function (className, params, queryHandle) {

    }

    return {
        getPerDates: getPerDates,
    };
});