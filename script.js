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

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // 显示通知
    setTimeout(() => {
        notification.style.display = 'block';
    }, 100);

    // 3秒后隐藏通知
    setTimeout(() => {
        notification.style.display = 'none';
        notification.remove();
    }, 3000);
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
        
        // 添加当天课程
        const today = new Date().toLocaleString('zh-CN', { weekday: 'long' });
        const todayClasses = weeklySchedule[today];
        
        if (todayClasses && todayClasses.length > 0) {
            const todayClassesLi = document.createElement('li');
            todayClassesLi.className = 'today-classes';
            todayClassesLi.innerHTML = `<h3>今日课程：</h3>`;
            const classesList = document.createElement('ul');
            todayClasses.forEach(course => {
                const classItem = document.createElement('li');
                classItem.textContent = `${course.name} (${course.time}, ${course.location})`;
                classesList.appendChild(classItem);
            });
            todayClassesLi.appendChild(classesList);
            taskList.appendChild(todayClassesLi);
        }
        
        // 显示任务
        if (tasks.length === 0) {
            taskList.innerHTML += '<li>没有找到匹配的任务</li>';
        } else {
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `priority-${task.priority}`;
                const startDateTime = new Date(task.startDateTime);
                const endDateTime = new Date(task.endDateTime);
                let taskInfo = `${task.name} (时间段: ${startDateTime.toLocaleString()} 至 ${endDateTime.toLocaleString()}`;
                taskInfo += `, 优先级: ${task.priority}`;
                if (task.category) taskInfo += `, 分类: ${task.category}`;
                if (task.location) taskInfo += `, 地点: ${task.location}`;
                taskInfo += `)`;
                
                li.innerHTML = `
                    <span>${taskInfo}</span>
                    <div class="task-actions">
                        <button class="edit-btn" onclick="editTask(${task.id})">编辑</button>
                        <button class="delete-btn" onclick="deleteTask(${task.id})">删除</button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        }
    }
}

// 在文件顶部添加课程表数据
const weeklySchedule = {
    "周一": [
        { name: "大学英语(一)", time: "08:20-10:00", location: "教十一楼B区401" },
        { name: "高等数学B(一)", time: "10:20-12:00", location: "教一楼三区505" },
        { name: "体育(一)", time: "16:00-17:40", location: "黄家湖南区运动场" }
    ],
    "周二": [
        { name: "大学生心理健康教育", time: "08:20-10:00", location: "教一楼一区304" },
        { name: "大学计算机基础", time: "10:20-12:00", location: "教三楼106(黄家湖)" },
        { name: "普通化学", time: "16:00-17:40", location: "教一楼三区205" }
    ],
    "周三": [
        { name: "大学英语(一)", time: "08:20-10:00", location: "教十一楼B区401" },
        { name: "高等数学B(一)", time: "10:20-12:00", location: "教一楼三区505" },
        { name: "工程制图", time: "14:00-15:40", location: "教一楼三区405" }
    ],
    "周四": [
        { name: "普通化学", time: "10:20-12:00", location: "教一楼三区205" },
        { name: "工程制图", time: "14:00-15:40", location: "教一楼三区505" }
    ],
    "周五": [
        { name: "大学生心理健康教育", time: "08:20-10:00", location: "教一楼一区204" },
        { name: "高等数学B(一)", time: "10:20-12:00", location: "教一楼三区505" },
        { name: "思想道德与法治", time: "16:00-17:40", location: "教一楼三区310" }
    ],
    "周六": [],
    "周日": [
        { name: "形势与政策", time: "14:00-15:40", location: "教一楼一区210" }
    ]
};

// 添加检查今日课程的函数
function checkTodayClasses() {
    const today = new Date().toLocaleString('zh-CN', { weekday: 'long' });
    const todayClasses = weeklySchedule[today];
    
    if (todayClasses && todayClasses.length > 0) {
        let message = `今天的课程安排：\n`;
        todayClasses.forEach(course => {
            message += `${course.name} (${course.time}, ${course.location})\n`;
        });
        showNotification(message, 'info');
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
        showUnfinishedTasks(); // 确保这行存在
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

    // 创建通知容器
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notificationContainer';
    document.body.appendChild(notificationContainer);

    checkTodayClasses(); // 检查今天的课程

    // 每天早上 7 点检查课程
    setDailyCheck();

    // 显示之前上传的课表图片
    const savedScheduleImage = localStorage.getItem('scheduleImage');
    if (savedScheduleImage) {
        const scheduleDisplay = document.createElement('div');
        scheduleDisplay.id = 'scheduleDisplay';
        scheduleDisplay.innerHTML = `<img src="${savedScheduleImage}" alt="Saved Schedule" style="max-width: 100%;">`;
        document.getElementById('scheduleUpload').appendChild(scheduleDisplay);
    }

    // 加载保存的课表
    const savedSchedule = localStorage.getItem('userSchedule');
    if (savedSchedule) {
        weeklySchedule = JSON.parse(savedSchedule);
    }
}

// 设置每日检查
function setDailyCheck() {
    const now = new Date();
    const millisTill7AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0, 0) - now;
    if (millisTill7AM < 0) {
        millisTill7AM += 86400000; // 如果已经过了今天的7点，就设置为明天的7点
    }
    setTimeout(function() {
        checkTodayClasses();
        setDailyCheck(); // 设置下一天的检查
    }, millisTill7AM);
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
        showUnfinishedTasks();
        checkTodayClasses();
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
        showNotification('任务添加成功！');

        // 添加新任务动画
        const newTask = taskList.lastElementChild;
        newTask.classList.add('task-added');
    } else {
        showNotification('请填写所有必填字段！', 'error');
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
    showNotification('任务已删除');
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
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        displayTasks(updatedTasks);
    }
}

// 确保在页面加载时初始化应用
document.addEventListener('DOMContentLoaded', function() {
    init();
    addEventListeners();
});

// 新增函数显示未完成任务
function showUnfinishedTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const currentDateTime = new Date().toISOString();
    const unfinishedTasks = tasks.filter(task => task.endDateTime > currentDateTime);
    
    if (unfinishedTasks.length > 0) {
        let message = "<ul>";
        unfinishedTasks.forEach(task => {
            const endDateTime = new Date(task.endDateTime);
            message += `<li>${task.name} (截止时间: ${endDateTime.toLocaleString()})</li>`;
        });
        message += "</ul>";
        
        const unfinishedTasksList = document.getElementById('unfinishedTasksList');
        unfinishedTasksList.innerHTML = message;
        
        const overlay = document.getElementById('unfinishedTasksOverlay');
        overlay.style.display = "block";
        
        function closeOverlay() {
            overlay.style.display = "none";
            document.removeEventListener('click', closeOverlay);
        }
        
        // 使用 setTimeout 来延迟添加事件监听器
        setTimeout(() => {
            document.addEventListener('click', closeOverlay);
        }, 100);
    }
}

function handleScheduleUpload() {
    const fileInput = document.getElementById('scheduleFile');
    const file = fileInput.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const scheduleDisplay = document.getElementById('scheduleDisplay');
            const scheduleImage = document.getElementById('scheduleImage');
            scheduleImage.src = e.target.result;
            scheduleDisplay.style.display = 'block';
            
            // 创建课表输入字段
            createScheduleInputs();
        };
        reader.readAsDataURL(file);
    } else {
        showNotification('请上传图片文件', 'error');
    }
}

function createScheduleInputs() {
    const scheduleInputs = document.getElementById('scheduleInputs');
    scheduleInputs.innerHTML = '';
    
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    days.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.innerHTML = `
            <h4>${day}</h4>
            <input type="text" placeholder="课程名称" name="${day}-name">
            <input type="text" placeholder="时间" name="${day}-time">
            <input type="text" placeholder="地点" name="${day}-location">
        `;
        scheduleInputs.appendChild(dayDiv);
    });
}

document.getElementById('scheduleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const schedule = {};
    
    for (let [key, value] of formData.entries()) {
        const [day, field] = key.split('-');
        if (!schedule[day]) schedule[day] = [];
        if (field === 'name' && value) {
            schedule[day].push({
                name: value,
                time: formData.get(`${day}-time`),
                location: formData.get(`${day}-location`)
            });
        }
    }
    
    localStorage.setItem('userSchedule', JSON.stringify(schedule));
    showNotification('课表保存成功！');
    
    // 删除图片
    document.getElementById('scheduleImage').src = '';
    document.getElementById('scheduleDisplay').style.display = 'none';
    document.getElementById('scheduleFile').value = '';
    
    // 更新全局变量
    weeklySchedule = schedule;
    
    // 刷新任务列表以显示新的课程信息
    loadTasks();
});
