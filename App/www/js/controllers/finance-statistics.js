/**
 * @description <p>Контроллер для получения данных о финансовой
 * статистике за сегодня.</p>
 * @ngdoc controller
 * @name myApp.controller:FinanceStatisticsController
 * @requires myApp.service:FinanceStatisticsLoader
 */
myApp.controller('FinanceStatisticsController', function ($scope, FinanceStatisticsLoader) { //контроллер  нижней   плитки
     $scope.FinanceStatistics = FinanceStatisticsLoader();
 });

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