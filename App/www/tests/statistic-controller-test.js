describe('test of OperationalStatisticController', function () {

    beforeEach(module('myApp'));

    var operStatCtrl, scope, OperationalStatisticLoader, DateHelper;

    beforeEach(inject(function ($controller, $filter, $rootScope, _DateHelper_) {
        scope = $rootScope.$new();
        filter = $filter;
        OperationalStatisticLoader = jasmine.createSpy("OperationalStatisticLoaderSpy");
        DateHelper = _DateHelper_;
        operStatCtrl = $controller('OperationalStatisticController', {
            $scope: scope,
            OperationalStatisticLoader: OperationalStatisticLoader,
            DateHelper: _DateHelper_
        });
    }));

    describe('OperationalStatisticController', function () {
        var today = new Date();
        var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

        it('должен создать дату = сегодня', function () {
            expect(scope.date.toDateString()).toBe(today.toDateString());
        });

        it('должен показать, что нет данных за будущее', function () {
            expect(scope.hasFutureData()).toBe(false);
        });

        it('должен показать, что есть данные за прошлое', function () {
            expect(scope.hasPrevData()).toBe(true);
        });

        it('должен подгрузить данные за текущий и прошлый период при загрузке приложения, при изменении даты и при изменении периода', function () {
            scope.$apply();
            expect(OperationalStatisticLoader.calls.length).toBe(4);

            scope.date.setDate(yesterday.getDate());
            scope.$apply();
            expect(OperationalStatisticLoader.calls.length).toBe(6);

            scope.step = DateHelper.steps.WEEK;
            scope.$apply();
            expect(OperationalStatisticLoader.calls.length).toBe(8);
        });
    });
});