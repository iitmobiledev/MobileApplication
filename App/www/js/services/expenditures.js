/**
 * @ngdoc service
 * @description Сервис для загрузки данных о расходах
 * @name myApp.service:ExpendituresLoader
 */
myApp.factory('ExpendituresLoader', function () {

    /**
     *
     * @ngdoc method
     * @name myApp.service:ExpendituresLoader#getData
     * @methodOf myApp.service:ExpendituresLoader
     * @description Функция для получения данных о расходах за
     * определенную дату.
     * @param {Date} date дата, за которую будут подгружаться данные.
     * @returns {Expenditures} объект расходов или [], если данных за
     * эту дату нет.
     */
    function getData(date) {
        var getedData = getExpenditures();
        for (var i = 0; i < getedData.length; i++) {
            if (getedData[i].date.toDateString() == date.toDateString()) {
                return getedData[i].expenditureList;
            }
        }
        return [];
    }

    /**
     *
     * @ngdoc method
     * @name myApp.service:ExpendituresLoader#getMinDate
     * @methodOf myApp.service:ExpendituresLoader
     * @description Функция для получения минимальной даты (самой
     * прошлой), за которую есть данные по расходам.
     * @returns {Date} дата самых ранних данных по расходам.
     */
    function getMinDate() {
        var data = getExpenditures();
        var minDate = new Date();
        for (var i = 0; i < data.length; i++) {
            if (data[i].date < minDate)
                minDate = new Date(data[i].date.getFullYear(), data[i].date.getMonth(), data[i].date.getDate());
        }
        return minDate;
    }

    /**
     *
     * @ngdoc method
     * @name myApp.service:ExpendituresLoader#getMaxDate
     * @methodOf myApp.service:ExpendituresLoader
     * @description Функция для получения максимальной даты (самой
     * будущей), за которую есть данные по расходам.
     * @returns {Date} дата, за которую внесены максимально будущие
     * данные по расходам.
     */
    function getMaxDate() {
        var data = getExpenditures();
        var maxDate = new Date();
        for (var i = 0; i < data.length; i++) {
            if (data[i].date > maxDate)
                maxDate = new Date(data[i].date.getFullYear(), data[i].date.getMonth(), data[i].date.getDate());
        }
        return maxDate;
    }


    return {
        getData: getData,
        getMinDate: getMinDate,
        getMaxDate: getMaxDate
    };
});