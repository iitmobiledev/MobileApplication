myApp.
value('APPID', "test").
value('SECRET_PHRASE', "WatchThatStupidLeech").
value('VERSION', "1.0").
value('ClassesLastModified', function () {
    this.primary = "primary";
    this.OperationalStatistics = new Date();
    this.Visit = new Date();
    this.Expenditure = new Date();
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
}]).
value('Status', function () {
    this.count = 0;
    this.amount = 0;
}).
value('storageSupport', true);