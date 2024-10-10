<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>大学任务提醒</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>大学任务提醒</h1>
        <div id="authForm">
            <div id="loginForm">
                <h2>登录</h2>
                <input type="text" id="loginUsername" placeholder="用户名" required>
                <input type="password" id="loginPassword" placeholder="密码" required>
                <button id="loginButton">登录</button>
                <p>没有账号？<a href="#" id="showRegisterLink">注册新账号</a></p>
            </div>
            <div id="registerForm" style="display: none;">
                <h2>注册</h2>
                <input type="text" id="registerUsername" placeholder="用户名" required>
                <input type="password" id="registerPassword" placeholder="密码" required>
                <button onclick="window.register()">注册</button>
                <p>已有账号？<a href="#" onclick="window.showLoginForm()">返回登录</a></p>
            </div>
        </div>
        <div id="taskManager" style="display: none;">
            <div id="taskForm">
                <h2>添加新任务</h2>
                <input type="text" id="taskName" placeholder="任务名称" required>
                <input type="date" id="dueDate" required>
                <input type="time" id="dueTime" placeholder="具体时间（可选）">
                <select id="priority">
                    <option value="low">低优先级</option>
                    <option value="medium">中优先级</option>
                    <option value="high">高优先级</option>
                </select>
                <input type="text" id="category" placeholder="分类（可选）">
                <input type="text" id="location" placeholder="地点（可选）">
                <button onclick="window.addTask()">添加任务</button>
            </div>
            <div id="taskList">
                <h2>任务列表</h2>
                <div id="sortOptions">
                    <label for="sortBy">排序方式：</label>
                    <select id="sortBy" onchange="sortTasks()">
                        <option value="dueDate">截止日期</option>
                        <option value="priority">优先级</option>
                        <option value="category">分类</option>
                    </select>
                </div>
                <div id="searchBox">
                    <input type="text" id="searchInput" placeholder="搜索任务...">
                    <button onclick="searchTasks()">搜索</button>
                </div>
                <ul id="allTasks"></ul>
            </div>
            <button onclick="window.logout()" class="logout-btn">退出登录</button>
        </div>
    </div>
    <sc
