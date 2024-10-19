<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>添加任务</title>
    <link rel="stylesheet" href="./styles.css">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <h1>添加任务</h1>
        </header>

        <main class="app-main">
            <section class="task-form" id="addTaskForm">
                <h2>添加任务</h2>
                <form>
                    <input type="text" id="taskName" placeholder="任务名称" required>
                    <input type="date" id="startDate" required>
                    <input type="time" id="startTime" required>
                    <input type="date" id="endDate" required>
                    <input type="time" id="endTime" required>
                    <select id="priority" required>
                        <option value="low">低优先级</option>
                        <option value="medium">中优先级</option>
                        <option value="high">高优先级</option>
                    </select>
                    <input type="text" id="category" placeholder="分类">
                    <input type="text" id="location" placeholder="地点">
                    <button id="addTaskButton" class="btn btn-primary">添加任务</button>
                    <button id="cancelAddTaskButton" class="btn btn-secondary" onclick="location.href='index.html'">取消</button>
                </form>
            </section>
        </main>
    </div>

    <script src="js/storage.js"></script>
    <script src="js/ui.js"></script>
    <script src="js/taskManager.js"></script>
    <script src="js/addTask.js"></script>
</body>
</html>
