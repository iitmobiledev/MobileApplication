myApp.
value('APPID', "test").
value('SECRET_PHRASE', "WatchThatStupidLeech").
value('VERSION', "1.0").
value('ClassesLastModified', function () {
    this.primary = "primary";
    this.OperationalStatistics = null;
    this.Visit = null;
    this.Expenditure = null;
}).
value('ClassesFieldStat', function () {
    this.primary = "primary";
    this.OperationalStatistics = {
        date: {
            min: null,
            max: null
        }
    };
    this.Visit = {
        date: {
            min: null,
            max: null
        }
    };
    this.Expenditure = {
        date: {
            min: null,
            max: null
        }
    };
}).
value('fieldStatQuery', [{
    type: "OperationalStatistics",
    field: "date"
    }, {
    type: "Visit",
    field: "date"
    }, {
    type: "Expenditure",
    field: "date"
}]);