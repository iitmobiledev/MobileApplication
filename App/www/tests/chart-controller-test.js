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

        //        it('должен показать заголовок', function () {
        //            scope.$apply();
        //            expect(scope.type).toBe('proceeds');
        //        });        //
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


//describe('Unit testing great quotes', function () {
//    var $link;
//    var $rootScope;
//
//    // Load the myApp module, which contains the directive
//    beforeEach(module('myApp'));
//    //    beforeEach(angular.mock.module('myApp'));
//
//    // Store references to $rootScope and $compile
//    // so they are available to all tests in this describe block
//    beforeEach(inject(function (_$link_, _$rootScope_) {
//        // The injector unwraps the underscores (_) from around the parameter names when matching
//        $link = _$link_;
//        $rootScope = _$rootScope_;
//    }));
//
//    it('Replaces the element with the appropriate content', function () {
//        // Compile a piece of HTML containing the directive
//        var element = $link("<loadBar></loadBar>")($rootScope);
//        // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
//        $rootScope.$digest();
//        // Check that the compiled element contains the templated content
//        expect(element.html()).toContain("lidless, wreathed in flame, 2 times");
//    });
//});