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
    initializeApp();
});

function initializeApp() {
    console.log("App script loaded");

    const requiredElements = [
        'loginButton', 'authForm', 'submitLoginButton', 'logoutButton',
        'showAddTaskFormButton', 'addTaskForm', 'addTaskButton', 'cancelAddTaskButton',
        'allTasks', 'editTaskForm', 'saveEditTaskButton', 'cancelEditTaskButton', 
        'addClassButton', 'saveWeeklyScheduleButton', 'weeklyClassList'
    ];

    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.error("Missing required elements:", missingElements);
        UI.showError("页面加载出错，缺少必要元素。请刷新页面或联系管理员。");
        return;
    }

    // 检查必要的对象是否已定义
    if (typeof UI === 'undefined' || typeof Auth === 'undefined' || 
        typeof TaskManager === 'undefined' || typeof Storage === 'undefined') {
        console.error("One or more required objects are not defined. Check script loading order.");
        return;
    }

    function logDeviceInfo() {
        console.log("User Agent:", navigator.userAgent);
        console.log("Screen Width:", screen.width);
        console.log("Screen Height:", screen.height);
        console.log("Window Inner Width:", window.innerWidth);
        console.log("Window Inner Height:", window.innerHeight);
    }

    function checkLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            console.log("Local storage is working");
        } catch(e) {
            console.error("Local storage is not available:", e);
        }
    }

    // 设置事件监听器
    addEventListenerSafely('loginButton', 'click', () => {
        console.log("Login button clicked");
        UI.showElement('authForm');
        UI.hideElement('loginButton');
    });

    addEventListenerSafely('submitLoginButton', 'click', (e) => {
        e.preventDefault();
        console.log("Submit login button clicked");
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        Auth.login(username, password);
    });

    addEventListenerSafely('logoutButton', 'click', Auth.logout);

    addEventListenerSafely('showAddTaskFormButton', 'click', () => {
        document.getElementById('addTaskForm').style.display = 'block';
        document.getElementById('showAddTaskFormButton').style.display = 'none';
    });

    addEventListenerSafely('addTaskButton', 'click', (e) => {
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
            document.getElementById('addTaskForm').style.display = 'none';
            document.getElementById('showAddTaskFormButton').style.display = 'block';
            document.getElementById('taskName').value = '';
            // 清空其他输入字段...
        }
    });

    addEventListenerSafely('cancelAddTaskButton', 'click', () => {
        document.getElementById('addTaskForm').style.display = 'none';
        document.getElementById('showAddTaskFormButton').style.display = 'block';
    });

    addEventListenerSafely('addClassButton', 'click', (e) => {
        e.preventDefault();
        const day = document.getElementById('classDay').value;
        const name = document.getElementById('className').value;
        const startTime = document.getElementById('classStartTime').value;
        const endTime = document.getElementById('classEndTime').value;
        const location = document.getElementById('classLocation').value;

        if (name && startTime && endTime) {
            weeklySchedule.push({ day, name, startTime, endTime, location });
            updateWeeklyClassList();
            clearClassForm();
        } else {
            UI.showError('请填写课程名称、开始时间和结束时间。');
        }
    });

    addEventListenerSafely('saveWeeklyScheduleButton', 'click', (e) => {
        e.preventDefault();
        if (weeklySchedule.length > 0) {
            TaskManager.addWeeklySchedule(weeklySchedule);
            UI.showSuccess('周课表已保存！');
            weeklySchedule = [];
            updateWeeklyClassList();
        } else {
            UI.showError('请先添加课程。');
        }
    });

    // 任务列表事件监听
    const allTasks = document.getElementById('allTasks');
    allTasks.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-button')) {
            const index = parseInt(e.target.dataset.index);
            editTask(index);
        } else if (e.target.classList.contains('delete-button')) {
            const index = parseInt(e.target.dataset.index);
            if (confirm('确定要删除这个任务吗？')) {
                TaskManager.deleteTask(index);
            }
        } else if (e.target.classList.contains('complete-button')) {
            const index = parseInt(e.target.dataset.index);
            TaskManager.toggleTaskCompletion(index);
        }
    });

    // 编辑任务表单事件监听
    addEventListenerSafely('saveEditTaskButton', 'click', saveEditTask);
    addEventListenerSafely('cancelEditTaskButton', 'click', cancelEditTask);

    logDeviceInfo();
    checkLocalStorage();
    Auth.checkLoginStatus();
    TaskManager.loadClasses();
    TaskManager.loadTasks();
    UI.showTodayClasses();
    UI.showUnfinishedTasks();

    console.log("App initialization completed");
}

function addEventListenerSafely(id, event, handler) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(event, handler);
        console.log(`Event listener added to ${id}`);
    } else {
        console.warn(`Element ${id} not found. Event listener not added.`);
    }
}

function updateWeeklyClassList() {
    const weeklyClassList = document.getElementById('weeklyClassList');
    if (weeklyClassList) {
        weeklyClassList.innerHTML = '';
        weeklySchedule.forEach((cls, index) => {
            const li = document.createElement('li');
            li.textContent = `${cls.day} ${cls.name} ${cls.startTime}-${cls.endTime} ${cls.location}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.onclick = () => {
                weeklySchedule.splice(index, 1);
                updateWeeklyClassList();
            };
            li.appendChild(deleteButton);
            weeklyClassList.appendChild(li);
        });
    } else {
        console.error("weeklyClassList element not found");
    }
}

function clearClassForm() {
    document.getElementById('className').value = '';
    document.getElementById('classStartTime').value = '';
    document.getElementById('classEndTime').value = '';
    document.getElementById('classLocation').value = '';
}

function editTask(index) {
    const tasks = Storage.getItem('tasks') || [];
    const task = tasks[index];
    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editStartDate').value = task.startDate;
    document.getElementById('editStartTime').value = task.startTime;
    document.getElementById('editEndDate').value = task.endDate;
    document.getElementById('editEndTime').value = task.endTime;
    document.getElementById('editPriority').value = task.priority;
    document.getElementById('editCategory').value = task.category || '';
    document.getElementById('editLocation').value = task.location || '';
    document.getElementById('editTaskForm').style.display = 'block';
    document.getElementById('editTaskForm').dataset.taskIndex = index;
}

function saveEditTask(e) {
    e.preventDefault();
    const index = parseInt(document.getElementById('editTaskForm').dataset.taskIndex);
    const updatedTask = {
        name: document.getElementById('editTaskName').value,
        startDate: document.getElementById('editStartDate').value,
        startTime: document.getElementById('editStartTime').value,
        endDate: document.getElementById('editEndDate').value,
        endTime: document.getElementById('editEndTime').value,
        priority: document.getElementById('editPriority').value,
        category: document.getElementById('editCategory').value,
        location: document.getElementById('editLocation').value,
        completed: false
    };
    TaskManager.editTask(index, updatedTask);
    document.getElementById('editTaskForm').style.display = 'none';
}

function cancelEditTask() {
    document.getElementById('editTaskForm').style.display = 'none';
}
