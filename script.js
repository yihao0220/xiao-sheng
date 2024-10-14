document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    init();
});

function init() {
    console.log("Initializing application...");
    addEventListeners();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        showElement('taskManager');
        hideElement('authForm');
        loadTasks();
        remindTodayClasses();
    } else {
        showElement('authForm');
        showLoginForm();
    }
}

function addEventListeners() {
    console.log("Adding event listeners");

    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            login();
        });
    }

    const showRegisterLink = document.getElementById('showRegisterLink');
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterForm();
        });
    }

    const addTaskButton = document.getElementById('addTaskButton');
    if (addTaskButton) {
        addTaskButton.addEventListener('click', function(e) {
            e.preventDefault();
            addTask();
        });
    }

    const addClassButton = document.getElementById('addClassButton');
    if (addClassButton) {
        addClassButton.addEventListener('click', function(e) {
            e.preventDefault();
            addClass();
        });
    }
}

function login() {
    const username = document.getElement
