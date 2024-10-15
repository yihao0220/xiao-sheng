document.addEventListener("DOMContentLoaded", function() {
    const authForm = document.getElementById("authForm");
    const taskManager = document.getElementById("taskManager");
    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
    const addTaskButton = document.getElementById("addTaskButton");
    const taskName = document.getElementById("taskName");
    const allTasks = document.getElementById("allTasks");

    // 加载任务
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        allTasks.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${task.name}</span>
                <button class="delete-button" data-index="${index}">删除</button>
            `;
            allTasks.appendChild(li);
        });
    }

    // 添加任务
    addTaskButton.addEventListener("click", function(event) {
        event.preventDefault();
        if (taskName.value) {
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.push({ name: taskName.value, completed: false });
            localStorage.setItem("tasks", JSON.stringify(tasks));
            taskName.value = "";
            loadTasks();
        }
    });

    // 删除任务
    allTasks.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-button")) {
            const index = event.target.dataset.index;
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            loadTasks();
        }
    });

    // 显示未完成任务
    function showUnfinishedTasks() {
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

    // 检查本地存储中是否有登录信息
    function checkLoginStatus() {
        if (localStorage.getItem("isLoggedIn") === "true") {
            authForm.style.display = "none";
            taskManager.style.display = "block";
            showUnfinishedTasks();
        } else {
            authForm.style.display = "block";
            taskManager.style.display = "none";
        }
    }

    // 登录按钮事件
    loginButton.addEventListener("click", function(event) {
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

    // 初始化
    checkLoginStatus();
    loadTasks();
});
