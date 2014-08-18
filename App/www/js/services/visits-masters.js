myApp.factory('Client', function (Model) {
    return Model("Client", {
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['firstName', 'middleName', 'lastName']
    });
});

myApp.factory('Master', function (Model) {
    return Model("Master", {
        //        deserialize: function (self, data) {
        //            console.log("parent ", parent);
        //            Parent.call(self, data)
        //            self.id = data.id;
        //            self.firstName = data.firstName;
        //            self.middleName = data.middleName;
        //            self.lastName = data.lastName;
        //        },
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['firstName', 'middleName', 'lastName']
    });
});


myApp.factory('Service', function (Model, Master) {
    return Model("Service", {
        deserialize: function (self, data) {
            self.description = data.description;
            self.startTime = data.startTime;
            self.endTime = data.endTime;
            self.master = new Master(data.master);
            self.cost = data.cost;
            self.employeeSalary = data.employeeSalary;
        },
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['description']
    });
});



myApp.factory('Visit', function (Model, Client, Service) {

    var statuses = {
        titles: {
            NEW: "Новая запись",
            NOTCOME: "Клиент не пришел",
            COME: "Клиент пришел",
            CONFIRMED: "Подтверждена"
        },
        classesNames: {
            NEW: "new",
            NOTCOME: "not-come",
            COME: "come",
            CONFIRMED: "confirm"
        }

    }

    var createObject = Model("Visit", {
        deserialize: function (self, data) {
            self.id = data.id;
            self.client = data.client;
            self.comment = data.comment;
            self.status = data.status;

            var serviceList = [];
            for (var i = 0; i < data.serviceList.length; i++)
                serviceList.push(new Service(data.serviceList[i]));
            self.serviceList = serviceList;

            self.date = new Date(data.date);
        },
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['id'],
        indexes: {
            date: false,
            step: false,
            master: false
        }
    });

    createObject.searchIndexedDb = function (trans, params, callback) {
        var result = [];
        var store = trans.objectStore("Visit"); //найдем хранилище для объектов данного класса
        var keyRange = IDBKeyRange.bound(new Date(params.dateFrom), new Date(params.dateTill));
        console.log(keyRange);
        var request = store.index(params.index).openCursor(keyRange);
        request.onerror = function (event) {
            callback(null);
        };
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                result.push(cursor.value);
                cursor.continue();
            }
        };

        trans.oncomplete = function (e) {
            if (result.length != 0) {
                callback(result);
            }
        }
    }

    return createObject;
    //        statuses: statuses,

});



myApp.factory('GetVisitsObjects', function (Visit) {
    return function (allVisits) {
        var result = [];
        for (var i = 0; i < allVisits.length; i++) {
            var visitsDay = allVisits[i];
            var tempResult = [];
            for (var j = 0; j < visitsDay.length; j++) {
                var visit = new Visit.createObject(visitsDay[j]);
                tempResult.push(visit);
            }
            result.push(tempResult);
        }
        var objsList = [];
        if (result.length != 0) {
            for (var i = 0; i < result.length; i++) {
                objsList.push(result[i].sort(function (a, b) {
                    return new Date(a.date).getTime() - new Date(b.date).getTime()
                }));
            }
        }
        return objsList;
    }
});

myApp.factory('GetVisitObjects', function (Visit) {
    return function (visit) {
        return new Visit(visit);
    }
});

/**
 * @ngdoc service
 * @description Сервис для загрузки данных о визитах.
 * @name myApp.service:VisitsLoader
 */
//myApp.factory('VisitsLoader', function (Model, Visit) {
//    var statuses = ["Новая запись", "Клиент не пришел", "Подтверждена", "Клиент пришел"];
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:VisitsLoader#getData
//     * @methodOf myApp.service:VisitsLoader
//     * @description Метод для получения визитом за выбранный день.
//     * @param {Date} date Дата, за которую нужно получить список визитов.
//     * @returns {Array} Список визитов за нужную дату или [], если
//     * визитов за эту дату нет.
//     */
//    function getData(date) {
//        var getedData = getVisits();
//        var result = [];
//        for (var i = 0; i < getedData.length; i++) {
//            var item = new Visit(getedData[i]);
//            result.push(item);
//        }
//        result = result.filter(function (visit) {
//            return (visit.date.toDateString() == date.toDateString());
//        });
//        if (result.length != 0) {
//            return result.sort(function (a, b) {
//                return new Date(a.date).getTime() - new Date(b.date).getTime()
//            });
//        }
//        return [];
//    }
//
//
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:VisitsLoader#getMinDate
//     * @methodOf myApp.service:VisitsLoader
//     * @description Функция для получения минимальной даты (самой
//     * прошлой), за которую есть данные по визитам.
//     * @returns {Date} Дата самых ранних данных по визитам.
//     */
////    function getMinDate() {
////        var data = getVisits();
////        var minDate = new Date();
////        for (var i = 0; i < data.length; i++) {
////            if (data[i].date < minDate)
////                minDate = new Date(data[i].date.getFullYear(), data[i].date.getMonth(), data[i].date.getDate());
////        }
////        return minDate;
////    }
//
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:VisitsLoader#getMaxDate
//     * @methodOf myApp.service:VisitsLoader
//     * @description Функция для получения максимальной даты (самой
//     * будущей), за которую есть данные по визитам.
//     * @returns {Date} Дата, за которую внесены максимально будущие
//     * данные по визитам.
//     */
////    function getMaxDate() {
////        var data = getVisits();
////        var maxDate = new Date();
////        for (var i = 0; i < data.length; i++) {
////            if (data[i].date > maxDate)
////                maxDate = new Date(data[i].date.getFullYear(), data[i].date.getMonth(), data[i].date.getDate());
////        }
////        return maxDate;
////    }
//
//
//    return {
//        getData: getData,
//        getMinDate: getMinDate,
//        getMaxDate: getMaxDate,
//        statuses: statuses
//    };
//});


/**
 * @ngdoc service
 * @description Сервис для получения списка мастеров с их визитами за нужную дату.
 * @name myApp.service:MastersPerDayLoader
 * @requires myApp.service:VisitsLoader
 */
myApp.factory('MastersLoader', function (DateHelper, Loader) {

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
     * @description Метод для получения списка мастеров за период, состоящего из списков мастеров за день, отсортированных по фамилии мастера объектов `perMaster`.
     * @param {Period} period  Период, за который требуется получить мастеров.
     * @param {Function} callback Функция, в которую будут переданы полученные мастера.
     */
    function getAllMastersPerDay(period, callback) {
        Loader.search("Visits", {
            dateFrom: period.begin,
            dateTill: period.end,
            step: DateHelper.steps.DAY
        }, function (data) {
            console.log("data in MasterLoader ", data);

            var mastersForPeriod = [];
            for (var k = 0; k < data.length; k++) {
                var mastersForDay = [];
                for (var i = 0; i < data[k].length; i++) {
                    for (var j = 0; j < data[k][i].serviceList.length; j++) {
                        var usl = checkMasterInList(data[k][i].serviceList[j].master, mastersForDay);
                        if (usl !== null) {
                            mastersForDay[usl].visList.push(data[k][i]);
                        } else {
                            mastersForDay.push(new perMaster(data[k][i].serviceList[j].master, data[k][i]));
                        }
                    }
                }

                mastersForDay = mastersForDay.sort(function (a, b) {
                    if (a.master.lastName.toLowerCase() < b.master.lastName.toLowerCase())
                        return -1;
                    if (nameA = a.master.lastName.toLowerCase() > b.master.lastName.toLowerCase())
                        return 1;
                    return 0;
                });
                mastersForPeriod.push(mastersForDay);
            }
            callback(mastersForPeriod);
        });
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
// */
//myApp.factory('VisitLoader', function () {
//    return function (neededID) {
//        Loader.search("Visit", {
//            id: neededID
//        }, function (data) {
//            return data;
//        }             
////        var getedData = getVisits();
////        getedData = getedData.filter(function (visit) {
////            return (visit.id == neededID);
////        });
////        if (getedData.length == 1)
////            return getedData[0];
////        else
////            return null;
//    };
//});