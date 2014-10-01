////Расходы
//function Expenditures(date, expenditureList) {
//    this.date = date; //дата, за которые получаем расходы
//    this.expenditureList = expenditureList; //список расходов
//}
//
////Статья расходов
//function ExpenditureItem(description, cost) {
//    this.description = description; //описание статьи расходов
//    this.cost = cost; //стоимость
//}

myApp.factory('Expenditure', function (Model, DateHelper) {
    var Expenditure = Model("Expenditure", {
        deserialize: function (self, data) {
            self.date = new Date(data.date);
            self.amount = data.amount;
            self.id = data.id;
            self.description = data.description || "Расход№" + data.id;
        },
        primary: ['id'],
        indexes: ['date']
    });

    //    Expenditure.searchIndexedDb = function (trans, params, callback) {
    //        var result = [];
    //        var dates = [];
    //        var store = trans.objectStore("Expenditure"); //найдем хранилище для объектов данного класса
    //        var keyRange = IDBKeyRange.bound(new Date(params.dateFrom), new Date(params.dateTill));
    //        console.log(keyRange);
    //        var request = store.index("date").openCursor(keyRange);
    //
    //        request.onerror = function (event) {
    //            callback(null);
    //        };
    //        request.onsuccess = function (event) {
    //            var cursor = event.target.result;
    //            if (cursor) {
    //                result.push(cursor.value);
    //                cursor.continue();
    //            }
    //        };
    //
    //        trans.oncomplete = function (e) {
    //            if (result.length != 0) {
    //                callback(result);
    //            } else {
    //                callback(null);
    //            }
    //        }
    //    }

    Expenditure.keysByDates = {};
    Expenditure.onUpdate = function (obj) {
        var key = Expenditure.keysByDates[obj.date.toDateString()] || [];
        key.push("Expenditure" + obj.getKey());
        Expenditure.keysByDates[obj.date.toDateString()] = key;
        console.log(Expenditure.keysByDates);
    }

    Expenditure.searchInLocalStorage = function (params, callback) {
        var keys = [];
        var startDate = new Date(params.dateFrom);
        var endDate = new Date(params.dateTill);
        for (var i = startDate; i < endDate || i.toDateString() == endDate.toDateString(); i = DateHelper.getNextPeriod(new Date(i), params.step).begin) {
            console.log("date.toDateString()", i.toDateString());

            if (Expenditure.keysByDates[i.toDateString()]) {
                console.log("keys:", Expenditure.keysByDates[i.toDateString()])
                for (key in Expenditure.keysByDates[i.toDateString()]) {
                    keys.push(key);
                }
            }
        }
        return keys;
    }

    return Expenditure;
});

/*
myApp.factory('Expenditures', function (Model, ExpenditureItem) {
    var exps = Model("Expenditures", {
        deserialize: function (self, data) {
            self.date = new Date(data.date);
            var expItems = [];
            for (var i = 0; i < data.expenditureList.length; i++) {
                expItems.push(new ExpenditureItem(data.expenditureList[i]));
            }
            self.expenditureList = expItems;
        },
        serialize: function (self) {
            self.constructor.prototype.call(self)
            var data = angular.extend({}, self);
            return data;
        },
        primary: ['date'],
        indexes: {
            date: false
        }
    });
    exps.searchIndexedDb = function (trans, params, callback) {
        var result = [];
        var dates = [];
        var store = trans.objectStore("Expenditures"); //найдем хранилище для объектов данного класса
        var keyRange = IDBKeyRange.bound(new Date(params.dateFrom), new Date(params.dateTill));
        console.log(keyRange);
        var request = store.index(params.index).openCursor(keyRange);

        request.onerror = function (event) {
            callback(null);
        };
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                result.push(cursor.value);
                cursor.
                continue ();
            }
        };

        trans.oncomplete = function (e) {
            if (result.length != 0) {
                callback(result);
            } else
                callback(null);
        }
    }

    return exps;
});
*/