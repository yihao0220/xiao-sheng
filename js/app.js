// 设置全局错误处理函数
window.onerror = function(message, source, lineno, colno, error) {
    console.error("发生错误:", message, "在", source, "行号:", lineno);
    alert("抱歉，发生了一个错误。请查看控制台以获取更多信息。");
};

// 添加未处理的 Promise 拒绝事件监听器
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

// 应用程序初始化函数
function initializeApp() {
    console.log("正在初始化应用...");
    try {
        // 定义包含所有重要 DOM 元素的对象
        const elements = {
            loginButton: document.getElementById('loginButton'),
            loginForm: document.getElementById('loginForm'),  // 更新这里
            logoutButton: document.getElementById('logoutButton'),
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
                console.error(`元素 ${key} 未找到`);
            }
        }

        // 设置事件监听器
        setupEventListeners(elements);

        // 初始化应用程序状态
        Auth.checkLoginStatus();
        TaskManager.loadClasses();
        TaskManager.loadTasks();

        // 显示未完成任务提醒
        if (localStorage.getItem('isLoggedIn') === 'true') {
            UI.showUnfinishedTasks();
        }

        // 设置提醒
        setupReminders();

        console.log("应用程序初始化完成");

        // 设置定时器，每天凌晨执行一次删除过期任务的操作
        setDailyTaskCleanup();
    } catch (error) {
        console.error("应用程序初始化过程中出错:", error);
        alert("初始化应用时出错，请刷新页面或联系管理员。");
    }
}

// 设置事件监听器
function setupEventListeners(elements) {
    // 登录按钮点击事件
    elements.loginButton?.addEventListener('click', () => {
        console.log("登录按钮被点击");
        UI.showElement('authForm');
        UI.hideElement('loginButton');
    });

    // 提交登录表单事件
    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        Auth.login(username, password);
    });

    // 登出按钮点击事件
    elements.logoutButton?.addEventListener('click', Auth.logout);

    // 保存周课表按钮点击事件
    elements.saveWeeklyScheduleButton?.addEventListener('click', (e) => {
        e.preventDefault();
        TaskManager.addWeeklySchedule();
    });

    // 任务列表点击事件（用于编辑和删除任务）
    elements.allTasks?.addEventListener('click', handleTaskListClick);

    // 显示添加任务模态框按钮点击事件
    elements.showAddTaskFormButton?.addEventListener('click', () => {
        elements.addTaskModal.style.display = 'block';
    });

    // 添加任务按钮点击事件
    elements.addTaskButton?.addEventListener('click', handleAddTask);

    // 取消添加任务按钮点击事件
    elements.cancelAddTaskButton?.addEventListener('click', (e) => {
        e.preventDefault();
        elements.addTaskModal.style.display = 'none';
        UI.clearTaskForm();
    });

    // 为编辑任务模态框的取消按钮添加事件监听器
    const cancelEditTaskButton = document.getElementById('cancelEditTaskButton');
    if (cancelEditTaskButton) {
        cancelEditTaskButton.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('editTaskModal').style.display = 'none';
            UI.clearTaskForm();
        });
    } else {
        console.error("Cancel edit task button not found");
    }

    // 设置其他事件监听器...
}

// 处理任务列表点击事件
function handleTaskListClick(e) {
    if (e.target.classList.contains('edit-button')) {
        const index = parseInt(e.target.dataset.index);
        showEditTaskForm(index);
    } else if (e.target.classList.contains('delete-button')) {
        const index = parseInt(e.target.dataset.index);
        if (confirm('确定要删除这个任务吗？')) {
            TaskManager.deleteTask(index);
        }
    }
}

// 处理添加任务事件
function handleAddTask(e) {
    e.preventDefault();
    console.log("添加任务按钮被点击");
    const taskName = document.getElementById('taskName').value.trim();
    const timeSlots = document.querySelectorAll('.time-slot');
    const times = Array.from(timeSlots).map(slot => {
        const [dateInput, startTimeInput, endTimeInput] = slot.querySelectorAll('input');
        return {
            date: dateInput.value,
            startTime: startTimeInput.value,
            endTime: endTimeInput.value
        };
    });

    if (taskName && times.length > 0) {
        const newTask = { 
            name: taskName, 
            times: times,
            priority: document.getElementById('priority').value,
            category: document.getElementById('category').value,
            location: document.getElementById('location').value,
            completed: false 
        };
        const success = TaskManager.addTask(newTask);
        if (success) {
            document.getElementById('addTaskModal').style.display = 'none';
            UI.clearTaskForm();
            UI.showSuccess("任务已添加");
            TaskManager.loadTasks();
        }
    } else {
        UI.showError("请填写任务名称并至少添加一个时间段");
    }
}

// 显示编辑任务表单的函数
function showEditTaskForm(index) {
    const tasks = Storage.getItem('tasks') || [];
    const task = tasks[index];

    if (task) {
        const elements = {
            editTaskName: document.getElementById('editTaskName'),
            editStartDate: document.getElementById('editStartDate'),
            editStartTime: document.getElementById('editStartTime'),
            editEndDate: document.getElementById('editEndDate'),
            editEndTime: document.getElementById('editEndTime'),
            editPriority: document.getElementById('editPriority'),
            editCategory: document.getElementById('editCategory'),
            editLocation: document.getElementById('editLocation'),
            editTaskForm: document.getElementById('editTaskForm'),
            editTaskModal: document.getElementById('editTaskModal'),
            cancelEditTaskButton: document.getElementById('cancelEditTaskButton')
        };

        // 检查所有必要的元素是否存在
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Element ${key} not found`);
                UI.showError(`编辑任务表单缺少必要元素: ${key}`);
                return; // 如果缺少任何元素，直接返回
            }
        }

        // 设置表单值
        elements.editTaskName.value = task.name;
        elements.editStartDate.value = task.startDate || '';
        elements.editStartTime.value = task.startTime || '';
        elements.editEndDate.value = task.endDate || '';
        elements.editEndTime.value = task.endTime || '';
        elements.editPriority.value = task.priority || 'medium';
        elements.editCategory.value = task.category || '';
        elements.editLocation.value = task.location || '';

        elements.editTaskForm.dataset.taskIndex = index;
        elements.editTaskModal.style.display = 'block';
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
        completed: false
    };

    TaskManager.editTask(taskIndex, updatedTask);
    document.getElementById('editTaskModal').style.display = 'none';
    UI.showSuccess("任务已更新");
});

function generateWeeklyScheduleTemplate() {
    const timeSlots = [
        "8:00 - 9:40", "10:00 - 11:40", "14:00 - 15:40", "16:00 - 17:40", "19:00 - 20:40"
    ];
    const tbody = document.querySelector("#weeklyScheduleTemplate tbody");
    if (!tbody) {
        console.error("Weekly schedule template tbody not found");
        return; // 如果找不到 tbody，直接返回
    }
    tbody.innerHTML = '';

    timeSlots.forEach((slot, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${slot}</td>
            ${Array(5).fill().map((_, dayIndex) => `
                <td>
                    <input type="text" class="form-control course-input" data-time="${slot}" data-day="${dayIndex}">
                </td>
            `).join('')}
        `;
        tbody.appendChild(row);
    });
}

// 在 initializeApp 函数中调用
generateWeeklyScheduleTemplate();

// 在 DOM 加载完成后初始化应用程序
document.addEventListener('DOMContentLoaded', initializeApp);

// 设置提醒
function setupReminders() {
    // 每小时检查一次
    setInterval(() => {
        const now = new Date();
        // 检查未完成任务
        UI.showUnfinishedTasks();
        // 检查今日课程
        UI.showTodayClasses();
        // 根据时间显示早晨或下午的提醒
        if (now.getHours() === 8) {  // 假设早上8点显示
            UI.showMorningReminder();
        } else if (now.getHours() === 14) {  // 假设下午2点显示
            UI.showAfternoonReminder();
        }
    }, 3600000); // 3600000 毫秒 = 1 小时
}

// 添加新函数来设置每日任务清理
function setDailyTaskCleanup() {
    const now = new Date();
    const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // 明天
        0, 0, 0 // 凌晨 00:00:00
    );
    const msToMidnight = night.getTime() - now.getTime();

    // 首次执行
    setTimeout(() => {
        TaskManager.removeExpiredTasks();
        // 之后每24小时执行一次
        setInterval(TaskManager.removeExpiredTasks, 24 * 60 * 60 * 1000);
    }, msToMidnight);
}
