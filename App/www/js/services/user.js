/**
 * @ngdoc service
 * @description Сервис для авторизации пользователя.
 * @name myApp.service:UserAuthorization
 * @param {String} login логин пользователя.
 * @param {String} password пароль пользователя.
 * @returns {Token} токен
 */
myApp.factory('UserAuthorization', function ($http) {
    return function (login, password, callback) {
        $http({
            method: 'POST',
            url: 'http://auth.test.arnica.pro/rest/login',
            data: {
                v: '1.0',
                appID: 'test',
                rand: '11',
                sign: hex_md5(hex_md5('appidtestrand11v1.0test') + 'login' + 'WatchThatStupidLeech'),
                email: login,
                password: password
            },
            responseType: 'json'
        }).
        success(function (data, status, headers, config) {
            callback(data);
        });
    };
});


/**
 * @ngdoc service
 * @description Сервис для получения текущего пользователя.
 * @name myApp.service:UserLoader
 * @returns {UserInfo} объект пользователя
 */
myApp.factory('UserLoader', function ($http) {
    return function (token) {
        $http({
            method: 'POST',
            url: 'http://auth.test.arnica.pro/rest/getUserInfo',
            params: {
                token: token
            }
        }).
        success(function (data, status, headers, config) {
            return data;
        }).
        error(function () {
            return null;
        });

        //        var user = getCurrentUser();
        //        return user;
    };
});


/**
 * @ngdoc service
 * @description Сервис для выхода пользователя из системы.
 * @name myApp.service:UserLogout
 * @param {Token} token токен пользователя.
 */
myApp.factory('UserLogout', function ($http) {
    return function (token) {
        $http({
            method: 'POST',
            url: 'http://auth.test.arnica.pro/rest/logout',
            params: {
                token: token
            }
        }).
        success(function (data, status, headers, config) {
            console.log("Пользователь разлогинен.");
        });
    }
});