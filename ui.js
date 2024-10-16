const UI = {
    showElement: (elementId) => document.getElementById(elementId).style.display = 'block',
    hideElement: (elementId) => document.getElementById(elementId).style.display = 'none',
    updateTaskList: (tasks) => {
        // 实现更新任务列表的逻辑
        const allTasks = document.getElementById('allTasks');
        allTasks.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <span>${task.name}</span>
                <button class="edit-button" data-index="${index}">编辑</button>
                <button class="delete-button" data-index="${index}">删除</button>
            `;
            allTasks.appendChild(li);
        });
    },
    showUnfinishedTasks: () => {
        const tasks = Storage.getItem('tasks') || [];
        const unfinishedTasks = tasks.filter(task => !task.completed);
        if (unfinishedTasks.length > 0) {
            let message = "您有以下未完成的任务:\n";
            unfinishedTasks.forEach(task => {
                message += `- ${task.name}\n`;
            });
            alert(message);
        }
    }
};
