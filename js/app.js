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

// 应用程序初始化函数
function initializeApp() {
    // 输出日志，表示初始化函数已被调用
    console.log("initializeApp function called");

    try {
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

        // 替换 Bootstrap 模态框相关代码
        const showAddTaskFormButton = document.getElementById('showAddTaskFormButton');
        const addTaskModal = document.getElementById('addTaskModal');
        const closeModalButtons = document.querySelectorAll('.close-modal');

        if (showAddTaskFormButton && addTaskModal) {
            showAddTaskFormButton.addEventListener('click', function() {
                console.log("Showing add task modal");
                addTaskModal.style.display = 'block';
            });
        }

        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

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

            // 检查是否至少填写了任务名称
            if (taskName) {
                const newTask = { 
                    name: taskName, 
                    startDate: startDate || null, 
                    startTime: startTime || null, 
                    endDate: endDate || null, 
                    endTime: endTime || null, 
                    priority: priority || 'medium', 
                    category: category || '', 
                    location: location || '', 
                    completed: false 
                };
                console.log("New task object:", newTask);
                const success = TaskManager.addTask(newTask);
                if (success) {
                    console.log("Task added successfully");
                    addTaskModal.style.display = 'none';
                    UI.clearTaskForm();
                    UI.showSuccess("任务已添加");
                    TaskManager.loadTasks();
                    console.log("Tasks reloaded after adding new task");
                }
            } else {
                UI.showError("请至少填写任务名称");
            }
        });

        // 为取消添加任务按钮添加点击事件监听器
        elements.cancelAddTaskButton?.addEventListener('click', (e) => {
            e.preventDefault();
            addTaskModal.style.display = 'none';
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

        const editTaskModal = document.getElementById('editTaskModal');
        editTaskModal.style.display = 'block';
    } else {
        console.error("Task not found");
        UI.showError("未找到任务");
    }
}

// 为保存编辑任务按钮添加点击事件监听器
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
