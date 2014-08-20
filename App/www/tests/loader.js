describe('tests for Loader:\n', function () {
    describe('Loader.search', function () {
        var $injector = angular.injector(['myApp']),
            loader = $injector.get('Loader'),
            opStat = $injector.get('OperationalStatistics'),
            finStat = $injector.get('FinanceStatistics'),
            dateHelper = $injector.get('DateHelper'),
            today = new Date(),
            step = dateHelper.steps.DAY,
            yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
            tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
            periodObj = {
                dateFrom: yesterday,
                dateTill: tomorrow,
                step: step,
                index: "date"
            }

        it("должен вернуть массив из объектов OperationalStatistics", function () {
            var opStats, flag = false;

            runs(loader.search("OperationalStatistics", periodObj, function (data) {
                flag = true;
                opStats = data;
            }));

            waitsFor(function () {
                return flag;
            }, "The objects's array should be received", 750);

            runs(function () {
                expect(opStats).toEqual(jasmine.any(Array));
                for (var i in opStats) {
                    expect(opStats[i]).toEqual(jasmine.any(opStat));
                    //                    expect(opStats[i].financeStat).toEqual(jasmine.any(finStat));
                };
            });
        });

        it("должен вернуть массив из объектов за указанный период (проверка на правильные даты)", function () {
            var opStats, flag = false;
            runs(loader.search("OperationalStatistics", periodObj, function (data) {
                flag = true;
                opStats = data;
            }));

            waitsFor(function () {
                return flag;
            }, "The objects's array should be received", 750);

            runs(function () {
                var period = dateHelper.getPeriod(yesterday, step);
                var day = period.begin;
                while (day < tomorrow || day.toDateString() == tomorrow.toDateString()) {
                    var hasObject = false;
                    for (var i = 0; i < opStats.length; i++) {
                        if (day.toDateString() == opStats[i].date.toDateString())
                            hasObject = true;
                    }
                    expect(hasObject).toEqual(true);
                    period = dateHelper.getNextPeriod(day, step);
                    day = period.begin;
                }
            });
        });
    });
});