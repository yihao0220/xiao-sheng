document.addEventListener("DOMContentLoaded", function() {
    // 登录功能
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", function(event) {
            event.preventDefault();
            const username = document.getElementById("loginUsername").value;
            const password = document.getElementById("loginPassword").value;
            if (username && password) {
                document.getElementById("authForm").style.display = "none";
                document.getElementById("taskManager").style.display = "block";

                // 加载任务和课程
                loadTasks();
                loadClasses();
            }
        });
    }

    // 添加任务功能
    const addTaskButton = document.getElementById("addTaskButton");
    if (addTaskButton) {
        addTaskButton.addEventListener("click", function() {
            let taskName = document.getElementById("taskName").value;
            let startDate = document.getElementById("startDate").value;
            let startTime = document.getElementById("startTime").value;
            let endDate = document.getElementById("endDate").value;
            let endTime = document.getElementById("endTime").value;
            let priority = document.getElementById("priority").value;
            let category = document.getElementById("category").value;
            let location = document.getElementById("location").value;

            if (taskName) {
                const taskItem = document.createElement("li");
                taskItem.innerText = `任务: ${taskName}, 开始: ${startDate} ${startTime}, 结束: ${endDate} ${endTime}, 优先级: ${priority}, 分类: ${category}, 地点: ${location}`;

                // 添加删除按钮
                const deleteButton = document.createElement("button");
                deleteButton.innerText = "删除";
                deleteButton.classList.add("button", "delete-button");
                deleteButton.addEventListener("click", function() {
                    deleteTask(taskItem, taskName);
                });

                // 添加修改按钮
                const editButton = document.createElement("button");
                editButton.innerText = "修改";
                editButton.classList.add("button", "edit-button");
                editButton.addEventListener("click", function() {
                    editTask(taskItem, taskName);
                });

                taskItem.appendChild(deleteButton);
                taskItem.appendChild(editButton);
                document.getElementById("allTasks").appendChild(taskItem);

                // 存储任务到 localStorage
                let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
                tasks.push({ name: taskName, startDate, startTime, endDate, endTime, priority, category, location });
                localStorage.setItem("tasks", JSON.stringify(tasks));

                // 添加任务后的提示
                alert("任务添加成功！");
            } else {
                alert("请填写任务名称！");
            }
        });
    }

    // 修改任务功能
    function editTask(taskElement, oldTaskName) {
        // 从 localStorage 中查找任务
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        let taskToEdit = tasks.find(task => task.name === oldTaskName);

        if (taskToEdit) {
            // 填充表单字段
            document.getElementById("taskName").value = taskToEdit.name;
            document.getElementById("startDate").value = taskToEdit.startDate;
            document.getElementById("startTime").value = taskToEdit.startTime;
            document.getElementById("endDate").value = taskToEdit.endDate;
            document.getElementById("endTime").value = taskToEdit.endTime;
            document.getElementById("priority").value = taskToEdit.priority;
            document.getElementById("category").value = taskToEdit.category;
            document.getElementById("location").value = taskToEdit.location;

            // 删除旧任务
            deleteTask(taskElement, oldTaskName);
        }
    }

    // 删除任务功能
    function deleteTask(taskElement, taskName) {
        // 从 DOM 中删除任务
        taskElement.remove();

        // 从 localStorage 中删除任务
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.name !== taskName);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        alert("任务已删除！");
    }

    // 加载任务信息
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.innerText = `任务: ${task.name}, 开始: ${task.startDate} ${task.startTime}, 结束: ${task.endDate} ${task.endTime}, 优先级: ${task.priority}, 分类: ${task.category}, 地点: ${task.location}`;

            // 添加删除按钮
            const deleteButton = document.createElement("button");
            deleteButton.innerText = "删除";
            deleteButton.classList.add("button", "delete-button");
            deleteButton.addEventListener("click", function() {
                deleteTask(taskItem, task.name);
            });

            // 添加修改按钮
            const editButton = document.createElement("button");
            editButton.innerText = "修改";
            editButton.classList.add("button", "edit-button");
            editButton.addEventListener("click", function() {
                editTask(taskItem, task.name);
            });

            taskItem.appendChild(deleteButton);
            taskItem.appendChild(editButton);
            document.getElementById("allTasks").appendChild(taskItem);
        });
    }

    // 加载课程信息
    function loadClasses() {
        const classes = JSON.parse(localStorage.getItem("classes")) || [];
        classes.forEach(cls => {
            const classItem = document.createElement("p");
            classItem.innerText = `课程: ${cls.name}, 时间: ${cls.day} ${cls.time}, 地点: ${cls.location}`;
            document.getElementById("notificationContainer").appendChild(classItem);
        });
    }
});
