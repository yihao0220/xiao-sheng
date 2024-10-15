// 在文件开头添加以下代码
window.onerror = function(message, source, lineno, colno, error) {
    console.error("发生错误:", message, "在", source, "行号:", lineno);
    alert("抱歉，发生了一个错误。请查看控制台以获取更多信息。");
};

console.log("Script started"); // 添加这行

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
                showLoading(this);
                setTimeout(() => {
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
                    clearTaskForm(); // 调用清除表单的函数
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

        // 编辑任务函数
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
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
            console.log("isLoggedIn:", isLoggedIn);

            if (isLoggedIn) {
                console.log("User is logged in, showing task manager");
                authForm.style.display = "none";
                taskManager.style.display = "block";
                loginButton.style.display = "none";
                logoutButton.style.display = "block";
                editTaskForm.style.display = "none";
            } else {
                console.log("User is not logged in, showing login button");
                authForm.style.display = "none";
                taskManager.style.display = "none";
                loginButton.style.display = "block";
                logoutButton.style.display = "none";
                editTaskForm.style.display = "none";
            }

            document.querySelector('.container').style.display = 'block';
            console.log("authForm display:", authForm.style.display);
            console.log("taskManager display:", taskManager.style.display);
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

        // 显示添加任务表单
        showAddTaskFormButton.addEventListener("click", function() {
            addTaskForm.style.display = "block";
            addTaskForm.classList.add("fade-in");
            showAddTaskFormButton.style.display = "none";
        });

        // 取消添加任务
        cancelAddTaskButton.addEventListener("click", function() {
            addTaskForm.style.display = "none";
            showAddTaskFormButton.style.display = "block";
            clearTaskForm(); // 调用清除表单的函数
        });

        // 初始化
        checkLoginStatus();
        loadTasks();

        // 添加加载动画函数
        function showLoading(element) {
            const loadingSpinner = document.createElement("div");
            loadingSpinner.className = "loading";
            element.appendChild(loadingSpinner);
        }

        function hideLoading(element) {
            const loadingSpinner = element.querySelector(".loading");
            if (loadingSpinner) {
                loadingSpinner.remove();
            }
        }

        console.log("Script initialization completed"); // 添加这行
    } catch (error) {
        console.error("初始化过程中发生错误:", error);
        alert("初始化过程中发生错误。请查看控制台以获取更多信息。");
    }
}); // 确保这里有一个闭合的圆括号和分号

console.log("Script end"); // 添加这行
