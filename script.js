// 检查 localStorage
console.log("Checking localStorage...");
try {
    localStorage.setItem('test', 'testvalue');
    console.log("localStorage test:", localStorage.getItem('test'));
    localStorage.removeItem('test');
    console.log("localStorage is working properly");
} catch (e) {
    console.error("localStorage is not available:", e);
}

window.onerror = function(message, source, lineno, colno, error) {
    console.error("JavaScript error:", message, "at", source, ":", lineno);
    return true;
};

console.log("Script is running");

// 辅助函数
function showElement(id) {
    const element = document.getElementById(id);
    if (element) element.style.display = 'block';
}

function hideElement(id) {
    const element = document.getElementById(id);
    if (element) element.style.display = 'none';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // 显示通知
    setTimeout(() => {
        notification.style.display = 'block';
    }, 100);

    // 3秒后隐藏通知
    setTimeout(() => {
        notification.style.display = 'none';
        notification.remove();
    }, 3000);
}

// 核心功能函数
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    displayTasks(tasks);
}

function displayTasks(tasks) {
    const taskList = document.getElementById('allTasks');
    if (taskList) {
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            taskList.innerHTML += '<li>没有找到匹配的任务</li>';
        } else {
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `priority-${task.priority}`;
                const startDateTime = new Date(task.startDateTime);
                const endDateTime = new Date(task.endDateTime);
                let taskInfo = `
                    <div class="task-info">
                        <strong>${task.name}</strong><br>
                        开始: ${startDateTime.toLocaleString()}<br>
                        结束: ${endDateTime.toLocaleString()}<br>
                        优先级: ${task.priority}
                        ${task.category ? `<br>分类: ${task.category}` : ''}
                        ${task.location ? `<br>地点: ${task.location}` : ''}
                    </div>
                `;
                
                li.innerHTML = `
                    ${taskInfo}
                    <div class="task-actions">
                        <button class="edit-btn button" onclick="editTask(${task.id})">编辑</button>
                        <button class="delete-btn button" onclick="deleteTask(${task.id})">删除</button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        }
    }
}

// 初始化函数
function init() {
    console.log("Initializing application...");
    addEventListeners();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        showElement('taskManager');
        hideElement('authForm');
        loadTasks();
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
        console.log("Login button found");
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            login();
        });
    } else {
        console.log("Login button not found");
    }

    const showRegisterLink = document.getElementById('showRegisterLink');
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterForm();
        });
    }
}

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
        showNotification('登录成功！');
    } else {
        showNotification('用户名或密码错误', 'error');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    init();
});
