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
    console.log("Initializing app...");
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
        elements.showAddTaskFormButton?.addEventListener('click', () => {
            elements.addTaskModal.style.display = 'block';
        });

        // 为添加任务按钮添加点击事件监听器
        elements.addTaskButton?.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Add task button clicked");
            const taskName = document.getElementById('taskName').value.trim();

            if (taskName) {
                const newTask = { 
                    name: taskName, 
                    startDate: document.getElementById('startDate').value,
                    startTime: document.getElementById('startTime').value,
                    endDate: document.getElementById('endDate').value,
                    endTime: document.getElementById('endTime').value,
                    priority: document.getElementById('priority').value,
                    category: document.getElementById('category').value,
                    location: document.getElementById('location').value,
                    completed: false 
                };
                const success = TaskManager.addTask(newTask);
                if (success) {
                    elements.addTaskModal.style.display = 'none';
                    UI.clearTaskForm();
                    UI.showSuccess("任务已添加");
                    TaskManager.loadTasks();
                }
            } else {
                UI.showError("请至少填写任务名称");
            }
        });

        // 为取消添加任务按钮添加点击事件监听器
        elements.cancelAddTaskButton?.addEventListener('click', (e) => {
            e.preventDefault();
            elements.addTaskModal.style.display = 'none';
            UI.clearTaskForm();
        });

        // 初始化应用程序
        Auth.checkLoginStatus();
        TaskManager.loadClasses();
        TaskManager.loadTasks();

        // 添加这行来显示未完成任务提醒
        if (localStorage.getItem('isLoggedIn') === 'true') {
            UI.showUnfinishedTasks();
        }

        console.log("App initialization completed");
    } catch (error) {
        console.error("Error during app initialization:", error);
        alert("初始化应用时出错，请刷新页面或联系管理员。");
    }
}

// 在 DOM 加载完成后初始化应用程序
document.addEventListener('DOMContentLoaded', initializeApp);
