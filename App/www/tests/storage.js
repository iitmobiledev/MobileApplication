describe('tests for Storage:\n', function () {
    describe('Storage.search', function () {
        var $injector = angular.injector(['myApp']),
            storage = $injector.get('Storage'),
            opStat = $injector.get('OperationalStatistics'),
            dateHelper = $injector.get('DateHelper'),
            today = new Date(),
            tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
            step = dateHelper.steps.DAY,
            params = {
                dateFrom: today,
                dateTill: tomorrow,
                step: step,
                index: "date"
            };

        it("должен записать и достать объект из бд", function () {
            var data = {};
            data.date = today;
            data.step = step;
            data.proceeds = 3000;
            data.profit = 1000;
            data.clients = 15;
            data.workload = 70;
            data.financeStat = {
                date: today,
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
            data.date = tomorrow;
            data.step = step;
            data.proceeds = 3000;
            data.profit = 1000;
            data.clients = 15;
            data.workload = 70;
            data.financeStat = {
                date: today,
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
                console.log(opStats);
            }));

            waitsFor(function () {
                return flag;
            }, "The objects's array should be received", 750);

            runs(function () {
                expect(opStats).toEqual(jasmine.any(Array));
                for (var i in opStats) {
                    expect(opStats[i]).toEqual(jasmine.any(Object));
                };
            });
        });

    });
});