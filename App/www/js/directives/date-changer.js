/**
 * @description Директива для изменения и отображения даты и периода.
 * Для обработки свайпа на странице подключения директивы
 * необходимо иметь тег с классом `upage-content`.
 * @ngdoc directive
 * @name myApp.directive:dateChanger
 * @restrict E
 * @param {Date} date начальная дата для отображения и изменения
 * @param {Array} steps все возможные этапы периода, должны быть прописаны
 * в DateHelper.steps
 * @param {String} step начальный период для отображения даты, должен
 * быть равен одному из элементов steps
 * @param {Array} titles названия этапов периода, которые будет видеть
 * пользователь, например ["За день", "За неделю", "За месяц"],
 * должны быть равны по размеру steps
 * @param {Boolean} hasFutureData переменная показывает есть ли данные за
 * следующий период.
 * @param {Boolean} hasPrevData переменная показывает есть ли данные за
 * прошлый период.
 * @param {Boolean} index переменная показывает влево или вправо была
 * сдвинута страница по свайпу.
 */
myApp.directive('dateChanger', function (DateHelper, $filter) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var date, step, steps, titleSteps, hasFutureData, hasPrevData, index;

             /**
             *
             * @ngdoc method
             * @name myApp.directive:dateChanger#updateIndex
             * @methodOf myApp.directive:dateChanger
             * @description Метод, вызывающий другой метод setNewDate для
             * изменения даты в зависимости от параметра директивы
             * index.
             */
            var updateIndex = function () {
                index = scope.$eval(attrs.index);
                if (index !== 1) {
                    switch (index) {
                    case 2:
                        setNewDate(1);
                        break;
                    case 0:
                        setNewDate(-1);
                        break;
                    }
                }
            };
            scope.$watch(attrs.index, updateIndex);
            updateIndex();

            var updateDate = function () {
                date = scope.$eval(attrs.date);
            };
            scope.$watch(attrs.date, updateDate);
            updateDate();

            var updateStep = function () {
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
             * если параметр директивы steps, содержит больше 1
             * елемента, скроет в противном случае.
             */
            var updateSteps = function () {
                steps = scope.$eval(attrs.steps);
                if (steps.length > 1)
                    element.find('#periodChanger').css('display', 'block');
                else
                    element.find('#periodChanger').css('display', 'none');
            };
            scope.$watch(attrs.steps, updateSteps);
            updateSteps();

            var updateTitleSteps = function () {
                titleSteps = scope.$eval(attrs.titles) || "";
            };
            scope.$watch(attrs.titleSteps, updateTitleSteps);
            updateTitleSteps();

             /**
             *
             * @ngdoc method
             * @name myApp.directive:dateChanger#updateHasFutureData
             * @methodOf myApp.directive:dateChanger
             * @description Метод покажет кнопку для перехода на
             * следующую дату, если параметр директивы hasFutureData
             * равен true, скроет кнопку в противном случае.
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
             * предыдущую дату, если параметр директивы hasPrevData
             * равен true, скроет кнопку в противном случае.
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

            scope.$watch('step', function () {
                var period = DateHelper.getPeriod(date, step);
                scope[attrs.date] = new Date(period.begin.getFullYear(), period.begin.getMonth(),
                    period.begin.getDate());
            });

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
             * @description Функция для изменения даты. Должна быть
             * объявлена переменная step, которая показывает
             * выбранный период. Валидные значения step объявлены
             * в DateHelper.steps
             * @param {Number} sign - знак, который показывает увеличивать
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
             * читабельном виде и/или добавления заголока над
             * датой. Надпись добавляется путем вызова функции
             * `updateTitle`.
             * @returns {String} дату в формате `dd.MM.yyyy`, если текущий
             * период step равен дню или неделе, в противном случае
             * возвращает пустую строку.
             */
            function getDateString() {
                element.find('#Title').html(updateTitle());
                if (step == DateHelper.steps.DAY) {
                    return $filter('date')(date, "dd.MM.yyyy");
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
             * @name myApp.directive:dateChanger#updateTitle
             * @methodOf myApp.directive:dateChanger
             * @description Функция для обновления надписи над датой.
             * Если шаг периода step равен дню и текущая
             * дата это сегодня или вчера, то добавится надпись 
             * 'За сегодня' или 'За вчера'. Если step равен неделе, то
             * заголовок добавлен не будет. Если step равен месяцу,
             * то вместо даты будет добавлена только надпись с
             * названием текущего месяца и годом, например 
             * 'Август 2013'.
             * @returns {String} надпись, если дата и шаг удовлетворяют
             * описанным критериям, иначе пустая строка.
             */
            function updateTitle() {
                if (step == DateHelper.steps.DAY) {
                    var today = new Date();
                    var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                    if (date.toDateString() == today.toDateString())
                        return "За сегодня";
                    if (date.toDateString() == yesterday.toDateString())
                        return "За вчера";
                }
                if (step == DateHelper.steps.MONTH) {
                    return DateHelper.getMonthTitle(date.getMonth()) + ' ' + date.getFullYear();
                }
                return "";
            }

            for (var i = 0; i < steps.length; i++) {
                element.find("#periodButtons").append(
                    $("<a>", {
                        "class": "button widget uib_w_6 d-margins",
                        "data-uib": "app_framework/button",
                        "data-ver": "1",
                        text: titleSteps[i],
                        "id": "" + steps[i],
                        click: function () {
                            scope[attrs.step] = this.id;
                            scope.$apply();
                            //$(this).addClass("pressed");
                        }
                    })
                );
            }
        },
        templateUrl: 'date-navigation.html'
    }
});