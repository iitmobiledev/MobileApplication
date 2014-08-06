myApp.service("Loader", ["$http", function($http){
    return {
        get: function(modelClass, primaryKey, callback){
            
        },
        search: function(className, searchAttrs, callback){
            //пытаемся найти объект в хранилище
            // если не нашли,то вызываем get()
            
        }
    }
}]);
