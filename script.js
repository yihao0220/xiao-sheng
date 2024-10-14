document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    init();
});

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

function deleteTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    loadTasks();
    showNotification('任务已删除');
}

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

    setTimeout(() => {
        notification.style.display = 'block';
    }, 100);

    setTimeout(() => {
        notification.style.display = 'none';
        notification.remove();
    }, 3000);
}

function addTask() {
    const taskName = document.getElementById('taskName').value;
    const startDate = document.getElementById('startDate').value;
    const startTime = document.getElementById('startTime').value;
    const endDate = document.getElementById('endDate').value;
    const endTime = document.getElementById('endTime').value;
    const priority = document.getElementById('priority').value;
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value;

    if (taskName && startDate && endDate) {
        const task = {
            id: Date.now(),
            name: taskName,
            startDateTime: startTime ? `${startDate}T${startTime}` : `${startDate}T00:00`,
            endDateTime: endTime ? `${endDate}T${endTime}` : `${endDate}T23:59`,
            priority,
            category: category || null,
            location: location || null
        };
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
        showNotification('任务添加成功！');
    } else {
        showNotification('请填写任务名称、开始日期和结束日期！', 'error');
    }
}

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
