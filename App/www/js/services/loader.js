myApp.service("Loader", ["$http", "OperationalStatisticsData", "GetOpStatObjects", "VisitsData", "GetVisitsObjects", "DateHelper", "GetVisitObjects",
    function ($http, OperationalStatisticsData, GetOpStatObjects, VisitsData, GetVisitsObjects, DateHelper, GetVisitObjects) {
        return {
            get: function (modelClass, primaryKey, callback) {
                var classes = {
                    "OperationalStatistics": {
                        getData: OperationalStatisticsData,
                        getObjects: GetOpStatObjects
                    },
                    "Visits": {
                        getData: VisitsData,
                        getObjects: GetVisitsObjects
                    },
                    "Visit": {
                        getData: VisitsData,
                        getObjects: GetVisitObjects
                    }
                };
                //получили нужные данные
                //преобразовали их в объекты
                var data = [];
                if (primaryKey.dateFrom && primaryKey.dateTill && primaryKey.step) {
                    data = classes[modelClass].getData.forPeriod(primaryKey.dateFrom, primaryKey.dateTill, primaryKey.step);
                } else {
                    data = classes[modelClass].getData.byID(primaryKey.id);
                }
                var objs = classes[modelClass].getObjects(data);

                //тут должна быть запись в хранилище
                //вместо return
                return objs;

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