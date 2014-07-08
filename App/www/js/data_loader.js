myApp.factory('loader', function () {
    return function (startDay, endDay, step) {
        var manyData = getData();

        if (startDay == endDay) {
            manyData = manyData.filter(function (d) {
                return (d.date.toDateString() == startDay.toDateString());
            });
        } else {
            manyData = manyData.filter(function (d) {
                return (d.date <= startDay && d.date >= endDay);

            });
        }
        return manyData;
    };
})