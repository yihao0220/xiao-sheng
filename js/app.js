// 设置全局错误处理函数，捕获未被 try-catch 块捕获的错误
window.onerror = function(message, source, lineno, colno, error) {
    // 在控制台输出错误信息，包括错误消息、源文件和行号
    console.error("发生错误:", message, "在", source, "行号:", lineno);
    // 向用户显示一个警告弹窗，提示发生了错误
    alert("抱歉，发生了一个错误。请查看控制台以获取更多信息。");
};

// 添加未处理的 Promise 拒绝事件监听器
window.addEventListener('unhandledrejection', function(event) {
    // 在控制台输出未处理的 Promise 拒绝原因
    console.error('Unhandled promise rejection:', event.reason);
});

// 检查 Bootstrap 是否正确加载的函数
function checkBootstrapLoaded() {
    // 检查 bootstrap 对象是否存在
    if (typeof bootstrap === 'undefined') {
        // 如果 bootstrap 未定义，输出错误信息并返回 false
        console.error("Bootstrap is not loaded. Some features may not work correctly.");
        return false;
    }
    // 如果 bootstrap 已加载，返回 true
    return true;
}

// 应用程序初始化函数
function initializeApp() {
    // 输出日志，表示初始化函数已被调用
    console.log("initializeApp function called");

    try {
        // 检查 Bootstrap 是否加载，如果未加载则抛出错误
        if (!checkBootstrapLoaded()) {
            throw new Error("Bootstrap not loaded");
        }

        // 定义包含所有重要 DOM 元素的对象
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

        // 检查所有 DOM 元素是否存在
        for (const [key, value] of Object.entries(elements)) {
            if (!value) {
                // 如果某个元素不存在，输出错误信息
                console.error(`Element ${key} not found`);
            }
        }

        // 为登录按钮添加点击事件监听器
        elements.loginButton?.addEventListener('click', () => {
            console.log("Login button clicked");
            UI.showElement('authForm');
            UI.hideElement('loginButton');
        });

        // 为提交登录按钮添加点击事件监听器
        elements.submitLoginButton?.addEventListener('click', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            Auth.login(username, password);
        });

        // 为登出按钮添加点击事件监听器
        elements.logoutButton?.addEventListener('click', Auth.logout);

        // 为添加课程按钮添加点击事件监听器
        elements.addClassButton?.addEventListener('click', (e) => {
            e.preventDefault();
            // 获取课程信息
            const className = document.getElementById('className').value;
            const classDay = document.getElementById('classDay').value;
            const classStartTime = document.getElementById('classStartTime').value;
            const classEndTime = document.getElementById('classEndTime').value;
            const classLocation = document.getElementById('classLocation').value;

            // 检查必要信息是否填写完整
            if (className && classDay && classStartTime && classEndTime) {
                const newClass = { name: className, day: classDay, startTime: classStartTime, endTime: classEndTime, location: classLocation };
                TaskManager.addClass(newClass);
                UI.clearClassForm();
            } else {
                UI.showError("请填写所有必要的课程信息");
            }
        });

        // 为保存周课表按钮添加点击事件监听器
        elements.saveWeeklyScheduleButton?.addEventListener('click', (e) => {
            e.preventDefault();
            const weeklySchedule = TaskManager.getWeeklySchedule();
            TaskManager.addWeeklySchedule(weeklySchedule);
            UI.updateClassList(weeklySchedule);
        });

        // 为任务列表添加点击事件监听器，处理编辑和删除任务
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

        // 为显示添加任务模态框按钮添加点击事件监听器
        const showAddTaskFormButton = document.getElementById('showAddTaskFormButton');
        const addTaskModal = document.getElementById('addTaskModal');

        if (showAddTaskFormButton && addTaskModal) {
            showAddTaskFormButton.addEventListener('click', function() {
                console.log("Showing add task modal");
                const modal = new bootstrap.Modal(addTaskModal);
                modal.show();
            });
        } else {
            console.error("Add task button or modal not found");
        }

        // 为添加任务按钮添加点击事件监听器
        elements.addTaskButton?.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Add task button clicked");
            // 获取任务信息
            const taskName = document.getElementById('taskName').value;
            const startDate = document.getElementById('startDate').value;
            const startTime = document.getElementById('startTime').value;
            const endDate = document.getElementById('endDate').value;
            const endTime = document.getElementById('endTime').value;
            const priority = document.getElementById('priority').value;
            const category = document.getElementById('category').value;
            const location = document.getElementById('location').value;

            // 检查必要信息是否填写完整
            if (taskName && startDate && startTime && endDate && endTime) {
                const newTask = { name: taskName, startDate, startTime, endDate, endTime, priority, category, location, completed: false };
                console.log("New task object:", newTask);
                const success = TaskManager.addTask(newTask);
                if (success) {
                    console.log("Task added successfully");
                    // 隐藏模态框
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
                    TaskManager.loadTasks(); // 重新加载任务列表
                    console.log("Tasks reloaded after adding new task");
                }
            } else {
                UI.showError("请填写所有必要的任务信息");
            }
        });

        // 为取消添加任务按钮添加点击事件监听器
        elements.cancelAddTaskButton?.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = bootstrap.Modal.getInstance(elements.addTaskModal);
            modal.hide();
            UI.clearTaskForm();
        });

        // 为周课表列表添加点击事件监听器，处理删除课程
        elements.weeklyClassList?.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-class')) {
                const index = parseInt(e.target.dataset.index);
                if (confirm('确定要删除这个课程吗？')) {
                    TaskManager.deleteClass(index);
                }
            }
        });

        // 初始化应用程序
        Auth.checkLoginStatus();
        TaskManager.loadClasses();
        TaskManager.loadTasks(); // 确保这行代码存在
        console.log("Tasks loaded");

        console.log("App initialization completed");
    } catch (error) {
        // 捕获并处理初始化过程中的错误
        console.error("Error during app initialization:", error);
        alert("初始化应用时出错，请刷新页面或联系管理员。");
    }
}

// 显示编辑任务表单的函数
function showEditTaskForm(index) {
    // 从存储中获取任务列表
    const tasks = Storage.getItem('tasks') || [];
    const task = tasks[index];

    if (task) {
        // 如果找到任务，填充编辑表单
        document.getElementById('editTaskName').value = task.name;
        document.getElementById('editStartDate').value = task.startDate;
        document.getElementById('editStartTime').value = task.startTime;
        document.getElementById('editEndDate').value = task.endDate;
        document.getElementById('editEndTime').value = task.endTime;
        document.getElementById('editPriority').value = task.priority;
        document.getElementById('editCategory').value = task.category || '';
        document.getElementById('editLocation').value = task.location || '';

        // 在表单上存储任务索引
        document.getElementById('editTaskForm').dataset.taskIndex = index;

        // 显示编辑任务模态框
        const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
        modal.show();
    } else {
        // 如果未找到任务，输出错误信息
        console.error("Task not found");
        UI.showError("未找到任务");
    }
}

// 为保存编辑任务按钮添加点击事件监听器
document.getElementById('saveEditTaskButton')?.addEventListener('click', () => {
    // 获取任务索引
    const taskIndex = document.getElementById('editTaskForm').dataset.taskIndex;
    // 创建更新后的任务对象
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

    // 更新任务
    TaskManager.editTask(taskIndex, updatedTask);
    // 隐藏编辑任务模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
    modal.hide();
    // 显示成功消息
    UI.showSuccess("任务已更新");
});

// 在 DOM 加载完成后初始化应用程序
document.addEventListener('DOMContentLoaded', initializeApp);
