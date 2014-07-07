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

//{
//    tillMoney: 12345
//}
//
//
//function getData(startDate, endDate, step) { //метод возвращающий данные за какой-то период
//    
//    for (int day = startDate; day <= endDate; ) {
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
    manyData.push(new Data(new Date(2014, 6, 6), 1000, 3000, 12, 70, 5000, 3000, 2500, -500));
    manyData.push(new Data(new Date(2014, 6, 5), 2000, 1000, 5, 15, 7000, 9000, 1500, +5050));
    manyData.push(new Data(new Date(2014, 6, 4), 5000, 7000, 15, 85, 3000, 1000, 500, -5400));
    manyData.push(new Data(new Date(2014, 6, 3), 7000, 500, 13, 60, 6000, 2000, 1700, +2100));
    manyData.push(new Data(new Date(2014, 6, 2), 100, 3500, 10, 45, 900, 3500, 4500, -10000));
    manyData.push(new Data(new Date(2014, 6, 7), 5555, 3500, 10, 45, 900, 3500, 4500, -10000));
    manyData.push(new Data(new Date(2014, 6, 1), 1000, 3500, 10, 45, 900, 3500, 4500, -1000));
    manyData.push(new Data(new Date(2014, 5, 15), 7777, 3500, 10, 45, 900, 3500, 4500, -1000));
    return manyData;
}