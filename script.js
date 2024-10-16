// 在文件开头添加以下代码
window.onerror = function(message, source, lineno, colno, error) {
    console.error("发生错误:", message, "在", source, "行号:", lineno);
    alert("抱歉，发生了一个错误。请查看控制台以获取更多信息。");
};

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

console.log("Script started");

function checkLoginStatus() {
    console.log("checkLoginStatus called");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    console.log("isLoggedIn:", isLoggedIn);

    const authForm = document.getElementById("authForm");
    const taskManager = document.getElementById("taskManager");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");

    if (isLoggedIn) {
        console.log("User is logged in");
        authForm.style.display = "none";
        taskManager.style.display = "block";
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";
    } else {
        console.log("User is not logged in");
        authForm.style.display = "none";
        taskManager.style.display = "none";
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";
    }
    console.log("Element visibility:", {
        authForm: authForm.style.display,
        taskManager: taskManager.style.display,
        loginButton: loginButton.style.display,
        logoutButton: logoutButton.style.display
    });
}

function initializeApp() {
    console.log("initializeApp started");
    const authForm = document.getElementById("authForm");
    const taskManager = document.getElementById("taskManager");
    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    const loginButton = document.getElementById("loginButton");
    const submitLoginButton = document.getElementById("submitLoginButton");
    const logoutButton = document.getElementById("logoutButton");
    const addTaskButton = document.getElementById("addTaskButton");
    const taskName = document.getElementById("taskName");
    const allTasks = document.getElementById("allTasks");
    const showAddTaskFormButton = document.getElementById("showAddTaskFormButton");
    const addTaskForm = document.getElementById("addTaskForm");
    const cancelAddTaskButton = document.getElementById("cancelAddTaskButton");
    const editTaskForm = document.getElementById("editTaskForm");
    const saveEditTaskButton = document.getElementById("saveEditTaskButton");
    const cancelEditTaskButton = document.getElementById("cancelEditTaskButton");
    let currentEditingTaskIndex = -1;

    // 加载任务
    function loadTasks() {
        console.log("loadTasks called");
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        console.log("Tasks from localStorage:", tasks);
        allTasks.innerHTML = "";
        tasks.forEach((task, index) => {
            console.log("Creating task element for index:", index);
            const li = document.createElement("li");
            li.className = "task-item slide-in";
            li.innerHTML = `
                <div class="task-details">
                    <h3>${task.name}</h3>
                    <p>开始: ${task.startDate} ${task.startTime}</p>
                    <p>结束: ${task.endDate} ${task.endTime}</p>
                    <p>优先级: ${task.priority}</p>
                    ${task.category ? `<p>分类: ${task.category}</p>` : ''}
                    ${task.location ? `<p>地点: ${task.location}</p>` : ''}
                </div>
                <div class="task-actions">
                    <button class="edit-button" data-index="${index}">编辑</button>
                    <button class="delete-button" data-index="${index}">删除</button>
                </div>
            `;
            allTasks.appendChild(li);
        });
        console.log("Tasks loaded and displayed");
    }

    // 添加任务
    addTaskButton.addEventListener("click", function(event) {
        event.preventDefault();
        if (taskName.value) {
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.push({ 
                name: taskName.value,
                startDate: document.getElementById("startDate").value,
                startTime: document.getElementById("startTime").value,
                endDate: document.getElementById("endDate").value,
                endTime: document.getElementById("endTime").value,
                priority: document.getElementById("priority").value,
                category: document.getElementById("category").value,
                location: document.getElementById("location").value,
                completed: false,
            });
            localStorage.setItem("tasks", JSON.stringify(tasks));
            clearTaskForm();
            loadTasks();
            addTaskForm.style.display = "none";
            showAddTaskFormButton.style.display = "block";
        }
    });

    // 删和编辑任务
    allTasks.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-button")) {
            const index = event.target.dataset.index;
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            loadTasks();
        } else if (event.target.classList.contains("edit-button")) {
            const index = event.target.dataset.index;
            editTask(index);
        }
    });

    // 编辑任
    function editTask(index) {
        console.log("Editing task at index:", index);
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const task = tasks[index];
        console.log("Task to edit:", task);
        currentEditingTaskIndex = index;

        document.getElementById("editTaskName").value = task.name;
        document.getElementById("editStartDate").value = task.startDate;
        document.getElementById("editStartTime").value = task.startTime;
        document.getElementById("editEndDate").value = task.endDate;
        document.getElementById("editEndTime").value = task.endTime;
        document.getElementById("editPriority").value = task.priority;
        document.getElementById("editCategory").value = task.category;
        document.getElementById("editLocation").value = task.location;

        editTaskForm.style.display = "block";
        taskManager.style.display = "none";
        console.log("Edit form displayed");
    }

    // 保存编辑的任务
    saveEditTaskButton.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Saving edited task");
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        
        tasks[currentEditingTaskIndex] = {
            name: document.getElementById("editTaskName").value,
            startDate: document.getElementById("editStartDate").value,
            startTime: document.getElementById("editStartTime").value,
            endDate: document.getElementById("editEndDate").value,
            endTime: document.getElementById("editEndTime").value,
            priority: document.getElementById("editPriority").value,
            category: document.getElementById("editCategory").value,
            location: document.getElementById("editLocation").value,
            completed: tasks[currentEditingTaskIndex].completed
        };

        localStorage.setItem("tasks", JSON.stringify(tasks));
        console.log("Tasks saved to localStorage");
        editTaskForm.style.display = "none";
        taskManager.style.display = "block";
        loadTasks();
        console.log("Tasks reloaded");
    });

    // 取消编辑任务
    cancelEditTaskButton.addEventListener("click", function() {
        editTaskForm.style.display = "none";
        taskManager.style.display = "block";
    });

    // 登录按钮事件
    loginButton.addEventListener("click", function() {
        console.log("Login button clicked");
        authForm.style.display = "block";
        loginButton.style.display = "none";
    });

    // 提交登录表单事件
    submitLoginButton.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Submit login button clicked");
        if (loginUsername.value && loginPassword.value) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUser", loginUsername.value);
            checkLoginStatus();
            showUnfinishedTasks(); // 添加这行
        }
    });

    // 退出登录按钮事件
    logoutButton.addEventListener("click", function() {
        console.log("Logout button clicked");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        checkLoginStatus();
    });

    // 显示添加任务表单
    showAddTaskFormButton.addEventListener("click", function() {
        addTaskForm.style.display = "block";
        showAddTaskFormButton.style.display = "none";
    });

    // 取消添加任务
    cancelAddTaskButton.addEventListener("click", function() {
        addTaskForm.style.display = "none";
        showAddTaskFormButton.style.display = "block";
        clearTaskForm();
    });

    // 清除任务表单
    function clearTaskForm() {
        document.getElementById("taskName").value = "";
        document.getElementById("startDate").value = "";
        document.getElementById("startTime").value = "";
        document.getElementById("endDate").value = "";
        document.getElementById("endTime").value = "";
        document.getElementById("priority").value = "low";
        document.getElementById("category").value = "";
        document.getElementById("location").value = "";
    }

    // 初始化
    checkLoginStatus();
    loadTasks();

    console.log("initializeApp completed");

    console.log("DOM elements:", {
        authForm,
        taskManager,
        loginButton,
        submitLoginButton,
        logoutButton
    });

    console.log("After checkLoginStatus:", {
        authFormDisplay: authForm.style.display,
        taskManagerDisplay: taskManager.style.display,
        loginButtonDisplay: loginButton.style.display,
        logoutButtonDisplay: logoutButton.style.display
    });

    console.log("authForm:", authForm);
    console.log("loginButton:", loginButton);

    console.log("Initial state:", {
        authFormDisplay: authForm.style.display,
        taskManagerDisplay: taskManager.style.display,
        loginButtonDisplay: loginButton.style.display,
        logoutButtonDisplay: logoutButton.style.display
    });

    console.log("Final state:", {
        authFormDisplay: authForm.style.display,
        taskManagerDisplay: taskManager.style.display,
        loginButtonDisplay: loginButton.style.display,
        logoutButtonDisplay: logoutButton.style.display
    });
}

function showUnfinishedTasks() {
    console.log("Checking for unfinished tasks");
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const unfinishedTasks = tasks.filter(task => !task.completed);

    if (unfinishedTasks.length > 0) {
        let message = "您有以下未完成的任务:\n";
        unfinishedTasks.forEach(task => {
            message += `- ${task.name}\n`;
        });
        alert(message);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded event fired");
    initializeApp();
});

console.log("Script end");
