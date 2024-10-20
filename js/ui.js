console.log("UI.js start");
const UI = {
    showElement: (elementId) => {
        console.log(`Attempting to show element: ${elementId}`);
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'block';
            console.log(`Element ${elementId} display set to block`);
        } else {
            console.error(`Element with id ${elementId} not found`);
        }
    },
    hideElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        } else {
            console.error(`Element with id ${elementId} not found`);
        }
    },
    updateTaskList: (tasks) => {
        console.log("Updating task list:", tasks);
        const allTasks = document.getElementById('allTasks');
        if (!allTasks) {
            console.error("allTasks element not found");
            return;
        }
        allTasks.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <div class="task-details">
                    <h3>${task.name}</h3>
                    <p>开始: ${task.startDate} ${task.startTime}</p>
                    <p>结束: ${task.endDate} ${task.endTime}</p>
                    <p>优先级: ${task.priority}</p>
                    ${task.category ? `<p>分类: ${task.category}</p>` : ''}
                    ${task.location ? `<p>地点: ${task.location}</p>` : ''}
                    <p>状态: ${task.completed ? '已完成' : '未完成'}</p>
                </div>
                <div class="task-actions">
                    <button class="complete-button" data-index="${index}">${task.completed ? '标记为未完成' : '标记为已完成'}</button>
                    <button class="edit-button" data-index="${index}">编辑</button>
                    <button class="delete-button" data-index="${index}">删除</button>
                </div>
            `;
            allTasks.appendChild(li);
        });
        console.log("Task list updated");
    },
    showError: (message) => {
        console.error(message);
        alert(`错误: ${message}`);
    },
    showSuccess: (message) => {
        console.log(message);
        alert(message);
    },
    showTodayClasses: () => {
        const today = new Date();
        const todayClasses = TaskManager.getClassesForDate(today);
        if (todayClasses && todayClasses.length > 0) {
            let message = `今天（${today.toLocaleDateString()}）的课程：\n\n`;
            todayClasses.forEach(classInfo => {
                message += `课程：${classInfo.name}\n`;
                message += `时间：${classInfo.startTime} - ${classInfo.endTime}\n`;
                message += `地点：${classInfo.location || '未知'}\n\n`;
            });
            UI.showSuccess(message);
        } else {
            console.log("No classes found for today");
        }
    },
    showUnfinishedTasks: () => {
        const tasks = Storage.getItem('tasks') || [];
        const unfinishedTasks = tasks.filter(task => !task.completed);
        if (unfinishedTasks.length > 0) {
            let message = "您有以下未完成的任务:\n";
            unfinishedTasks.forEach(task => {
                message += `- ${task.name}\n`;
            });
            UI.showSuccess(message);
        }
    },
    updateClassList: (classes) => {
        console.log("Updating class list:", classes);
        const weeklyClassList = document.getElementById('weeklyClassList');
        if (!weeklyClassList) {
            console.error("weeklyClassList element not found");
            return;
        }
        weeklyClassList.innerHTML = '';
        classes.forEach((classInfo, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <span>${classInfo.name} - ${classInfo.day} ${classInfo.startTime}-${classInfo.endTime} ${classInfo.location}</span>
                <button class="btn btn-danger btn-sm delete-class" data-index="${index}">删除</button>
            `;
            weeklyClassList.appendChild(li);
        });
        console.log("Class list updated");
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
    },
    showClassReminders: () => {
        const today = new Date();
        const todayClasses = TaskManager.getClassesForDate(today);
        console.log("Today's classes:", todayClasses);
        
        if (todayClasses && todayClasses.length > 0) {
            let message = "今天的课程提醒：\n\n";
            todayClasses.forEach(classInfo => {
                message += `预习提醒：${classInfo.name}\n`;
                message += `时间：${classInfo.startTime} - ${classInfo.endTime}\n`;
                message += `地点：${classInfo.location || '未知'}\n\n`;
            });
            UI.showSuccess(message);
        } else {
            console.log("No classes found for today");
        }

        const yesterday = new Date(today.getTime() - 24*60*60*1000);
        const yesterdayClasses = TaskManager.getClassesForDate(yesterday);
        console.log("Yesterday's classes:", yesterdayClasses);
        
        if (yesterdayClasses && yesterdayClasses.length > 0) {
            let message = "昨天的课程复习提醒：\n\n";
            yesterdayClasses.forEach(classInfo => {
                message += `复习提醒：${classInfo.name}\n`;
            });
            UI.showSuccess(message);
        } else {
            console.log("No classes found for yesterday");
        }
    }
};
window.UI = UI;  // 将 UI 对象添加到全局作用域
console.log("UI.js end");
