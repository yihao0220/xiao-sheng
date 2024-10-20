window.onerror = function(message, source, lineno, colno, error) {
    console.error("发生错误:", message, "在", source, "行号:", lineno);
    alert("抱歉，发生了一个错误。请查看控制台以获取更多信息。");
};

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

// 在文件顶部定义 weeklySchedule
let weeklySchedule = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded");
    try {
        initializeApp();
    } catch (error) {
        console.error("Error during app initialization:", error);
    }
});

function initializeApp() {
    console.log("initializeApp function called");

    // 检查必要的对象是否已定义
    if (typeof UI === 'undefined' || typeof Auth === 'undefined' || 
        typeof TaskManager === 'undefined' || typeof Storage === 'undefined') {
        console.error("One or more required objects are not defined. Check script loading order.");
        return;
    }

    initializeMainPage();

    console.log("App initialization completed");
}

function initializeMainPage() {
    console.log("Initializing main page");

    const requiredElements = [
        'loginButton', 'authForm', 'submitLoginButton', 'logoutButton',
        'showAddTaskFormButton', 'allTasks', 
        'addClassButton', 'saveWeeklyScheduleButton', 'weeklyClassList'
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.error("Missing required elements:", missingElements);
        UI.showError("页面加载出错，缺少必要元素。请刷新页面或联系管理员。");
        return;
    }

    // 设置主页面的事件监听器
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            UI.showElement('authForm');
            UI.hideElement('loginButton');
        });
    } else {
        console.error("Login button not found");
    }

    document.getElementById('submitLoginButton').addEventListener('click', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        Auth.login(username, password);
    });

    document.getElementById('logoutButton').addEventListener('click', Auth.logout);

    document.getElementById('addClassButton').addEventListener('click', (e) => {
        e.preventDefault();
        const className = document.getElementById('className').value;
        const classDay = document.getElementById('classDay').value;
        const classStartTime = document.getElementById('classStartTime').value;
        const classEndTime = document.getElementById('classEndTime').value;
        const classLocation = document.getElementById('classLocation').value;

        if (className && classDay && classStartTime && classEndTime) {
            const newClass = { name: className, day: classDay, startTime: classStartTime, endTime: classEndTime, location: classLocation };
            TaskManager.addClass(newClass);
            clearClassForm();
        } else {
            alert("请填写所有必要的课程信息");
        }
    });

    document.getElementById('saveWeeklyScheduleButton').addEventListener('click', (e) => {
        e.preventDefault();
        TaskManager.addWeeklySchedule(weeklySchedule);
        weeklySchedule = [];
        UI.updateClassList([]);
    });

    // 任务列表事件监听
    document.getElementById('allTasks').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-button')) {
            const index = parseInt(e.target.dataset.index);
            showEditTaskForm(index);
        } else if (e.target.classList.contains('delete-button')) {
            const index = parseInt(e.target.dataset.index);
            if (confirm('确定要删除这个任务吗？')) {
                TaskManager.deleteTask(index);
            }
        }
    });

    // 编辑任务表单的事件监听器
    document.getElementById('saveEditTaskButton').addEventListener('click', saveEditTask);

    document.getElementById('cancelEditTaskButton').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('editTaskFormOverlay').style.display = 'none';
    });

    Auth.checkLoginStatus();
    TaskManager.loadClasses();
    TaskManager.loadTasks();
    updateTaskList(Storage.getItem('tasks') || []);
    
    setTimeout(() => {
        UI.showTodayClasses();
        UI.showUnfinishedTasks();
        UI.showClassReminders();
    }, 1000);

    const showAddTaskFormButton = document.getElementById('showAddTaskFormButton');
    const addTaskModal = document.getElementById('addTaskModal');

    if (showAddTaskFormButton && addTaskModal) {
        showAddTaskFormButton.addEventListener('click', () => {
            console.log("Showing add task modal");
            new bootstrap.Modal(addTaskModal).show();
        });
    } else {
        console.error("showAddTaskFormButton or addTaskModal not found");
    }

    // 添加任务的事件监听器
    const addTaskButton = document.getElementById('addTaskButton');
    if (addTaskButton) {
        addTaskButton.addEventListener('click', (e) => {
            e.preventDefault();
            const taskName = document.getElementById('taskName').value;
            const startDate = document.getElementById('startDate').value;
            const startTime = document.getElementById('startTime').value;
            const endDate = document.getElementById('endDate').value;
            const endTime = document.getElementById('endTime').value;
            const priority = document.getElementById('priority').value;
            const category = document.getElementById('category').value;
            const location = document.getElementById('location').value;

            if (taskName) {
                const newTask = { name: taskName, startDate, startTime, endDate, endTime, priority, category, location, completed: false };
                TaskManager.addTask(newTask);
                bootstrap.Modal.getInstance(addTaskModal).hide();
                clearTaskForm();
            } else {
                alert("请输入任务名称");
            }
        });
    } else {
        console.error("addTaskButton not found");
    }

    // 取消添加任务的事件监听器
    document.getElementById('cancelAddTaskButton').addEventListener('click', (e) => {
        e.preventDefault();
        UI.hideElement('addTaskForm');
        UI.showElement('showAddTaskFormButton');
        clearTaskForm();
    });

    // 添加课程列表的事件监听器
    document.getElementById('weeklyClassList').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-class')) {
            const index = parseInt(e.target.dataset.index);
            if (confirm('确定要删除这个课程吗？')) {
                TaskManager.deleteClass(index);
            }
        }
    });

    console.log("Main page initialization completed");
}

function showEditTaskForm(index) {
    const tasks = Storage.getItem('tasks') || [];
    const task = tasks[index];

    if (task) {
        document.getElementById('editTaskName').value = task.name;
        document.getElementById('editStartDate').value = task.startDate;
        document.getElementById('editStartTime').value = task.startTime;
        document.getElementById('editEndDate').value = task.endDate;
        document.getElementById('editEndTime').value = task.endTime;
        document.getElementById('editPriority').value = task.priority;
        document.getElementById('editCategory').value = task.category || '';
        document.getElementById('editLocation').value = task.location || '';

        document.getElementById('editTaskForm').dataset.taskIndex = index;

        new bootstrap.Modal(document.getElementById('editTaskModal')).show();
    } else {
        console.error("Task not found");
        alert("未找到任务");
    }
}

function saveEditTask() {
    const taskIndex = document.getElementById('editTaskForm').dataset.taskIndex;
    const updatedTask = {
        name: document.getElementById('editTaskName').value,
        startDate: document.getElementById('editStartDate').value,
        startTime: document.getElementById('editStartTime').value,
        endDate: document.getElementById('editEndDate').value,
        endTime: document.getElementById('editEndTime').value,
        priority: document.getElementById('editPriority').value,
        category: document.getElementById('editCategory').value,
        location: document.getElementById('editLocation').value,
        completed: false // 保持原有的完成状态
    };

    TaskManager.editTask(taskIndex, updatedTask);
    bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
    alert("任务已更新");
}

// 在文件末尾添加这个函数
function clearTaskForm() {
    document.getElementById('taskName').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('priority').value = 'low';
    document.getElementById('category').value = '';
    document.getElementById('location').value = '';
}

function updateTaskList(tasks) {
    const allTasks = document.getElementById('allTasks');
    allTasks.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <h3>
                <span class="priority-indicator priority-${task.priority}"></span>
                ${task.name}
            </h3>
            <p>开始: ${task.startDate} ${task.startTime}</p>
            <p>结束: ${task.endDate} ${task.endTime}</p>
            <p>优先级: ${task.priority}</p>
            ${task.category ? `<p>分类: ${task.category}</p>` : ''}
            ${task.location ? `<p>地点: ${task.location}</p>` : ''}
            <div class="task-actions">
                <button class="edit-button" data-index="${index}">编辑</button>
                <button class="delete-button" data-index="${index}">删除</button>
            </div>
        `;
        allTasks.appendChild(li);
    });

    // 更新存储中的任务列表
    Storage.setItem('tasks', tasks);
}

// 在文件末尾添加这个函数
function clearClassForm() {
    document.getElementById('className').value = '';
    document.getElementById('classDay').value = '周一';
    document.getElementById('classStartTime').value = '';
    document.getElementById('classEndTime').value = '';
    document.getElementById('classLocation').value = '';
}
