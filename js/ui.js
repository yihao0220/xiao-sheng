console.log("UI.js start"); // 输出日志，表示 UI.js 文件开始执行

// UI 对象：包含所有与用户界面相关的功能
const UI = {
    // 显示指定 ID 的元素
    showElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'block';
        } else {
            console.error(`Element with id ${elementId} not found`);
        }
    },

    // 隐藏指定 ID 的元素
    hideElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        } else {
            console.error(`Element with id ${elementId} not found`);
        }
    },

    // 更新任务列表的显示
    updateTaskList: (tasks) => {
        console.log("UI: Updating task list:", tasks);
        const allTasks = document.getElementById('allTasks');
        if (!allTasks) {
            console.error("UI: allTasks element not found");
            return;
        }
        allTasks.innerHTML = '';
        if (!Array.isArray(tasks)) {
            console.error("UI: Invalid tasks data:", tasks);
            return;
        }
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            
            let taskInfo = `<strong>${task.name}</strong>`;
            if (task.times && task.times.length > 0) {
                taskInfo += '<br>时间段:';
                task.times.forEach(time => {
                    taskInfo += `<br>${time.date} ${time.startTime}-${time.endTime}`;
                });
            }
            if (task.priority) {
                taskInfo += `<br>优先级: ${task.priority}`;
            }
            if (task.category) {
                taskInfo += `<br>分类: ${task.category}`;
            }
            if (task.location) {
                taskInfo += `<br>地点: ${task.location}`;
            }

            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>${taskInfo}</div>
                    <div>
                        <button class="btn btn-sm btn-outline-primary edit-button" data-index="${index}">编辑</button>
                        <button class="btn btn-sm btn-outline-danger delete-button" data-index="${index}">删除</button>
                    </div>
                </div>
            `;
            allTasks.appendChild(li);
        });
        console.log("UI: Task list updated");

        // 添加更新日历的调用
        UI.createTaskCalendar(tasks);
    },

    // 显示错误消息
    showError: (message) => {
        console.error("Error:", message);
        alert("错误: " + message); // 或者使用更友好的方式显示错误消息
    },

    // 显示成功消息
    showSuccess: (message) => {
        console.log("Success:", message);
        alert(message); // 或者使用更友好的方式显示成功消息
    },

    // 显示今天的课程
    showTodayClasses: () => {
        const todayClasses = TaskManager.getClassesForToday();
        if (todayClasses && todayClasses.length > 0) {
            let message = `今天的课程：\n\n`;
            todayClasses.forEach(classInfo => {
                message += `${classInfo.name} (${classInfo.time})\n`;
            });
            UI.showReminder("今日课程提醒", message);
        } else {
            console.log("今天没有课程");
        }
    },

    // 显示未完成的任务
    showUnfinishedTasks: () => {
        const tasks = Storage.getItem('tasks') || [];
        const unfinishedTasks = tasks.filter(task => !task.completed);
        console.log("Unfinished tasks:", unfinishedTasks);
        if (unfinishedTasks.length > 0) {
            let message = "您有以下未完成的任务:\n";
            unfinishedTasks.forEach(task => {
                message += `- ${task.name}\n`;
            });
            UI.showReminder("未完成任务提醒", message);
        } else {
            console.log("No unfinished tasks");
        }
    },

    // 更新课程列表的显示
    updateClassList: (classes) => {
        console.log("Updating class list:", classes);
        const weeklyClassList = document.getElementById('weeklyClassList');
        if (!weeklyClassList) {
            console.error("weeklyClassList element not found");
            return;
        }
        weeklyClassList.innerHTML = '';
        classes.forEach((classInfo) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = `
                <span>${classInfo.name} - ${classInfo.day} ${classInfo.time}</span>
            `;
            weeklyClassList.appendChild(li);
        });
        console.log("Class list updated");
    },

    // 显示早上的提醒
    showMorningReminder: () => {
        const todayClasses = TaskManager.getClassesForToday(); // 获取今天的课程
        if (todayClasses.length > 0) {
            let message = "今天需要预习的课程：\n"; // 构建消息开头
            todayClasses.forEach(classInfo => {
                message += `- ${classInfo.name} (${classInfo.time})\n`; // 为每个课程加一行
            });
            alert(message); // 显示提醒消息
        }
    },

    // 显示下午的提醒
    showAfternoonReminder: () => {
        const morningClasses = TaskManager.getMorningClasses(); // 获取上午的课程
        if (morningClasses.length > 0) {
            let message = "上午上过的课程，请记得完成作业：\n"; // 构建消息开头
            morningClasses.forEach(classInfo => {
                message += `- ${classInfo.name}\n`; // 为每个上午的课程添加一行
            });
            alert(message); // 显示提醒消息
        }
    },

    // 显示课程提醒
    showClassReminders: () => {
        const todayClasses = TaskManager.getClassesForToday();
        
        if (todayClasses && todayClasses.length > 0) {
            let message = "今天的课程提醒：\n\n";
            todayClasses.forEach(classInfo => {
                message += `预习提醒：${classInfo.name}\n`;
                message += `时间：${classInfo.time}\n\n`;
            });
            alert(message);
        } else {
            console.log("No classes to remind for today");
        }

        // 注意：由于新的结构不包含具体日期，我们无法显示昨天的课程复习提醒
        // 如果需要这个功能，可能需重新设计数据结构或存储方式
    },

    // 清空课程表单
    clearClassForm: () => {
        document.getElementById('className').value = ''; // 清空课程名称输入框
        document.getElementById('classDay').value = '周一'; // 重置上课日期为周一
        document.getElementById('classStartTime').value = ''; // 清空开始时间输入框
        document.getElementById('classEndTime').value = ''; // 清空结束时间输入框
        document.getElementById('classLocation').value = ''; // 清空上课地点输入框
    },

    // 清空任务表单
    clearTaskForm: () => {
        const taskName = document.getElementById('taskName');
        const taskTimesList = document.getElementById('taskTimesList');
        const priority = document.getElementById('priority');
        const category = document.getElementById('category');
        const location = document.getElementById('location');

        if (taskName) taskName.value = '';
        if (taskTimesList) taskTimesList.innerHTML = '';
        if (priority) priority.value = 'medium';
        if (category) category.value = '';
        if (location) location.value = '';

        console.log('Task form cleared');
    },

    // 改进提醒功能
    showReminder: (title, message) => {
        // 检查是否支持通知
        if ("Notification" in window) {
            // 如果已经获得了通知权限
            if (Notification.permission === "granted") {
                new Notification(title, {
                    body: message,
                    icon: '/favicon.ico', // 可以添加一个图标
                    vibrate: [200, 100, 200] // 振动模式（如果设备支持）
                });
                // 同时显示页面内提醒
                UI.showMobileReminder(title, message);
            }
            // 如果没有被拒绝通知权限
            else if (Notification.permission !== "denied") {
                // 请求权限
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new Notification(title, {
                            body: message,
                            icon: '/favicon.ico',
                            vibrate: [200, 100, 200]
                        });
                        UI.showMobileReminder(title, message);
                    }
                });
            }
        }
        
        // 无论是否支持通知，都显示页面内提醒
        UI.showMobileReminder(title, message);
        
        // 添加声音提醒
        const audio = new Audio('/notification.mp3'); // 需要添加提醒音频文件
        audio.play().catch(e => console.log('无法播放提醒音频:', e));
    },

    // 显示页面内提醒
    showMobileReminder: (title, message) => {
        const reminderContainer = document.createElement('div');
        reminderContainer.className = 'mobile-reminder';
        
        reminderContainer.innerHTML = `
            <div class="reminder-header">
                <h3>${title}</h3>
                <span class="close-btn">&times;</span>
            </div>
            <div class="reminder-body">
                <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
        `;

        // 添加提醒样式
        reminderContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #ffffff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 90%;
            width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(reminderContainer);

        // 添加关闭按钮功能
        const closeBtn = reminderContainer.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            reminderContainer.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(reminderContainer);
            }, 300);
        });

        // 30秒后自动关闭
        setTimeout(() => {
            if (document.body.contains(reminderContainer)) {
                reminderContainer.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    document.body.removeChild(reminderContainer);
                }, 300);
            }
        }, 30000);
    },

    // 添加时间段输入
    addTimeSlotInput: (containerId) => {
        console.log("Attempting to add time slot to container:", containerId);
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with id '${containerId}' not found`);
            return;
        }
        const timeSlotDiv = document.createElement('div');
        timeSlotDiv.className = 'time-slot mb-2';
        timeSlotDiv.innerHTML = `
            <input type="date" class="form-control mb-1" required>
            <div class="d-flex">
                <input type="time" class="form-control mr-1" required>
                <input type="time" class="form-control ml-1" required>
                <button type="button" class="btn btn-danger ml-2 remove-time-slot">删除</button>
            </div>
        `;
        container.appendChild(timeSlotDiv);
        console.log("Time slot added successfully");
    },

    // 创建并显示任务日历
    createTaskCalendar: (tasks) => {
        console.log("Creating task calendar with tasks:", tasks);
        const calendarContainer = document.getElementById('taskCalendar');
        if (!calendarContainer) {
            console.error("Calendar container not found");
            return;
        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        let calendarHTML = `
            <table class="calendar">
                <thead>
                    <tr>
                        <th colspan="7">${currentYear}年${currentMonth + 1}月</th>
                    </tr>
                    <tr>
                        <th>日</th>
                        <th>一</th>
                        <th>二</th>
                        <th>三</th>
                        <th>四</th>
                        <th>五</th>
                        <th>六</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let dayCount = 1;
        for (let i = 0; i < 6; i++) {
            calendarHTML += '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDayOfMonth) {
                    calendarHTML += '<td></td>';
                } else if (dayCount > daysInMonth) {
                    calendarHTML += '<td></td>';
                } else {
                    const currentDate = new Date(currentYear, currentMonth, dayCount);
                    const dayTasks = UI.getTasksForDay(tasks, currentDate);
                    console.log(`Tasks for ${currentDate.toDateString()}:`, dayTasks); // 添加这行
                    calendarHTML += `
                        <td>
                            <div class="calendar-day">${dayCount}</div>
                            <div class="calendar-tasks">
                                ${dayTasks.map(task => `
                                    <div class="calendar-task" title="${task.name}">
                                        ${task.times && task.times[0] && task.times[0].startTime ? task.times[0].startTime : ''} ${task.name}
                                    </div>
                                `).join('')}
                            </div>
                        </td>
                    `;
                    dayCount++;
                }
            }
            calendarHTML += '</tr>';
            if (dayCount > daysInMonth) break;
        }

        calendarHTML += '</tbody></table>';
        calendarContainer.innerHTML = calendarHTML;
    },

    // 获取指定日期的任务
    getTasksForDay: (tasks, date) => {
        if (!Array.isArray(tasks)) {
            console.error('Tasks is not an array:', tasks);
            return [];
        }
        const tasksForDay = tasks.filter(task => {
            if (!task || !Array.isArray(task.times)) {
                console.warn('Invalid task structure:', task);
                return false;
            }
            return task.times.some(time => {
                if (!time || !time.date) {
                    console.warn('Invalid time structure:', time);
                    return false;
                }
                const taskDate = new Date(time.date);
                return taskDate.getFullYear() === date.getFullYear() &&
                       taskDate.getMonth() === date.getMonth() &&
                       taskDate.getDate() === date.getDate();
            });
        });
        console.log(`Tasks for ${date.toDateString()}:`, tasksForDay); // 添加这行
        return tasksForDay.sort((a, b) => {
            const aTime = a.times && a.times[0] && a.times[0].startTime ? a.times[0].startTime : '';
            const bTime = b.times && b.times[0] && b.times[0].startTime ? b.times[0].startTime : '';
            return aTime.localeCompare(bTime);
        });
    },

    showEditTaskForm: (index) => {
        const tasks = Storage.getItem('tasks') || [];
        const task = tasks[index];

        if (task) {
            document.getElementById('editTaskName').value = task.name;
            document.getElementById('editTaskTimesList').innerHTML = '';
            task.times.forEach(time => {
                UI.addTimeSlotInput('editTaskTimesList');
                const timeSlot = document.getElementById('editTaskTimesList').lastElementChild;
                timeSlot.querySelector('input[type="date"]').value = time.date;
                timeSlot.querySelectorAll('input[type="time"]')[0].value = time.startTime;
                timeSlot.querySelectorAll('input[type="time"]')[1].value = time.endTime;
            });
            document.getElementById('editPriority').value = task.priority || 'medium';
            document.getElementById('editCategory').value = task.category || '';
            document.getElementById('editLocation').value = task.location || '';

            document.getElementById('editTaskForm').dataset.taskIndex = index;
            document.getElementById('editTaskModal').style.display = 'block';
        } else {
            console.error("Task not found");
            UI.showError("未找到任务");
        }
    },

    addEditTimeSlotInput: () => {
        const editTaskTimesList = document.getElementById('editTaskTimesList');
        if (editTaskTimesList) {
            const timeSlotDiv = document.createElement('div');
            timeSlotDiv.className = 'time-slot mb-2';
            timeSlotDiv.innerHTML = `
                <input type="date" class="form-control mb-1" required>
                <div class="d-flex">
                    <input type="time" class="form-control mr-1" required>
                    <input type="time" class="form-control ml-1" required>
                    <button type="button" class="btn btn-danger ml-2 remove-time-slot">删除</button>
                </div>
            `;
            editTaskTimesList.appendChild(timeSlotDiv);
        } else {
            console.error("Edit task times list not found");
        }
    }
};

window.UI = UI;  // 将 UI 对象添加到全局作用域，使其他脚本可以访问

console.log("UI.js end"); // 输出日志，表示 UI.js 文件执行结束

// 将所有的 DOM 操作和事件监听器设置移到这个函数中
function initializeUI() {
    console.log("Initializing UI");
    
    // 移除这里的事件监听器设置
    // const addTimeSlotButton = document.getElementById('addTimeSlot');
    // if (addTimeSlotButton) {
    //     addTimeSlotButton.addEventListener('click', () => {
    //         console.log("Add time slot button clicked");
    //         UI.addTimeSlotInput('taskTimesList');
    //     });
    // }

    const taskTimesList = document.getElementById('taskTimesList');
    if (taskTimesList) {
        taskTimesList.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-time-slot')) {
                e.target.closest('.time-slot').remove();
            }
        });
    }

    // 其他初始化代码...
}

// 确保在 DOM 加载完成后执行初始化
document.addEventListener('DOMContentLoaded', initializeUI);
