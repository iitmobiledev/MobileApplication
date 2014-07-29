/**
 * @ngdoc service
 * @description Сервис для получения данных о визитах
 * @name myApp.service:VisitsLoader
 * @param {Date} neededDate дата, за которую нужно получить список визитов
 * @returns {Array} список визитов за нужную дату
 */
myApp.factory('VisitsLoader', function () {
    return function (neededDate) {
        var getedData = getVisits();
        getedData = getedData.filter(function (visit) {
            return (visit.date.toDateString() == neededDate.toDateString());
        });
        if (getedData.length != 0) {
            return getedData.sort(function (a, b) {
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            });
        }
        return [];
    };
});



/**
 * @ngdoc service
 * @description Сервис для получения списка мастеров с их визитами за нужную дату
 * @name myApp.service:MastersPerDayLoader
 * @param {Date} neededDate Дата, за которую нужно получить список мастеров с их визитами
 * @param {Service} VisitsLoader Сервис для загрузки списка визитов
 * @returns {method}  getAllMastersPerDay Метод для получения  списка отсортированных по фамилии мастера объектов perMaster
 */
myApp.factory('MastersPerDayLoader', function () {

    /**
     *
     * @ngdoc method
     * @name myApp.service:MastersPerDayLoader#checkMasterInList
     * @methodOf myApp.service:MastersPerDayLoader
     * @description Проверяет есть ли мастер в списке мастеров
     * @param {String} master Объект мастер
     * @param {Array}  masters Список мастеров
     * @returns {Null or Number}  Индекс мастера, если он есть в списке; null если нет.
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
     * @description Метод для получения списка отсортированных по фамилии мастера объектов perMaster
     * @param {Date} neededData  Дата, за которую требуется получить список объектов
     * @param {Service} VisitsLoader  Сервис для загрузки списка визитов
     * @returns {Array} allMasters Список отсортированных по фамилии мастера объектов perMaster
     */
    function getAllMastersPerDay(neededDate, VisitsLoader) {
        var getedData = VisitsLoader(neededDate);
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
 * @param {Number} neededID id визита
 * @returns {Visit} объект "Визит"
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
