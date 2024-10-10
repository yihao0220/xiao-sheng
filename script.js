document.addEventListener('DOMContentLoaded', function() {
    // 初始化函数
    function init() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            showElement('taskManager');
            hideElement('authForm');
            loadTasks();
            checkAndRemindTasks();
        } else {
            showLoginForm();
        }

        // 每小时检查一次任务
        setInterval(checkAndRemindTasks, 3600000); // 3600000 毫秒 = 1 小时
    }

    // 辅助函数：显示元素
    function showElement(id) {
        const element = document.getElementById(id);
        if (element) element.style.display = 'block';
    }

    // 辅助函数：隐藏元素
    function hideElement(id) {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    }

    // 显示登录表单
    window.showLoginForm = function() {
        showElement('loginForm');
        hideElement('registerForm');
    }

    // 显示注册表单
    window.showRegisterForm = function() {
        hideElement('loginForm');
        showElement('registerForm');
    }

    // 用户管理和任务管理函数保持不变...

    // 初始化应用
    init();
});
