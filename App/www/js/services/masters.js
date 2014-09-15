myApp.factory('MastersForPeriod', function (DateHelper, Loader, $filter) {
    /**
     *
     * @ngdoc method
     * @name myApp.service:MastersLoader#checkMasterInList
     * @methodOf myApp.service:MastersLoader
     * @description Проверяет есть ли мастер в списке мастеров.
     * @param {Object} master Объект мастер.
     * @param {Array}  masters Список мастеров.
     * @returns {Null or Number}  Индекс мастера, если он есть в списке,
     * иначе - null.
     */
    function checkMasterInList(master, masters) {
        for (var i = 0; i < masters.length; i++) {
            if (master.id === masters[i].master.id) {
                return i;
            }
        }
        return null;
    }

    function checkVisitInList(visit, visits) {
        for (var i = 0; i < visits.length; i++) {
            if (visit.id === visits[i].id) {
                return i;
            }
        }
        return null;
    }

    function perMaster(master, visit) {
        this.master = master;
        this.visList = [];
        if (visit) {
            this.visList.push(visit);
        }
    }

    /**
     *
     * @ngdoc method
     * @name myApp.service:MastersLoader#getGoodVisitsList
     * @methodOf myApp.service:MastersLoader
     * @param {Array} masterList список визитов мастера
     * @description Метод, формирующий список объектов "визит" с дополнительными информационными полями
     * @returns {Object} Список объектов "визит" с новыми полями
     */
    function getGoodVisitsList(masterList, id) {
        var nmav = [];
        for (var i = 0; i < masterList.length; i++) {
            nmav.push(selectVisitInfo(masterList[i], id));
        }
        for (var j = 1; j < nmav.length; j++) {
            if (nmav[j].startTime != nmav[j - 1].endTime) {
                nmav[j - 1].downTime = $filter('date')(nmav[j - 1].endTime, "HH:mm") + '-' + $filter('date')(nmav[j].startTime, "HH:mm");
                nmav[j - 1].isDownTime = true;
            }
        }
        return nmav;
    }


    /**
     *
     * @ngdoc method
     * @name myApp.service:MastersLoader#selectVisitInfo
     * @methodOf myApp.service:MastersLoader
     * @param {Object} visit Объект визит
     * @description Метод, формирующий объект визит с дополнительными информационными полями
     * @returns {Object} Объект визит с новыми полями
     */
    function selectVisitInfo(visit, id) {
        var services = [],
            startTimes = [],
            endTimes = [],
            coast = 0;
        for (var j = 0; j < visit.serviceList.length; j++) {
            var service = visit.serviceList[j]
            if (id == service.master.id) {
                services.push(service);
                coast += service.cost
                startTimes.push(service.startTime);
                endTimes.push(service.endTime);
            }
        }
        var result = {};
        result.id = visit.id;
        result.status = visit.status;
        result.client = visit.client;
        result.serviceList = services;
        result.cost = coast + ' р.';
        result.startTime = Math.min.apply(null, startTimes);
        result.endTime = Math.max.apply(null, endTimes);
        result.isDownTime = false;
        result.downTime = '';
        //        console.log("res-visit", result);
        return result;
    }

    return function (visits, period) {
        var visitsByDate = {};
        for (var tmpDate = new Date(period.begin); tmpDate <= new Date(period.end); tmpDate.setDate(tmpDate.getDate() + 1)) {
            var key = tmpDate.toDateString();
            visitsByDate[key] = [];
        }
        //            console.log(" visitsByDate", visitsByDate);
        angular.forEach(visits, function (visit) {
            //                console.log(visit);
            visitsByDate[visit.date.toDateString()].push(visit);
        });

        var list = [];
        for (var date = period.begin; date < period.end || date.toDateString() == period.end.toDateString(); date.setDate(date.getDate() + 1)) {
            if (visitsByDate[date.toDateString()]) {
                list.push(visitsByDate[date.toDateString()]);
            }
        }

        var result = [];
        for (var i in list) {
            //                console.log(list[i]);
            if (list[i].length != 0) {
                result.push(list[i].sort(function (a, b) {
                    return new Date(a.date).getTime() - new Date(b.date).getTime()
                }));
            }
        }
        var data = result;

        var mastersForPeriod = [];
        for (var k = 0; k < data.length; k++) {
            var mastersForDay = [];
            for (var i = 0; i < data[k].length; i++) {
                for (var j = 0; j < data[k][i].serviceList.length; j++) {
                    var usl = checkMasterInList(data[k][i].serviceList[j].master, mastersForDay);
                    if (usl !== null) {
                        if (checkVisitInList(data[k][i], mastersForDay[usl].visList) == null)
                            mastersForDay[usl].visList.push(data[k][i]);
                    } else {
                        if (data[k][i].serviceList[j].master)
                            mastersForDay.push(new perMaster(data[k][i].serviceList[j].master, data[k][i]));
                    }
                }
            }

            mastersForDay = mastersForDay.sort(function (a, b) {
                if (typeof (b.master.lastName) == 'undefined')
                    b.master.lastName = "";
                if (a.master.lastName.toLowerCase() < b.master.lastName.toLowerCase())
                    return -1;
                if (nameA = a.master.lastName.toLowerCase() > b.master.lastName.toLowerCase())
                    return 1;
                return 0;
            });

            for (var i in mastersForDay) {
                var vlist = mastersForDay[i].visList;
                mastersForDay[i].visList = getGoodVisitsList(vlist, mastersForDay[i].master.id);
            }
            //                console.log('mastersForDay', mastersForDay);
            mastersForPeriod.push(mastersForDay);
        }
        return mastersForPeriod;
    };
});