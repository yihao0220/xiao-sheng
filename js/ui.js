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
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            // 只显示任务名称，其他信息如果存在则显示
            let taskInfo = `${task.name}`;
            if (task.startDate) {
                taskInfo += ` - ${task.startDate}`;
                if (task.startTime) {
                    taskInfo += ` ${task.startTime}`;
                }
            }
            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <span>${taskInfo}</span>
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

    // 显示错误消息
    showError: (message) => {
        console.error(message); // 在控制台输出错误消息
        alert(`错误: ${message}`); // 使用浏览器的 alert 显示错误消息给用户
    },

    // 显示成功消息
    showSuccess: (message) => {
        console.log("Success:", message);
        alert(message); // 或者使用其他更友好的方式显示成功消息
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
        if (unfinishedTasks.length > 0) {
            let message = "您有以下未完成的任务:\n";
            unfinishedTasks.forEach(task => {
                message += `- ${task.name}\n`;
            });
            UI.showReminder("未完成任务提醒", message);
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
                message += `- ${classInfo.name} (${classInfo.time})\n`; // 为每个课程添加一行
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
        // 如果需要这个功能，可能需要重新设计数据结构或存储方式
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
        // 定义需要清空的表单元素 ID 数组
        const formElements = ['taskName', 'startDate', 'startTime', 'endDate', 'endTime', 'priority', 'category', 'location'];
        formElements.forEach(elementId => {
            const element = document.getElementById(elementId); // 取每个表单元素
            if (element) {
                element.value = ''; // 如果元素存在，清空其值
            } else {
                console.error(`Form element ${elementId} not found`); // 如果元素不存在，输出错误日志
            }
        });
        console.log("Task form cleared"); // 输出任务表单已清空的日志
    },

    // 改进提醒功能
    showReminder: (title, message) => {
        // 检查浏览器是否支持通知
        if (!("Notification" in window)) {
            alert("此浏览器不支持桌面通知");
            return;
        }

        // 检查通知权限
        if (Notification.permission === "granted") {
            new Notification(title, { body: message });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body: message });
                }
            });
        }
    }
};

window.UI = UI;  // 将 UI 对象添加到全局作用域，使其他脚本可以访问

console.log("UI.js end"); // 输出日志，表示 UI.js 文件执行结束
