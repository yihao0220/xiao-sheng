// 获取今天的日期
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// 添加新任务
function addTask() {
    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    
    if (taskName && dueDate) {
        const task = { name: taskName, dueDate: dueDate };
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        document.getElementById('taskName').value = '';
        document.getElementById('dueDate').value = '';
        
        showTodayTasks();
    } else {
        alert('请填写任务名称和截止日期！');
    }
}

// 显示今天的任务
function showTodayTasks() {
    const todayDate = getTodayDate();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const todayTasks = tasks.filter(task => new Date(task.dueDate) >= new Date(todayDate));
    
    const taskList = document.getElementById('todayTasks');
    taskList.innerHTML = '';
    
    todayTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.name} (截止日期: ${task.dueDate})`;
        taskList.appendChild(li);
    });
}

// 页面加载时显示今天的任务
window.onload = showTodayTasks;

// 用户认证
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('taskManager').style.display = 'block';
            loadTasks();
        } else {
            alert('登录失败，请检查用户名和密码');
        }
    } catch (error) {
        console.error('登录错误:', error);
        alert('登录过程中发生错误，请稍后重试');
    }
}

async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('注册成功，请登录');
        } else {
            alert('注册失败，请稍后重试');
        }
    } catch (error) {
        console.error('注册错误:', error);
        alert('注册过程中发生错误，请稍后重试');
    }
}

// 任务管理
async function addTask() {
    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;
    const category = document.getElementById('category').value;
    
    if (taskName && dueDate && priority && category) {
        const task = { name: taskName, dueDate, priority, category };
        
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(task),
            });

            if (response.ok) {
                document.getElementById('taskName').value = '';
                document.getElementById('dueDate').value = '';
                document.getElementById('priority').value = 'low';
                document.getElementById('category').value = '';
                loadTasks();
            } else {
                alert('添加任务失败，请稍后重试');
            }
        } catch (error) {
            console.error('添加任务错误:', error);
            alert('添加任务过程中发生错误，请稍后重试');
        }
    } else {
        alert('请填写所有任务信息！');
    }
}

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (response.ok) {
            const tasks = await response.json();
            displayTasks(tasks);
        } else {
            alert('加载任务失败，请稍后重试');
        }
    } catch (error) {
        console.error('加载任务错误:', error);
        alert('加载任务过程中发生错误，请稍后重试');
    }
}

function displayTasks(tasks) {
    const taskList = document.getElementById('todayTasks');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.name} (截止日期: ${task.dueDate}, 优先级: ${task.priority}, 分类: ${task.category})</span>
            <button onclick="editTask('${task._id}')">编辑</button>
            <button onclick="deleteTask('${task._id}')">删除</button>
        `;
        taskList.appendChild(li);
    });
}

// 页面加载时检查登录状态
window.onload = function() {
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('taskManager').style.display = 'block';
        loadTasks();
    }
};
