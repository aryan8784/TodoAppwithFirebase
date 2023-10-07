// --------------------Fire Base 
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, set, push, onChildAdded, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDirl70UzqDUDzZTlZUd1rhiMy-xqy0sDE",
  authDomain: "todoapp-with-firebase-67723.firebaseapp.com",
  projectId: "todoapp-with-firebase-67723",
  storageBucket: "todoapp-with-firebase-67723.appspot.com",
  messagingSenderId: "292906375986",
  appId: "1:292906375986:web:bc5a6cacd421ee1205552b",
  measurementId: "G-W7YCLWZD39"
};

// Initialize Firebase
var firebaseApp = initializeApp(firebaseConfig);
var database = getDatabase(firebaseApp);




// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
// import {
//     getDatabase, ref, set, push, onChildAdded, update, remove, onValue
// } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// var firebaseConfig = {
//     apiKey: "AIzaSyA4MB1QKRGzhXnRf3R8y8I65_PTeGnhC_0",
//     authDomain: "todoapp-with-firebase-aa7f6.firebaseapp.com",
//     databaseURL: "https://todoapp-with-firebase-aa7f6-default-rtdb.firebaseio.com",
//     projectId: "todoapp-with-firebase-aa7f6",
//     storageBucket: "todoapp-with-firebase-aa7f6.appspot.com",
//     messagingSenderId: "692795516620",
//     appId: "1:692795516620:web:6b9ef7b2e24f581db00469",
//     measurementId: "G-7T998FFYRR"
// };
// // Initialize Firebase
// var firebaseApp = initializeApp(firebaseConfig);
// var database = getDatabase(firebaseApp);

// =========================TODO APP

var input = document.getElementById("inp");
var list = document.getElementById("list");
let todoListt = [];

window.addTodo = function () {

    if (input.value === "") {
        // alert("Enter Your Task")
        Swal.fire('Enter Your Task')

    } else {

        var task = input.value;

        var parentTodoRef = ref(database, "ParentTodo");

        // ====================Push the new task to the database
        var newTaskRef = push(parentTodoRef);
        set(newTaskRef, {
            UserTask: task
        });

        input.value = "";
    }

};

// ========================Function to render the task list
function render() {

    list.innerHTML = "";
    for (let i = 0; i < todoListt.length; i++) {
        list.innerHTML += `
      <li class="list-group-item fs-4  ">
        <div class="list-card">
          <div class = "col-7 text-break col-md-8 ">
            ${todoListt[i].UserTask}
          </div>
          <div>
            <button type="button" class="btn btn-success" onclick="editTodo(${i})"><i class="fa-solid fa-pen-to-square"></i></button>
            <button type="button" class="btn btn-danger"  onclick="delTodo(${i})"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </li>`;
    }

}

// =========================Function to edit a task
window.editTodo = function (i) {
    var newTask = prompt("Enter Your New Value", todoListt[i].UserTask);
    if (newTask !== null) {
        todoListt[i].UserTask = newTask;
        update(ref(database, `ParentTodo/${todoListt[i].id}`), {
            UserTask: newTask
        });
        render();
    }
};

// =====================Function to delete a task
window.delTodo = function (i) {
    var taskId = todoListt[i].id;
    remove(ref(database, `ParentTodo/${taskId}`));
    todoListt.splice(i, 0);
    render();

};

// ======================Function to delete all tasks
window.deleteAll = function () {
    if (todoListt.length !== 0) {

        var parentTodoRef = ref(database, "ParentTodo");
        // var confirmDelete = confirm('Are you sure?');
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to Delete this!",
            icon: 'warning',
            // showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your Tasks has been deleted.',
                    'success'
                )
            }
        })
        remove(parentTodoRef);
        todoListt = [];
        render();
    }
    else {
        // alert("Todos Not Availables")
        Swal.fire('Tasks Not Availables')

    }
};

var parentTodoRef = ref(database, "ParentTodo");

onValue(parentTodoRef, (snapshot) => {
    todoListt = [];
    snapshot.forEach((onChildAdded) => {
        var taskData = onChildAdded.val();
        taskData.id = onChildAdded.key;
        todoListt.push(taskData);
    });
    render();
});
