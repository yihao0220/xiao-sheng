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
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.username === username && u.password === password);
                if (!user) {
                    throw new Error("用户名或密码错误");
                }
                
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
                UI.showError(error.message || "登录时出错，请稍后再试。");
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
        // 添加注册方法
        register: (username, password) => {
            console.log("Register attempt:", username);
            try {
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
                document.getElementById('registerForm').reset();
            } catch (error) {
                console.error("Error during registration:", error);
                UI.showError(error.message || "注册时出错，请稍后再试。");
            }
        }
    };

    // 将 Auth 对象添加到全局作用域，使其他脚本可以访问
    window.Auth = Auth;
}

// 添加注册表单的提交事件监听器
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        UI.showError("两次输入的密码不一致");
        return;
    }
    
    Auth.register(username, password);
});

console.log("Auth.js end"); // 输出日志，表示 Auth.js 文件执行结束
