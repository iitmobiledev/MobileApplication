/**
 * @ngdoc service
 * @description Сервис для работы с датами и периодами. 
 * @name myApp.service:DateHelper
 */
myApp.factory('DateHelper', function () {
    var steps = {
        DAY: "day",
        WEEK: "week",
        MONTH: "month"
    }

    /**
     *
     * @ngdoc method
     * @name myApp.service:DateHelper#getPrev
     * @methodOf myApp.service:DateHelper
     * @param {Date} date Дата, для которой будет вычислена
     * предыдущая дата.
     * @param {String} step Указание периода, для которого будет
     * вычсилена предыдущая дата. Валидные значения параметра
     * прописаны в `DateHelper.steps`.  
     * @returns {Date} Предыдущая дата или `null`, если `step` не равен
     * одному из значений `steps`.
     * @description Метод предназначен для получения того же дня на
     * прошлой неделе или прошлой недели, или прошлого месяца.
     * Необходимое указывается параметром `step`.
     */
        function getPrev(date, step) {
            switch (step) {
            case steps.DAY:
                return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
            case steps.WEEK:
                return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
            case steps.MONTH:
                return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
            default:
                return null;
            }
        };

    /**
     *
     * @ngdoc method
     * @name myApp.serviceDateHelper#getPeriod
     * @methodOf myApp.service:DateHelper
     * @param {Date} date Дата, по которой будет определяться период.
     * @param {String} step Шаг, показывающий какой период необходимо
     * вернуть. Валидные значения этого параметра определены в
     * `DateHelper.steps`.
     * @returns {Period} Объект с полями `Date` begin и `Date` end,
     * обозначающими сответственно начальную и конечную даты
     * периода.
     * @description Метод предназначен для получения периода, т.е.
     * начальной даты и конечной даты.
     */
    function getPeriod(date, step) {
        step = step || steps.DAY;
        var period = new function () {
                switch (step) {
                case steps.DAY:
                    this.begin = date;
                    this.end = date;
                    break;
                case steps.WEEK:
                    var weekDay = date.getDay() - 1;
                    if (weekDay < 0)
                        weekDay = 6;
                    this.begin = new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekDay);
                    this.end = new Date(this.begin.getFullYear(), this.begin.getMonth(), this.begin.getDate() + 6);
                    break;
                case steps.MONTH:
                    var begin = new Date(date.getFullYear(), date.getMonth(), 1);
                    this.begin = begin;
                    var tempDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    this.end = new Date(date.getFullYear(), date.getMonth(), tempDate.getDate());
                    break;
                }
            };
        return period;
    };
    
    function getPrevPeriod(date, step){
        var currentPeriod = getPeriod(date, step);
        return getPeriod(new Date(currentPeriod.begin.getFullYear(), currentPeriod.begin.getMonth(), currentPeriod.begin.getDate() - 1), step);
    }
    
    function getNextPeriod(date, step){
        var currentPeriod = getPeriod(date, step);
        return getPeriod(new Date(currentPeriod.end.getFullYear(), currentPeriod.end.getMonth(), currentPeriod.end.getDate() + 1), step);
    }

    /**
     *
     * @ngdoc method
     * @name myApp.serviceDateHelper#getMonthTitle
     * @methodOf myApp.service:DateHelper
     * @param {Number} monthNumber Номер месяца, начиная с 0.
     * @param {String} step Указание периода. Если период равен месяцу,
     * то название месяца будет с заглавной буквы в
     * именительном падеже. Если период равен дню, то название
     * месяца будет в родительном падеже и со строчной буквы.
     * @returns {String} Название месяца.
     * @description Метод для получения названия месяца по его
     * номеру.
     */
    function getMonthTitle(monthNumber, step) {
        if (step == steps.MONTH)
            return ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'][monthNumber] || '';
        if (step == steps.DAY)
            return ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][monthNumber] || '';
        return '';
    };


    /**
     *
     * @ngdoc method
     * @name myApp.serviceDateHelper#getWeekDayTitle
     * @methodOf myApp.service:DateHelper
     * @param {Number} dayNumber Номер дня недели, начиная с воскресенья - 0.
     * @returns {String} Название для недели со строчной буквы или пустая строка, если номер дня < 0 или > 7.
     * @description Метод для получения названия дня недели по его номеру.
     */
    function getWeekDayTitle(dayNumber) {
        return ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'][dayNumber] || '';
    };

    return {
        steps: steps,
        getPrev: getPrev,
        getPeriod: getPeriod,
        getPrevPeriod: getPrevPeriod,
        getNextPeriod: getNextPeriod,
        getMonthTitle: getMonthTitle,
        getWeekDayTitle: getWeekDayTitle
    };
});