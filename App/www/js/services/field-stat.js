myApp.factory('FieldStat', function (Model) {
    var fieldStat = Model("FieldStat", {
        deserialize: function (self, data) {
            angular.extend(self, data);
            self.primary = 'primary';
        },
        serialize: function (self) {
            self.constructor.prototype.call(self);
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['primary']
    });
    return fieldStat;
});