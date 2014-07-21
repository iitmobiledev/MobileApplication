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
function Service(id, description, startTime, endTime, master, cost, status) {
    this.id = id;
    this.description = description; //название услуги
    this.startTime = startTime; //время начала оказания услуги
    this.endTime = endTime; //время конца оказания услуги
    this.master = master; //мастера, оказывающий услугу
    this.cost = cost; //стоимость
    this.status = status;
}

//мастер
function Master(firstName, middleName, lastName) {
    this.firstName = firstName; //имя
    this.middleName = middleName; // отчество
    this.lastName = lastName; //фамилия
}

//Пользователь
function User(firstName, middleName, lastName, email, login, password) {
    this.firstName = firstName; //имя
    this.middleName = middleName; // отчество
    this.lastName = lastName; //фамилия
    this.email = email; //почта
    this.login = login;
    this.password = password;
}


var manyData = [];
var nowDay = new Date();
for (var i = 0; i < 3650; i++) {
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

function getUsers(){
    var users = [];
    users.push(new User("Анна", "Петровна", "Касатникова", "kasatnik@gmail.com", "kasatnik", "12345"));
    users.push(new User("Елена", "Анатольевна", "Звонкова",
                        "zvonkova@gmail.com", "zvonok", "11111"));
    users.push(new User("Татьяна", "Леонидовна", "Цветкова",
                        "flower@gmail.com", "flower", "22222"));
    users.push(new User("Анастасия", "Борисовна", "Ельникова", "yelnikova@gmail.com", "Ель", "33333"));
    users.push(new User("Ольга", "Юрьевна", "Рычкова", "richkova@gmail.com", "Рычкова", "44444"));
    return users;
}

function getCurrentUser() {
    return new User("Анна", "Петровна", "Касатникова", "kasatnik@gmail.com", "kasatnik", "12345");
}