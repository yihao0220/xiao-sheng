<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>大学任务提醒</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="main-grid">
        <header class="header">
            <h1>大学任务提醒</h1>
        </header>

        <div class="content">
            <!-- 登录功能 -->
            <div id="authForm" style="display: none;">
                <form id="loginForm">
                    <h2>登录</h2>
                    <label for="loginUsername">用户名:</label>
                    <input type="text" id="loginUsername" required><br>
                    <label for="loginPassword">密码:</label>
                    <input type="password" id="loginPassword" required><br>
                    <button id="loginButton" class="button">登录</button>
                </form>
                <a href="#" id="showRegisterLink">没有账号？注册新账户</a>
            </div>

            <!-- 任务管理器功能 -->
            <div id="taskManager" style="display: none;">
                <h2>添加新任务</h2>
                <div id="addTaskForm" class="task-form">
                    <input type="text" id="taskName" placeholder="任务名称">
                    <input type="date" id="startDate">
                    <input type="time" id="startTime">
                    <input type="date" id="endDate">
                    <input type="time" id="endTime">
                    <select id="priority">
                        <option value="low">低优先级</option>
                        <option value="medium">中优先级</option>
                        <option value="high">高优先级</option>
                    </select>
                    <input type="text" id="category" placeholder="分类 (可选)">
                    <input type="text" id="location" placeholder="地点 (可选)">
                    <button id="addTaskButton" class="button">添加任务</button>
                </div>

                <h2>任务列表</h2>
                <div class="task-controls">
                    <label for="sortBy">排序方式:</label>
                    <select id="sortBy">
                        <option value="startDate">开始日期</option>
                        <option value="endDate">结束日期</option>
                        <option value="priority">优先级</option>
                    </select>
                    <input type="text" id="searchInput" placeholder="搜索任务...">
                    <button id="clearSearchButton" class="button">清除搜索</button>
                </div>
                <ul id="allTasks" class="task-list"></ul>
                <button id="logoutButton" class="button">退出登录</button>

                <!-- 课程管理功能 -->
                <h2>添加课程信息</h2>
                <form id="classForm" class="task-form">
                    <input type="text" id="className" placeholder="课程名称">
                    <select id="classDay">
                        <option value="周一">周一</option>
                        <option value="周二">周二</option>
                        <option value="周三">周三</option>
                        <option value="周四">周四</option>
                        <option value="周五">周五</option>
                        <option value="周六">周六</option>
                        <option value="周日">周日</option>
                    </select>
                    <input type="time" id="classTime">
                    <input type="text" id="classLocation" placeholder="上课地点 (可选)">
                    <button id="addClassButton" class="button">添加课程</button>
                </form>
            </div>
        </div>
    </div>

    <div id="notificationContainer"></div>

    <script>
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

        document.addEventListener("DOMContentLoaded", function() {
            const authForm = document.getElementById("authForm");
            const taskManager = document.getElementById("taskManager");
            const loginUsername = document.getElementById("loginUsername");
            const loginPassword = document.getElementById("loginPassword");
            const loginButton = document.getElementById("loginButton");
            const logoutButton = document.getElementById("logoutButton");

            // 检查本地存储中是否有登录信息
            if (localStorage.getItem("isLoggedIn") === "true") {
                authForm.style.display = "none";
                taskManager.style.display = "block";
                showUnfinishedTasks();
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
                    showUnfinishedTasks();
                }
            });

            // 退出登录按钮事件
            logoutButton.addEventListener("click", function() {
                localStorage.removeItem("isLoggedIn");
                authForm.style.display = "block";
                taskManager.style.display = "none";
            });
        });
    </script>
</body>
</html>
