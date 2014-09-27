/**
 * @ngdoc service
 * @description Сервис - конструктор класса Автор
 * @name myApp.service:Client
 * @requires myApp.service:Model
 * @param {Object} data Данные в формате ключ: значение.
 */
myApp.factory('Author', function (Model) {
    return Model("Author", {
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['id']
    });
});

/**
 * @ngdoc service
 * @description Сервис - конструктор класса Клиент
 * @name myApp.service:Client
 * @requires myApp.service:Model
 * @param {Object} data Данные в формате ключ: значение.
 */
myApp.factory('Client', function (Model) {
    return Model("Client", {
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['id']
    });
});

/**
 * @ngdoc service
 * @description Сервис - конструктор класса Мастер
 * @name myApp.service:Master
 * @requires myApp.service:Model
 * @param {Object} data Данные в формате ключ: значение.
 */
myApp.factory('Master', function (Model) {
    return Model("Master", {
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['id']
    });
});

/**
 * @ngdoc service
 * @description Сервис - конструктор класса Услуга
 * @name myApp.service:Service
 * @requires myApp.service:Model
 * @param {Object} data Данные в формате ключ: значение.
 */
myApp.factory('Service', function (Model, Master) {
    return Model("Service", {
        deserialize: function (self, data) {
            self.description = data.description;
            self.master = new Master(data.master);
            self.cost = data.cost;
            self.employeeSalary = data.employeeSalary;
            var parseTime = data.startTime.split(':');
            if (parseTime.length > 2) {
                self.startTime = new Date(self.date.getFullYear(), self.date.getMonth(), self.date.getDate(), parseTime[0], parseTime[1]);
            } else
                self.startTime = "";
            parseTime = data.endTime.split(':');
            if (parseTime.length > 2) {
                self.endTime = new Date(self.date.getFullYear(), self.date.getMonth(), self.date.getDate(), parseTime[0], parseTime[1]);
            } else
                self.endTime = "";
        },
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['id']
    });
});


/**
 * @ngdoc service
 * @description Сервис - конструктор класса Визит
 * @name myApp.service:Visit
 * @requires myApp.service:Model
 * @param {Object} data Данные в формате ключ: значение.
 */
myApp.factory('Visit', function (Model, Client, Service, Author) {
    var visitConstructor = Model("Visit", {
        deserialize: function (self, data) {
            self.id = data.id;
            self.author = new Author(data.author);
            self.client = data.client;
            self.comment = data.comment;
            self.status = data.status;

            var serviceList = [];
            if (data.serviceList) {
                for (var i = 0; i < data.serviceList.length; i++)
                    serviceList.push(new Service(data.serviceList[i]));
            }
            self.serviceList = serviceList;

            self.date = new Date(data.date);
            self.paid = parseInt(data.paid);
            var parseTime = data.startTime.split(':');
            if (parseTime.length > 2) {
                self.startTime = new Date(self.date.getFullYear(), self.date.getMonth(), self.date.getDate(), parseTime[0], parseTime[1]);
            } else
                self.startTime = "";
            parseTime = data.endTime.split(':');
            if (parseTime.length > 2) {
                self.endTime = new Date(self.date.getFullYear(), self.date.getMonth(), self.date.getDate(), parseTime[0], parseTime[1]);
            } else
                self.endTime = "";
        },
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['id'],
        indexes: {
            date: {
                keyPath: ['date'],
                unique: false
            },
        }
    });

    //    visitConstructor.searchIndexedDb = function (trans, params, callback) {
    //        var result = [];
    //        var dates = [];
    //        var store = trans.objectStore("Visit"); //найдем хранилище для объектов данного класса
    //        var keyRange = IDBKeyRange.bound(new Date(params.dateFrom), new Date(params.dateTill));
    //        //        console.log(keyRange);
    //        var request = store.index(params.index).openCursor(keyRange);
    //
    //        request.onerror = function (event) {
    //            callback(null);
    //        };
    //        request.onsuccess = function (event) {
    //            var cursor = event.target.result;
    //            if (cursor) {
    //                result.push(cursor.value);
    //                cursor.
    //                continue ();
    //            }
    //        };
    //
    //        trans.oncomplete = function (e) {
    //            if (result.length != 0) {
    //                callback(result);
    //            } else
    //                callback(null);
    //        }
    //    }
    visitConstructor.searchInLocalStorage = function (params, callback) {
        var keys = [];
        var startDate = new Date(params.dateFrom);
        var endDate = new Date(params.dateTill);
        for (var i = startDate; i < endDate; i = DateHelper.getNextPeriod(new Date(i), step).begin) {
            var item = [];
            item.push("Visit");
            item.push(i);
            item.push(params.step);
            keys.push(item);
        }
        return keys;
    }

    visitConstructor.statuses = {
        titlesArray: ["Новая запись", "Клиент не пришел", "Клиент пришел", "Подтверждена"],
        titles: {
            "new": "Новая запись",
            "not-come": "Клиент не пришел",
            "come": "Клиент пришел",
            "confirmed": "Подтверждена"
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

//
///**
// * @ngdoc service
// * @description Сервис для получения списка мастеров с их визитами за нужную дату.
// * @name myApp.service:MastersLoader
// * @requires myApp.service:VisitsLoader
// */
//myApp.factory('MastersLoader', function (DateHelper, Loader, $filter) {
//
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:MastersLoader#checkMasterInList
//     * @methodOf myApp.service:MastersLoader
//     * @description Проверяет есть ли мастер в списке мастеров.
//     * @param {Object} master Объект мастер.
//     * @param {Array}  masters Список мастеров.
//     * @returns {Null or Number}  Индекс мастера, если он есть в списке,
//     * иначе - null.
//     */
//    function checkMasterInList(master, masters) {
//        for (var i = 0; i < masters.length; i++) {
//            if (master.id === masters[i].master.id) {
//                return i;
//            }
//        }
//        return null;
//    }
//
//    function checkVisitInList(visit, visits) {
//        for (var i = 0; i < visits.length; i++) {
//            if (visit.id === visits[i].id) {
//                return i;
//            }
//        }
//        return null;
//    }
//
//    function perMaster(master, visit) {
//        this.master = master;
//        this.visList = [];
//        if (visit) {
//            this.visList.push(visit);
//        }
//    }
//
//
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:MastersLoader#getAllMastersPerDay
//     * @methodOf myApp.service:MastersLoader
//     * @description Метод для получения списка мастеров за период, состоящего из списков мастеров за день, отсортированных по фамилии мастера объектов `perMaster`.
//     * @param {Period} period  Период, за который требуется получить мастеров.
//     * @param {Function} callback Функция, в которую будут переданы полученные мастера.
//     */
//    function getAllMastersPerDay(period, callback) {
//        Loader.search("Visit", {
//            dateFrom: period.begin,
//            dateTill: period.end,
//            step: DateHelper.steps.DAY,
//            index: "date"
//        }, function (visits) {
//            var visitsByDate = {};
//            for (var tmpDate = new Date(period.begin); tmpDate <= new Date(period.end); tmpDate.setDate(tmpDate.getDate() + 1)) {
//                var key = tmpDate.toDateString();
//                visitsByDate[key] = [];
//            }
//            //            console.log(" visitsByDate", visitsByDate);
//            angular.forEach(visits, function (visit) {
//                //                console.log(visit);
//                visitsByDate[visit.date.toDateString()].push(visit);
//            });
//
//            var list = [];
//            for (var date = period.begin; date < period.end || date.toDateString() == period.end.toDateString(); date.setDate(date.getDate() + 1)) {
//                if (visitsByDate[date.toDateString()]) {
//                    list.push(visitsByDate[date.toDateString()]);
//                }
//            }
//
//            var result = [];
//            for (var i in list) {
//                //                console.log(list[i]);
//                if (list[i].length != 0) {
//                    result.push(list[i].sort(function (a, b) {
//                        return new Date(a.date).getTime() - new Date(b.date).getTime()
//                    }));
//                }
//            }
//            var data = result;
//
//            var mastersForPeriod = [];
//            for (var k = 0; k < data.length; k++) {
//                var mastersForDay = [];
//                for (var i = 0; i < data[k].length; i++) {
//                    for (var j = 0; j < data[k][i].serviceList.length; j++) {
//                        var usl = checkMasterInList(data[k][i].serviceList[j].master, mastersForDay);
//                        if (usl !== null) {
//                            if (checkVisitInList(data[k][i], mastersForDay[usl].visList) == null)
//                                mastersForDay[usl].visList.push(data[k][i]);
//                        } else {
//                            if (data[k][i].serviceList[j].master)
//                                mastersForDay.push(new perMaster(data[k][i].serviceList[j].master, data[k][i]));
//                        }
//                    }
//                }
//
//                mastersForDay = mastersForDay.sort(function (a, b) {
//                    if (typeof (b.master.lastName) == 'undefined')
//                        b.master.lastName = "";
//                    if (a.master.lastName.toLowerCase() < b.master.lastName.toLowerCase())
//                        return -1;
//                    if (nameA = a.master.lastName.toLowerCase() > b.master.lastName.toLowerCase())
//                        return 1;
//                    return 0;
//                });
//
//                for (var i in mastersForDay) {
//                    var vlist = mastersForDay[i].visList;
//                    mastersForDay[i].visList = getGoodVisitsList(vlist, mastersForDay[i].master.id);
//                }
//                //                console.log('mastersForDay', mastersForDay);
//                mastersForPeriod.push(mastersForDay);
//            }
//            callback(mastersForPeriod);
//        });
//    }
//
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:MastersLoader#getGoodVisitsList
//     * @methodOf myApp.service:MastersLoader
//     * @param {Array} masterList список визитов мастера
//     * @description Метод, формирующий список объектов "визит" с дополнительными информационными полями
//     * @returns {Object} Список объектов "визит" с новыми полями
//     */
//    function getGoodVisitsList(masterList, id) {
//        var nmav = [];
//        for (var i = 0; i < masterList.length; i++) {
//            nmav.push(selectVisitInfo(masterList[i], id));
//        }
//        for (var j = 1; j < nmav.length; j++) {
//            if (nmav[j].startTime != nmav[j - 1].endTime) {
//                nmav[j - 1].downTime = $filter('date')(nmav[j - 1].endTime, "HH:mm") + '-' + $filter('date')(nmav[j].startTime, "HH:mm");
//                nmav[j - 1].isDownTime = true;
//            }
//        }
//        return nmav;
//    }
//
//
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:MastersLoader#selectVisitInfo
//     * @methodOf myApp.service:MastersLoader
//     * @param {Object} visit Объект визит
//     * @description Метод, формирующий объект визит с дополнительными информационными полями
//     * @returns {Object} Объект визит с новыми полями
//     */
//    function selectVisitInfo(visit, id) {
//        var services = [],
//            startTimes = [],
//            endTimes = [],
//            coast = 0;
//        for (var j = 0; j < visit.serviceList.length; j++) {
//            var service = visit.serviceList[j]
//            if (id == service.master.id) {
//                services.push(service);
//                coast += service.cost
//                startTimes.push(service.startTime);
//                endTimes.push(service.endTime);
//            }
//        }
//        var result = {};
//        result.id = visit.id;
//        result.status = visit.status;
//        result.client = visit.client;
//        result.serviceList = services;
//        result.cost = coast + ' р.';
//        result.startTime = Math.min.apply(null, startTimes);
//        result.endTime = Math.max.apply(null, endTimes);
//        result.isDownTime = false;
//        result.downTime = '';
//        //        console.log("res-visit", result);
//        return result;
//    }
//
//
//
//    return {
//        getAllMastersPerDay: getAllMastersPerDay
//    };
//});