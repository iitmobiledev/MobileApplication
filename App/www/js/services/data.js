 myApp.service("RealServer", ["$http","DATA_URL", "$rootScope",
     function ($http, DATA_URL, $rootScope) {
         var DataSvc = function (t) {
             this.token = t;
         }

         DataSvc.prototype = {
             baseUrl: DATA_URL,
             get: function (className, primaryKey, callback) {
                 this.restPost("get", className, primaryKey, callback);
             },
             search: function (className, searchParams, callback) {
                 this.restPost("search", className, searchParams, callback);
             },
             lastModified: function (classNames, callback) {
                 this.restPost("lastModified", "", classNames, callback);
             },
             fieldStat: function (request, callback) {
                 this.restPost("fieldStat", "", request, callback);
             },
             restPost: function (method, className, param, callback) {
                 var url = this.baseUrl + method;
                 var params = [];
                 if (className) {
                     params.push("c=" + className);
                 }
                 if (this.token) {
                     params.push("token=" + this.token);
                 }
                 url += "?" + params.join("&");
                 $http({
                     url: url,
                     method: "POST",
                     data: param,
                     responseType: "json",
                 })
                     .success(callback)
                     .error(function (data, status, headers, config) {
                         console.log(
                             "FAILURE", url, $.extend(true, {}, param),
                             status, headers, config
                         );
                         $rootScope.$emit('serverError', '');
                         callback();
                     });
             }
         };
         return DataSvc;
 }]);



 var classesLastModifiedOnServer = {
     "OperationalStatistics": "2014-09-04 09:11:00",
     "Visit": "2014-09-01 09:00:00",
     "Expenditure": "2014-09-01 09:00:00"
 };

 function ClassesLastModified() {
     this.primary = "primary";
     this.OperationalStatistics = "2011-10-06 21:00:00";
     this.Visit = "2011-08-25 21:00:00";
     this.Expenditure = "2011-08-25 21:00:00";
 }


 /**
  * @ngdoc service
  * @description Сервис для генерации данных.
  * @name myApp.service:Server
  * @requires myApp.service:DateHelper
  * @requires myApp.service:Visit
  */
 myApp.service("Server", ["DateHelper", "Visit",
    function (DateHelper, Visit) {

         var classesFieldStat = {
             "OperationalStatistics": {
                 "date": {
                     min: "2014-05-19 00:00:00",
                     max: "2014-10-06 00:00:00"
                 }
             },
             "Visit": {
                 "date": {
                     min: "2014-05-19 00:00:00",
                     max: "2014-09-22 00:00:00"
                 }
             },
             "Expenditure": {
                 "date": {
                     min: "2013-01-01 15:00:00",
                     max: "2014-09-22 00:00:00"
                 }
             }
         };

         var objects = {
             "OperationalStatistics": function () {
                 var dayCount = 380;
                 var allObjects = [];
                 var day = new Date(2014, 9, 7);
                 var currentDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() - dayCount);
                 for (var i = 0; i <= dayCount; i++) {
                     var data = {};
                     data.proceeds = getRandom(1000, 10000);
                     data.profit = getRandom(-1000, 5000);
                     data.clients = Math.round(getRandom(3, 50));
                     data.workload = getRandom(30, 100);
                     data.date = currentDay;
                     data.step = DateHelper.steps.DAY;
                     data.financialStat = getFinanceStatistics(new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate()));
                     data.visible = true;
                     allObjects.push(data);

                     var currentWeek = DateHelper.getPeriod(currentDay, DateHelper.steps.WEEK);
                     if (currentDay.toDateString() == currentWeek.begin.toDateString()) {
                         data = {};
                         data.proceeds = getRandom(7000, 70000);
                         data.profit = getRandom(-7000, 35000);
                         data.clients = Math.round(getRandom(21, 350));
                         data.workload = getRandom(30, 100);
                         data.date = currentDay;
                         data.step = DateHelper.steps.WEEK;
                         data.financialStat = {};
                         data.visible = true;
                         allObjects.push(data);
                     }

                     var currentMonth = DateHelper.getPeriod(currentDay, DateHelper.steps.MONTH);
                     if (currentDay.toDateString() == currentMonth.begin.toDateString()) {
                         data = {};
                         data.proceeds = getRandom(30000, 300000);
                         data.profit = getRandom(-2000, 150000);
                         data.clients = Math.round(getRandom(90, 150));
                         data.workload = getRandom(50, 100);
                         data.date = currentDay;
                         data.step = DateHelper.steps.MONTH;
                         data.financeStat = {};
                         data.visible = true;
                         allObjects.push(data);
                     }

                     currentDay = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() + 1);
                 }

                 return allObjects;
             },
             "Visit": function () {
                 var dayCount = 100;
                 var visits = [];
                 var day = new Date(2014, 9, 30);
                 for (var j = 0; j <= dayCount; j++) {
                     for (var i = 0; i < 4; i++) {
                         var sList = [];
                         var hours = Math.round(getRandom(8, 21));
                         var serviceCost = Math.round(getRandom(500, 10000));
                         var salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
                         var service = {
                             description: "Мелирование",
                             startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
                             endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59))),
                             master: {
                                 id: 1,
                                 firstName: "Оксана",
                                 middleName: "Георгиевна",
                                 lastName: "Ромашкина"
                             },
                             cost: serviceCost,
                             employeeSalary: salary
                         };
                         sList.push(service);
                         var visit = {};
                         visit.id = j * 4 + i;
                         visit.client = {
                             firstName: "Марина",
                             middleName: "Андреевна",
                             lastName: "Пекарская",
                             phone: "+79021565814",
                             balance: getRandom(-1000, 10000),
                             discount: Math.round(getRandom(3, 30))
                         };
                         visit.paid = getRandom(-1000, 10000);
                         visit.serviceList = sList;
                         visit.comment = "Забыла деньги дома. Обещала принести чуть позже."
                         visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
                         visit.status = Visit.statuses.titlesArray[i];
                         visit.visible = true;
                         visits.push(visit);
                     }
                     day = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
                 }
                 return visits;
             },
             "Expenditure": function () {
                 var allObjs = [];
                 var dayCount = 100;
                 var day = new Date(2014, 9, 30);
                 for (var j = 0; j <= dayCount; j++) {
                     var expenditures = {};
                     var expItemsList = [];
                     expItemsList.push({
                         description: "Покупка расходных материалов",
                         cost: -1500
                     });
                     expItemsList.push({
                         description: "Покупка нового кресла",
                         cost: -5000
                     });
                     expenditures.expenditureList = expItemsList;
                     expenditures.date = day;
                     expenditures.visible = true;
                     allObjs.push(expenditures);
                     day = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
                 }
                 return allObjs;
             }
         };

         var classes = {
             "OperationalStatistics": function (params) {
                 var day = params.day || new Date();
                 var data = {};
                 data.proceeds = getRandom(1000, 10000);
                 data.profit = getRandom(-1000, 5000);
                 data.clients = Math.round(getRandom(3, 50));
                 data.workload = getRandom(50, 100);
                 data.date = day;
                 data.step = params.step || DateHelper.steps.DAY;
                 if (params.step == DateHelper.steps.DAY)
                     data.financialStat = getFinanceStatistics(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
                 else
                     data.financialStat = {};
                 data.visible = true;
                 return data;
             },
             "Expenditure": function (params) {
                 var expenditures = {};
                 var expItemsList = [];
                 expItemsList.push({
                     description: "Покупка расходных материалов",
                     cost: -1500
                 });
                 expItemsList.push({
                     description: "Покупка нового кресла",
                     cost: -5000
                 });
                 expenditures.expenditureList = expItemsList;
                 expenditures.date = params.day || new Date();
                 expenditures.visible = true;
                 return expenditures;
             }
         };
         return {
             lastModified: function (query, callbacK) {
                 var result = new ClassesLastModified();
                 for (var i in query)
                     result[query[i]] = classesLastModifiedOnServer[query[i]];
                 callbacK(result);
             },

             fieldStat: function (query, callback) {
                 var result = [];
                 for (var i in query) {
                     var resType = classesFieldStat[query[i].type];
                     var resField = resType[query[i].field];
                     result.push({
                         type: query[i].type,
                         field: query[i].field,
                         min: resField.min,
                         max: resField.max
                     });
                 }
                 callback(result);
             },

             search: function (className, params, callback) {
                 //console.log('search in server');
                 setTimeout(function () {
                     var allObjects = objects[className]();
                     var end = params.offset + params.count;
                     if (end > allObjects.length)
                         end = allObjects.length;
                     var neededObjs = [];
                     for (var i = params.offset; i < end; i++) {
                         neededObjs.push(allObjects[i]);
                     }
                     //classesLastModified[className] = "2014-8-30 14:00"
                     //alert('search in server');
                     callback(neededObjs);
                 }, 500);
             },

             /**
              * @ngdoc method
              * @name myApp.service:Server#search
              * @methodOf myApp.service:Server
              * @param {String} className Имя класса, для которого
              * будут создаваться данные.
              * @param {Object} params Начальная дата, конечная дата и
              * шаг, необходимые для создания данных.
              * @param {Function} callback Функция, которая будет
              * вызвана после создания всех данных, массив
              * этих данных будет передан функции в качестве
              * параметра.
              * @description Метод для получения данных за период.
              */
             searchForPeriod: function (className, params, callback) {
                 classes["Visit"] = function (params) {
                     var visits = [];
                     var day = params.day || new Date();
                     for (var i = 0; i < 4; i++) {
                         var sList = [];
                         var hours = Math.round(getRandom(8, 21));
                         var serviceCost = Math.round(getRandom(500, 10000));
                         var salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
                         var service = {
                             description: "Маникюр",
                             startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, 0),
                             endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 1, 0),
                             master: {
                                 id: 1,
                                 firstName: "Оксана",
                                 middleName: "Георгиевна",
                                 lastName: "Ромашкина"
                             },
                             cost: serviceCost,
                             employeeSalary: salary
                         };
                         sList.push(service);

                         serviceCost = Math.round(getRandom(500, 10000));
                         salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
                         service = {
                             description: "Укладка",
                             startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 1, 0),
                             endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, 0),
                             master: {
                                 id: 2,
                                 firstName: "Анна",
                                 middleName: "Георгиевна",
                                 lastName: "Алевская"
                             },
                             cost: serviceCost,
                             employeeSalary: salary
                         };
                         sList.push(service);

                         var visit = {};
                         visit.id = params.id || Math.round(getRandom(1, 1000));
                         visit.client = {
                             firstName: "Марина",
                             middleName: "Андреевна",
                             lastName: "Пекарская",
                             phone: "+79021565814",
                             balance: getRandom(-1000, 10000),
                             discount: Math.round(getRandom(3, 30))
                         };
                         visit.paid = getRandom(-1000, 10000);
                         visit.serviceList = sList;
                         visit.comment = "Забыла деньги дома. Обещала принести чуть позже."
                         visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
                         visit.status = Visit.statuses.titlesArray[i];
                         visit.visible = true;
                         visits.push(visit);
                     }

                     return visits;
                 };

                 setTimeout(function () {
                     var result = [];
                     var day = params.dateFrom;
                     while (day < params.dateTill || day.toDateString() == params.dateTill.toDateString()) {
                         var data = new classes[className]({
                             day: day,
                             step: params.step
                         });

                         if (data instanceof Array)
                             result = result.concat(data);
                         else
                             result.push(data);
                         day = DateHelper.getNextPeriod(day, params.step).begin;
                     }
                     callback(result);
                 }, 100);
             },

             /**
              * @ngdoc method
              * @name myApp.service:Server#get
              * @methodOf myApp.service:Server
              * @param {String} className Имя класса, для которого
              * будут создаваться данные.
              * @param {String} primary Первичный ключ
              * @param {Function} callback Функция, которая будет
              * вызвана после создания данных, которые будут
              * переданы функции в качестве параметра.
              * @description Метод для получения данных по
              * первичному ключу.
              */
             get: function (className, primary, callback) {
                 classes["Visit"] = function (params) {
                     var day = new Date();
                     var sList = [];
                     var hours = Math.round(getRandom(8, 21));
                     var serviceCost = Math.round(getRandom(500, 10000));
                     var salary = serviceCost - Math.round(getRandom(0, serviceCost / 2));
                     var service = {
                         description: "Маникюр",
                         startTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, Math.round(getRandom(0, 59))),
                         endTime: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + 2, Math.round(getRandom(0, 59))),
                         master: {
                             id: 1,
                             firstName: "Оксана",
                             middleName: "Георгиевна",
                             lastName: "Ромашкина"
                         },
                         cost: serviceCost,
                         employeeSalary: salary
                     };
                     sList.push(service);
                     var visit = {};
                     visit.id = params.id || Math.round(getRandom(0, 1000));
                     visit.client = {
                         firstName: "Марина",
                         middleName: "Андреевна",
                         lastName: "Пекарская",
                         phoneNumber: "+79021565814",
                         balance: getRandom(-1000, 10000),
                         discount: Math.round(getRandom(3, 30))
                     };
                     visit.paid = getRandom(-1000, 10000);
                     visit.serviceList = sList;
                     visit.comment = "Забыла деньги дома. Обещала принести чуть позже."
                     visit.date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours + Math.round(getRandom(-2, 1)), Math.round(getRandom(0, 59)));
                     visit.status = Visit.statuses.titles.CONFIRMED;
                     visit.visible = true;
                     return visit;
                 };

                 var params;
                 primary = primary.split(':');
                 if (primary.length == 1)
                     params = {
                         id: primary[0]
                     };
                 else {
                     params = {
                         day: primary[0],
                         step: primary[1]
                     };
                 }
                 callback(new classes[className](params));
             }
         }
}]);