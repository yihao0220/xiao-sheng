console.log("Auth.js start"); // 输出日志，表示 Auth.js 文件开始执行

// 检查 UI 对象是否已定义，如果未定义则输出错误日志
if (typeof UI === 'undefined') {
    console.error("UI object is not defined. Make sure ui.js is loaded before this script.");
}

// 检查 TaskManager 对象是否已定义，如果未定义则输出错误日志
if (typeof TaskManager === 'undefined') {
    console.error("TaskManager object is not defined. Make sure taskManager.js is loaded before this script.");
}

// 创建 Auth 对象
const Auth = {
    // 登录方法
    login: (username, password) => {
        console.log("Login attempt:", username);
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', username);
                UI.hideElement('authForm');
                UI.showElement('taskManager');
                UI.hideElement('loginButton');
                UI.showElement('logoutButton');
                TaskManager.loadTasks();
                console.log("User logged in successfully:", username);
                UI.showSuccess("登录成功！");
            } else {
                throw new Error("用户名或密码错误");
            }
        } catch (error) {
            console.error("Error during login:", error);
            UI.showError(error.message || "登录时出错，请稍后再试。");
        }
    },
    // 退出登录方法
    logout: () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        UI.hideElement('taskManager');
        UI.showElement('loginButton');
        UI.hideElement('logoutButton');
        UI.showElement('authForm');
        console.log("User logged out successfully");
        UI.showSuccess("已成功退出登录");
    },
    // 检查登录状态方法
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
            UI.showElement('authForm');
        }
    },
    // 注册方法
    register: (username, password) => {
        console.log("Register attempt:", username);
        try {
            if (!username || !password) {
                throw new Error("用户名和密码不能为空");
            }
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.username === username)) {
                throw new Error("用户名已存在");
            }
            
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            console.log("User registered successfully:", username);
            UI.showSuccess("注册成功，请登录");
            
            UI.hideElement('registerForm');
            UI.showElement('authForm');
        } catch (error) {
            console.error("Error during registration:", error);
            UI.showError(error.message || "注册时出错，请稍后再试。");
        }
    }
};

// 将 Auth 对象添加到全局作用域，使其他脚本可以访问
window.Auth = Auth;

console.log("Auth.js end"); // 输出日志，表示 Auth.js 文件执行结束
