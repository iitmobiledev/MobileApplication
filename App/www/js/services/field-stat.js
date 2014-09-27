myApp.factory('FieldStat', function (Model) {
    var fieldStat = Model("FieldStat", {
        deserialize: function (self, data) {
            angular.extend(self, data);
            self.primary = 'primary';
        },
        primary: ['primary']
    });
    return fieldStat;
});