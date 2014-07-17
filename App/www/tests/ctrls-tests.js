describe('tests of controllers', function () {

    beforeEach(module('myApp'));

    var operStatCtrl, scope;

    beforeEach(inject(function ($controller, $filter) {
        scope = {$watch:function(){}};
        filter = $filter;
        operStatCtrl = $controller('OperationalStatisticController', {
            $scope: scope
        });
    }));

    describe('OperationalStatisticController', function () {
        var today = new Date();
        var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        it('должен создать дату = сегодня', function () {
            expect(scope.date.toDateString()).toBe(today.toDateString());
        });
        
        it('должен показать, что нет данных за будущее', function(){
            //scope.date.setDate(tomorrow.getDate());
            expect(scope.hasFutureData()).toBe(false);
        });
        
        it('должен показать, что есть данные за прошлое', function(){
            //scope.date.setDate(yesterday.getDate());
            expect(scope.hasPrevData()).toBe(true);
        });
    });
    
//    describe('DateChangerController', function () {
//        var today = new Date();
//        var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
//        var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
//
//        it('должен изменить дату на вчера', function () {
//            scope.back();
//            expect(scope.date.toDateString()).toBe(yesterday.toDateString());
//        });
//
//        it('должен изменить дату на завтра', function () {
//            scope.forward();
//            expect(scope.date.toDateString()).toBe(tomorrow.toDateString());
//        });
//        
//        it('должен показать дату в виде "dd.mm.yyyy"', function () {
//            expect(scope.getDate()).toBe(filter('date')(scope.date, "dd.MM.yyyy"));
//        });
//        
//        it('должен показать надпись "За сегодня"', function () {
//            scope.getDate();
//            expect(scope.getTitle()).toBe("За сегодня");
//        });
//        
//        it('должен показать надпись "За вчера"', function () {
//            scope.back();
//            scope.getDate();
//            expect(scope.getTitle()).toBe("За вчера");
//        });
//    });
});