// 立即执行函数，创建一个闭包来避免全局变量污染
(function() {
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
        displayTasks(tasks);
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

    // 将函数绑定到全局 window 对象
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
    };

    window.editTask = function(taskId) {
        // 实现编辑任务的逻辑
    };

    window.deleteTask = function(taskId) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        loadTasks();
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
})();
