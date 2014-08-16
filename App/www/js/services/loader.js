myApp.service("Loader", ["$http", "OperationalStatisticsData", "GetOpStatObjects", "VisitsData", "GetVisitsObjects", "DateHelper", "GetVisitObjects", "Storage", "ExpendituresData", "GetExpendituresObjects",
    function ($http, OperationalStatisticsData, GetOpStatObjects, VisitsData, GetVisitsObjects, DateHelper, GetVisitObjects, Storage, ExpendituresData, GetExpendituresObjects) {
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
                    },
                    "Expenditures": {
                        getData: ExpendituresData,
                        getObjects: GetExpendituresObjects
                    }
                };
                //получили нужные данные
                //преобразовали их в объекты
                var data = [];
                if (primaryKey.dateFrom && primaryKey.dateTill) {
                    data = classes[modelClass].getData.forPeriod(primaryKey.dateFrom, primaryKey.dateTill, primaryKey.step);
                } else {
                    data = classes[modelClass].getData.byID(primaryKey.id);
                }
                var objs = classes[modelClass].getObjects(data);
                for (var i in objs) {
                    Storage.update(objs[i]);
                }
                callback(objs);

                //тут должна быть запись в хранилище
                //вместо return
                //                return objs;

                //callback(statObjs);
            },
            search: function (className, primaryKey, callback) {
                //пытаемся найти объект в хранилище
                // если не нашли,то вызываем get()
                //снова обращается к хранилище, 
                //если данных вновь нет, то
                // возвращаем null
                //                var pk = [];
                //                for (var i in primaryKey) {
                //                    pk.push(primaryKey[i]);
                //                }
                var loader = this;
                Storage.open();
                Storage.get(className, primaryKey, function (data) {
                    if (data == null) {
                        loader.get(className, primaryKey, callback);
                    } else
                        callback(objs);
                });
            }
        }
            }]);