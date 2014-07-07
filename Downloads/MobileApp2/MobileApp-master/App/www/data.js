function Data(date, proceeds, profit, clients, workload, tillMoney, morningMoney, credit, debit) {
    this.date = date;
    this.proceeds = proceeds;
    this.profit = profit;
    this.clients = clients;
    this.workload = workload;
    this.tillMoney = tillMoney;
    this.morningMoney = morningMoney;
    this.credit = credit;
    this.debit = debit;

}

function getData(){
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
    manyData.push(new Data(new Date(2014, 6, 7), 5000, 3000, 11, 50, 5000, 3000, 2500, -500));
    return manyData;
}

