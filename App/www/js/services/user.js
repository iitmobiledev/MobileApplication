/**
 * @ngdoc service
 * @description Сервис для аутентификации пользователя.
 * @name myApp.service:UserAuthentification
 * @param {String} login Логин пользователя.
 * @param {String} password Пароль пользователя.
 * @returns {String} Токен зарегистрированного пользователя.
 * @requires $http
 */
myApp.factory('UserAuthentification', function ($http) {
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
            callback(data.token);
        });
    };
});


/**
 * @ngdoc service
 * @description Сервис для получения текущего аутентифицированного 
 * пользователя.
 * @name myApp.service:UserLoader
 * @returns {UserInfo} Информация о пользователе.
 */
myApp.factory('UserLoader', function ($http) {
    return function (token, callback) {
        $http({
            method: 'POST',
            url: 'http://auth.test.arnica.pro/rest/getUserInfo',
            data: {
                v: '1.0',
                appID: 'test',
                rand: '12',
                sign: hex_md5(hex_md5('appidtestrand12v1.0test') + 'getUserInfo' + 'WatchThatStupidLeech'),
                token: token
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
 * @description Сервис для выхода пользователя из системы.
 * @name myApp.service:UserLogout
 * @param {Token} token Токен аутентифицированного пользователя.
 */
myApp.factory('UserLogout', function ($http) {
    return function (token, callback) {
        $http({
            method: 'POST',
            url: 'http://auth.test.arnica.pro/rest/logout',
            data: {
                v: '1.0',
                appID: 'test',
                rand: '13',
                sign: hex_md5(hex_md5('appidtestrand12v1.0test') + 'logout' + 'WatchThatStupidLeech'),
                token: token
            },
            responseType: 'json'
        }).
        success(function () {
            callback();
        });
    };
});