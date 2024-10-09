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
            <!-- 登录和注册表单保持不变 -->
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
                <button onclick="addTask()">添加任务</button>
            </div>
            <div id="taskList">
                <h2>任务列表</h2>
                <ul id="allTasks"></ul>
            </div>
            <button onclick="logout()" class="logout-btn">退出登录</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
