function Data(date, proceeds, profit, clients, workload, tillMoney, morningMoney, credit, debit) {
    this.date = date; //дата за которую получаем все данные                                          
    this.proceeds = proceeds; //выручка
    this.profit = profit; //прибыль  
    this.clients = clients; //количество клиентов
    this.workload = workload; //загруженность
    this.tillMoney = tillMoney; //денег в кассе
    this.morningMoney = morningMoney; //денег на утро
    this.credit = credit; //расход      
    this.debit = debit; //приход
}

//function getData(startDate, endDate) { //метод возвращающий данные за какой-то период
//    for (int day = startDate; day <= endDate; day++) {
//        var proceeds += day.getProceeds();
//        var profit += day.getProfit();
//        var clients += day.getClients();
//        var workload += day.getwWorkload();
//        var tillMoney += day.getTillMoney();
//        var morningMoney += day.getMorningMoney();
//        var credit += day.getCredit();
//        var debit += day.getDebit();
//    }
//    return new Data(proceeds, profit, clients, workload, tillMoney, morningMoney, credit, debit); //решить вопрос с датой(массив дат)
//}
//
//function getData(day) {
//    var proceeds = day.getProceeds();
//    var profit = day.getProfit();
//    var clients = day.getClients();
//    var workload = day.getwWorkload();
//    var tillMoney = day.getTillMoney();
//    var morningMoney = day.getMorningMoney();
//    var credit = day.getCredit();
//    var debit = day.getDebit();
//    return new Data(proceeds, profit, clients, workload, tillMoney, morningMoney, credit, debit);
//}

function getData() {
    var manyData = [];
    manyData.push(new Data(new Date(2014, 6, 5), 1000, 3000, 12, 70, 5000, 3000, 2500, -500));
    manyData.push(new Data(new Date(2014, 6, 4), 2000, 2000, 5, 80, 5000, 3000, 2500, -500));
    manyData.push(new Data(new Date(2014, 6, 3), 5000, 4000, 10, 50, 5000, 3000, 2500, -500));
    manyData.push(new Data(new Date(2014, 6, 2), 3000, 1000, 9, 70, 5000, 3000, 2500, -500));
    manyData.push(new Data(new Date(2014, 6, 1), 4000, 2000, 7, 80, 5000, 3000, 2500, -500));
    manyData.push(new Data(new Date(2014, 5, 30), 5000, 3000, 11, 50, 5000, 3000, 2500, -500));
    manyData.push(new Data(new Date(2014, 5, 29), 2500, 2000, 6, 50, 5000, 3000, 2500, -500));
    manyData.push(new Data(new Date(2014, 5, 28), 1000, 1000, 5, 50, 5000, 3000, 2500, -500));
    manyData.push(new Data(new Date(2014, 6, 6), 1000, 3000, 12, 70, 5000, 3000, 2500, -500));
    return manyData;
}