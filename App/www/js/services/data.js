myApp.factory('OperationalStatisticsData', function (DateHelper) {

    function byID(id) {
        var period = DateHelper.getPeriod(new Date(), DateHelper.steps.DAY);
        var day = period.begin;
        var till = period.end;
        var item = {};
        var a = getRandom(1000, 10000);
        item.dateFrom = day;
        item.dateTill = till;
        item.proceeds = a;
        item.profit = getRandom(-1000, 5000);
        item.clients = Math.round(getRandom(3, 50));
        item.workload = getRandom(50, 100);
        item.step = step;
        if (step == DateHelper.steps.DAY)
            item.financeStat = getFinanceStatistics(item.dateFrom);
        else
            item.financeStat = {};
        item.id = id;
        return item;
    }

    function forPeriod(dateFrom, dateTill, step) {
        var data = [];
        var period = DateHelper.getPeriod(dateFrom, step);
        var day = period.begin;
        var till = period.end;
        while (day > dateTill || day.toDateString() == dateTill.toDateString()) {
            var item = {};
            var a = getRandom(1000, 10000);
            item.dateFrom = day;
            item.dateTill = till;
            item.proceeds = a;
            item.profit = getRandom(-1000, 5000);
            item.clients = Math.round(getRandom(3, 50));
            item.workload = getRandom(50, 100);
            item.step = step;
            if (step == DateHelper.steps.DAY)
                item.financeStat = getFinanceStatistics(item.dateFrom);
            else
                item.financeStat = {};
            data.push(item);
            period = DateHelper.getPrevPeriod(day, step);
            day = period.begin;
            till = period.end;
        }
        return data;
    }

    return {
        forPeriod: forPeriod,
        byID: byID
    }
});

myApp.factory('VisitsData', function (DateHelper) {
    function byID(id) {
        var sList = [];
        var hours = Math.round(getRandom(8, 21));
        var service = {
            description: "Стрижка",
            startTime: new Date(2014, 8, 11, hours, Math.round(getRandom(0, 59))),
            endTime: new Date(2014, 8, 11, hours + 2, Math.round(getRandom(0, 59))),
            master: {
                id: 3,
                firstName: "Владимир",
                middleName: "Петрович",
                lastName: "Сидоров"
            },
            cost: getRandom(500, 10000)
        };
        sList.push(service);
        var visit = {};
        visit.id = id;
        visit.client = {
            firstName: "Марина",
            middleName: "Андреевна",
            lastName: "Пекарская",
            phoneNumber: "+79021565814",
            balance: getRandom(-1000, 10000),
            discount: Math.round(getRandom(3, 30))
        };
        visit.serviceList = sList;
        visit.comment = "Забыла деньги дома. Обещала принести чуть позже."
        visit.date = new Date(2014, 8, 11, hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
        visit.status = "Клиент пришел";
        return visit;
    }


    function forPeriod(dateFrom, dateTill, step) {
        var visList = [];
        var period = DateHelper.getPeriod(dateFrom, step);
        var day = period.begin;
        var till = period.end;

        while (day > dateTill || day.toDateString() == dateTill.toDateString()) {
            var visitsDay = [];
            var sList = [];
            var hours = Math.round(getRandom(8, 21));
            var service = {
                description: "Стрижка",
                startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
                endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59))),
                master: {
                    id: 3,
                    firstName: "Владимир",
                    middleName: "Петрович",
                    lastName: "Сидоров"
                },
                cost: getRandom(500, 10000)
            };
            sList.push(service);
            var visit = {};
            visit.id = 4;
            visit.client = {
                firstName: "Марина",
                middleName: "Андреевна",
                lastName: "Пекарская",
                phoneNumber: "+79021565814",
                balance: getRandom(-1000, 10000),
                discount: Math.round(getRandom(3, 30))
            };
            visit.serviceList = sList;
            visit.comment = "Забыла деньги дома. Обещала принести чуть позже."
            visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
            visit.status = "Клиент пришел";
            visitsDay.push(visit);


            sList = [];
            hours = Math.round(getRandom(8, 21));
            service = {
                description: "Мелирование",
                startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
                endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59))),
                master: {
                    id: 4,
                    firstName: "Наталья",
                    middleName: "Федоровна",
                    lastName: "Касатникова"
                },
                cost: getRandom(500, 10000)
            };
            sList.push(service);
            var visit = {};
            visit.id = 4;
            visit.client = {
                firstName: "Елена",
                middleName: "Андреевна",
                lastName: "Бурлакова",
                phoneNumber: "+79021565814",
                balance: getRandom(-1000, 10000),
                discount: Math.round(getRandom(3, 30))
            };
            visit.serviceList = sList;
            visit.comment = "Может опоздать"
            visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
            visit.status = "Новая запись";
            visitsDay.push(visit);

            visList.push(visitsDay);

            period = DateHelper.getPrevPeriod(day, step);
            day = period.begin;
            till = period.end;
        }
        //        var result = [];
        //        result.push(visList[0]);
        //        result.push([]);
        //        result.push(visList[2]);

        return visList;
    }

    return {
        forPeriod: forPeriod,
        byID: byID
    }
});

//function getVisits() {
//    var visList = [];
//    var sList = [];
//    sList.push(new Service("Стрижка", new Date(2014, 7, 2, 19, 00), new Date(2014, 7, 2, 20, 00), new Master(3, "Владимир", "Петрович", "Петров"), 5000));
//
//    var visit = {};
//    visit.id = 4;
//    visit.client = new Client("Марина", "Андреевна", "Пекарская", "+79021565814", -1000, 5);
//    visit.serviceList = sList;
//    visit.comment = "Забыла деньги дома. Обещала принести чуть позже."
//    visit.date = new Date(2014, 7, 7, 20, 00);
//    visit.status = "Клиент пришел";
//    visList.push(visit);
//
//    return visList;
//}