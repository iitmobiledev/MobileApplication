myApp.factory('UserToken', function (Model) {
    var user = Model("UserToken", {
        deserialize: function (self, data) {
            angular.extend(self, data);
            self.primary = 'primary';
        },
        primary: ['primary'],
        indexes: ['primary']
    });

    user.onUpdate = function (obj) {}
    return user;
});