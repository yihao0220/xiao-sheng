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
    showUnfinishedTasks: () => {
        const tasks = Storage.getItem('tasks') || [];
        const unfinishedTasks = tasks.filter(task => !task.completed);
        if (unfinishedTasks.length > 0) {
            let message = "您有以下完成的任务:\n";
            unfinishedTasks.forEach(task => {
                message += `- ${task.name}\n`;
            });
            alert(message);
        }
    },
    updateClassList: (classes) => {
        console.log("Updating class list:", classes);
        const classList = document.getElementById('classList');
        if (!classList) {
            console.error("classList element not found");
            return;
        }
        classList.innerHTML = '';
        classes.forEach((classInfo) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${classInfo.name} - 周${classInfo.day} ${classInfo.startTime}-${classInfo.endTime} ${classInfo.location}</span>
                ${classInfo.photo ? `<img src="${classInfo.photo}" alt="${classInfo.name}" style="max-width: 100px; max-height: 100px;">` : ''}
            `;
            classList.appendChild(li);
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
    }
};
window.UI = UI;  // 将 UI 对象添加到全局作用域
console.log("UI.js end");
