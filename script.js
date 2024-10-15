document.addEventListener("DOMContentLoaded", function() {
    const authForm = document.getElementById("authForm");
    const taskManager = document.getElementById("taskManager");
    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
    const addTaskButton = document.getElementById("addTaskButton");
    const allTasks = document.getElementById("allTasks");
    const sortBy = document.getElementById("sortBy");
    const searchInput = document.getElementById("searchInput");
    const clearSearchButton = document.getElementById("clearSearchButton");
    const addClassButton = document.getElementById("addClassButton");

    // 检查本地存储中是否有登录信息
    if (localStorage.getItem("isLoggedIn") === "true") {
        authForm.style.display = "none";
        taskManager.style.display = "block";
    } else {
        authForm.style.display = "block";
        taskManager.style.display = "none";
    }

    // 登录按钮事件
    loginButton.addEventListener("click", function(event) {
        event.preventDefault();
        if (loginUsername.value && loginPassword.value) {
            localStorage.setItem("isLoggedIn", "true");
            authForm.style.display = "none";
            taskManager.style.display = "block";
        }
    });

    // 退出登录按钮事件
    logoutButton.addEventListener("click", function() {
        localStorage.removeItem("isLoggedIn");
        authForm.style.display = "block";
        taskManager.style.display = "none";
    });

    // 添加任务按钮事件
    addTaskButton.addEventListener("click", function(event) {
        event.preventDefault();
        const taskName = document.getElementById("taskName").value;
        const startDate = document.getElementById("startDate").value;
        const startTime = document.getElementById("startTime").value;
        const endDate = document.getElementById("endDate").value;
        const endTime = document.getElementById("endTime").value;
        const priority = document.getElementById("priority").value;
        const category = document.getElementById("category").value;
        const location = document.getElementById("location").value;

        if (taskName) {
            const task = {
                name: taskName,
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime,
                priority: priority,
                category: category,
                location: location
            };

            addTaskToDOM(task);
            saveTaskToLocalStorage(task);
        }
    });

    // 添加任务到 DOM
    function addTaskToDOM(task) {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";
        taskItem.innerHTML = `
            <strong>${task.name}</strong><br>
            开始: ${task.startDate} ${task.startTime}<br>
            结束: ${task.endDate} ${task.endTime}<br>
            优先级: ${task.priority}<br>
            分类: ${task.category}<br>
            地点: ${task.location}<br>
            <button class="delete-button button">删除</button>
        `;

        // 删除按钮事件
        taskItem.querySelector(".delete-button").addEventListener("click", function() {
            allTasks.removeChild(taskItem);
            deleteTaskFromLocalStorage(task.name);
        });

        allTasks.appendChild(taskItem);
    }

    // 保存任务到 localStorage
    function saveTaskToLocalStorage(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // 从 localStorage 删除任务
    function deleteTaskFromLocalStorage(taskName) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.name !== taskName);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // 加载所有任务
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTaskToDOM(task));
    }

    loadTasks();

    // 清除搜索按钮事件
    clearSearchButton.addEventListener("click", function() {
        searchInput.value = "";
        filterTasks();
    });

    // 课程管理功能 - 添加课程按钮事件
    addClassButton.addEventListener("click", function(event) {
        event.preventDefault();
        const className = document.getElementById("className").value;
        const classDay = document.getElementById("classDay").value;
        const classTime = document.getElementById("classTime").value;
        const classLocation = document.getElementById("classLocation").value;

        if (className) {
            const classInfo = `课程: ${className}, 时间: ${classDay} ${classTime}, 地点: ${classLocation}`;
            const classItem = document.createElement("p");
            classItem.textContent = classInfo;
            document.getElementById("notificationContainer").appendChild(classItem);
        }
    });

    // 任务过滤功能
    function filterTasks() {
        const filterText = searchInput.value.toLowerCase();
        const tasks = document.querySelectorAll(".task-item");
        tasks.forEach(task => {
            const taskName = task.querySelector("strong").textContent.toLowerCase();
            if (taskName.includes(filterText)) {
                task.style.display = "block";
            } else {
                task.style.display = "none";
            }
        });
    }

    searchInput.addEventListener("input", filterTasks);
});
