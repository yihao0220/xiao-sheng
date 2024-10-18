console.log("Auth.js start");

if (typeof UI === 'undefined') {
    console.error("UI object is not defined. Make sure ui.js is loaded before this script.");
}

if (typeof TaskManager === 'undefined') {
    console.error("TaskManager object is not defined. Make sure taskManager.js is loaded before this script.");
}

if (typeof Auth === 'undefined') {
    const Auth = {
        login: (username, password) => {
            try {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', username);
                UI.hideElement('authForm');
                UI.showElement('taskManager');
                UI.hideElement('loginButton');
                UI.showElement('logoutButton');
                TaskManager.loadTasks();
                console.log("User logged in successfully:", username);
            } catch (error) {
                console.error("Error during login:", error);
                alert("登录时出错，请稍后再试。");
            }
        },
        logout: () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            UI.hideElement('taskManager');
            UI.showElement('loginButton');
            UI.hideElement('logoutButton');
            console.log("User logged out successfully");
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
