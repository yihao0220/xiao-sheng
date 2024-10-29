// 设置全局错误处理函数
window.onerror = function(message, source, lineno, colno, error) {
    console.error("发生错误:", message, "在", source, "行号:", lineno);
    alert("抱歉，发生了一个错误。请查看控制台以获取更多信息。");
};

// 添加未处理的 Promise 拒绝事件监听器
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

// 将所有的初始化逻辑移到这个函数中
function initializeApp() {
    console.log("正在初始化应用...");
    try {
        // 定义包含所有重要 DOM 元素的对象
        const elements = {
            loginButton: document.getElementById('loginButton'),
            authForm: document.getElementById('authForm'),
            loginForm: document.getElementById('loginForm'),
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
        TaskManager.loadTasks(); // 确保这里调用了 loadTasks

        // 显示未完成任务提醒
        if (localStorage.getItem('isLoggedIn') === 'true') {
            UI.showUnfinishedTasks();
            // 确保传入有效的任务数组
            const tasks = Storage.getItem('tasks') || [];
            if (Array.isArray(tasks)) {
                UI.createTaskCalendar(tasks);
            } else {
                console.error('Invalid tasks data:', tasks);
            }
        }

        // 设置提醒
        setupReminders();

        console.log("应用程序初始化成，登录按钮应该可使用了");

        // 设置定时器，每天凌晨执行一次删除过期任务的操作
        setDailyTaskCleanup();

        // 加载并显示已保存的时间段
        const savedSchedule = Storage.getItem('weeklySchedule') || [];
        UI.updateClassList(savedSchedule);
    } catch (error) {
        console.error("应用程序初始化过程中出错:", error);
        alert("初始化应用时出错，请刷新页面或联系管理员。");
    }
}

// 确保在 DOM 加载完成后执行初始化
document.addEventListener('DOMContentLoaded', initializeApp);

// 设置事件监听器
function setupEventListeners(elements) {
    // 登录按钮点击事件
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            console.log("登录按钮被点击");
            UI.showElement('authForm');
            UI.hideElement('loginButton');
        });
    } else {
        console.error("登录按钮未找到");
    }

    // 提交登录表单事件
    elements.loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        Auth.login(username, password);
    });

    // 登出按钮点击事件
    elements.logoutButton?.addEventListener('click', Auth.logout);

    // 保存周课按钮点击件
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
        if (elements.addTaskModal) {
            elements.addTaskModal.style.display = 'none';
            // 确保所有必要的元素都存在后再调用 clearTaskForm
            if (document.getElementById('taskName') && 
                document.getElementById('taskTimesList') && 
                document.getElementById('priority') && 
                document.getElementById('category') && 
                document.getElementById('location')) {
                UI.clearTaskForm();
            } else {
                console.error("Some task form elements are missing");
            }
        } else {
            console.error("Add task modal not found");
        }
    });

    // 为编辑任务模态框的取消按钮添加事件监听器
    const cancelEditTaskButton = document.getElementById('cancelEditTaskButton');
    if (cancelEditTaskButton) {
        cancelEditTaskButton.addEventListener('click', (e) => {
            e.preventDefault();
            const editTaskModal = document.getElementById('editTaskModal');
            if (editTaskModal) {
                editTaskModal.style.display = 'none';
                // 确保所有必要的元素都存在后再调用 clearTaskForm
                if (document.getElementById('taskName') && 
                    document.getElementById('taskTimesList') && 
                    document.getElementById('priority') && 
                    document.getElementById('category') && 
                    document.getElementById('location')) {
                    UI.clearTaskForm();
                } else {
                    console.error("Some task form elements are missing");
                }
            } else {
                console.error("Edit task modal not found");
            }
        });
    } else {
        console.error("Cancel edit task button not found");
    }

    // 设置其他事件监听器...

    // 在 setupEventListeners 函数中添加
    const registerForm = document.getElementById('signupForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            Auth.register(username, password);
        });
    } else {
        console.error("Register form not found");
    }

    // 添加显示注册表单的事件监听器
    const showRegisterFormButton = document.getElementById('showRegisterForm');
    if (showRegisterFormButton) {
        showRegisterFormButton.addEventListener('click', (e) => {
            e.preventDefault();
            UI.hideElement('authForm');
            UI.showElement('registerForm');
        });
    } else {
        console.error("Show register form button not found");
    }

    // 添加返回登录表单的事件监听器
    const showLoginFormButton = document.getElementById('showLoginForm');
    if (showLoginFormButton) {
        showLoginFormButton.addEventListener('click', (e) => {
            e.preventDefault();
            UI.hideElement('registerForm');
            UI.showElement('authForm');
        });
    } else {
        console.error("Show login form button not found");
    }

    // 添加时间段按钮点击事件
    const addTimeSlotButton = document.getElementById('addTimeSlot');
    if (addTimeSlotButton) {
        addTimeSlotButton.addEventListener('click', () => {
            console.log("Add time slot button clicked");
            UI.addTimeSlotInput('taskTimesList');
        });
    } else {
        console.error("Add time slot button not found");
    }

    // 删除时间段按钮点击事件（使用事件委托）
    document.getElementById('taskTimesList')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-time-slot')) {
            e.target.closest('.time-slot').remove();
        }
    });
}

// 处任务列表点击事件
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
    const timeSlots = document.querySelectorAll('#taskTimesList .time-slot');
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
        const editTaskModal = document.getElementById('editTaskModal');
        const editTaskForm = document.getElementById('editTaskForm');
        const editTaskTimesList = document.getElementById('editTaskTimesList');
        
        document.getElementById('editTaskName').value = task.name;
        document.getElementById('editPriority').value = task.priority || 'medium';
        document.getElementById('editCategory').value = task.category || '';
        document.getElementById('editLocation').value = task.location || '';

        // 清空并重新填充时间段列表
        editTaskTimesList.innerHTML = '';
        task.times.forEach(time => {
            const timeSlotDiv = document.createElement('div');
            timeSlotDiv.className = 'time-slot mb-2';
            timeSlotDiv.innerHTML = `
                <input type="date" class="form-control mb-1" value="${time.date}" required>
                <div class="d-flex">
                    <input type="time" class="form-control mr-1" value="${time.startTime}" required>
                    <input type="time" class="form-control ml-1" value="${time.endTime}" required>
                    <button type="button" class="btn btn-danger ml-2 remove-time-slot">删除</button>
                </div>
            `;
            editTaskTimesList.appendChild(timeSlotDiv);
        });

        editTaskForm.dataset.taskIndex = index;
        editTaskModal.style.display = 'block';
    } else {
        console.error("Task not found");
        UI.showError("未找到任务");
    }
}

// 为保存编辑任务按钮添加点击事件监听器
document.getElementById('saveEditTaskButton').addEventListener('click', () => {
    const taskIndex = document.getElementById('editTaskForm').dataset.taskIndex;
    const timeSlots = document.querySelectorAll('#editTaskTimesList .time-slot');
    const times = Array.from(timeSlots).map(slot => {
        const [dateInput, startTimeInput, endTimeInput] = slot.querySelectorAll('input');
        return {
            date: dateInput.value,
            startTime: startTimeInput.value,
            endTime: endTimeInput.value
        };
    });

    const updatedTask = {
        name: document.getElementById('editTaskName').value,
        times: times,
        priority: document.getElementById('editPriority').value,
        category: document.getElementById('editCategory').value,
        location: document.getElementById('editLocation').value,
        completed: false
    };

    if (TaskManager.editTask(taskIndex, updatedTask)) {
        document.getElementById('editTaskModal').style.display = 'none';
        UI.showSuccess("任务已更新");
        TaskManager.loadTasks();
    }
});

// 修改 generateWeeklyScheduleTemplate 函数
function generateWeeklyScheduleTemplate() {
    const timeSlots = [
        "8:00 - 9:40", "10:00 - 11:40", "14:00 - 15:40", "16:00 - 17:40", "19:00 - 20:40"
    ];
    const tbody = document.querySelector("#weeklyScheduleTemplate tbody");
    if (!tbody) {
        console.error("Weekly schedule template tbody not found");
        return;
    }
    tbody.innerHTML = '';

    // 添加"添加时间段"按钮
    const addTimeButton = document.createElement('button');
    addTimeButton.className = 'btn btn-secondary mb-3';
    addTimeButton.innerHTML = '<i class="fas fa-plus"></i> 添加时间段';
    addTimeButton.onclick = addNewTimeSlot;
    tbody.parentElement.parentElement.insertBefore(addTimeButton, tbody.parentElement);

    // 生成初始时间段
    timeSlots.forEach((slot) => {
        const [startTime, endTime] = slot.split(' - ');
        addTimeSlotRow(startTime, endTime);
    });

    // 添加新时间段的函数
    function addNewTimeSlot() {
        addTimeSlotRow();
    }

    // 创建时间段行的函数
    function addTimeSlotRow(startTime = '', endTime = '') {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="time" class="form-control time-slot-start" value="${startTime}" required>
                -
                <input type="time" class="form-control time-slot-end" value="${endTime}" required>
                <button class="btn btn-danger btn-sm remove-time-slot ml-2">删除</button>
            </td>
            ${Array(5).fill().map((_, dayIndex) => `
                <td>
                    <input type="text" class="form-control course-input" data-day="${dayIndex}">
                </td>
            `).join('')}
        `;
        tbody.appendChild(row);

        // 添加删除按钮的事件监听器
        const removeButton = row.querySelector('.remove-time-slot');
        if (removeButton) {
            removeButton.addEventListener('click', () => {
                row.remove();
            });
        }
    }
}

// 在 initializeApp 函数中调用
generateWeeklyScheduleTemplate();

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

// 添加新函数来设置日任务清理
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

