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
    alert('注册成功，请登录');
    showLoginForm();
}

// 任务管理
function addTask() {
    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;
    const category = document.getElementById('category').value;
    
    if (taskName && dueDate && priority && category) {
        const task = { id: Date.now(), name: taskName, dueDate, priority, category };
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        document.getElementById('taskName').value = '';
        document.getElementById('dueDate').value = '';
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
            <span>${task.name} (截止日期: ${task.dueDate}, 优先级: ${task.priority}, 分类: ${task.category})</span>
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

// 页面加载时检查登录状态
window.onload = function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        document.getElementById('authForm').style.display = 'none';
        document.getElementById('taskManager').style.display = 'block';
        loadTasks();
    } else {
        showLoginForm();
    }
};
