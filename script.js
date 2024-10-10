// 辅助函数
function showElement(id) {
    const element = document.getElementById(id);
    if (element) element.style.display = 'block';
}

function hideElement(id) {
    const element = document.getElementById(id);
    if (element) element.style.display = 'none';
}

function addMinutes(time, minutes) {
    const [hours, mins] = time.split(':').map(Number);
    const date = new Date(2000, 0, 1, hours, mins + minutes);
    return date.toTimeString().slice(0, 5);
}

function showNotification(message) {
    if ("Notification" in window) {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                new Notification("任务提醒", { body: message });
            } else {
                alert(message);
            }
        });
    } else {
        alert(message);
    }
}

// 核心功能函数
function checkAndRemindTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].slice(0, 5);
    
    const upcomingTasks = tasks.filter(task => {
        if (task.dueDate !== today) return false;
        if (!task.dueTime) return true;
        return task.dueTime > currentTime && task.dueTime <= addMinutes(currentTime, 60);
    });
    
    if (upcomingTasks.length > 0) {
        const taskMessages = upcomingTasks.map(task => {
            let message = task.name;
            if (task.dueTime) message += ` (${task.dueTime})`;
            return message;
        }).join(', ');
        showNotification(`提醒：接下来一小时内有以下任务需要完成：${taskMessages}`);
    }
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    sortTasks(); // 这里调用 sortTasks 而不是直接调用 displayTasks
}

function displayTasks(tasks) {
    const taskList = document.getElementById('allTasks');
    if (taskList) {
        taskList.innerHTML = '';
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            let taskInfo = `${task.name} (截止日期: ${task.dueDate}`;
            if (task.dueTime) taskInfo += ` ${task.dueTime}`;
            taskInfo += `, 优先级: ${task.priority}`;
            if (task.category) taskInfo += `, 分类: ${task.category}`;
            if (task.location) taskInfo += `, 地点: ${task.location}`;
            taskInfo += `)`;
            
            li.innerHTML = `
                <span>${taskInfo}</span>
                <button onclick="window.editTask(${task.id})">编辑</button>
                <button onclick="window.deleteTask(${task.id})">删除</button>
            `;
            taskList.appendChild(li);
        });
    }
}

// 初始化函数
function init() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        showElement('taskManager');
        hideElement('authForm');
        loadTasks();
        checkAndRemindTasks();
    } else {
        showElement('authForm');
        showLoginForm();
    }

    // 每小时检查一次任务
    setInterval(checkAndRemindTasks, 3600000);
}

// 全局函数定义
window.showLoginForm = function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
};

window.showRegisterForm = function() {
    hideElement('loginForm');
    showElement('registerForm');
};

window.login = function() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', username);
        showElement('taskManager');
        hideElement('authForm');
        loadTasks();
    } else {
        alert('用户名或密码错误');
    }
};

window.register = function() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.username === username)) {
        alert('用户名已存在');
        return;
    }
    
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    localStorage.setItem('currentUser', username);
    showElement('taskManager');
    hideElement('authForm');
    loadTasks();
    
    alert('注册成功，已自动登录');
};

window.addTask = function() {
    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    const dueTime = document.getElementById('dueTime').value;
    const priority = document.getElementById('priority').value;
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value;
    
    if (taskName && dueDate) {
        const task = { 
            id: Date.now(), 
            name: taskName, 
            dueDate, 
            dueTime: dueTime || null,
            priority, 
            category: category || null,
            location: location || null
        };
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        document.getElementById('taskName').value = '';
        document.getElementById('dueDate').value = '';
        document.getElementById('dueTime').value = '';
        document.getElementById('priority').value = 'low';
        document.getElementById('category').value = '';
        document.getElementById('location').value = '';
        sortTasks(); // 替换 loadTasks();
    } else {
        alert('请至少填写任务名称和截止日期！');
    }
};

window.editTask = function(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskToEdit = tasks.find(task => task.id === taskId);
    
    if (taskToEdit) {
        // 填充表单
        document.getElementById('taskName').value = taskToEdit.name;
        document.getElementById('dueDate').value = taskToEdit.dueDate;
        document.getElementById('dueTime').value = taskToEdit.dueTime || '';
        document.getElementById('priority').value = taskToEdit.priority;
        document.getElementById('category').value = taskToEdit.category || '';
        document.getElementById('location').value = taskToEdit.location || '';
        
        // 更改添加任务按钮为保存编辑按钮
        const addTaskButton = document.querySelector('#taskForm button');
        addTaskButton.textContent = '保存编辑';
        addTaskButton.onclick = function() {
            saveEditedTask(taskId);
        };
    }
};

function saveEditedTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            id: taskId,
            name: document.getElementById('taskName').value,
            dueDate: document.getElementById('dueDate').value,
            dueTime: document.getElementById('dueTime').value || null,
            priority: document.getElementById('priority').value,
            category: document.getElementById('category').value || null,
            location: document.getElementById('location').value || null
        };
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        sortTasks(); // 替换 loadTasks();
        
        // 重置表单
        document.getElementById('taskName').value = '';
        document.getElementById('dueDate').value = '';
        document.getElementById('dueTime').value = '';
        document.getElementById('priority').value = 'low';
        document.getElementById('category').value = '';
        document.getElementById('location').value = '';
        
        // 恢复添加任务按钮
        const addTaskButton = document.querySelector('#taskForm button');
        addTaskButton.textContent = '添加任务';
        addTaskButton.onclick = window.addTask;
    }
}

window.deleteTask = function(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    sortTasks(); // 替换 loadTasks();
};

window.logout = function() {
    localStorage.removeItem('currentUser');
    showElement('authForm');
    hideElement('taskManager');
    showLoginForm();
    // 清空登录表单
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    if (loginUsername) loginUsername.value = '';
    if (loginPassword) loginPassword.value = '';
};

// 当 DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', init);

// 在其他全局函数定义之后添加这个新函数
window.sortTasks = function() {
    const sortBy = document.getElementById('sortBy').value;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.sort((a, b) => {
        switch (sortBy) {
            case 'dueDate':
                return new Date(a.dueDate + ' ' + (a.dueTime || '')) - new Date(b.dueDate + ' ' + (b.dueTime || ''));
            case 'priority':
                const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'category':
                return (a.category || '').localeCompare(b.category || '');
            default:
                return 0;
        }
    });

    displayTasks(tasks);
};
