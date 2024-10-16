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
    },

    updateClassList: (classes) => {
        const classList = document.getElementById('classList');
        classList.innerHTML = '';
        classes.forEach((classInfo, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${classInfo.name} - ${classInfo.day} ${classInfo.time} ${classInfo.location}</span>
                <img src="${classInfo.photo}" alt="${classInfo.name}" style="max-width: 100px; max-height: 100px;">
            `;
            classList.appendChild(li);
        });
    },

    showMorningReminder: () => {
        const todayClasses = TaskManager.getClassesForToday();
        if (todayClasses.length > 0) {
            let message = "今天需要预习的课程：\n";
            todayClasses.forEach(classInfo => {
                message += `- ${classInfo.name} (${classInfo.time})\n`;
            });
            alert(message);
        }
    },

    showAfternoonReminder: () => {
        const morningClasses = TaskManager.getMorningClasses();
        if (morningClasses.length > 0) {
            let message = "上午上过的课程，请记得完成作业：\n";
            morningClasses.forEach(classInfo => {
                message += `- ${classInfo.name}\n`;
            });
            alert(message);
        }
    }
};
