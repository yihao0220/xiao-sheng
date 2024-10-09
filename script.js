// 设置 API 基础 URL
const API_BASE_URL = 'http://localhost:3000';  // 确保这里是您本地服务器的地址和端口

// 用户管理
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', username);
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('taskManager').style.display = 'block';
        loadTasks();
    } else {
        alert('用户名或密码错误');
    }
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.username === username)) {
        alert('用户名已存在');
        return;
    }
    
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('注册成功，请登录');
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
        // 这里可以实现编辑功能，例如弹出一个编辑框
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
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('taskManager').style.display = 'block';
        loadTasks();
    }
};
