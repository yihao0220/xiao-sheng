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

    // 设置事件监听器
    document.getElementById('loginButton').addEventListener('click', () => {
        UI.showElement('authForm');
        UI.hideElement('loginButton');
    });

    document.getElementById('submitLoginButton').addEventListener('click', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        Auth.login(username, password);
    });

    document.getElementById('logoutButton').addEventListener('click', Auth.logout);

    document.getElementById('showAddTaskFormButton').addEventListener('click', () => {
        UI.showElement('addTaskForm');
        UI.hideElement('showAddTaskFormButton');
    });

    document.getElementById('addTaskButton').addEventListener('click', (e) => {
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
            UI.hideElement('addTaskForm');
            UI.showElement('showAddTaskFormButton');
            clearTaskForm();
        } else {
            alert("请输入任务名称");
        }
    });

    document.getElementById('cancelAddTaskButton').addEventListener('click', (e) => {
        e.preventDefault();
        UI.hideElement('addTaskForm');
        UI.showElement('showAddTaskFormButton');
        clearTaskForm();
    });

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
    document.getElementById('saveEditTaskButton').addEventListener('click', saveEditTask);
    document.getElementById('cancelEditTaskButton').addEventListener('click', cancelEditTask);

    Auth.checkLoginStatus();
    TaskManager.loadClasses();
    TaskManager.loadTasks();
    UI.showTodayClasses();
    UI.showUnfinishedTasks();

    console.log("App initialization completed");
}

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

function clearClassForm() {
    document.getElementById('className').value = '';
    document.getElementById('classDay').value = '周一';
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

function cancelEditTask(e) {
    e.preventDefault();
    document.getElementById('editTaskForm').style.display = 'none';
}
