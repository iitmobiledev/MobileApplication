myApp.factory('OperationalStatisticsData', function (DateHelper) {
    return function (dateFrom, dateTill, step) {
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
});