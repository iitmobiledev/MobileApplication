describe('tests of controllers', function () {

    beforeEach(module('myApp'));

    var operStatCtrl, scope, DateHelper,  OperationalStatisticLoader;
        

    beforeEach(inject(function ($controller, $filter, $rootScope, DateHelper) {
        scope = $rootScope.$new();
        filter = $filter;
        OperationalStatisticLoader= jasmine.createSpy("OperationalStatisticLoaderSpy");
        operStatCtrl = $controller('OperationalStatisticController', {
            $scope: scope,
            OperationalStatisticLoader: OperationalStatisticLoader,
            DateHelper: DateHelper
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
            expect(scope.hasFutureData()).toBe(false);
        });
        
        it('должен показать, что есть данные за прошлое', function(){
            expect(scope.hasPrevData()).toBe(true);
        });
        
        it('должен подгрузить данные за текущий период', function(){
            //scope.date.setDate(tomorrow.getDate());
            scope.$apply();
             //console.log("TIMES LOADER HAS BEEN CALLED = ",OperationalStatisticLoader.calls.length)
            expect(OperationalStatisticLoader.calls.length).toBe(4);
            scope.date.setDate(tomorrow.getDate());
            scope.$apply();
            expect(OperationalStatisticLoader.calls.length).toBe(6);
            //expect(OperationalStatisticLoader.calls.count()).toBe(6);
            //console.log("TIMES LOADER HAS BEEN CALLED = ",OperationalStatisticLoader.calls.length);
            /*expect(OperationalStatisticLoader).toHaveBeenCalledWith(new Date(), 'day');
            expect(OperationalStatisticLoader).toHaveBeenCalledWith(DateHelper.getPrev(new Date(), 'day'), 'day');*/
            
//            expect(scope.data).not.toBeUndefined();
//            scope.date.setDate(yesterday.getDate());
//            expect(scope.data).not.toBeUndefined();
        });
        
//        it('должен подгрузить данные за прошлый период', function(){
//            expect(scope.prevData).not.toBeUndefined();
//            scope.date.setDate(tomorrow.getDate());
//            expect(scope.prevData).not.toBeUndefined();
//            scope.date.setDate(yesterday.getDate());
//            expect(scope.prevData).not.toBeUndefined();
//        });
        
//        it('должен вызвать сервис OperationalStatisticLoader', function(){
//            scope.date.setDate(tomorrow.getDate());
//            expect(OperationalStatisticLoader).toHaveBeenCalled();
//        });
        
//        it('должен вызвать сервис DateHelper', function(){
//            //scope.date.setDate(tomorrow.getDate());
//            expect(DateHelper.getPrev).toHaveBeenCalled();
//        });
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