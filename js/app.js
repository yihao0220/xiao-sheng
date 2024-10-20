window.onerror = function(message, source, lineno, colno, error) {
    console.error("发生错误:", message, "在", source, "行号:", lineno);
    alert("抱歉，发生了一个错误。请查看控制台以获取更多信息。");
};

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    initializeApp();
});

function initializeApp() {
    console.log("initializeApp function called");

    const elements = {
        loginButton: document.getElementById('loginButton'),
        submitLoginButton: document.getElementById('submitLoginButton'),
        logoutButton: document.getElementById('logoutButton'),
        addClassButton: document.getElementById('addClassButton'),
        saveWeeklyScheduleButton: document.getElementById('saveWeeklyScheduleButton'),
        allTasks: document.getElementById('allTasks'),
        showAddTaskFormButton: document.getElementById('showAddTaskFormButton'),
        addTaskModal: document.getElementById('addTaskModal'),
        addTaskButton: document.getElementById('addTaskButton'),
        cancelAddTaskButton: document.getElementById('cancelAddTaskButton'),
        weeklyClassList: document.getElementById('weeklyClassList')
    };

    // 登录相关
    elements.loginButton?.addEventListener('click', () => {
        UI.showElement('authForm');
        UI.hideElement('loginButton');
    });

    elements.submitLoginButton?.addEventListener('click', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        Auth.login(username, password);
    });

    elements.logoutButton?.addEventListener('click', Auth.logout);

    // 添加课程
    elements.addClassButton?.addEventListener('click', (e) => {
        e.preventDefault();
        const className = document.getElementById('className').value;
        const classDay = document.getElementById('classDay').value;
        const classStartTime = document.getElementById('classStartTime').value;
        const classEndTime = document.getElementById('classEndTime').value;
        const classLocation = document.getElementById('classLocation').value;

        if (className && classDay && classStartTime && classEndTime) {
            const newClass = { name: className, day: classDay, startTime: classStartTime, endTime: classEndTime, location: classLocation };
            TaskManager.addClass(newClass);
            UI.clearClassForm();
        } else {
            UI.showError("请填写所有必要的课程信息");
        }
    });

    // 保存周课表
    elements.saveWeeklyScheduleButton?.addEventListener('click', (e) => {
        e.preventDefault();
        const weeklySchedule = TaskManager.getWeeklySchedule();
        TaskManager.addWeeklySchedule(weeklySchedule);
        UI.updateClassList(weeklySchedule);
    });

    // 任务列表事件
    elements.allTasks?.addEventListener('click', (e) => {
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

    // 显示添加任务模态框
    elements.showAddTaskFormButton?.addEventListener('click', () => {
        console.log("Showing add task modal");
        const modal = new bootstrap.Modal(elements.addTaskModal);
        modal.show();
    });

    // 添加任务
    elements.addTaskButton?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Add task button clicked");
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
            const success = TaskManager.addTask(newTask);
            if (success) {
                console.log("Task added successfully");
                const modal = bootstrap.Modal.getInstance(elements.addTaskModal);
                if (modal) {
                    modal.hide();
                    console.log("Modal hidden");
                } else {
                    console.error("Bootstrap modal instance not found");
                    elements.addTaskModal.style.display = 'none';
                }
                UI.clearTaskForm();
                UI.showSuccess("任务已添加");
                const tasks = Storage.getItem('tasks') || [];
                UI.updateTaskList(tasks);  // 直接更新UI
                console.log("UI updated with new task list");
            }
        } else {
            UI.showError("请输入任务名称");
        }
    });

    // 取消添加任务
    elements.cancelAddTaskButton?.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = bootstrap.Modal.getInstance(elements.addTaskModal);
        modal.hide();
        UI.clearTaskForm();
    });

    // 删除课程
    elements.weeklyClassList?.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-class')) {
            const index = parseInt(e.target.dataset.index);
            if (confirm('确定要删除这个课程吗？')) {
                TaskManager.deleteClass(index);
            }
        }
    });

    // 初始化
    Auth.checkLoginStatus();
    TaskManager.loadClasses();
    TaskManager.loadTasks();

    console.log("App initialization completed");
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

        const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
        modal.show();
    } else {
        console.error("Task not found");
        UI.showError("未找到任务");
    }
}

// 保存编辑后的任务
document.getElementById('saveEditTaskButton')?.addEventListener('click', () => {
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
        completed: false
    };

    TaskManager.editTask(taskIndex, updatedTask);
    const modal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
    modal.hide();
    UI.showSuccess("任务已更新");
});
