/**
 * @ngdoc service
 * @description Сервис для получения типизированных объектов
 * из данных в формате ключ:значение.
 * @name myApp.service:ModelConverter
 * @requires myApp.service:OperationalStatistics
 * @requires myApp.service:Visit
 * @requires myApp.service:Expenditures
 */
myApp.service("ModelConverter", ["OperationalStatistics", "Visit", "Expenditures",
    function (OperationalStatistics, Visit, Expenditures) {
        var classes = {
            "OperationalStatistics": OperationalStatistics,
            "Visits": Visit,
            "Visit": Visit,
            "Expenditures": Expenditures
        };
        return {
            /**
             * @ngdoc method
             * @name myApp.service:ModelConverter#getObjects
             * @methodOf myApp.service:ModelConverter
             * @param {String} className Класс, к которому будет преобразован массив данных.
             * @param {Array} dataArray Массив данных в формате ключ:значение.
             * @returns {Array} Массив типизированных объектов.
             * @description Метод предназначен для типизирования списка объектов.
             */
            getObjects: function (className, dataArray) {
                var modelObjs = [];
                for (var i = 0; i < dataArray.length; i++) {
                    if (dataArray[i] instanceof Array) {
                        var objs = [];
                        for (var j = 0; j < dataArray[i].length; j++) {
                            objs.push(new classes[className](dataArray[i][j]));
                        }
                        modelObjs.push(objs);
                    } else
                        modelObjs.push(new classes[className](dataArray[i]));
                }
                return modelObjs;
            },
            /**
             * @ngdoc method
             * @name myApp.service:ModelConverter#getObject
             * @methodOf myApp.service:ModelConverter
             * @param {String} className Класс, к которому будут преобразованы данные.
             * @param {Object} data Данные в формате ключ:значение.
             * @returns {Object} Типизированный объект.
             * @description Метод предназначен для типизирования
             * объекта.
             */
            getObject: function (className, data) {
                return new classes[className](data);
            }
        }
}]);