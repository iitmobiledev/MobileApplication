describe('test of GraphicController', function () {

    beforeEach(module('myApp'));

    var chartCtrl, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        chartCtrl = $controller('GraphicController', {
            $scope: scope,
        });
    }));

    describe('GraphicController', function () {


        it('период должен быть равен 3', function () {
            scope.$apply();
            expect(scope.period).toBe(3);
        });

        it('должен показать что период меняется с 3 на 5', function () {
            scope.$apply();
            scope.changePeriod(5);
            expect(scope.period).toBe(5);
        });

        it('должен показать заголовок', function () {
            scope.$apply();
            expect(scope.type).toBe('proceeds');
        });
        //
        //        it('должен показать, что есть данные за прошлое', function () {
        //            expect(scope.hasPrevData()).toBe(true);
        //        });
        //
        //        it('должен подгрузить данные за текущий и прошлый период при загрузке приложения, при изменении даты и при изменении периода', function () {
        //            scope.$apply();
        //            expect(OperationalStatisticLoader.calls.length).toBe(4);
        //
        //            scope.date.setDate(yesterday.getDate());
        //            scope.$apply();
        //            expect(OperationalStatisticLoader.calls.length).toBe(6);
        //
        //            scope.step = DateHelper.steps.WEEK;
        //            scope.$apply();
        //            expect(OperationalStatisticLoader.calls.length).toBe(8);
        //        });
    });
});