myApp.service("Loader", ["$http", "OperationalStatisticsData", "GetOpStatObjects",  "VisitsData", "GetVisitsObjects", "DateHelper",
    function ($http, OperationalStatisticsData, GetOpStatObjects, VisitsData, GetVisitsObjects, DateHelper) {
        return {
            get: function (modelClass, primaryKey, callback) {
                var classes = {
                    "OperationalStatistics": {getData: OperationalStatisticsData,
                                             getObjects: GetOpStatObjects},
                    "Visit": {getData: VisitsData,
                              getObjects: GetVisitsObjects}
                };
                //получили нужные данные
                //преобразовали их в объекты
                var statData = classes[modelClass].getData(primaryKey.dateFrom, primaryKey.dateTill, primaryKey.step);
                var statObjs = classes[modelClass].getObjects(statData);

                //тут должна быть запись в хранилище
                //вместо return
                return statObjs;

                //callback(statObjs);
            },
            search: function (className, primaryKey, callback) {
                //пытаемся найти объект в хранилище
                // если не нашли,то вызываем get()
                //снова обращается к хранилище, 
                //если данных вновь нет, то
                // возвращаем null
                var objs = this.get(className, primaryKey);
                callback(objs);
            }
        }
}]);