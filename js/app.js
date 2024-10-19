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

    // 检查当前页面
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "index.html" || currentPage === "") {
        initializeMainPage();
    } else if (currentPage === "editTask.html") {
        initializeEditTaskPage();
    }

    // 检查必要的对象是否已定义
    if (typeof UI === 'undefined' || typeof Auth === 'undefined' || 
        typeof TaskManager === 'undefined' || typeof Storage === 'undefined') {
        console.error("One or more required objects are not defined. Check script loading order.");
        return;
    }

    console.log("App initialization completed");
}

function initializeMainPage() {
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
            window.location.href = `editTask.html?index=${index}`;
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

    Auth.checkLoginStatus();
    TaskManager.loadClasses();
    TaskManager.loadTasks();
    UI.showTodayClasses();
    UI.showUnfinishedTasks();

    // 修改"添加任务"按钮的事件监听器
    document.getElementById('showAddTaskFormButton').addEventListener('click', () => {
        document.getElementById('addTaskFormOverlay').style.display = 'flex';
    });

    // 添加任务的事件监听器
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
            document.getElementById('addTaskFormOverlay').style.display = 'none';
            clearTaskForm();
        } else {
            alert("请输入任务名称");
        }
    });

    // 取消添加任务的事件监听器
    document.getElementById('cancelAddTaskButton').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('addTaskFormOverlay').style.display = 'none';
        clearTaskForm();
    });
}

function initializeEditTaskPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskIndex = urlParams.get('index');

    if (taskIndex !== null) {
        const tasks = Storage.getItem('tasks') || [];
        const task = tasks[taskIndex];

        if (task) {
            document.getElementById('editTaskName').value = task.name;
            document.getElementById('editStartDate').value = task.startDate;
            document.getElementById('editStartTime').value = task.startTime;
            document.getElementById('editEndDate').value = task.endDate;
            document.getElementById('editEndTime').value = task.endTime;
            document.getElementById('editPriority').value = task.priority;
            document.getElementById('editCategory').value = task.category || '';
            document.getElementById('editLocation').value = task.location || '';

            document.getElementById('saveEditTaskButton').addEventListener('click', (e) => {
                e.preventDefault();
                const updatedTask = {
                    name: document.getElementById('editTaskName').value,
                    startDate: document.getElementById('editStartDate').value,
                    startTime: document.getElementById('editStartTime').value,
                    endDate: document.getElementById('editEndDate').value,
                    endTime: document.getElementById('editEndTime').value,
                    priority: document.getElementById('editPriority').value,
                    category: document.getElementById('editCategory').value,
                    location: document.getElementById('editLocation').value,
                    completed: task.completed
                };
                TaskManager.editTask(taskIndex, updatedTask);
                alert("任务已更新");
                window.location.href = 'index.html';
            });

            document.getElementById('cancelEditTaskButton').addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm("确定要取消编辑任务吗？")) {
                    window.location.href = 'index.html';
                }
            });
        } else {
            console.error("Task not found");
            alert("未找到任务");
            window.location.href = 'index.html';
        }
    } else {
        console.error("No task index provided");
        alert("未提供任务索引");
        window.location.href = 'index.html';
    }
}

function clearClassForm() {
    document.getElementById('className').value = '';
    document.getElementById('classDay').value = '周一';
    document.getElementById('classStartTime').value = '';
    document.getElementById('classEndTime').value = '';
    document.getElementById('classLocation').value = '';
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
