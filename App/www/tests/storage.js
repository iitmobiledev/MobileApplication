describe('tests for Storage:\n', function () {
    describe('Storage.search', function () {
        var $injector = angular.injector(['myApp']),
            storage = $injector.get('Storage'),
            opStat = $injector.get('OperationalStatistics'),
            dateHelper = $injector.get('DateHelper'),
            objectCount = 2; //сколько объектов должно вернуться из бд

        it("должен записать и достать объекты из бд в количестве 2-х штук с шагом - неделя", function () {
            var currentDate = dateHelper.getPeriod(new Date(), dateHelper.steps.WEEK).begin,
            nextDate = dateHelper.getNextPeriod(currentDate, dateHelper.steps.WEEK).begin,
            step = dateHelper.steps.WEEK,
            params = {
                dateFrom: currentDate,
                dateTill: nextDate,
                step: step,
                index: "date"
            },
            data = {};
            data.date = currentDate;
            data.step = step;
            data.proceeds = 3000;
            data.profit = 1000;
            data.clients = 15;
            data.workload = 70;
            data.financeStat = {
                date: currentDate,
                tillMoney: 7000,
                morningMoney: 1000,
                credit: 4000,
                debit: -1000
            };
            data.id = 1;

            var statistics = new opStat(data);
            expect(statistics).toEqual(jasmine.any(opStat));

            storage.update(statistics);

            data = {};
            data.date = nextDate;
            data.step = step;
            data.proceeds = 3000;
            data.profit = 1000;
            data.clients = 15;
            data.workload = 70;
            data.financeStat = {
                date: nextDate,
                tillMoney: 7000,
                morningMoney: 1000,
                credit: 4000,
                debit: -1000
            };
            data.id = 2;

            statistics = new opStat(data);
            expect(statistics).toEqual(jasmine.any(opStat));

            storage.update(statistics);

            var opStats, flag = false;

            runs(storage.search("OperationalStatistics", params, function (data) {
                flag = true;
                opStats = data;
            }));

            waitsFor(function () {
                return flag;
            }, "The objects's array should be received", 750);

            runs(function () {
                expect(opStats).toEqual(jasmine.any(Array));
                expect(opStats.length).toEqual(2);
                for (var i in opStats) {
                    expect(opStats[i]).toEqual(jasmine.any(Object));
                    expect(opStats[i].step).toEqual(step);
                };
            });
        });
        
        
        it("должен записать и достать объекты из бд в количестве 2-х штук с шагом - месяц", function () {
            var step = dateHelper.steps.MONTH,
            currentDate = dateHelper.getPeriod(new Date(), step).begin,
            nextDate = dateHelper.getNextPeriod(currentDate, step).begin,
            params = {
                dateFrom: currentDate,
                dateTill: nextDate,
                step: step,
                index: "date"
            },
            data = {};
            data.date = currentDate;
            data.step = step;
            data.proceeds = 3000;
            data.profit = 1000;
            data.clients = 15;
            data.workload = 70;
            data.financeStat = {
                date: currentDate,
                tillMoney: 7000,
                morningMoney: 1000,
                credit: 4000,
                debit: -1000
            };
            data.id = 1;

            var statistics = new opStat(data);
            expect(statistics).toEqual(jasmine.any(opStat));

            storage.update(statistics);

            data = {};
            data.date = nextDate;
            data.step = step;
            data.proceeds = 3000;
            data.profit = 1000;
            data.clients = 15;
            data.workload = 70;
            data.financeStat = {
                date: nextDate,
                tillMoney: 7000,
                morningMoney: 1000,
                credit: 4000,
                debit: -1000
            };
            data.id = 2;

            statistics = new opStat(data);
            expect(statistics).toEqual(jasmine.any(opStat));

            storage.update(statistics);

            var opStats, flag = false;

            runs(storage.search("OperationalStatistics", params, function (data) {
                flag = true;
                opStats = data;
            }));

            waitsFor(function () {
                return flag;
            }, "The objects's array should be received", 750);

            runs(function () {
                expect(opStats).toEqual(jasmine.any(Array));
                expect(opStats.length).toEqual(2);
                for (var i in opStats) {
                    expect(opStats[i]).toEqual(jasmine.any(Object));
                    expect(opStats[i].step).toEqual(step);
                };
            });
        });

    });
});