describe('test of dateChanger directive', function () {

    beforeEach(module('myApp'));
     beforeEach(module('tmpls'));
    //beforeEach(module('date-navigation.html'));

    var scope, elm;

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        scope.date = new Date();
        scope.steps = ['day','week','month'];
        scope.titles = ["За день", "За неделю", "За месяц"];
        scope.step = 'day';
        scope.future = true;
        scope.prev = true;
        elm = $compile("<date-changer step='step' date='date' steps='steps' titles='titles' has-future-data='future' has-prev-data='prev'></date-changer>")(scope);
        scope.$apply();
    }));

    describe('', function () {
        it('должен создать группу кнопок для переключения периода',
            function () {
                var periodButtons = elm.find('#periodChanger');

                //expect(periodButtons.length).toBe(3);
                expect(periodButtons.eq(0).text()).toBe('За день');
                expect(periodButtons.eq(1).text()).toBe('За неделю');
                expect(periodButtons.eq(2).text()).toBe('За месяц');
                
                var title = elm.find('##Title');
                expect(title.eq(0).text()).toBe('Сегодня');
                
            });
    });
});