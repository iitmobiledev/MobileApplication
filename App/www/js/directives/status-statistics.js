myApp.directive('statusStatistics', function (Visit, Status) {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            var visits, salary = 0;

            var updateStatus = function () {
                visits = scope.$eval(attrs.visits);
                salary = 0;

                var statuses = {
                    "new": new Status(),
                    "not-come": new Status(),
                    "come": new Status(),
                    "confirm": new Status()
                };

                for (var i = 0; i < visits.length; i++) {
                    salary += getEmployeeSalary(visits[i].serviceList);

                    angular.forEach(Visit.statuses.titles, function (value, key) {
                        if (visits[i].status == key) {
                            statuses[key].count++;
                            statuses[key].amount += getServicesCost(visits[i].serviceList);
                        }

                    });
                }

                element.find('#newRecordCount').html(statuses["new"].count);
                element.find('#newRecordAmount').html(Math.round(statuses["new"].amount));
                element.find('#notComeCount').html(statuses['not-come'].count);
                element.find('#notComeAmount').html(Math.round(statuses['not-come'].amount));
                element.find('#comeCount').html(statuses['come'].count);
                element.find('#comeAmount').html(Math.round(statuses['come'].amount));
                element.find('#confirmedCount').html(statuses['confirm'].count);
                element.find('#confirmedAmount').html(Math.round(statuses['confirm'].amount));
                element.find('#salary').html(Math.round(salary));
            }

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

//            scope.$watch(attrs.visits, updateStatus);
            updateStatus();
        },
        templateUrl: 'views/statuses-statistics.html'
    }
});