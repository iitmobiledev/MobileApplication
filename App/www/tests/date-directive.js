describe('test of dateChanger directive', function () {

    beforeEach(module('myApp'));
    beforeEach(module('date-navigation.html'));

    var scope, elm;

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        
//        template = $templateCache.get('date-navigation.html');
//        console.log(template);
//		$templateCache.put('date-navigation.html',template);
//        console.log($templateCache.get('date-navigation.html'));
//     
        scope.date = new Date();
        scope.steps = ['day','week','month'];
        scope.titles = ["За день", "За неделю", "За месяц"];
        scope.step = 'day';
        scope.future = true;
        scope.prev = true;
        elm = angular.element("<date-changer step='step' date='date' steps='steps' titles='titles' has-future-data='future' has-prev-data='prev'></date-changer>");
        elm = $compile(elm)(scope);
        scope.$apply();
    }));

    describe('', function () {
        it('должен создать группу кнопок для переключения периода',
            function () {
                //var periodButtons = elm.find('#periodButtons')
                //console.log(elm[0].getElementsByTagName('div'));
//                for (var el in elm[0].getElementsByTagName('p'))
//                    console.log(el);
                
                console.log(elm[0].getElementsByTagName('p')['Date']);
                //expect(periodButtons.length).toBe(3);
//                expect(periodButtons.eq(0).text()).toBe('За день');
//                expect(periodButtons.eq(1).text()).toBe('За неделю');
//                expect(periodButtons.eq(2).text()).toBe('За месяц');

                //expect(elm[0].find('#Title').text()).toBe('Сегодня');
                
            });
    });
});