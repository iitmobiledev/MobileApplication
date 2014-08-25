myApp.service("ModelConverter", ["OperationalStatistics", "Visit", "Expenditures",
    function (OperationalStatistics, Visit, Expenditures) {
        var classes = {
            "OperationalStatistics": OperationalStatistics,
            "Visits": Visit,
            "Visit": Visit,
            "Expenditures": Expenditures
        };
        return {
            getObjects: function (className, dataArray) {
                var modelObjs = [];
                for (var i = 0; i < dataArray.length; i++){
                    if (dataArray[i] instanceof Array){
                        var objs = [];
                        for (var j = 0; j < dataArray[i].length; j++){
                            objs.push(new classes[className](dataArray[i][j]));
                        }
                        modelObjs.push(objs);
                    }
                    else
                        modelObjs.push(new classes[className](dataArray[i]));}
                return modelObjs;
            },
            getObject: function (className, data) {
                return new classes[className](data);
            }
        }
}]);