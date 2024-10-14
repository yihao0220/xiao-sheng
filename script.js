document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    init();
});

// 初始化函数
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

// 添加事件监听器
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

// 登录功能
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', username);
        showElement('taskManager');
        hideElement('authForm');
        loadTasks();
        remindTodayClasses();
        showNotification('登录成功！');
    } else {
        showNotification('用户名或密码错误', 'error');
    }
}

// 显示元素
function showElement(id) {
    const element = document.getElementById(id);
    if (element) element.style.display = 'block';
}

// 隐藏元素
function hideElement(id) {
    const element = document.getElementById(id);
    if (element) element.style.display = 'none';
}

// 显示通知
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.display = 'block';
    }, 100);

    setTimeout(() => {
        notification.style.display = 'none';
        notification.remove();
    }, 3000);
}

// 添加课程信息
function addClass() {
    const className = document.getElementById('className').value;
    const classDay = document.getElementById('classDay').value;
    const classTime = document.getElementById('classTime').value;
    const classLocation = document.getElementById('classLocation').value;

    if (className && classDay && classTime) {
        const newClass = {
            name: className,
            day: classDay,
            time: classTime,
            location: classLocation || '未指定地点'
        };

        const classSchedule = JSON.parse(localStorage.getItem('classSchedule')) || [];
        classSchedule.push(newClass);
        localStorage.setItem('classSchedule', JSON.stringify(classSchedule));

        // 清空表单
        document.getElementById('className').value = '';
        document.getElementById('classDay').value = '周一';
        document.getElementById('classTime').value = '';
        document.getElementById('classLocation').value = '';

        showNotification('课程添加成功！');
    } else {
        showNotification('请填写课程名称、日期和时间！', 'error');
    }
}

// 提醒当天课程
function remindTodayClasses() {
    const classSchedule = JSON.parse(localStorage.getItem('classSchedule')) || [];
    const today = new Date().toLocaleString('zh-CN', { weekday: 'long' });

    const todayClasses = classSchedule.filter(cls => cls.day === today);

    if (todayClasses.length > 0) {
        let message = `今天的课程安排：\n`;
        todayClasses.forEach(cls => {
            message += `${cls.name} - 时间: ${cls.time} - 地点: ${cls.location}\n`;
        });
        showNotification(message, 'info');
    }
}
