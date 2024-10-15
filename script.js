// 在文件开头添加以下代码
window.onerror = function(message, source, lineno, colno, error) {
    console.error("发生错误:", message, "在", source, "行号:", lineno);
    alert("抱歉，发生了一个错误。请查看控制台以获取更多信息。");
};

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded event fired");
    try {
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
                    <button class="delete-button" data-index="${index}">删除</button>
                `;
                allTasks.appendChild(li);
            });
        }

        // 添加任务
        addTaskButton.addEventListener("click", function(event) {
            event.preventDefault();
            if (taskName.value) {
                showLoading(this);
                setTimeout(() => {
                    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
                    tasks.push({ 
                        name: taskName.value, 
                        completed: false,
                    });
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    taskName.value = "";
                    loadTasks();
                    addTaskForm.style.display = "none";
                    showAddTaskFormButton.style.display = "block";
                    hideLoading(this);
                }, 500); // 模拟加载时间
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
            console.log("checkLoginStatus called");
            if (localStorage.getItem("isLoggedIn") === "true") {
                authForm.style.display = "none";
                taskManager.style.display = "block";
                loginButton.style.display = "none";
                logoutButton.style.display = "inline-block";
            } else {
                authForm.style.display = "block";
                taskManager.style.display = "none";
                loginButton.style.display = "inline-block";
                logoutButton.style.display = "none";
            }
            document.querySelector('.container').style.display = 'block';
            console.log("Login status checked");
        }

        // 登录按钮事件
        loginButton.addEventListener("click", function() {
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

