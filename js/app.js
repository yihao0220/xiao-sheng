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
    }

    if (typeof Auth === 'undefined') {
        console.error("Auth object is not defined. Make sure auth.js is loaded before app.js");
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
    
    if (!loginButton) console.error("Login button not found");
    if (!authForm) console.error("Auth form not found");
    
    logDeviceInfo();
    checkLocalStorage();

    // 初始化应用
    Auth.checkLoginStatus();
    
    // 设置事件监听器
    loginButton.addEventListener('click', () => {
        console.log("Login button clicked");
        UI.showElement('authForm');
        console.log("authForm display:", document.getElementById('authForm').style.display);
    });
    document.getElementById('submitLoginButton').addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Submit login button clicked");
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        Auth.login(username, password);
    });
    document.getElementById('logoutButton').addEventListener('click', Auth.logout);
    
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
    const showAddTaskFormButton = document.getElementById('showAddTaskFormButton');
    const addTaskForm = document.getElementById('addTaskForm');
    const addTaskButton = document.getElementById('addTaskButton');
    const cancelAddTaskButton = document.getElementById('cancelAddTaskButton');

    showAddTaskFormButton.addEventListener('click', () => {
        addTaskForm.style.display = 'block';
        showAddTaskFormButton.style.display = 'none';
    });

    addTaskButton.addEventListener('click', (e) => {
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
            addTaskForm.style.display = 'none';
            showAddTaskFormButton.style.display = 'block';
            // 清空表单
            document.getElementById('taskName').value = '';
            // ... 清空其他输入字段 ...
        }
    });

    cancelAddTaskButton.addEventListener('click', () => {
        addTaskForm.style.display = 'none';
        showAddTaskFormButton.style.display = 'block';
    });

    // 添加课程相关的事件监听器
    const addClassButton = document.getElementById('addClassButton');
    const classForm = document.getElementById('classForm');

    addClassButton.addEventListener('click', (e) => {
        e.preventDefault();
        const className = document.getElementById('className').value;
        const classDay = document.getElementById('classDay').value;
        const classTime = document.getElementById('classTime').value;
        const classLocation = document.getElementById('classLocation').value;
        const classPhoto = document.getElementById('classPhoto').files[0];

        if (className && classDay && classTime) {
            const newClass = {
                name: className,
                day: classDay,
                time: classTime,
                location: classLocation,
                photo: classPhoto ? URL.createObjectURL(classPhoto) : null
            };
            TaskManager.addClass(newClass);
            classForm.reset();
        }
    });

    console.log("Event listeners set up");
}

console.log("App.js end");
