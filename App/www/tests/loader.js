describe('tests for Loader', function () {
    describe('Loader.search', function () {
        var $injector = angular.injector(['myApp']);
        var myService = $injector.get('Loader');
        var today = new Date();

        it("должен вернуть массив из объектов OperationalStatistics", function () {
            var opStats, flag = false;
            var periodObj = {
                dateFrom: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
                dateTill: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
                step: "day",
                index: "date"
            }
            runs(myService.search("OperationalStatistics", periodObj, function (data) {
                flag = true;
                opStats = data;
            }));

            waitsFor(function () {
                return flag;
            }, "The objects's array should be received", 750);

            runs(function () {
                expect(opStats).toEqual(jasmine.any(Array));
                for (var i in opStats) {
                    expect(opStats[i]).toEqual(jasmine.any($injector.get('OperationalStatistics')))
                };
            });
        })
    })
});