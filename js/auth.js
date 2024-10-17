console.log("Auth.js start");

if (typeof UI === 'undefined') {
    console.error("UI object is not defined. Make sure ui.js is loaded before this script.");
}

if (typeof Auth === 'undefined') {
    const Auth = {
        login: (username, password) => {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            UI.hideElement('authForm');
            UI.showElement('taskManager');
            TaskManager.loadTasks();
        },
        logout: () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            UI.showElement('loginButton');
            UI.hideElement('taskManager');
        },
        checkLoginStatus: () => {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (isLoggedIn) {
                UI.hideElement('authForm');
                UI.showElement('taskManager');
                UI.hideElement('loginButton');
                UI.showElement('logoutButton');
                TaskManager.loadTasks();
            } else {
                UI.hideElement('taskManager');
                UI.showElement('loginButton');
                UI.hideElement('logoutButton');
            }
        }
    };

    // 将 Auth 对象添加到全局作用域
    window.Auth = Auth;
}

console.log("Auth.js end");
