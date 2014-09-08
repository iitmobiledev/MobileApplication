myApp.directive('statusStatistics', function (Visit) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var visits, salary = 0;

            var updateStatus = function () {
                visits = scope.$eval(attrs.visits);
//                console.log("visits in dir ", visits);
                
                salary = 0;

                var statuses = {
                    newRecord: new Status(),
                    notCome: new Status(),
                    come: new Status(),
                    confirmed: new Status()
                };

                for (var i = 0; i < visits.length; i++) {
                    salary += getEmployeeSalary(visits[i].serviceList);

                    switch (visits[i].status) {
                    case Visit.statuses.titles.NEW:
                        statuses.newRecord.count++;
                        statuses.newRecord.amount = getServicesCost(visits[i].serviceList);
                        break;
                    case Visit.statuses.titles.NOTCOME:
                        statuses.notCome.count++;
                        statuses.notCome.amount = getServicesCost(visits[i].serviceList);
                        break;
                    case Visit.statuses.titles.COME:
                        statuses.come.count++;
                        statuses.come.amount = getServicesCost(visits[i].serviceList);
                        break;
                    case Visit.statuses.titles.CONFIRMED:
                        statuses.confirmed.count++;
                        statuses.confirmed.amount = getServicesCost(visits[i].serviceList);
                        break;
                    }
                }

                element.find('#newRecordCount').html(statuses.newRecord.count);
                element.find('#newRecordAmount').html(statuses.newRecord.amount);
                element.find('#notComeCount').html(statuses.notCome.count);
                element.find('#notComeAmount').html(statuses.notCome.amount);
                element.find('#comeCount').html(statuses.come.count);
                element.find('#comeAmount').html(statuses.come.amount);
                element.find('#confirmedCount').html(statuses.confirmed.count);
                element.find('#confirmedAmount').html(statuses.confirmed.amount);
                element.find('#salary').html(salary);
            }
//            scope.$watch(attrs.visits, updateStatus);

            function getServicesCost(services) {
                var amount = 0;
                for (var j = 0; j < services.length; j++) {
                    amount += services[j].cost;
                }
                return amount;
            }

            function getEmployeeSalary(services) {
                var salary = 0;
                for (var j = 0; j < services.length; j++) {
                    salary += services[j].employeeSalary;
                }
                return salary;
            }
            updateStatus();
        },
        templateUrl: 'views/statuses-statistics.html'
    }
});