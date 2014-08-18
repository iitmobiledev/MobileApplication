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
                if (primaryKey.dateFrom && primaryKey.dateTill && primaryKey.step) {
                    data = classes[modelClass].getData.forPeriod(primaryKey.dateFrom, primaryKey.dateTill, primaryKey.step);
                } else {
                    data = classes[modelClass].getData.byID(primaryKey.id);
                }
                var objs = classes[modelClass].getObjects(data);
                console.log("objs ", objs);
                for (var i in objs) {
                    Storage.update(objs[i]);
                }
                callback(objs);
            },
            search: function (className, params, callback) {
                //пытаемся найти объект в хранилище
                // если не нашли,то вызываем get()
                //снова обращается к хранилище, 
                //если данных вновь нет, то
                // возвращаем null
                var loader = this;
                console.log("search params in loader:", params);

                Storage.search(className, params, function (data) {
                    console.log("search ", data);

                    if (data == null) { //если в базе ничего не нашли
                        loader.get(className, params, callback);
                    } else {
                        var period = DateHelper.getPeriod(params.dateFrom, params.step);
                        var day = period.begin;
                        var missingDates = [];
                        while (day < params.dateTill || day.toDateString() == params.dateTill.toDateString()) {
                            var hasObject = false;
                            for (var i = 0; i < data.length; i++) {
                                if (day.toDateString() == data[i].date.toDateString())
                                    hasObject = true;
                            }
                            if (!hasObject)
                                missingDates.push(day);
                            period = DateHelper.getNextPeriod(day, params.step);
                            day = period.begin;
                        }

                        var i = 0;
                        while ( i < missingDates.length) {
                            var primary = {
                                dateFrom: missingDates[i],
                                dateTill: DateHelper.getPeriod(missingDates[i], params.step).end,
                                step: params.step,
                                index: params.indexName
                            }
                            loader.get(className, primary, function (misObj) {
                                data = data.concat(misObj);
                                i++;
                            });
                        }
                        data.sort(compareByData);

                        callback(data);
                    }
                });
            }
        }
            }]);


function compareByData(a, b) {
    if (a.date > b.date) return 1;
    if (a.date < b.DATABASE_ERR) return -1;
    return 0;
};