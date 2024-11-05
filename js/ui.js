console.log("Auth.js start"); // 输出日志，表示 Auth.js 文件开始执行

// 检查 UI 对象是否已定义，如果未定义则输出错误日志
if (typeof UI === 'undefined') {
    console.error("UI object is not defined. Make sure ui.js is loaded before this script.");
}

// 检查 TaskManager 对象是否已定义，如果未定义则输出错误日志
if (typeof TaskManager === 'undefined') {
    console.error("TaskManager object is not defined. Make sure taskManager.js is loaded before this script.");
}

// 检查 Auth 对象是否已定义，如果未定义则创建 Auth 对象
if (typeof Auth === 'undefined') {
    const Auth = {
        // 登录方法
        login: (username, password) => {
            console.log("Login attempt:", username);
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
        // 退出登录方法
        logout: () => {
            localStorage.removeItem('isLoggedIn'); // 从本地存储中移除登录状态
            localStorage.removeItem('currentUser'); // 从本地存储中移除当前用户信息
            UI.hideElement('taskManager'); // 隐藏任务管理界面
            UI.showElement('loginButton'); // 显示登录按钮
            UI.hideElement('logoutButton'); // 隐藏退出按钮
            console.log("User logged out successfully"); // 输出退出登录成功日志
        },
        // 检查登录状态方法
        checkLoginStatus: () => {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // 从本地存储中获取登录状态
            if (isLoggedIn) {
                UI.hideElement('authForm'); // 如果已登录，隐藏登录表单
                UI.showElement('taskManager'); // 显示任务管理界面
                UI.hideElement('loginButton'); // 隐藏登录按钮
                UI.showElement('logoutButton'); // 显示退出按钮
                TaskManager.loadTasks(); // 加载用户的任务
            } else {
                UI.hideElement('taskManager'); // 如果未登录，隐藏任务管理界面
                UI.showElement('loginButton'); // 显示登录按钮
                UI.hideElement('logoutButton'); // 隐藏退出按钮
            }
        },
        register: (username, password) => {
            console.log("Register attempt:", username);
            try {
                if (!username || !password) {
                    throw new Error("用户名和密码不能为空");
                }
                // 检查用户名是否已存在
                const users = JSON.parse(localStorage.getItem('users')) || [];
                if (users.some(user => user.username === username)) {
                    throw new Error("用户名已存在");
                }
                
                // 添加新用户
                users.push({ username, password });
                localStorage.setItem('users', JSON.stringify(users));
                
                console.log("User registered successfully:", username);
                UI.showSuccess("注册成功，请登录");
                
                // 清空注册表单
                document.getElementById('registerUsername').value = '';
                document.getElementById('registerPassword').value = '';
                
                // 显示登录表单
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
}

// 添加用户数据持久化
function persistUserSession(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('lastLoginTime', new Date().toISOString());
}

// 添加自动登录功能
function checkAutoLogin() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        // 自动登录处理
        UI.showElement('taskManager');
        UI.hideElement('authForm');
    }
}

console.log("Auth.js end"); // 输出日志，表示 Auth.js 文件执行结束
