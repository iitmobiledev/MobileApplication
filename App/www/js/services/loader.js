myApp.service("Loader", ["$http", "OperationalStatisticsData", "GetOpStatObjects", "VisitsData", "GetVisitsObjects", "DateHelper", "GetVisitObjects", "Storage", "ExpendituresData", "GetExpendituresObjects",
    function ($http, OperationalStatisticsData, GetOpStatObjects, VisitsData, GetVisitsObjects, DateHelper, GetVisitObjects, Storage, ExpendituresData, GetExpendituresObjects) {
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
        return {
            get: function (modelClass, primaryKey, callback) {

                //получили нужные данные
                //преобразовали их в объекты
                var data = [];
                if (primaryKey.dateFrom && primaryKey.dateTill && primaryKey.step) {
                    data = classes[modelClass].getData.forPeriod(primaryKey.dateFrom, primaryKey.dateTill, primaryKey.step);
                } else {
                    data = classes[modelClass].getData.byID(primaryKey.id);
                }
                var objs = classes[modelClass].getObjects(data);
                //                console.log("objs ", objs);
                for (var i in objs) {
                    if (objs[i] instanceof Array) {
                        for (var j in objs[i])
                            Storage.update(objs[i][j]);
                    } else
                        Storage.update(objs[i]);
                }
                callback(objs);
            },
            search: function (className, params, callback) {
                //                var classes = {
                //                    "OperationalStatistics": GetOpStatObjects
                //                };
                var loader = this;
                //                console.log("search params in loader:", params);

                Storage.search(className, params, function (data) {
                    if (data == null) { //если в базе ничего не нашли
                        loader.get(className, params, callback);
                    } else {
                        var objs = classes[className].getObjects(data);
                        var period = DateHelper.getPeriod(params.dateFrom, params.step);
                        var day = period.begin;
                        var missingDates = [];
                        while (day < params.dateTill || day.toDateString() == params.dateTill.toDateString()) {
                            var hasObject = false;
                            for (var i = 0; i < objs.length; i++) {
                                if (day.toDateString() == objs[i].date.toDateString())
                                    hasObject = true;
                            }
                            if (!hasObject)
                                missingDates.push(day);
                            period = DateHelper.getNextPeriod(day, params.step);
                            day = period.begin;
                        }

                        var i = 0;
                        while (i < missingDates.length) {
                            var primary = {
                                dateFrom: missingDates[i],
                                dateTill: DateHelper.getPeriod(missingDates[i], params.step).end,
                                step: params.step,
                                index: params.indexName
                            }
                            loader.get(className, primary, function (misObj) {
                                objs = objs.concat(misObj);
                                i++;
                            });
                        }
                        objs.sort(compareByDate);

                        callback(objs);
                    }
                });
            }
        }
            }]);


function compareByDate(a, b) {
    if (a.date > b.date) return 1;
    if (a.date < b.date) return -1;
    return 0;
};