myApp.service("authService", ["$http", "APPID", "SECRET_PHRASE", "VERSION", "AUTH_URL",
    function ($http, APPID, SECRET_PHRASE, VERSION, AUTH_URL) {
        var randomString = function (len, chars) {
            chars = chars || "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            len = len || 20;
            var res = [];
            for (var i = 0; i < len; i++) {
                res.push(chars.charAt(Math.random() * chars.length));
            }
            return res.join("");
        }
        var flatObject = function (params) {
            var items = [];
            for (var i in params) {
                if (!params.hasOwnProperty(i)) {
                    continue;
                }
                items.push([i, params[i]]);
            }
            items.sort(function (a, b) {
                if (a[0] < b[0]) {
                    return -1;
                }
                if (a[0] > b[0]) {
                    return 1;
                }
                return 0;
            });
            for (var i = 0; i < items.length; i++) {
                items[i] = items[i].join("");
            }
            return items.join("").toLowerCase();
        }
        var sign = function (method, params) {
            params.appID = params.appID || APPID;
            params.v = VERSION;
            params.rand = randomString();
            var flat = flatObject(params);
            params.sign = hex_md5(
                hex_md5(flat + params.appID) + method + SECRET_PHRASE
            );
            //console.log("SIGNATURE:", params.sign,"= md5(md5(",flat, ".", params.appID,").",method, ".",SECRET_PHRASE,")");
        }

        return {
            login: function (login, password, callback) {
                var params = {
                    email: login || "",
                    password: password || ""
                };
                sign("login", params);
                $http({
                    method: 'POST',
                    url: AUTH_URL + 'login',
                    data: params,
                    responseType: 'json'
                }).
                success(function (data, status, headers, config) {
                    callback(data.token);
                }).
                error(function () {
                    callback('error');
                });
            },
            logout: function (token, callback) {
                params = {
                    token: token || ""
                };
                sign("logout", params);
                $http({
                    method: 'POST',
                    url: AUTH_URL + 'logout',
                    data: params,
                    responseType: 'json'
                }).
                success(function () {
                    callback();
                });
            },
            getUserInfo: function (token, callback) {
                var params = {
                    token: token || ""
                };
                sign("getUserInfo", params);
                $http({
                    method: 'POST',
                    url: AUTH_URL + 'getUserInfo',
                    data: params,
                    responseType: 'json'
                }).
                success(function (data, status, headers, config) {
                    callback(data);
                });
            },
            getToken: function () {}
        }
}]);