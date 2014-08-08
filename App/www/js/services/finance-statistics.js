myApp.factory('FinanceStatistics', function (Model, DateHelper) {
    return Model("FinanceStatistics", {
        deserialize: function (self, data) {
            Object.defineProperty(self, "date", {
                value: new Date(data.date),
                writable: true
            });
            Object.defineProperty(self, "tillMoney", {
                value: data.tillMoney,
                writable: true
            });
            Object.defineProperty(self, "morningMoney", {
                value: data.morningMoney,
                writable: true
            });
            Object.defineProperty(self, "credit", {
                value: data.credit,
                writable: true
            });
            Object.defineProperty(self, "debit", {
                value: data.debit,
                writable: true
            });
        },
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['date']
    });
});