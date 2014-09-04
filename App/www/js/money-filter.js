/**
 * @ngdoc filter
 * @description Фильтр для округления и вставки пробелов в разряды
 * @name myApp.filter:money
 */
myApp.filter('money', ['$filter', '$locale',
    function (filter, locale) {
        var filter = filter('number');
        var formats = locale.NUMBER_FORMATS;
        return function (amount, num, currencySymbol) {
            if (num === 0)
                num = -1;
            var value = filter(amount);
            var sep = value.indexOf(formats.DECIMAL_SEP);
            return value.substring(0, sep).replace(/,/g, " ");
        };
}]);