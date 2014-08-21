/**
 * @description Директива для изменения и отображения даты и
 * периода.
 * @ngdoc directive
 * @name myApp.directive:dateChanger
 * @restrict E
 * @param {Date} date Начальная дата для отображения и изменения.
 * @param {Array} steps Все возможные периоды, должны быть прописаны
 * в DateHelper.steps.
 * @param {String} step Начальный период для отображения даты, должен
 * быть равен одному из элементов steps.
 * @param {Array} titles Названия периодов, которые будет видеть
 * пользователь, например ["За день", "За неделю", "За месяц"],
 * должны соответстовать параметру steps поэлементно. 
 * @param {Boolean} hasFutureData Переменная показывает есть ли данные за
 * следующий период.
 * @param {Boolean} hasPrevData Переменная показывает есть ли данные за
 * прошлый период.
 * @param {Boolean} index Переменная показывает влево или вправо была
 * сдвинута страница по свайпу, т.е. уменьшать или увеличивать
 * дату.
 * @requires myApp.service:DateHelper
 */
myApp.directive('dateChanger', function (DateHelper, $filter) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var date, step, hasFutureData, hasPrevData, index;
            step = DateHelper.steps.DAY;

            var updateDate = function () {
                date = scope.$eval(attrs.date);
            };
            scope.$watch(attrs.date, updateDate);
            updateDate();
            

            var updateStep = function () {
                console.log("watch", scope.$eval(attrs.step))
                step = scope.$eval(attrs.step);
            };
            scope.$watch(attrs.step, updateStep);
            updateStep();

            /**
             *
             * @ngdoc method
             * @name myApp.directive:dateChanger#updateSteps
             * @methodOf myApp.directive:dateChanger
             * @description Метод покажет кнопки для изменения периода,
             * если параметр директивы `steps` содержит больше 1
             * елемента или скроет в противном случае.
             */
//            var updateSteps = function () {
//                steps = scope.$eval(attrs.steps);
//                if (steps.length > 1)
//                    element.find('#periodChanger').css('display', 'block');
//                else
//                    element.find('#periodChanger').css('display', 'none');
//            };
//            scope.$watch(attrs.steps, updateSteps);
//            updateSteps();
//
//            var updateTitleSteps = function () {
//                titleSteps = scope.$eval(attrs.titles) || "";
//            };
//            scope.$watch(attrs.titleSteps, updateTitleSteps);
//            updateTitleSteps();

            /**
             *
             * @ngdoc method
             * @name myApp.directive:dateChanger#updateHasFutureData
             * @methodOf myApp.directive:dateChanger
             * @description Метод покажет кнопку для перехода на
             * следующую дату, если параметр директивы `hasFutureData`
             * равен `true` или скроет кнопку в противном случае.
             */
            var updateHasFutureData = function () {
                hasFutureData = scope.$eval(attrs.hasFutureData);
                if (hasFutureData) {
                    element.find("#NextDay").css('display', 'block');
                } else {
                    element.find("#NextDay").css('display', 'none');
                }
            };
            scope.$watch(attrs.hasFutureData, updateHasFutureData);
            updateHasFutureData();

            /**
             *
             * @ngdoc method
             * @name myApp.directive:dateChanger#updateHasPrevData
             * @methodOf myApp.directive:dateChanger
             * @description Метод покажет кнопку для перехода на
             * предыдущую дату, если параметр директивы `hasPrevData`
             * равен `true` или скроет кнопку в противном случае.
             */
            var updateHasPrevData = function () {
                hasPrevData = scope.$eval(attrs.hasPrevData);
                if (hasPrevData)
                    element.find("#PrevDay").css('display', 'block');
                else
                    element.find("#PrevDay").css('display', 'none');
            };
            scope.$watch(attrs.hasPrevData, updateHasPrevData);
            updateHasPrevData();



            scope.$watch('date', function () {
                element.find('#Date').html(getDateString());
            });

            element.find("#PrevDay").bind('click', function () {
                scope[attrs.index] = 0;
                scope.$apply();
            });

            element.find("#NextDay").bind('click', function () {
                scope[attrs.index] = 2;
                scope.$apply();
            });

            /**
             *
             * @ngdoc method
             * @name myApp.directive:dateChanger#setNewDate
             * @methodOf myApp.directive:dateChanger
             * @description Функция для изменения даты. Во внешей
             * области видимости должна быть объявлена переменная
             * `step`, которая показывает текущий период. Валидные
             * значения `step` объявлены в `DateHelper.steps`.
             * @param {Number} sign Знак, который показывает увеличивать
             * или уменьшать дату, должен быть равен 1 или -1.
             */
            function setNewDate(sign) {
                if (step == DateHelper.steps.DAY) {
                    scope[attrs.date] = new Date(date.getFullYear(), date.getMonth(),
                        date.getDate() + sign * 1);
                }
                if (step == DateHelper.steps.WEEK) {
                    scope[attrs.date] = new Date(date.getFullYear(), date.getMonth(),
                        date.getDate() + sign * 7);
                }
                if (step == DateHelper.steps.MONTH) {
                    scope[attrs.date] = new Date(date.getFullYear(), date.getMonth() + sign * 1,
                        date.getDate());
                }
            }

            /**
             *
             * @ngdoc method
             * @name myApp.directive:dateChanger#getDateString
             * @methodOf myApp.directive:dateChanger
             * @description Функция для получения текущей даты в
             * читабельном виде и/или добавления заголовка над
             * датой. Надпись добавляется путем вызова функции
             * `addTitle`.
             * @returns {String} Дата в формате `dd.MM.yyyy`, если текущий
             * период `step` равен дню или неделе, в противном случае
             * возвращает пустую строку.
             */
            function getDateString() {
                element.find('#Title').html(addTitle());
                if (step == DateHelper.steps.DAY) {
                    
                    return (date.getDate() + ' ' + DateHelper.getMonthTitle(date.getMonth(), step) + ' ' + date.getFullYear() + ', ' + DateHelper.getWeekDayTitle(date.getDay()));
                }
                if (step == DateHelper.steps.WEEK) {
                    var period = DateHelper.getPeriod(date, step);
                    return $filter('date')(period.begin, "dd.MM.yyyy") + " - " +
                        $filter('date')(period.end, "dd.MM.yyyy");
                }
                return "";
            }

            element.find('#Date').html(getDateString());


            /**
             *
             * @ngdoc method
             * @name myApp.directive:dateChanger#addTitle
             * @methodOf myApp.directive:dateChanger
             * @description Функция для добавления надписи над датой.
             * Если шаг периода `step` равен дню и текущая
             * дата - это сегодня или вчера, то добавится надпись
             * `Сегодня` или `Вчера`. Если `step` равен неделе, то
             * заголовок добавлен не будет. Если `step` равен месяцу,
             * то будет добавлена надпись с названием текущего
             * месяца и годом, например 'Август 2013'.
             * @returns {String} Надпись, если дата и шаг удовлетворяют
             * описанным критериям, иначе пустая строка.
             */
            function addTitle() {
                if (step == DateHelper.steps.DAY) {
                    //$('#Title').css('font-size', '13px');
                    var today = new Date();
                    var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                    if (date.toDateString() == today.toDateString())
                        return "Сегодня";
                    if (date.toDateString() == yesterday.toDateString())
                        return "Вчера";
                }
                if (step == DateHelper.steps.MONTH) {
                    //$('#Title').css('font-size', '');
                    return DateHelper.getMonthTitle(date.getMonth(), step) + ' ' + date.getFullYear();
                }
                return "";
            }

//            
        },
        templateUrl: 'views/date-navigation.html'
    }
});