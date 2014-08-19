describe('myService test', function () {
    describe('when I call myService.one', function () {
        it('returns 1', function () {
            var $injector = angular.injector(['myApp']);
            var myService = $injector.get('Loader');
            //            expect(myService.search).toEqual(jasmine.any(Function));

            var today = new Date();
            var opStats, flag = false;
            var periodObj = {
                dateFrom: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
                dateTill: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
                step: "day",
                index: "date"
            }
            runs(myService.search("OperationalStatistics", periodObj, function (data) {
                console.log("has data");
                flag = true;
                opStats = data;
            }));

            waitsFor(function () {
                return flag;
            }, "The Value should be incremented", 750);

            runs(function () {
                expect(opStats).toEqual(jasmine.any(Array));
            });
        })
    })
});