myApp.
value('APPID', "test").
value('SECRET_PHRASE', "WatchThatStupidLeech").
value('SYNC_TIMEOUT', 120000). // two minutes timeout for update
value('VERSION', "1.0").
value("DATA_URL", "http://app.arnica.pro/api/data/").
value("AUTH_URL", "http://auth.arnica.pro/rest/").
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
}]).
value('Status', function () {
    this.count = 0;
    this.amount = 0;
}).
value('storageSupport', true);