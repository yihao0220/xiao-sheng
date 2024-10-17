console.log("Auth.js start");

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

console.log("Auth.js end");
