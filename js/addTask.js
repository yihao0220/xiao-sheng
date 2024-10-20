document.addEventListener('DOMContentLoaded', function() {
    console.log("AddTask page loaded");

    document.getElementById('addTaskButton').addEventListener('click', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('taskName').value;
        const startDate = document.getElementById('startDate').value;
        const startTime = document.getElementById('startTime').value;
        const endDate = document.getElementById('endDate').value;
        const endTime = document.getElementById('endTime').value;
        const priority = document.getElementById('priority').value;
        const category = document.getElementById('category').value;
        const location = document.getElementById('location').value;

        if (taskName) {
            const newTask = { name: taskName, startDate, startTime, endDate, endTime, priority, category, location, completed: false };
            TaskManager.addTask(newTask);
            UI.showSuccess("任务已添加");
            UI.clearTaskForm();
        } else {
            UI.showError("请输入任务名称");
        }
    });

    document.getElementById('cancelAddTaskButton').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("确定要取消添加任务吗？")) {
            window.location.href = 'index.html';
        }
    });
});
