myApp.factory('LastModified', function (Model) {
    var lastModified = Model("LastModified", {
        deserialize: function (self, data) {
            angular.extend(self, data);
            self.primary = 'primary';
        },
        primary: ['primary'],
        indexes: ['primary']
    });
    return lastModified;
});