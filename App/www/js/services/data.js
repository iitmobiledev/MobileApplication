/**
 * @ngdoc service
 * @description Сервис для генерации данных.
 * @name myApp.service:Server
 * @requires myApp.service:DateHelper
 * @requires myApp.service:Visit
 */
myApp.service("Server", ["DateHelper", "Visit",
    function (DateHelper, Visit) {
        var classesLastModified = {
            "OperationalStatistics": "2014-08-25 21:44:00",
            "Visit": "2014-08-25 21:44:00",
            "Expenditures": "2014-08-25 21:44:00"
        };

        var classesFieldStat = {
            "OperationalStatistics": {
                "date": {
                    min: "2013-01-01 09:00:00",
                    max: "2014-01-01 15:15:00"
                }
            },
            "Visit": {
                "id": {
                    min: "2013-01-01 13:00:00",
                    max: "2014-01-01 17:15:00"
                }
            },
            "Expenditures": {
                "date": {
                    min: "2013-01-01 15:00:00",
                    max: "2014-01-01 19:15:00"
                }
            }
        };

        var objects = {
            "OperationalStatistics": function () {
                var dayCount = 365;
                var allObjects = [];
                var day = new Date(2014, 8, 15);
                var currentDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() - dayCount);
                for (var i = 0; i <= dayCount; i++) {
                    var data = {};
                    data.proceeds = getRandom(1000, 10000);
                    data.profit = getRandom(-1000, 5000);
                    data.clients = Math.round(getRandom(3, 50));
                    data.workload = getRandom(30, 100);
                    data.date = currentDay;
                    data.step = DateHelper.steps.DAY;
                    data.financeStat = getFinanceStatistics(new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate()));
                    allObjects.push(data);

                    var currentWeek = DateHelper.getPeriod(currentDay, DateHelper.steps.WEEK);
                    if (currentDay.toDateString() == currentWeek.begin.toDateString()) {
                        data = {};
                        data.proceeds = getRandom(7000, 70000);
                        data.profit = getRandom(-7000, 35000);
                        data.clients = Math.round(getRandom(21, 350));
                        data.workload = getRandom(30, 100);
                        data.date = currentDay;
                        data.step = DateHelper.steps.WEEK;
                        data.financeStat = {};
                        allObjects.push(data);
                    }

                    var currentMonth = DateHelper.getPeriod(currentDay, DateHelper.steps.MONTH);
                    if (currentDay.toDateString() == currentMonth.begin.toDateString()) {
                        data = {};
                        data.proceeds = getRandom(30000, 300000);
                        data.profit = getRandom(-2000, 150000);
                        data.clients = Math.round(getRandom(90, 150));
                        data.workload = getRandom(50, 100);
                        data.date = currentDay;
                        data.step = DateHelper.steps.MONTH;
                        data.financeStat = {};
                        allObjects.push(data);
                    }

                    currentDay = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() + 1);
                }

                return allObjects;
            },
            "Visit": "2014-07-01 15:15:00",
            "Expenditures": "2014-08-01 15:30:00"
        };


        var classes = {
            "OperationalStatistics": function (params) {
                var day = params.day || new Date();
                var data = {};
                data.proceeds = getRandom(1000, 10000);
                data.profit = getRandom(-1000, 5000);
                data.clients = Math.round(getRandom(3, 50));
                data.workload = getRandom(50, 100);
                data.date = day;
                data.step = params.step || DateHelper.steps.DAY;
                if (params.step == DateHelper.steps.DAY)
                    data.financeStat = getFinanceStatistics(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
                else
                    data.financeStat = {};
                return data;
            },
            "Expenditures": function (params) {
                var expenditures = {};
                var expItemsList = [];
                expItemsList.push({
                    description: "Покупка расходных материалов",
                    cost: -1500
                });
                expItemsList.push({
                    description: "Покупка нового кресла",
                    cost: -5000
                });
                expenditures.expenditureList = expItemsList;
                expenditures.date = params.day || new Date();
                return expenditures;
            }
        };
        return {
            lastModified: function (query, callback) {
                //                var result = {};
                //                for (var i in query)
                //                    result[query[i]] = classesLastModified[query[i]];
                var result = classesLastModified[query];
                callback(result);
            },

            getFieldStat: function (query, callback) {
                var result = [];
                for (var i in query) {
                    var resType = classesFieldStat[query[i].type];
                    var resField = resType[query[i].field];
                    result.push({
                        type: query[i].type,
                        field: query[i].field,
                        min: resField.min,
                        max: resField.max
                    });
                }
                callback(result);
            },

            search: function (className, params, callback) {
                var allObjects = objects[className]();
                var end = params.offset + params.count;
                if (end > allObjects.length)
                    end = allObjects.length;
                var neededObjs = [];
                for (var i = params.offset; i < end; i++) {
                    //                    if (typeof (allObjects[i]) != 'undefined')
                    neededObjs.push(allObjects[i]);
                }

                callback(neededObjs);
            },

            /**
             * @ngdoc method
             * @name myApp.service:Server#search
             * @methodOf myApp.service:Server
             * @param {String} className Имя класса, для которого
             * будут создаваться данные.
             * @param {Object} params Начальная дата, конечная дата и
             * шаг, необходимые для создания данных.
             * @param {Function} callback Функция, которая будет
             * вызвана после создания всех данных, массив
             * этих данных будет передан функции в качестве
             * параметра.
             * @description Метод для получения данных за период.
             */
            searchForPeriod: function (className, params, callback) {
                classes["Visit"] = function (params) {
                    var day = params.day || new Date();
                    var visitsDay = [];
                    var sList = [];
                    var hours = Math.round(getRandom(8, 21));
                    var serviceCost = Math.round(getRandom(500, 10000));
                    var salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
                    var service = {
                        description: "Стрижка",
                        startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
                        endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59))),
                        master: {
                            id: 1,
                            firstName: "Владимир",
                            middleName: "Петрович",
                            lastName: "Сидоров"
                        },
                        cost: serviceCost,
                        employeeSalary: salary
                    };
                    sList.push(service);
                    var visit = {};
                    visit.id = Math.round(getRandom(0, 500));
                    visit.client = {
                        firstName: "Марина",
                        middleName: "Андреевна",
                        lastName: "Пекарская",
                        phoneNumber: "+79021565814",
                        balance: getRandom(-1000, 10000),
                        discount: Math.round(getRandom(3, 30))
                    };
                    visit.paid = getRandom(-1000, 10000);
                    visit.serviceList = sList;
                    visit.comment = "Забыла деньги дома. Обещала принести чуть позже."
                    visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
                    visit.status = Visit.statuses.titles.COME;
                    visitsDay.push(visit);

                    sList = [];
                    hours = Math.round(getRandom(8, 21));
                    serviceCost = Math.round(getRandom(500, 10000));
                    salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
                    service = {
                        description: "Мелирование",
                        startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
                        endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59))),
                        master: {
                            id: 2,
                            firstName: "Наталья",
                            middleName: "Федоровна",
                            lastName: "Касатникова"
                        },
                        cost: serviceCost,
                        employeeSalary: salary
                    };
                    sList.push(service);
                    var visit = {};
                    visit.id = 2;
                    visit.client = {
                        firstName: "Елена",
                        middleName: "Андреевна",
                        lastName: "Бурлакова",
                        phoneNumber: "+79021565814",
                        balance: getRandom(-1000, 10000),
                        discount: Math.round(getRandom(3, 30))
                    };
                    visit.serviceList = sList;
                    visit.paid = getRandom(-1000, 10000);
                    visit.comment = "Может опоздать"
                    visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
                    visit.status = Visit.statuses.titles.NEW;
                    visitsDay.push(visit);

                    sList = [];
                    hours = Math.round(getRandom(8, 21));
                    serviceCost = Math.round(getRandom(500, 10000));
                    salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
                    var endTime = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59)));
                    service = {
                        description: "Стрижка волос",
                        startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
                        endTime: endTime,
                        master: {
                            id: 3,
                            firstName: "Алена",
                            middleName: "Федоровна",
                            lastName: "Алевская"
                        },
                        cost: serviceCost,
                        employeeSalary: salary
                    };
                    sList.push(service);
                    visit.paid = getRandom(-1000, 10000);
                    serviceCost = Math.round(getRandom(500, 10000));
                    salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
                    service = {
                        description: "Ламинирование",
                        startTime: endTime,
                        endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), endTime.getHours() + 1, Math.round(getRandom(0, 59))),
                        master: {
                            id: 3,
                            firstName: "Алена",
                            middleName: "Федоровна",
                            lastName: "Алевская"
                        },
                        cost: serviceCost,
                        employeeSalary: salary
                    };
                    sList.push(service);
                    var visit = {};
                    visit.id = 3;
                    visit.client = {
                        firstName: "Константин",
                        middleName: "Борисович",
                        lastName: "Варнавский",
                        phoneNumber: "+79021565814",
                        balance: getRandom(-1000, 10000),
                        discount: Math.round(getRandom(3, 30))
                    };
                    visit.serviceList = sList;
                    visit.paid = getRandom(-1000, 10000);
                    visit.comment = "Может опоздать"
                    visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
                    visit.status = Visit.statuses.titles.NOTCOME;
                    visitsDay.push(visit);

                    sList = [];
                    hours = Math.round(getRandom(8, 21));
                    serviceCost = Math.round(getRandom(500, 10000));
                    salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
                    service = {
                        description: "Массаж",
                        startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
                        endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59))),
                        master: {
                            id: 3,
                            firstName: "Алена",
                            middleName: "Федоровна",
                            lastName: "Алевская"
                        },
                        cost: serviceCost,
                        employeeSalary: salary
                    };
                    sList.push(service);
                    var visit = {};
                    visit.id = 4;
                    visit.client = {
                        firstName: "Светлана",
                        middleName: "Андреевна",
                        lastName: "Игнашевич",
                        phoneNumber: "+79021565814",
                        balance: getRandom(-1000, 10000),
                        discount: Math.round(getRandom(3, 30))
                    };
                    visit.serviceList = sList;
                    visit.paid = getRandom(-1000, 10000);
                    visit.comment = "Может опоздать"
                    visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
                    visit.status = Visit.statuses.titles.CONFIRMED;
                    visitsDay.push(visit);

                    return visitsDay;
                };
                var result = [];
                var day = params.dateFrom;
                while (day < params.dateTill || day.toDateString() == params.dateTill.toDateString()) {
                    var data = new classes[className]({
                        day: day,
                        step: params.step
                    });
                    result.push(data);
                    day = DateHelper.getNextPeriod(day, params.step).begin;
                }
                callback(result);
            },
            /**
             * @ngdoc method
             * @name myApp.service:Server#get
             * @methodOf myApp.service:Server
             * @param {String} className Имя класса, для которого
             * будут создаваться данные.
             * @param {String} primary Первичный ключ
             * @param {Function} callback Функция, которая будет
             * вызвана после создания данных, которые будут
             * переданы функции в качестве параметра.
             * @description Метод для получения данных по
             * первичному ключу.
             */
            get: function (className, primary, callback) {
                classes["Visit"] = function (params) {
                    var day = params.day || new Date();
                    var sList = [];
                    var hours = Math.round(getRandom(8, 21));
                    var serviceCost = Math.round(getRandom(500, 10000));
                    var salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
                    var service = {
                        description: "Маникюр",
                        startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
                        endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59))),
                        master: {
                            id: 1,
                            firstName: "Оксана",
                            middleName: "Георгиевна",
                            lastName: "Ромашкина"
                        },
                        cost: serviceCost,
                        employeeSalary: salary
                    };
                    sList.push(service);
                    var visit = {};
                    visit.id = params.id || 1;
                    visit.client = {
                        firstName: "Марина",
                        middleName: "Андреевна",
                        lastName: "Пекарская",
                        phoneNumber: "+79021565814",
                        balance: getRandom(-1000, 10000),
                        discount: Math.round(getRandom(3, 30))
                    };
                    visit.paid = getRandom(-1000, 10000);
                    visit.serviceList = sList;
                    visit.comment = "Забыла деньги дома. Обещала принести чуть позже."
                    visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
                    visit.status = Visit.statuses.titles.COME;
                    return visit;
                };
                var params;
                primary = primary.split(':');
                if (primary.length == 1)
                    params = {
                        id: primary[0]
                    };
                else {
                    params = {
                        day: primary[0],
                        step: primary[1]
                    };
                }
                callback(new classes[className](primary));
            }
        }
}]);