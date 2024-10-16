// 在文件开头添加以下代码
window.onerror = function(message, source, lineno, colno, error) {
    console.error("发生错误:", message, "在", source, "行号:", lineno);
    alert("抱歉，发生了一个错误。请查看控制台以获取更多信息。");
};

console.log("Script started");

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
        allTasks.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = "task-item slide-in";
            li.innerHTML = `
                <span>${task.name}</span>
                <div>
                    <button class="edit-button" data-index="${index}">编辑</button>
                    <button class="delete-button" data-index="${index}">删除</button>
                </div>
            `;
            allTasks.appendChild(li);
        });
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

    // 删除和编辑任务
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

    // 编辑任务
    function editTask(index) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const task = tasks[index];
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
    }

    // 保存编辑的任务
    saveEditTaskButton.addEventListener("click", function(event) {
        event.preventDefault();
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
        editTaskForm.style.display = "none";
        taskManager.style.display = "block";
        loadTasks();
    });

    // 取消编辑任务
    cancelEditTaskButton.addEventListener("click", function() {
        editTaskForm.style.display = "none";
        taskManager.style.display = "block";
    });

    // 检查登录状态
    function checkLoginStatus() {
        console.log("checkLoginStatus called");
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        console.log("isLoggedIn:", isLoggedIn);

        if (isLoggedIn) {
            authForm.style.display = "none";
            taskManager.style.display = "block";
            loginButton.style.display = "none";
            logoutButton.style.display = "block";
        } else {
            authForm.style.display = "block";
            taskManager.style.display = "none";
            loginButton.style.display = "block";
            logoutButton.style.display = "none";
        }
        document.querySelector('.container').style.display = 'block';
    }

    // 登录按钮事件
    loginButton.addEventListener("click", function() {
        console.log("Login button clicked");
        authForm.style.display = "block";
        loginButton.style.display = "none";
    });

    // 提交登录表单事件
    submitLoginButton.addEventListener("click", function(event) {
        event.preventDefault();
        if (loginUsername.value && loginPassword.value) {
            localStorage.setItem("isLoggedIn", "true");
            checkLoginStatus();
        }
    });

    // 退出登录按钮事件
    logoutButton.addEventListener("click", function() {
        localStorage.removeItem("isLoggedIn");
        checkLoginStatus();
    });

    // 显示添加任务表单
    showAddTaskFormButton.addEventListener("click", function() {
        addTaskForm.style.display = "block";
        showAddTaskFormButton.style.display = "none";
    });

    // 取消添加��务
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
}

document.addEventListener("DOMContentLoaded", initializeApp);

console.log("Script end");

console.log("authForm:", authForm);
console.log("loginButton:", loginButton);

window.addEventListener('load', function() {
    console.log("Window fully loaded");
    console.log("loginButton:", document.getElementById("loginButton"));
    console.log("authForm:", document.getElementById("authForm"));
});
