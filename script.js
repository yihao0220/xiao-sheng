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
                const startDateTime = new Date(task.startDateTime);
                const endDateTime = new Date(task.endDateTime);
                let taskInfo = `${task.name} (时间段: ${startDateTime.toLocaleString()} 至 ${endDateTime.toLocaleString()}`;
                taskInfo += `, 优先级: ${task.priority}`;
                if (task.category) taskInfo += `, 分类: ${task.category}`;
                if (task.location) taskInfo += `, 地点: ${task.location}`;
                taskInfo += `)`;
                
                li.innerHTML = `
                    <span>${taskInfo}</span>
                    <button onclick="editTask(${task.id})">编辑</button>
                    <button onclick="deleteTask(${task.id})">删除</button>
                `;
                taskList.appendChild(li);
            });
        }
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

    cleanExpiredTasks(); // 在初始化时清除过期任务
    
    // 每天凌晨自动清除过期任务
    const now = new Date();
    const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // 下一天
        0, 0, 0 // 凌晨 00:00:00
    );
    const msToMidnight = night.getTime() - now.getTime();
    
    setTimeout(function() {
        cleanExpiredTasks();
        setInterval(cleanExpiredTasks, 86400000); // 之后每24小时执行一次
    }, msToMidnight);

    // 添加事件监听器
    addEventListeners();
}

// 添加事件监听器
function addEventListeners() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', login);
    }

    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', register);
    }

    const showRegisterLink = document.getElementById('showRegisterLink');
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterForm();
        });
    }

    const showLoginLink = document.getElementById('showLoginLink');
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm();
        });
    }

    const addTaskButton = document.getElementById('addTaskButton');
    if (addTaskButton) {
        addTaskButton.addEventListener('click', addTask);
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    const sortBySelect = document.getElementById('sortBy');
    if (sortBySelect) {
        sortBySelect.addEventListener('change', sortTasks);
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchTasks);
    }

    const clearSearchButton = document.getElementById('clearSearchButton');
    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', clearSearch);
    }
}

// 全局函数定义
function showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
}

function showRegisterForm() {
    hideElement('loginForm');
    showElement('registerForm');
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
    } else {
        alert('用户名或密码错误');
    }
}

function register() {
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
    
    if (taskName && startDate && startTime && endDate && endTime) {
        const task = { 
            id: Date.now(), 
            name: taskName, 
            startDateTime: `${startDate}T${startTime}`,
            endDateTime: `${endDate}T${endTime}`,
            priority, 
            category: category || null,
            location: location || null
        };
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // 清空表单
        document.getElementById('taskName').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('startTime').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('endTime').value = '';
        document.getElementById('priority').value = 'low';
        document.getElementById('category').value = '';
        document.getElementById('location').value = '';
        
        // 重新加载任务列表
        sortTasks();
        
        // 显示成功消息
        alert('任务添加成功！');
    } else {
        alert('请填写所有必填字段！');
    }
}

function editTask(taskId) {
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
}

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
        addTaskButton.onclick = addTask;
    }
}

function deleteTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    sortTasks();
}

function logout() {
    localStorage.removeItem('currentUser');
    showElement('authForm');
    hideElement('taskManager');
    showLoginForm();
    // 清空登录表单
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    if (loginUsername) loginUsername.value = '';
    if (loginPassword) loginPassword.value = '';
}

function sortTasks() {
    const sortBy = document.getElementById('sortBy').value;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.sort((a, b) => {
        switch (sortBy) {
            case 'startDate':
                return new Date(a.startDateTime) - new Date(b.startDateTime);
            case 'endDate':
                return new Date(a.endDateTime) - new Date(b.endDateTime);
            case 'priority':
                const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'category':
                return (a.category || '').localeCompare(b.category || '');
            default:
                return 0;
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks(tasks);
}

function searchTasks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const filteredTasks = tasks.filter(task => 
        task.name.toLowerCase().includes(searchTerm) ||
        (task.category && task.category.toLowerCase().includes(searchTerm)) ||
        (task.location && task.location.toLowerCase().includes(searchTerm))
    );

    displayTasks(filteredTasks);
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    loadTasks();
}

// 添加自动清除过期任务的函数
function cleanExpiredTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const currentDateTime = new Date().toISOString();
    const updatedTasks = tasks.filter(task => task.endDateTime >= currentDateTime);
    
    if (tasks.length !== updatedTasks.length) {
        localStorage.setItem('tasks', JSON.stringify
