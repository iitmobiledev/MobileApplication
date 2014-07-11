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
    this.firstName = firstName; //имя
    this.middleName = middleName; // отчество
    this.lastName = lastName; //фамилия
    this.phoneNumber = phoneNumber; //номер телефона
    this.balance = balance; //баланс
    this.discount = discount; // скидка
}

//Услуга
function Service(description, startTime, endTime, master, cost) {
    this.description = description; //название услуги
    this.startTime = startTime; //время начала оказания услуги
    this.endTime = endTime; //время конца оказания услуги
    this.master = master; //мастера, оказывающий услугу
    this.cost = cost; //стоимость
}

//мастер
function Master(firstName, middleName, lastName) {
    this.firstName = firstName; //имя
    this.middleName = middleName; // отчество
    this.lastName = lastName; //фамилия
}

//Пользователь
function User(firstName, middleName, lastName, email) {
    this.firstName = firstName; //имя
    this.middleName = middleName; // отчество
    this.lastName = lastName; //фамилия
    this.email = email; //почта
}


var manyData = [];
var nowDay = new Date();
for (var i = 0; i < 300; i++) {
    var a = getRandom(1000, 10000);
    manyData.push(new OperationalStatistics(new Date(nowDay.getFullYear(), nowDay.getMonth(), nowDay.getDate() - i),
        a,
        getRandom(-1000, 5000),
        Math.round(getRandom(3, 50)),
        getRandom(50, 100)));
}

function getData() {
    return manyData.sort();
}

function getRandom(min, max) {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}


function getFinanceStatistics() {
    return new FinanceStatistics(13000, 1000, 5000, -2000);
}

function getExpenditures() {
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

function getCurrentUser() {
    return new User("Анна", "Петровна", "Касатникова", "kasatnik@gmail.com");
}