////Расходы
//function Expenditures(date, expenditureList) {
//    this.date = date; //дата, за которые получаем расходы
//    this.expenditureList = expenditureList; //список расходов
//}
//
////Статья расходов
//function ExpenditureItem(description, cost) {
//    this.description = description; //описание статьи расходов
//    this.cost = cost; //стоимость
//}

myApp.factory('ExpenditureItem', function (Model) {
    return Model("ExpenditureItem", {
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['description']
    });
});

myApp.factory('Expenditures', function (Model, ExpenditureItem) {
    return Model("Expenditures", {
        deserialize: function (self, data) {
            self.date = data.date;
            var expItems = [];
            for(var i = 0; i < data.expenditureList.length; i++){
                expItems.push(new ExpenditureItem(data.expenditureList));
            }
            self.expenditureList = expItems;
        },
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['date']
    });
});

myApp.factory('GetExpendituresObjects', function (Model, Expenditures) {
    return function (data) {
        var result = [];
        for (var i = 0; i < data.length; i++) {
            result.push(new Expenditures(data[i]));
        }
        return result;
    }
});

///**
// * @ngdoc service
// * @description Сервис для загрузки данных о расходах
// * @name myApp.service:ExpendituresLoader
// */
//myApp.factory('ExpendituresLoader', function () {
//
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:ExpendituresLoader#getData
//     * @methodOf myApp.service:ExpendituresLoader
//     * @description Функция для получения данных о расходах за
//     * определенную дату.
//     * @param {Date} date Дата, за которую будут подгружаться данные.
//     * @returns {Array} Массив из объектов расходов `Expenditures` или [],
//     * если данных за эту дату нет.
//     */
//    function getData(date) {
//        var getedData = getExpenditures();
//        for (var i = 0; i < getedData.length; i++) {
//            if (getedData[i].date.toDateString() == date.toDateString()) {
//                return getedData[i].expenditureList;
//            }
//        }
//        return [];
//    }
//
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:ExpendituresLoader#getMinDate
//     * @methodOf myApp.service:ExpendituresLoader
//     * @description Функция для получения минимальной даты (самой
//     * прошлой), за которую есть данные по расходам.
//     * @returns {Date} Дата самых ранних данных по расходам.
//     */
//    function getMinDate() {
//        var data = getExpenditures();
//        var minDate = new Date();
//        for (var i = 0; i < data.length; i++) {
//            if (data[i].date < minDate)
//                minDate = new Date(data[i].date.getFullYear(), data[i].date.getMonth(), data[i].date.getDate());
//        }
//        return minDate;
//    }
//
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:ExpendituresLoader#getMaxDate
//     * @methodOf myApp.service:ExpendituresLoader
//     * @description Функция для получения максимальной даты (самой
//     * будущей), за которую есть данные по расходам.
//     * @returns {Date} Дата, за которую внесены максимально будущие
//     * данные по расходам.
//     */
//    function getMaxDate() {
//        var data = getExpenditures();
//        var maxDate = new Date();
//        for (var i = 0; i < data.length; i++) {
//            if (data[i].date > maxDate)
//                maxDate = new Date(data[i].date.getFullYear(), data[i].date.getMonth(), data[i].date.getDate());
//        }
//        return maxDate;
//    }
//
//
//    return {
//        getData: getData,
//        getMinDate: getMinDate,
//        getMaxDate: getMaxDate
//    };
//});