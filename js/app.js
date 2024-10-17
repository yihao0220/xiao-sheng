window.onerror = function(message, source, lineno, colno, error) {
    console.error("发生错误:", message, "在", source, "行号:", lineno);
    alert("抱歉，发生了一个错误。请查看控制台以获取更多信息。");
};

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded");
    initializeApp();
});

function initializeApp() {
    console.log("App script loaded");

    if (typeof UI === 'undefined') {
        console.error("UI object is not defined. Make sure ui.js is loaded before app.js");
        return;
    }

    if (typeof Auth === 'undefined') {
        console.error("Auth object is not defined. Make sure auth.js is loaded before app.js");
        return;
    }

    if (typeof TaskManager === 'undefined') {
        console.error("TaskManager object is not defined. Make sure taskManager.js is loaded before app.js");
        return;
    }

    if (typeof Storage === 'undefined') {
        console.error("Storage object is not defined. Make sure storage.js is loaded before app.js");
        return;
    }

    // 检查所有需要的 DOM 元素
    const elements = [
        'loginButton', 'authForm', 'submitLoginButton', 'logoutButton',
        'showAddTaskFormButton', 'addTaskForm', 'addTaskButton', 'cancelAddTaskButton',
        'uploadScheduleButton', 'schedulePhoto'
    ];

    const missingElements = elements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.error("Missing DOM elements:", missingElements);
        alert("页面加载出错，请刷新重试。");
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

    const loginButton = document.getElementById('loginButton');
    const authForm = document.getElementById('authForm');
    
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            console.log("Login button clicked");
            UI.showElement('authForm');
            console.log("authForm display:", authForm ? authForm.style.display : "authForm not found");
        });
    } else {
        console.error("Login button not found");
    }

    if (!authForm) console.error("Auth form not found");
    
    logDeviceInfo();
    checkLocalStorage();

    // 初始化应用
    Auth.checkLoginStatus();
    
    // 检查并添加事件监听器
    const eventListeners = {
        'submitLoginButton': () => {
            document.getElementById('submitLoginButton').addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Submit login button clicked");
                const username = document.getElementById('loginUsername').value;
                const password = document.getElementById('loginPassword').value;
                Auth.login(username, password);
            });
        },
        'logoutButton': () => {
            document.getElementById('logoutButton').addEventListener('click', Auth.logout);
        },
        'showAddTaskFormButton': () => {
            document.getElementById('showAddTaskFormButton').addEventListener('click', () => {
                document.getElementById('addTaskForm').style.display = 'block';
                document.getElementById('showAddTaskFormButton').style.display = 'none';
            });
        },
        'addTaskButton': () => {
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
                    const newTask = {
                        name: taskName,
                        startDate,
                        startTime,
                        endDate,
                        endTime,
                        priority,
                        category,
                        location,
                        completed: false
                    };
                    TaskManager.addTask(newTask);
                    document.getElementById('addTaskForm').style.display = 'none';
                    document.getElementById('showAddTaskFormButton').style.display = 'block';
                    // 清空表单
                    document.getElementById('taskName').value = '';
                    // ... 清空其他输入字段 ...
                }
            });
        },
        'cancelAddTaskButton': () => {
            document.getElementById('cancelAddTaskButton').addEventListener('click', () => {
                document.getElementById('addTaskForm').style.display = 'none';
                document.getElementById('showAddTaskFormButton').style.display = 'block';
            });
        },
        'uploadScheduleButton': () => {
            document.getElementById('uploadScheduleButton').addEventListener('click', (e) => {
                e.preventDefault();
                const file = document.getElementById('schedulePhoto').files[0];
                if (file) {
                    TaskManager.recognizeSchedule(file)
                        .then(() => {
                            console.log("Schedule recognized and saved successfully");
                            alert("课表已成功识别并保存");
                        })
                        .catch((error) => {
                            console.error("Error recognizing schedule:", error);
                            alert("识别课表时出错，请稍后再试。");
                        });
                } else {
                    alert("请选择一张课表照片");
                }
            });
        }
    };

    // 为每个元素添加事件监听器，如果元素不存在则跳过
    for (const [id, addListener] of Object.entries(eventListeners)) {
        const element = document.getElementById(id);
        if (element) {
            addListener();
        } else {
            console.warn(`Element with id '${id}' not found. Skipping event listener.`);
        }
    }

    // 加载现有的课程和任务
    TaskManager.loadClasses();
    TaskManager.loadTasks();

    // 检查今天的课程并显示提醒
    const todayClasses = TaskManager.getClassesForToday();
    if (todayClasses && todayClasses.length > 0) {
        let message = "今天的课程：\n";
        todayClasses.forEach(classInfo => {
            message += `- ${classInfo.name} (${classInfo.time} at ${classInfo.location})\n`;
        });
        alert(message);
    }

    // 添加任务相关的事件监听器
    const allTasks = document.getElementById('allTasks');
    const editTaskForm = document.getElementById('editTaskForm');
    const saveEditTaskButton = document.getElementById('saveEditTaskButton');
    const cancelEditTaskButton = document.getElementById('cancelEditTaskButton');
    let currentEditingTaskIndex = -1;

    allTasks.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-button')) {
            const index = parseInt(e.target.dataset.index);
            currentEditingTaskIndex = index;
            const tasks = Storage.getItem('tasks') || [];
            const task = tasks[index];
            
            // 填充编辑表单
            document.getElementById('editTaskName').value = task.name;
            document.getElementById('editStartDate').value = task.startDate;
            document.getElementById('editStartTime').value = task.startTime;
            document.getElementById('editEndDate').value = task.endDate;
            document.getElementById('editEndTime').value = task.endTime;
            document.getElementById('editPriority').value = task.priority;
            document.getElementById('editCategory').value = task.category || '';
            document.getElementById('editLocation').value = task.location || '';

            // 显示编辑表单
            editTaskForm.style.display = 'block';
            document.getElementById('taskManager').style.display = 'none';
        }
    });

    saveEditTaskButton.addEventListener('click', (e) => {
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
            completed: false // 假设编辑时不改变完成状态
        };
        TaskManager.editTask(currentEditingTaskIndex, updatedTask);
        editTaskForm.style.display = 'none';
        document.getElementById('taskManager').style.display = 'block';
    });

    cancelEditTaskButton.addEventListener('click', () => {
        editTaskForm.style.display = 'none';
        document.getElementById('taskManager').style.display = 'block';
    });

    console.log("Event listeners set up");

    // 删除原有的添加课程相关代码，添加上传课表照片的代码
    const schedulePhoto = document.getElementById('schedulePhoto');

    console.log("App.js end");
} // Add this closing brace to properly close the initializeApp function
