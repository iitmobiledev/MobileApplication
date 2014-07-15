describe('Statistic controllers', function () {

    beforeEach(module('myApp'));

    var operStatCtrl, scope, dateChangerCtrl, chartCtrl;

    beforeEach(inject(function ($controller, $filter) {
        scope = {$watch:function(){}};
        filter = $filter;
        operStatCtrl = $controller('OperationalStatisticController', {
            $scope: scope
        });
        dateChangerCtrl = $controller('DateChangerController', {
            $scope: scope
        });
//        chartCtrl = $controller('GraphicController', {
//            $scope: scope
//        });
    }));

    describe('OperationalStatisticController', function () {

        var today = new Date();
        var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        it('должен создать дату = сегодня', function () {
            expect(scope.date.toDateString()).toBe(today.toDateString());
        });
        
        it('должен изменить дату', function () {
            scope.setDate(10);
            expect(scope.date.toDateString()).not.toBe(today.toDateString());
        });

        it('должен изменить период на день и дату на сегодня', function () {
            scope.forDay();
            expect(scope.date.toDateString()).toBe(today.toDateString());
            expect(scope.step).toBe(1);
        });
        
        it('должен изменить период на неделю и дату на сегодня', function () {
            scope.forWeek();
            expect(scope.date.toDateString()).toBe(today.toDateString());
            expect(scope.step).toBe(7);
        });
        
        it('должен изменить период на месяц и дату на сегодня', function () {
            scope.forMonth();
            expect(scope.date.toDateString()).toBe(today.toDateString());
            expect(scope.step).toBe(30);
        });
    });
    
    describe('DateChangerController', function () {
        var today = new Date();
        var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        it('должен изменить дату на вчера', function () {
            scope.back();
            expect(scope.date.toDateString()).toBe(yesterday.toDateString());
        });

        it('должен изменить дату на завтра', function () {
            scope.forward();
            expect(scope.date.toDateString()).toBe(tomorrow.toDateString());
        });
        
        it('должен показать дату в виде "dd.mm.yyyy"', function () {
            expect(scope.getDate()).toBe(filter('date')(scope.date, "dd.MM.yyyy"));
        });
        
        it('должен показать надпись "За сегодня"', function () {
            scope.getDate();
            expect(scope.getTitle()).toBe("За сегодня");
        });
        
        it('должен показать надпись "За вчера"', function () {
            scope.back();
            scope.getDate();
            expect(scope.getTitle()).toBe("За вчера");
        });
    });
});