myApp.service("Loader", ["$http", "OperationalStatisticsData", "GetOpStatObjects", "DateHelper", function($http, OperationalStatisticsData, GetOpStatObjects, DateHelper){
    return {
        get: function(modelClass, primaryKey, callback){
            //получили нужные данные
            //преобразовали их в объекты
            if (modelClass == "OperationalStatistics"){
                var statData=OperationalStatisticsData(primaryKey.dateFrom, primaryKey.dateTill, primaryKey.step);
                var statObjs = GetOpStatObjects(statData);
                if (statObjs.length == 1 && primaryKey.dateFrom.toDateString() == primaryKey.dateTill.toDateString())
                    statObjs = statObjs[0];
                //тут должна быть запись в хранилище
                //вместо return
                return statObjs;
                
                //callback(statObjs);
            }
            
            
        },
        search: function(className, primaryKey, callback){
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


