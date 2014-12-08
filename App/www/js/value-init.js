myApp.
value('APPID', "mobile").
value('SECRET_PHRASE', "Here goes the mobile version").
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
myApp.regional= 'RU';
myApp.currency = function(plain){
    var csign = myApp.currencySign[myApp.regional];
    console.log("CURRENCY", plain, myApp.regional);
    if (plain && myApp.currencyPlain && myApp.currencyPlain[myApp.regional]){
        csign = myApp.currencyPlain[myApp.regional];        
    }
    if (!csign){
        return 'Р';
    }
    return csign;
}
myApp.currencyPlain = {
    'RU': 'Р',
    'RU_UA': 'Р',
};
myApp.currencySign = {
    'RU': 'ю',
    'BY': 'б.р.',
    'MD': 'lei',
    'UA': 'грн.',
    'RU_UA': 'ю',
    'KZ':  'тнг',
    'LV': '€',
    'AZ': 'ман.'
};
