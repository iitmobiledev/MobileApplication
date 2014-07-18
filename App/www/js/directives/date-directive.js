/**
 * @description Директива для изменения и отображения даты и периода.
 * @ngdoc directive
 * @name dateChanger
 * @restrict E
 */
myApp.directive('dateChanger', function (DateHelper, $filter) {
    return {
        restrict: 'E',
        replace: true,
        link:
        function (scope, element, attrs) {
            var date, step, steps, titleSteps;

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

            var updateSteps = function () {
                steps = scope.$eval(attrs.steps);
                if (steps.length > 1)
                    element.find('#periodChanger').show();
                else
                    element.find('#periodChanger').hide();
            };
            scope.$watch(attrs.steps, updateSteps);
            updateSteps();

            //            var updateTitleSteps = function () {
            //                titleSteps = scope.$eval(attrs.titleSteps);
            //            };
            //            scope.$watch(attrs.titleSteps, updateTitleSteps);
            //            updateTitleSteps();

            scope.$watch('step', function () {
                var period = DateHelper.getPeriod(date, step);
                scope[attrs.date] = new Date(period.begin.getFullYear(), period.begin.getMonth(),
                    period.begin.getDate());
                scope.$apply();
            });

            scope.$watch('date', function () {
                element.find('#Date').html(getDateString());
                hasPrevData();
                hasFutureData();
            });

            var hasPrevData = function () {
                element.find('#PrevDay').show();
                return true;
            };

            var hasFutureData = function () {
                var period = DateHelper.getPeriod(date, step);
                if (period.end > new Date() || period.end.toDateString() == new Date().toDateString()) {
                    element.find('#NextDay').hide();
                    return false;
                } else {
                    element.find('#NextDay').show();
                    return true;
                }
            };

            hasPrevData();
            hasFutureData();

            element.find("#PrevDay").bind('click', function () {
                getNewDate(-1);
            });

            element.find("#NextDay").bind('click', function () {
                getNewDate(1);
            });

            /**
             * Функция для изменения даты в зависимости от
             * установленного шага и параметра - знака
             * @param {Number} sign - знак, который указывает увеличивать
             * или уменьшать дату.
             */
            function getNewDate(sign) {
                if (step == 'day') {
                    scope[attrs.date] = new Date(date.getFullYear(), date.getMonth(),
                        date.getDate() + sign * 1);
                    scope.$apply();
                }
                if (step == 'week') {
                    scope[attrs.date] = new Date(date.getFullYear(), date.getMonth(),
                        date.getDate() + sign * 7);
                    scope.$apply();
                }
                if (step == 'month') {
                    scope[attrs.date] = new Date(date.getFullYear(), date.getMonth() + sign * 1,
                        date.getDate());
                    scope.$apply();
                }
            }

            activeButtonHandling();

            /**
             * Функция для получения текущей даты в читабельном виде
             * @return {Date} date
             * @require $filter для форматирования даты
             */
            function getDateString() {
                if (step == 'day') {
                    element.find('#Title').html(updateTitle());
                    return $filter('date')(date, "dd.MM.yyyy");
                } else {
                    element.find('#Title').html("");
                    var period = DateHelper.getPeriod(date, step);
                    return $filter('date')(period.begin, "dd.MM.yyyy") + " - " +
                        $filter('date')(period.end, "dd.MM.yyyy");
                }
            }

            element.find('#Date').html(getDateString());

            /**
             * Функция для обновления надписи над датой в зависимости
             * от установленной даты.
             * @return {String} "", или "За сегодня", или "За завтра".
             */
            function updateTitle() {
                var today = new Date();
                var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
                if (date.toDateString() == today.toDateString())
                    return "За сегодня";
                if (date.toDateString() == yesterday.toDateString())
                    return "За вчера";
                return "";
            }

            /**
             * Обработка левого свайпа - увеличение текущей даты
             */
            $(".upage-content").on('swipeLeft', function () {
                if (hasFutureData()) {
                    getNewDate(1);
                }
            });

            /**
             * Обработка правого свайпа - уменьшение текущей даты
             */
            $(".upage-content").on('swipeRight', function () {
                if (hasPrevData()) {
                    getNewDate(-1);
                }
            });

            titleSteps = ['За день', 'За неделю', 'За месяц'];

            for (var i = 0; i < steps.length; i++) {
                element.find("#periodButtons").append(
                    $("<a>", {
                        "class": "button widget uib_w_6 d-margins gray",
                        "data-uib": "app_framework/button",
                        "data-ver": "1",
                        text: titleSteps[i],
                        "id": "" + steps[i],
                        click: function () {
                            scope[attrs.step] = this.id;
                            scope.$apply();
                        }
                    })
                );
            }
        },
        templateUrl: 'date-navigation.html'
    }
});