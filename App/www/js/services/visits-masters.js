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

    var visitConstructor = Model("Visit", {
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
            self.paid=data.paid;
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

    visitConstructor.searchIndexedDb = function (trans, params, callback) {
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
            else
                callback(null);
        }
    }

    visitConstructor.statuses = {
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

    return visitConstructor;
});


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

    function checkVisitInList(visit, visits) {
        for (var i = 0; i < visits.length; i++) {
            if (visit.id === visits[i].id) {
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
            var mastersForPeriod = [];
            for (var k = 0; k < data.length; k++) {
                var mastersForDay = [];
                for (var i = 0; i < data[k].length; i++) {
                    for (var j = 0; j < data[k][i].serviceList.length; j++) {
                        var usl = checkMasterInList(data[k][i].serviceList[j].master, mastersForDay);
                        if (usl !== null) {
                            if (checkVisitInList(data[k][i], mastersForDay[usl].visList) == null)
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