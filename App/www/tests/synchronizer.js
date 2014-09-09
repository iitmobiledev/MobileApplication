describe('tests for Synchronizer:\n', function () {

    var $injector, loader, synchronizer, storage, server;

    beforeEach(function () {
        $injector = angular.injector(['myApp']);
        loader = $injector.get('Loader');
        synchronizer = $injector.get('Synchronizer');
        storage = $injector.get('Storage');
        server = $injector.get('Server');
        //        spyOn(storage, 'lastModified');
        //        spyOn(server, 'lastModified');
    });


    describe('Synchronizer', function () {
        it("должен начать синхронизацию хранилища с сервером", function () {

            //            spyOn(storage, 'lastModified').andCallFake(function () {
            //                console.log("storage.lastModified");
            //                return {
            //                    primary: "primary",
            //                    OperationalStatistics: "2000-08-25 22:44:00",
            //                    Visit: "2000-08-25 22:44:00",
            //                    Expenditures: "2000-08-25 22:44:00"
            //                };
            //            });
            //            spyOn(server, 'lastModified').andCallFake(function () {
            //                return {
            //                    primary: "primary",
            //                    OperationalStatistics: "2014-08-25 22:44:00",
            //                    Visit: "2014-08-25 22:44:00",
            //                    Expenditures: "2014-08-25 22:44:00"
            //                };
            //            });

            storage.saveLastModify({
                primary: "primary",
                OperationalStatistics: "2000-08-25 21:00:00",
                Visit: "2000-08-25 21:00:00",
                Expenditure: "2000-08-25 21:00:00"
            }, function () {});

            var flag = false;

            spyOn(synchronizer, 'updateData').andCallFake(function () {
                flag = true;
            });

            runs(synchronizer.synchCheck("OperationalStatistics", function () {
                flag = true;
            }));

            waitsFor(function () {
                return flag;
            }, "The synch for OpStat should start", 3000);

            runs(function () {
                expect(synchronizer.updateData).toHaveBeenCalled();
            });
        });

        it("должен не начинать синхронизацию хранилища с сервером", function () {
            spyOn(synchronizer, 'updateData');

            //            spyOn(storage, 'lastModified').andCallFake(function () {
            //                return {
            //                    primary: "primary",
            //                    OperationalStatistics: "2014-08-25 22:44:00",
            //                    Visit: "2014-08-25 22:44:00",
            //                    Expenditures: "2014-08-25 22:44:00"
            //                };
            //            });
            //            spyOn(server, 'lastModified').andCallFake(function () {
            //                return {
            //                    primary: "primary",
            //                    OperationalStatistics: "2014-08-25 22:44:00",
            //                    Visit: "2014-08-25 22:44:00",
            //                    Expenditures: "2014-08-25 22:44:00"
            //                };
            //            });

            storage.saveLastModify({
                primary: "primary",
                OperationalStatistics: "2014-08-25 22:44:00",
                Visit: "2014-08-25 22:44:00",
                Expenditure: "2014-08-25 22:44:00"
            }, function () {});

            var flag = false;

            runs(synchronizer.synchCheck("OperationalStatistics", function () {
                flag = true;
            }));

            waitsFor(function () {
                return flag;
            }, "The synch for OpStat should not start", 1000);

            runs(function () {
                expect(synchronizer.updateData.calls.length).toEqual(0);
            });
        });

        it("должен заново начать синхронизацию", function () {

            var className = "OperationalStatistics";
            var query = ["OperationalStatistics", "Visit", "Expenditure"];

            var lastServerModify;
            server.lastModified(query, function (date) {
                lastServerModify = date[className];
            });

            spyOn(synchronizer, 'updateData').andCallThrough();

            spyOn(server, 'search').andCallFake(function () {
                //меняем дату последних изменений на сервере
                classesLastModifiedOnServer = {
                    "OperationalStatistics": "2014-08-25 23:44:00",
                    "Visit": "2014-08-25 23:44:00",
                    "Expenditure": "2014-08-25 23:44:00"
                };
                server.lastModified(query, function (date) {
                    if (date[className] == lastServerModify) {
                        flag = true;
                        return;
                    } else {
                        lastServerModify = date[className];
                        synchronizer.updateData(className, 20, 0, function () {}, "2014-08-25 20:44:00", lastServerModify);
                    }
                });
            });

            //ставим дату последних изменений в хранилище
            //меньше чем дата изменений на сервере, чтобы
            //начать синхронихацию
            storage.saveLastModify({
                primary: "primary",
                OperationalStatistics: "2000-08-25 21:00:00",
                Visit: "2000-08-25 21:00:00",
                Expenditure: "2000-08-25 21:00:00"
            }, function () {});

            var flag = false;

            runs(synchronizer.synchCheck(className, function () {
                flag = true;
            }));

            waitsFor(function () {
                return flag;
            }, "The synch for OpStat should be start twice", 10000);

            runs(function () {
                expect(server.search).toHaveBeenCalled();
                expect(synchronizer.updateData.calls.length).toEqual(2);
            });
        });
    });
});
