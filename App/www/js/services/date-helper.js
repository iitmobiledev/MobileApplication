/**
 * @ngdoc service
 * @description Сервис для работы с датами. Позволяет получить
 * предыдущую дату с помощью метода `getPrev`, получить период методом
 * `getPeriod`, получить возможные шаги полем `steps`.
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
     * @name myApp.serviceDateHelper#getPrev
     * @methodOf myApp.service:DateHelper
     * @param {Date} date дата, для которой будет вычислена предыдущая
     * дата.
     * @param {String} step шаг, показывающий за какой период
     * необходимо вычислить предыдущую дату.
     * @returns {Date} предыдущая дата.
     * @description Метод предназначен для получения того же дня на
     * прошлой неделе или прошлой недели, или прошлого месяца.
     * Необходимое указывается параметром step.
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
     * @param {Date} date дата, по которой будет определяться период.
     * @param {String} step шаг, показывающий какой период необходимо
     * вернуть, должен быть определен в DateHelper.steps.
     * @returns {Period} объект с полями {Date} begin и {Date} end, обозначающими
     * начальную и конечную даты периода.
     * @description Метод предназначен для получения периода, т.е.
     * начальной даты и конечной даты.
     */
    function getPeriod(date, step) {
        var period = new function () {
                switch (step) {
                case steps.DAY:
                    this.begin = date;
                    this.end = date;
                    break;
                case steps.WEEK:
                    var weekDay = date.getDay() - 1; // для начала недели с понедельника
                    if (weekDay < 0)
                        weekDay = 6;
                    this.begin = new Date(date.getFullYear(), date.getMonth(), date.getDate() - weekDay);
                    this.end = new Date(date.getFullYear(), date.getMonth(), this.begin.getDate() + 6);
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

    /**
     *
     * @ngdoc method
     * @name myApp.serviceDateHelper#getMonthTitle
     * @methodOf myApp.service:DateHelper
     * @param {Number} monthNumber номер месяца, начиная с 0
     * @returns {String} название месяца
     * @description Метод для получения названия месяца по его номеру
     */
    function getMonthTitle(monthNumber) {
        switch (monthNumber + '') {
        case '0':
            return 'Январь';
        case '1':
            return 'Февраль';
        case '2':
            return 'Март';
        case '3':
            return 'Апрель';
        case '4':
            return 'Май';
        case '5':
            return 'Июнь';
        case '6':
            return 'Июль';
        case '7':
            return 'Август';
        case '8':
            return 'Сентябрь';
        case '9':
            return 'Октябрь';
        case '10':
            return 'Ноябрь';
        case '11':
            return 'Декабрь';
        default:
            return '';
        }
    };

    return {
        steps: steps,
        getPrev: getPrev,
        getPeriod: getPeriod,
        getMonthTitle: getMonthTitle
    };
});