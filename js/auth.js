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
            console.log("Login attempt:", username); // 输出登录尝试的用户名
            try {
                localStorage.setItem('isLoggedIn', 'true'); // 在本地存储中设置登录状态为 true
                localStorage.setItem('currentUser', username); // 在本地存储中保存当前用户名
                UI.hideElement('authForm'); // 隐藏登录表单
                UI.showElement('taskManager'); // 显示任务管理界面
                UI.hideElement('loginButton'); // 隐藏登录按钮
                UI.showElement('logoutButton'); // 显示退出按钮
                TaskManager.loadTasks(); // 加载用户的任务
                console.log("User logged in successfully:", username); // 输出登录成功日志
            } catch (error) {
                console.error("Error during login:", error); // 如果登录过程中出错，输出错误日志
                alert("登录时出错，请稍后再试。"); // 显示错误提示给用户
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
        }
    };

    // 将 Auth 对象添加到全局作用域，使其他脚本可以访问
    window.Auth = Auth;
}

console.log("Auth.js end"); // 输出日志，表示 Auth.js 文件执行结束
