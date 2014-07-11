function OperationalStatistics(date, proceeds, profit, clients, workload) {
    this.date = date; //дата за которую получаем все данные
    this.proceeds = proceeds; //выручка
    this.profit = profit; //прибыль  
    this.clients = clients; //количество клиентов
    this.workload = workload; //загруженность
}

function FinanceStatistics(tillMoney, morningMoney, credit, debit) {
    this.tillMoney = tillMoney; //денег в кассе
    this.morningMoney = morningMoney; //денег на утро
    this.credit = credit; //расход      
    this.debit = debit; //приход
}

//Расходы
function Expenditures(date, expenditureList) {
    this.date = date; //дата, за которые получаем расходы
    this.expenditureList = expenditureList; //список расходов
}

//Статья расходов
function ExpenditureItem(description, cost) {
    this.description = description; //описание статьи расходов
    this.cost = cost; //стоимость
}

//Запись
function Record(client, serviceList, comment, date) {
    this.client = client; //клиент
    this.serviceList = serviceList; //список услуг
    this.comment = comment; //коментарий
    this.date = date; //дата оказания услуги
}

//Клиент
function Client(firstName, middleName, lastName, phoneNumber, balance, discount) {
    this.firstName = firstName;//имя
    this.middleName = middleName;// отчество
    this.lastName = lastName;//фамилия
    this.phoneNumber = phoneNumber; //номер телефона
    this.balance = balance; //баланс
    this.discount = discount; // скидка
}

//Услуга
function Service(description, startTime, endTime, master, cost){
    this.description = description; //название услуги
    this.startTime = startTime; //время начала оказания услуги
    this.endTime = endTime; //время конца оказания услуги
    this.master = master; //мастера, оказывающий услугу
    this.cost = cost; //стоимость
}

//мастер
function Master(firstName, middleName, lastName){
    this.firstName = firstName;//имя
    this.middleName = middleName;// отчество
    this.lastName = lastName;//фамилия
}

//Пользователь
function User(firstName, middleName, lastName, email){
    this.firstName = firstName;//имя
    this.middleName = middleName;// отчество
    this.lastName = lastName;//фамилия
    this.email = email;//почта
}

function getData() {
    var manyData = [];
    manyData.push(new OperationalStatistics(new Date(2013, 11, 30), 3300, 1000, 5, 80, 5000, 10000, 2500, -300));
    manyData.push(new OperationalStatistics(new Date(2014, 3, 10), 3300, 1000, 5, 80, 5000, 10000, 2500, -300));
    manyData.push(new OperationalStatistics(new Date(2014, 6, 8), 3300, 1000, 5, 80, 5000, 10000, 2500, -300));
    manyData.push(new OperationalStatistics(new Date(2014, 6, 6), 1000, 3000, 12, 70, 5000, 3000, 2500, -500));
    manyData.push(new OperationalStatistics(new Date(2014, 6, 5), 2000, 1000, 20, 15, 7000, 9000, 1500, +5050));
    manyData.push(new OperationalStatistics(new Date(2014, 6, 4), 5000, 7000, 15, 85, 3000, 1000, 500, -5400));
    manyData.push(new OperationalStatistics(new Date(2014, 6, 3), 2500, 500, 13, 60, 6000, 2000, 1700, +2100));
    manyData.push(new OperationalStatistics(new Date(2014, 6, 2), 4444, 3500, 10, 45, 900, 3500, 4500, -10000));
    manyData.push(new OperationalStatistics(new Date(2014, 6, 7), 5555, 3500, 10, 45, 900, 3500, 4500, -10000));
    manyData.push(new OperationalStatistics(new Date(2014, 6, 1), 10000, 3500, 10, 45, 900, 3500, 4500, -1000));
    return manyData.sort();
}


function getFinanceStatistics() {
    return new FinanceStatistics(13000, 1000, 5000, -2000);
}

function getExpenditures()
{
    var expList = [];
    var expItemsList = [];
    expItemsList.push(new ExpenditureItem("Покупка расходных материалов", -1500));
    expItemsList.push(new ExpenditureItem("Выплата дворнику", -500));
    expList.push(new Expenditures(new Date(2014, 6, 9), expItemsList));
    
    expItemsList = [];
    expItemsList.push(new ExpenditureItem("Покупка расходных материалов", -1500));
    expItemsList.push(new ExpenditureItem("Покупка нового кресла", -5000));
    expList.push(new Expenditures(new Date(2014, 6, 8), expItemsList));
    return expList;
}

function getCurrentUser(){
    return new User("Анна", "Петровна", "Касатникова", "kasatnik@gmail.com");
}