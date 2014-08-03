/*
 *  1)Для каждого типа объекта свой ObjectStore
 *  2)БД привязать к myApp?!
 *  3)Оформить Storage как сервис с 3 методами?
 *  4)Если есть вложенные объекты, то как их вытащить?
 */
var update = function (obj) {
    var db = html5rocks.indexedDB.db;
    var objClass = obj.getClass(); //получим класс объекта
    var trans = db.transaction([objClass], "readwrite");
    var store = trans.objectStore(objClass); //найдем хранилище для объектов данного класса
    //нужно проверить, нет ли объекта с таким же PK
    //обновление объекта: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#Getting_data_from_the_database
    //если есть вложенные объекты, то как их вытащить?
    var request = store.put({ //положим в хранилище json-объект
        //пройтись по всем полям
    });

    //если транзакт прошел успешно
    request.onsuccess = function (e) {
        //make something
    };

    //если что-то пошло не так
    request.onerror = function (e) {
        console.log(e.value);
    };
};


var get = function (className, primary) {
    var db = html5rocks.indexedDB.db;
    var objClass = obj.getClass(); //получим класс объекта
    var trans = db.transaction([objClass], "readwrite");
    var store = trans.objectStore(objClass); //найдем хранилище для объектов данного класса

    var request = objectStore.get(primary); //произвести выборку по PK 
    request.onerror = function (event) {
        //make something
    };
    request.onsuccess = function (event) {
        // Do something with the request.result!
        //вернуть результат
        return request.result;
    };

};


var del = function (obj) {
    var db = html5rocks.indexedDB.db;
    var objClass = obj.getClass(); //получим класс объекта
    var trans = db.transaction([objClass], "readwrite");
    var store = trans.objectStore(objClass); //найдем хранилище для объектов данного класса

    var request = store.delete(obj.getKey()); //получим PK объекта, далее удалим по PK из бд нужный объект

    request.onsuccess = function (e) {
        //        make something
    };

    request.onerror = function (e) {
        console.log(e);
    };
};


//var html5rocks = {};
//window.indexedDB = window.indexedDB || window.webkitIndexedDB ||
//    window.mozIndexedDB;
//
//if ('webkitIndexedDB' in window) {
//    window.IDBTransaction = window.webkitIDBTransaction;
//    window.IDBKeyRange = window.webkitIDBKeyRange;
//}
//
//html5rocks.indexedDB = {};
//html5rocks.indexedDB.db = null;
//
//html5rocks.indexedDB.onerror = function (e) {
//    console.log(e);
//};
//
//html5rocks.indexedDB.open = function () {
//    var request = indexedDB.open("todos");
//
//    request.onsuccess = function (e) {
//        var v = 1;
//        html5rocks.indexedDB.db = e.target.result;
//        var db = html5rocks.indexedDB.db;
//        // We can only create Object stores in a setVersion transaction;
//        if (v != db.version) {
//            var setVrequest = db.setVersion(v);
//
//            // onsuccess is the only place we can create Object Stores
//            setVrequest.onerror = html5rocks.indexedDB.onerror;
//            setVrequest.onsuccess = function (e) {
//                if (db.objectStoreNames.contains("todo")) {
//                    db.deleteObjectStore("todo");
//                }
//
//                var store = db.createObjectStore("todo", {
//                    keyPath: "timeStamp"
//                });
//                e.target.transaction.oncomplete = function () {
//                    html5rocks.indexedDB.getAllTodoItems();
//                };
//            };
//        } else {
//            request.transaction.oncomplete = function () {
//                html5rocks.indexedDB.getAllTodoItems();
//            };
//        }
//    };
//    request.onerror = html5rocks.indexedDB.onerror;
//};
//
//html5rocks.indexedDB.addTodo = function (todoText) {
//    var db = html5rocks.indexedDB.db;
//    var trans = db.transaction(["todo"], "readwrite");
//    var store = trans.objectStore("todo");
//
//    var data = {
//        "text": todoText,
//        "timeStamp": new Date().getTime()
//    };
//
//    var request = store.put(data);
//
//    request.onsuccess = function (e) {
//        html5rocks.indexedDB.getAllTodoItems();
//    };
//
//    request.onerror = function (e) {
//        console.log("Error Adding: ", e);
//    };
//};
//
//html5rocks.indexedDB.deleteTodo = function (id) {
//    var db = html5rocks.indexedDB.db;
//    var trans = db.transaction(["todo"], "readwrite");
//    var store = trans.objectStore("todo");
//
//    var request = store.delete(id);
//
//    request.onsuccess = function (e) {
//        html5rocks.indexedDB.getAllTodoItems();
//    };
//
//    request.onerror = function (e) {
//        console.log("Error Adding: ", e);
//    };
//};
//
//html5rocks.indexedDB.getAllTodoItems = function () {
//    var todos = document.getElementById("todoItems");
//    todos.innerHTML = "";
//
//    var db = html5rocks.indexedDB.db;
//    var trans = db.transaction(["todo"], "readwrite");
//    var store = trans.objectStore("todo");
//
//    // Get everything in the store;
//    var cursorRequest = store.openCursor();
//
//    cursorRequest.onsuccess = function (e) {
//        var result = e.target.result;
//        if ( !! result == false)
//            return;
//
//        renderTodo(result.value);
//        result.
//        continue ();
//    };
//
//    cursorRequest.onerror = html5rocks.indexedDB.onerror;
//};
//
//function renderTodo(row) {
//    var todos = document.getElementById("todoItems");
//    var li = document.createElement("li");
//    var a = document.createElement("a");
//    var t = document.createTextNode(row.text);
//
//    a.addEventListener("click", function () {
//        html5rocks.indexedDB.deleteTodo(row.timeStamp);
//    }, false);
//
//    a.textContent = " [Delete]";
//    li.appendChild(t);
//    li.appendChild(a);
//    todos.appendChild(li);
//}
//
//function addTodo() {
//    var todo = document.getElementById("todo");
//    html5rocks.indexedDB.addTodo(todo.value);
//    todo.value = "";
//}
//
//function init() {
//    html5rocks.indexedDB.open();
//}
//
//window.addEventListener("DOMContentLoaded", init, false);​