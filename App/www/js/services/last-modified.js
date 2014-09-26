myApp.factory('LastModified', function (Model) {
    var lastModified = Model("LastModified", {
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
    return lastModified;
});