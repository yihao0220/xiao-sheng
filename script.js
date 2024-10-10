document.addEventListener('DOMContentLoaded', function() {
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
        setInterval(checkAndRemindTasks, 3600000); // 3600000 毫秒 = 1 小时
    }

    // 辅助函数：显示元素
    function showElement(id) {
        const element = document.getElementById(id);
        if (element) element.style.display = 'block';
    }

    // 辅助函数：隐藏元素
    function hideElement(id) {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    }

    // 显示登录表单
    window.showLoginForm = function() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
    }

    // 显示注册表单
    window.showRegisterForm = function() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
    }

    // 用户登录
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
    }

    // 用户注册
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
    }

    // 添加任务
    window.addTask = function() {
        const taskName = document.getElementById('taskName').value;
        const dueDate = document.getElementById('dueDate').value;
        const dueTime = document.getElementById('dueTime').value;
        const priority = document.getElementById('priority').value;
        const category = document.getElementById('category').value;
        
        if (taskName && dueDate) {
            const task = { 
                id: Date.now(), 
                name: taskName, 
                dueDate, 
                dueTime: dueTime || null,
                priority, 
                category: category || null
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
            alert('请至少填写任务名称和截止日期！');
        }
    }

    // 加载任务
    window.loadTasks = function() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        displayTasks(tasks);
    }

    // 显示任务
    window.displayTasks = function(tasks) {
        const taskList = document.getElementById('allTasks');
        if (taskList) {
            taskList.innerHTML = '';
            
            tasks.forEach(task => {
                const li = document.createElement('li');
                let taskInfo = `${task.name} (截止日期: ${task.dueDate}`;
                if (task.dueTime) taskInfo += ` ${task.dueTime}`;
                taskInfo += `, 优先级: ${task.priority}`;
                if (task.category) taskInfo += `, 分类: ${task.category}`;
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

    // 编辑任务
    window.editTask = function(taskId) {
        // 实现编辑任务的逻辑
    }

    // 删除任务
    window.deleteTask = function(taskId) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        loadTasks();
    }

    // 退出登录
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
    }

    // 检查并提醒任务
    window.checkAndRemindTasks = function() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().split(' ')[0].slice(0, 5);
        
        const upcomingTasks = tasks.filter(task => {
            if (task.dueDate !== today) return false;
            if (!task.dueTime) return true; // 如果没有具体时间，就认为是今天的任务
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

    // 添加分钟
    window.addMinutes = function(time, minutes) {
        const [hours, mins] = time.split(':').map(Number);
        const date = new Date(2000, 0, 1, hours, mins + minutes);
        return date.toTimeString().slice(0, 5);
    }

    // 显示通知
    window.showNotification = function(message) {
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

    // 初始化应用
    init();
});
