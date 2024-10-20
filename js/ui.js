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
        console.log("UI: Updating task list:", tasks);
        const allTasks = document.getElementById('allTasks');
        if (!allTasks) {
            console.error("UI: allTasks element not found");
            return;
        }
        allTasks.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <span>${task.name}</span>
                    <div>
                        <button class="btn btn-sm btn-outline-primary edit-button" data-index="${index}">编辑</button>
                        <button class="btn btn-sm btn-outline-danger delete-button" data-index="${index}">删除</button>
                    </div>
                </div>
            `;
            allTasks.appendChild(li);
        });
        console.log("UI: Task list updated");
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
    },
    clearClassForm: () => {
        document.getElementById('className').value = '';
        document.getElementById('classDay').value = '周一';
        document.getElementById('classStartTime').value = '';
        document.getElementById('classEndTime').value = '';
        document.getElementById('classLocation').value = '';
    },
    clearTaskForm: () => {
        const formElements = ['taskName', 'startDate', 'startTime', 'endDate', 'endTime', 'priority', 'category', 'location'];
        formElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.value = '';
            } else {
                console.error(`Form element ${elementId} not found`);
            }
        });
        console.log("Task form cleared");
    }
};
window.UI = UI;  // 将 UI 对象添加到全局作用域
console.log("UI.js end");
