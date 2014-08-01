/**
 * @ngdoc service
 * @description Сервис для загрузки данных о визитах.
 * @name myApp.service:VisitsLoader
 */
myApp.factory('VisitsLoader', function () {
    /**
     *
     * @ngdoc method
     * @name myApp.service:VisitsLoader#getData
     * @methodOf myApp.service:VisitsLoader
     * @description Метод для получения визитом за выбранный день.
     * @param {Date} date Дата, за которую нужно получить список визитов.
     * @returns {Array} Список визитов за нужную дату или [], если
     * визитов за эту дату нет.
     */
    function getData(date) {
        var getedData = getVisits();
        getedData = getedData.filter(function (visit) {
            return (visit.date.toDateString() == date.toDateString());
        });
        if (getedData.length != 0) {
            return getedData.sort(function (a, b) {
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            });
        }
        return [];
    }
    
    
    /**
     *
     * @ngdoc method
     * @name myApp.service:VisitsLoader#getMinDate
     * @methodOf myApp.service:VisitsLoader
     * @description Функция для получения минимальной даты (самой
     * прошлой), за которую есть данные по визитам.
     * @returns {Date} Дата самых ранних данных по визитам.
     */
    function getMinDate() {
        var data = getVisits();
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
     * @name myApp.service:VisitsLoader#getMaxDate
     * @methodOf myApp.service:VisitsLoader
     * @description Функция для получения максимальной даты (самой
     * будущей), за которую есть данные по визитам.
     * @returns {Date} Дата, за которую внесены максимально будущие
     * данные по визитам.
     */
    function getMaxDate() {
        var data = getVisits();
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


/**
 * @ngdoc service
 * @description Сервис для получения списка мастеров с их визитами за нужную дату.
 * @name myApp.service:MastersPerDayLoader
 * @requires myApp.service:VisitsLoader
 */
myApp.factory('MastersPerDayLoader', function (VisitsLoader) {

    /**
     *
     * @ngdoc method
     * @name myApp.service:MastersPerDayLoader#checkMasterInList
     * @methodOf myApp.service:MastersPerDayLoader
     * @description Проверяет есть ли мастер в списке мастеров.
     * @param {Object} master Объект мастер.
     * @param {Array}  masters Список мастеров.
     * @returns {Null or Number}  Индекс мастера, если он есть в списке,
     * иначе - null.
     */
    function checkMasterInList(master, masters) {
        for (var i = 0; i < masters.length; i++) {
            if (master.id === masters[i].master.id) {
                return i;
            }
        }
        return null;
    }

    function perMaster(master, visit) {
        this.master = master;
        this.visList = [];
        if (visit) {
            this.visList.push(visit);
        }
    }


    /**
     *
     * @ngdoc method
     * @name myApp.service:MastersPerDayLoader#getAllMastersPerDay
     * @methodOf myApp.service:MastersPerDayLoader
     * @description Метод для получения списка, отсортированных по фамилии мастера объектов `perMaster`.
     * @param {Date} neededData  Дата, за которую требуется получить список объектов.
     * @returns {Array} allMasters Список отсортированных по фамилии мастера объектов `perMaster`.
     */
    function getAllMastersPerDay(neededDate) {
        var getedData = VisitsLoader.getData(neededDate);
        var allMasters = [];
        for (var i = 0; i < getedData.length; i++) {
            for (var j = 0; j < getedData[i].serviceList.length; j++) {
                var usl = checkMasterInList(getedData[i].serviceList[j].master, allMasters);
                if (usl !== null) {
                    allMasters[usl].visList.push(getedData[i]);
                } else {
                    allMasters.push(new perMaster(getedData[i].serviceList[j].master, getedData[i]));
                }
            }
        }

        allMasters = allMasters.sort(function (a, b) {
            if (a.master.lastName.toLowerCase() < b.master.lastName.toLowerCase())
                return -1;
            if (nameA = a.master.lastName.toLowerCase() > b.master.lastName.toLowerCase())
                return 1;
            return 0;
        });
        return allMasters;
    }

    return {
        getAllMastersPerDay: getAllMastersPerDay
    };
});


/**
 * @ngdoc service
 * @description Сервис для получения визита по указанному id
 * @name myApp.service:VisitLoader
 * @param {Number} neededID Идентификатор визита.
 * @returns {Visit} Объект "Визит" или null, если такой id не был найден.
 */
myApp.factory('VisitLoader', function () {
    return function (neededID) {
        var getedData = getVisits();
        getedData = getedData.filter(function (visit) {
            return (visit.id == neededID);
        });
        if (getedData.length == 1)
            return getedData[0];
        else
            return null;
    };
});