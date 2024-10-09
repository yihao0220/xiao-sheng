// 显示登录表单
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

// 显示注册表单
function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// 用户管理
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', username);
        document.getElementById('authForm').style.display = 'none';
        document.getElementById('taskManager').style.display = 'block';
        loadTasks();
        checkAndRemindTasks(); // 添加这行
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
    
    // 自动登录
    localStorage.setItem('currentUser', username);
    document.getElementById('authForm').style.display = 'none';
    document.getElementById('taskManager').style.display = 'block';
    loadTasks();
    
    alert('注册成功，已自动登录');
}

// 任务管理
function addTask() {
    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    const dueTime = document.getElementById('dueTime').value;
    const priority = document.getElementById('priority').value;
    const category = document.getElementById('category').value;
    
    if (taskName && dueDate && dueTime && priority && category) {
        const task = { 
            id: Date.now(), 
            name: taskName, 
            dueDate, 
            dueTime,
            priority, 
            category 
        };
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        document.getElementById('taskName').value = '';
        document.getElementById('dueDate').value = '';
        document.getElementById('dueTime').value = '';
        document.getElementById('priority').value = 'low';
        document.getElementById('category').value = '';
        loadTasks();
    } else {
        alert('请填写所有任务信息！');
    }
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    displayTasks(tasks);
}

function displayTasks(tasks) {
    const taskList = document.getElementById('todayTasks');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.name} (截止日期: ${task.dueDate} ${task.dueTime}, 优先级: ${task.priority}, 分类: ${task.category})</span>
            <button onclick="editTask(${task.id})">编辑</button>
            <button onclick="deleteTask(${task.id})">删除</button>
        `;
        taskList.appendChild(li);
    });
}

function editTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const newName = prompt('请输入新的任务名称：', task.name);
        if (newName) {
            task.name = newName;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        }
    }
}

function deleteTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    loadTasks();
}

// 添加退出函数
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('taskManager').style.display = 'none';
    document.getElementById('authForm').style.display = 'block';
    showLoginForm();
    // 清空登录表单
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

// 页面加载时检查登录状态
window.onload = function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        document.getElementById('authForm').style.display = 'none';
        document.getElementById('taskManager').style.display = 'block';
        loadTasks();
        checkAndRemindTasks(); // 添加这行
    } else {
        showLoginForm();
    }

    // 每小时检查一次任务
    setInterval(checkAndRemindTasks, 3600000); // 3600000 毫秒 = 1 小时
};

// 添加这个新函数
function checkAndRemindTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].slice(0, 5); // 获取当前时间 HH:MM
    
    const upcomingTasks = tasks.filter(task => {
        return task.dueDate === today && task.dueTime > currentTime && task.dueTime <= addMinutes(currentTime, 60);
    });
    
    if (upcomingTasks.length > 0) {
        const taskMessages = upcomingTasks.map(task => `${task.name} (${task.dueTime})`).join(', ');
        showNotification(`提醒：接下来一小时内有以下任务需要完成：${taskMessages}`);
    }
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

function savePhoneNumber() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    if (phoneNumber) {
        localStorage.setItem('userPhoneNumber', phoneNumber);
        alert('手机号码已保存（仅用于本地存储，不会发送实际短信）');
    } else {
        alert('请输入有效的手机号码');
    }
}

// 删除 sendSMSReminder 函数，因为我们不再使用后端发送短信
