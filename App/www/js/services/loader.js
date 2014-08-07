myApp.service("Loader", ["$http", function($http){
    return {
        get: function(modelClass, primaryKey, callback){
            //получили нужные данные
            //преобразовали их в объекты
            //записали в хранилище
        },
        search: function(className, primaryKey, callback){
            //пытаемся найти объект в хранилище
            // если не нашли,то вызываем get()
            //снова обращается к хранилище, 
            //если данных вновь нет, то
            // возвращаем null
        }
    }
}]);

//Loader.search("OperationalStatistics",{
//            dateFrom: begin,
//            dateTill: end
//        }, function(data){
//        });
