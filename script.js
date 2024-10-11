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
    sortTasks();
}

function displayTasks(tasks) {
    const taskList = document.getElementById('allTasks');
    if (taskList) {
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            taskList.innerHTML = '<li>没有找到匹配的任务</li>';
        } else {
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
        
        // 添加清除搜索的按钮
        const clearSearchButton = document.createElement('button');
        clearSearchButton.textContent = '清除搜索';
        clearSearchButton.onclick = function() {
            document.getElementById('searchInput').value = '';
            loadTasks();
        };
        taskList.insertAdjacentElement('beforebegin', clearSearchButton);
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
        window.showLoginForm();
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
        sortTasks();
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
        
        sortTasks();
        
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
    sortTasks();
};

window.logout = function() {
    localStorage.removeItem('currentUser');
    showElement('authForm');
    hideElement('taskManager');
    window.showLoginForm();
    // 清空登录表单
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    if (loginUsername) loginUsername.value = '';
    if (loginPassword) loginPassword.value = '';
};

window.sortTasks = function() {
    const sortBy = document.getElementById('sortBy').value;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.sort((a, b) => {
        switch (sortBy) {
            case '
