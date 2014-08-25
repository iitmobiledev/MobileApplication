myApp.service("Server", ["DateHelper", "Visit",
    function (DateHelper, Visit) {
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
            "Visit": function (params) {
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
            },
            "Visits": function (params) {
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
            search: function (className, params, callback) {
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
            get: function (className, primary, callback) {
                console.log("primary ", primary);
                var params;
                primary = primary.split(':');
                console.log("split primary ", primary);
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


///**
// * @ngdoc service
// * @description Сервис для получения данных о визитах.
// * @name myApp.service:VisitsData
// */
//myApp.factory('VisitsData', function (DateHelper, Visit) {
//    function byID(id) {
//        var sList = [];
//        var hours = Math.round(getRandom(8, 21));
//        var serviceCost = Math.round(getRandom(500, 10000));
//        var salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
//        var service = {
//            description: "Стрижка",
//            startTime: new Date(2014, 8, 11, hours, Math.round(getRandom(0, 59))),
//            endTime: new Date(2014, 8, 11, hours + 2, Math.round(getRandom(0, 59))),
//            master: {
//                id: 1,
//                firstName: "Владимир",
//                middleName: "Петрович",
//                lastName: "Сидоров"
//            },
//            cost: serviceCost,
//            employeeSalary: salary
//        };
//        sList.push(service);
//        var visit = {};
//        visit.id = id;
//        visit.client = {
//            firstName: "Марина",
//            middleName: "Андреевна",
//            lastName: "Пекарская",
//            phoneNumber: "+79021565814",
//            balance: getRandom(-1000, 10000),
//            discount: Math.round(getRandom(3, 30))
//        };
//        visit.paid = getRandom(-1000, 10000);
//        visit.serviceList = sList;
//        visit.comment = "Забыла деньги дома. Обещала принести чуть позже."
//        visit.date = new Date(2014, 8, 11, hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
//        visit.status = "Клиент пришел";
//        return visit;
//    }
//
//    /**
//     *
//     * @ngdoc method
//     * @name myApp.service:VisitsData#forPeriod
//     * @methodOf myApp.service:VisitsData
//     * @param {Date} dateFrom Начальная дата.
//     * @param {Date} dateTill Конечная дата.
//     * @param {String} step Шаг, с которым будут браться данные.
//     * Допустимые значения этого параметра написаны в
//     * DateHelper.steps.
//     * @example
//     * <pre>
//     * var data = VisitsData.forPeriod(yesterday, tomorrow, 'day');
//     * //data = [[visitsYesterday],[visitsToday],[visitsTomorrow]];
//     * </pre>
//     * @returns {Array} Визиты по шагу с начальной по конечную дату.
//     * @description Метод предназначен для получения данных о
//     * визитах по периоду и шагу.
//     */
//    function forPeriod(dateFrom, dateTill, step) {
//        var visList = [];
//        var period = DateHelper.getPeriod(dateFrom, step);
//        var day = period.begin;
//
//        while (day < dateTill || day.toDateString() == dateTill.toDateString()) {
//            var visitsDay = [];
//            var sList = [];
//            var hours = Math.round(getRandom(8, 21));
//            var serviceCost = Math.round(getRandom(500, 10000));
//            var salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
//            var service = {
//                description: "Стрижка",
//                startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
//                endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59))),
//                master: {
//                    id: 1,
//                    firstName: "Владимир",
//                    middleName: "Петрович",
//                    lastName: "Сидоров"
//                },
//                cost: serviceCost,
//                employeeSalary: salary
//            };
//            sList.push(service);
//            var visit = {};
//            visit.id = 1;
//            visit.client = {
//                firstName: "Марина",
//                middleName: "Андреевна",
//                lastName: "Пекарская",
//                phoneNumber: "+79021565814",
//                balance: getRandom(-1000, 10000),
//                discount: Math.round(getRandom(3, 30))
//            };
//            visit.paid = getRandom(-1000, 10000);
//            visit.serviceList = sList;
//            visit.comment = "Забыла деньги дома. Обещала принести чуть позже."
//            visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
//            visit.status = Visit.statuses.titles.COME;
//            visitsDay.push(visit);
//
//
//            sList = [];
//            hours = Math.round(getRandom(8, 21));
//            serviceCost = Math.round(getRandom(500, 10000));
//            salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
//            service = {
//                description: "Мелирование",
//                startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
//                endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59))),
//                master: {
//                    id: 2,
//                    firstName: "Наталья",
//                    middleName: "Федоровна",
//                    lastName: "Касатникова"
//                },
//                cost: serviceCost,
//                employeeSalary: salary
//            };
//            sList.push(service);
//            var visit = {};
//            visit.id = 2;
//            visit.client = {
//                firstName: "Елена",
//                middleName: "Андреевна",
//                lastName: "Бурлакова",
//                phoneNumber: "+79021565814",
//                balance: getRandom(-1000, 10000),
//                discount: Math.round(getRandom(3, 30))
//            };
//            visit.serviceList = sList;
//            visit.paid = getRandom(-1000, 10000);
//            visit.comment = "Может опоздать"
//            visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
//            visit.status = Visit.statuses.titles.NEW;
//            visitsDay.push(visit);
//
//            sList = [];
//            hours = Math.round(getRandom(8, 21));
//            serviceCost = Math.round(getRandom(500, 10000));
//            salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
//            var endTime = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59)));
//            service = {
//                description: "Стрижка волос",
//                startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
//                endTime: endTime,
//                master: {
//                    id: 3,
//                    firstName: "Алена",
//                    middleName: "Федоровна",
//                    lastName: "Алевская"
//                },
//                cost: serviceCost,
//                employeeSalary: salary
//            };
//            sList.push(service);
//            visit.paid = getRandom(-1000, 10000);
//            serviceCost = Math.round(getRandom(500, 10000));
//            salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
//            service = {
//                description: "Ламинирование",
//                startTime: endTime,
//                endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), endTime.getHours() + 1, Math.round(getRandom(0, 59))),
//                master: {
//                    id: 3,
//                    firstName: "Алена",
//                    middleName: "Федоровна",
//                    lastName: "Алевская"
//                },
//                cost: serviceCost,
//                employeeSalary: salary
//            };
//            sList.push(service);
//            var visit = {};
//            visit.id = 3;
//            visit.client = {
//                firstName: "Константин",
//                middleName: "Борисович",
//                lastName: "Варнавский",
//                phoneNumber: "+79021565814",
//                balance: getRandom(-1000, 10000),
//                discount: Math.round(getRandom(3, 30))
//            };
//            visit.serviceList = sList;
//            visit.paid = getRandom(-1000, 10000);
//            visit.comment = "Может опоздать"
//            visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
//            visit.status = Visit.statuses.titles.NOTCOME;
//            visitsDay.push(visit);
//
//            sList = [];
//            hours = Math.round(getRandom(8, 21));
//            serviceCost = Math.round(getRandom(500, 10000));
//            salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
//            service = {
//                description: "Массаж",
//                startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
//                endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59))),
//                master: {
//                    id: 3,
//                    firstName: "Алена",
//                    middleName: "Федоровна",
//                    lastName: "Алевская"
//                },
//                cost: serviceCost,
//                employeeSalary: salary
//            };
//            sList.push(service);
//            var visit = {};
//            visit.id = 4;
//            visit.client = {
//                firstName: "Светлана",
//                middleName: "Андреевна",
//                lastName: "Игнашевич",
//                phoneNumber: "+79021565814",
//                balance: getRandom(-1000, 10000),
//                discount: Math.round(getRandom(3, 30))
//            };
//            visit.serviceList = sList;
//            visit.paid = getRandom(-1000, 10000);
//            visit.comment = "Может опоздать"
//            visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
//            visit.status = Visit.statuses.titles.CONFIRMED;
//            visitsDay.push(visit);
//
//            visList.push(visitsDay);
//
//            period = DateHelper.getNextPeriod(day, step);
//            day = period.begin;
//        }
//        return visList;
//    }
//
//    return {
//        forPeriod: forPeriod,
//        byID: byID
//    }
//});
//     * data = VisitsData.forPeriod(1.08.14, 31.08.14, 'week');
//     * //data = [[visitsFor(28.07-3.08)],[visitsFor(4.08-10.08)],[visitsFor(11.08-17.08)],[visitsFor(18.08-24.08)],[visitsFor(25.08-31.08)]];


//myApp.factory('ExpendituresData', function (DateHelper) {
//    function forPeriod(dateFrom, dateTill, step) {
//        var data = [];
//        var period = DateHelper.getPeriod(dateFrom, step);
//        var day = period.begin;
//        var till = period.end;
//
//        var expList = [];
//        while (day < dateTill || day.toDateString() == dateTill.toDateString()) {
//
//            var expItemsList = [];
//            expItemsList.push({
//                description: "Покупка расходных материалов",
//                cost: -1500
//            });
//            expItemsList.push({
//                description: "Покупка нового кресла",
//                cost: -5000
//            });
//            expList.push({
//                date: day,
//                expenditureList: expItemsList
//            });
//
//            period = DateHelper.getNextPeriod(day, step);
//            day = period.begin;
//        }
//        return expList;
//    }
//
//    return {
//        forPeriod: forPeriod
//    }
//});