// 辅助函数
function showElement(id) {
    const element = document.getElementById(id);
    if (element) element.style.display = 'block';
}

function hideElement(id) {
    const element = document.getElementById(id);
    if (element) element.style.display = 'none';
}

// 核心功能函数
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
                let taskInfo = `${task.name} (日期: ${task.startDate} 到 ${task.endDate}`;
                if (task.startTime && task.endTime) {
                    taskInfo += `, 时间: ${task.startTime} 到 ${task.endTime}`;
                }
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

window.addTask = function() {
    const taskName = document.getElementById('taskName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const priority = document.getElementById('priority').value;
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value;
    
    if (taskName && startDate && endDate) {
        const task = { 
            id: Date.now(), 
            name: taskName, 
            startDate,
            endDate,
            startTime: startTime || null,
            endTime: endTime || null,
            priority, 
            category: category || null,
            location: location || null
        };
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // 重置表单
        document.getElementById('taskName').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('startTime').value = '';
        document.getElementById('endTime').value = '';
        document.getElementById('priority').value = 'low';
        document.getElementById('category').value = '';
        document.getElementById('location').value = '';
        sortTasks();
    } else {
        alert('请至少填写任务名称、开始日期和结束日期！');
    }
};

window.editTask = function(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskToEdit = tasks.find(task => task.id === taskId);
    
    if (taskToEdit) {
        // 填充表单
        document.getElementById('taskName').value = taskToEdit.name;
        document.getElementById('startDate').value = taskToEdit.startDate;
        document.getElementById('endDate').value = taskToEdit.endDate;
        document.getElementById('startTime').value = taskToEdit.startTime || '';
        document.getElementById('endTime').value = taskToEdit.endTime || '';
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
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            startTime: document.getElementById('startTime').value || null,
            endTime: document.getElementById('endTime').value || null,
            priority: document.getElementById('priority').value,
            category: document.getElementById('category').value || null,
            location: document.getElementById('location').value || null
        };
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        sortTasks();
        
        // 重置表单和按钮
        document.getElementById('taskName').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('startTime').value = '';
        document.getElementById('endTime').value = '';
        document.getElementById('priority').value = 'low';
        document.getElementById('category').value = '';
        document.getElementById('location').value = '';
        
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
            case 'dueDate':
                return new Date(a.startDate) - new Date(b.startDate);
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
};

// 添加搜索功能
window.searchTasks = function() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const filteredTasks = tasks.filter(task => 
        task.name.toLowerCase().includes(searchTerm) ||
        (task.category && task.category.toLowerCase().includes(searchTerm)) ||
        (task.location && task.location.toLowerCase().includes(searchTerm))
    );

    displayTasks(filteredTasks);
};

// 确保在页面加载时初始化应用
