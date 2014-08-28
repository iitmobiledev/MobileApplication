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
            spyOn(server, 'search');
            spyOn(synchronizer, 'updateData');
            storage.saveLastModify({
                primary: "primary",
                OperationalStatistics: "2000-08-25 21:00:00",
                Visit: "2000-08-25 21:00:00",
                Expenditures: "2000-08-25 21:00:00"
            }, function () {});
            var flag = false;

            runs(synchronizer.synchCheck("OperationalStatistics", function () {
                flag = true;
            }));

            waitsFor(function () {
                return flag;
            }, "The synch for OpStat should start", 60000);

            runs(function () {
                expect(synchronizer.updateData).toHaveBeenCalled();
            });
        });

        it("должен не начинать синхронизацию хранилища с сервером", function () {
            spyOn(server, 'search');
            spyOn(synchronizer, 'updateData');
            storage.saveLastModify({
                primary: "primary",
                OperationalStatistics: "2014-08-25 22:44:00",
                Visit: "2014-08-25 22:44:00",
                Expenditures: "2014-08-25 22:44:00"
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


            spyOn(synchronizer, 'updateData').andCallThrough();
            spyOn(server, 'search').andCallFake(function () {
                server.lastModified("OperationalStatistics", function (date) {
                    if (date == "2014-08-25 20:44:00") {
                        return;
                    } else {
                        synchronizer.updateData("OperationalStatistics", 20, 0, function(){}, "2014-08-25 20:44:00", date);
                    }
                });
            });

            //            var ser = jasmine.createSpyObj('Server', ['search']);

            storage.saveLastModify({
                primary: "primary",
                OperationalStatistics: "2000-08-25 21:00:00",
                Visit: "2000-08-25 21:00:00",
                Expenditures: "2000-08-25 21:00:00"
            }, function () {});

            function changeServerModified() {
                server.classesLastModified = {
                    "OperationalStatistics": "2014-08-25 23:44:00",
                    "Visit": "2014-08-25 23:44:00",
                    "Expenditures": "2014-08-25 23:44:00"
                };
            }

            setTimeout(changeServerModified, 100);

            var flag = false;

            runs(synchronizer.synchCheck("OperationalStatistics", function () {
                flag = true;
            }));

            waitsFor(function () {
                return flag;
            }, "The synch for OpStat should be done", 60000);

            runs(function () {
                expect(server.search).toHaveBeenCalled();
                expect(synchronizer.updateData).toHaveBeenCalled();
            });
        });
    });
});