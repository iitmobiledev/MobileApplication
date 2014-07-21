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

///Запись(Визит)
function Visit(id, client, serviceList, comment, date) {
    this.id = id;
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
function Service(description, startTime, endTime, master, cost, status) {
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


function getVisits() {
    var visList = [];
    var client = new Client("Иван", "Сергеевич", "Иванов", "8-952-607-20-50", 5000, 0);
    var master = new Master("Петр", "Михайлович", "Васюков");
    var serviceList = [];
    var service = new Service("Стрижка модная", new Date(2014, 6, 20, 10, 00), new Date(2014, 6, 20, 11, 00), master, 2500, "Клиент пришел");
    serviceList.push(service);
    serviceList.push(new Service("Мелирование", new Date(2014, 6, 20, 11, 10), new Date(2014, 6, 20, 12, 10), master, 1000, "Клиент пришел"));
    visit = new Visit(1, client, serviceList, "Очень длинные волосы", new Date(2014, 6, 20));
    visList.push(visit);
    //2 visit
    serviceList = [];
    client = new Client("Екатерина", "Андреевна", "Иванова", "8-922-706-20-50", 2000, 0);
    master = new Master("Петр", "Михайлович", "Васюков");
    service = new Service("Мелирование", new Date(2014, 6, 21, 10, 00), new Date(2014, 6, 21, 12, 00), master, 2000, "Клиент пришел");
    serviceList.push(service);
    visit = new Visit(1, client, serviceList, "Очень плохие волосы", new Date(2014, 6, 21));
    visList.push(visit);
    return visList;
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
    users.push(new User("admin", "", "", "yelnikova@gmail.com", "", ""));
    return users;
}

function getCurrentUser() {
    return new User("Анна", "Петровна", "Касатникова", "kasatnik@gmail.com", "kasatnik", "12345");
}