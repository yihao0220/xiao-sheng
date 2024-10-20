const TaskManager = {
    addTask: (task) => {
        try {
            console.log("TaskManager: Adding task:", task);
            const tasks = Storage.getItem('tasks') || [];
            console.log("Current tasks:", tasks);
            tasks.push(task);
            console.log("Updated tasks:", tasks);
            Storage.setItem('tasks', tasks);
            console.log("Tasks saved to storage");
            UI.updateTaskList(tasks);
            console.log("UI updated with new task list");
            return true;
        } catch (error) {
            console.error("TaskManager: Error adding task:", error);
            UI.showError("添加任务时出错，请稍后再试。");
            return false;
        }
    },
    editTask: (index, updatedTask) => {
        try {
            console.log("Editing task at index:", index, "with data:", updatedTask);
            const tasks = Storage.getItem('tasks') || [];
            tasks[index] = updatedTask;
            Storage.setItem('tasks', tasks);
            UI.updateTaskList(tasks);
            console.log("Task edited successfully");
        } catch (error) {
            console.error("Error editing task:", error);
            alert("编辑任务时出错，请稍后再试。");
        }
    },
    deleteTask: (index) => {
        try {
            console.log("Deleting task at index:", index);
            const tasks = Storage.getItem('tasks') || [];
            tasks.splice(index, 1);
            Storage.setItem('tasks', tasks);
            UI.updateTaskList(tasks);
            console.log("Task deleted successfully");
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("删除任务时出错，请稍后再试。");
        }
    },
    loadTasks: () => {
        try {
            let tasks = Storage.getItem('tasks') || [];
            tasks = TaskManager.removeExpiredTasks(tasks);
            UI.updateTaskList(tasks);
        } catch (error) {
            console.error("Error loading tasks:", error);
            alert("加载任务列表时出错，请稍后再试。");
        }
    },

    removeExpiredTasks: (tasks) => {
        const now = new Date();
        const updatedTasks = tasks.filter(task => {
            const endDate = new Date(task.endDate + 'T' + task.endTime);
            return endDate > now;
        });
        if (updatedTasks.length !== tasks.length) {
            Storage.setItem('tasks', updatedTasks);
            console.log("Expired tasks removed");
        }
        return updatedTasks;
    },

    addClass: (classInfo) => {
        try {
            console.log("Adding class:", classInfo);
            const classes = Storage.getItem('classes') || [];
            classes.push(classInfo);
            Storage.setItem('classes', classes);
            UI.updateClassList(classes);
            console.log("Class added successfully:", classInfo);
        } catch (error) {
            console.error("Error adding class:", error);
            alert("添加课程时出错，请稍后再试。");
        }
    },

    loadClasses: () => {
        try {
            console.log("Loading classes");
            const classes = Storage.getItem('classes') || [];
            UI.updateClassList(classes);
            console.log("Loaded classes:", classes);
        } catch (error) {
            console.error("Error loading classes:", error);
            alert("加载课程列表时出错，请稍后再试。");
        }
    },

    getClassesForToday: () => {
        const classes = Storage.getItem('classes') || [];
        const today = new Date().toLocaleString('zh-CN', {weekday: 'long'});
        console.log("Today is:", today);
        const todayClasses = classes.filter(classInfo => classInfo.day === today);
        console.log("Classes for today:", todayClasses);
        return todayClasses;
    },

    getMorningClasses: () => {
        try {
            const todayClasses = TaskManager.getClassesForToday();
            return todayClasses.filter(classInfo => {
                const classTime = new Date(`2000-01-01T${classInfo.time}`);
                return classTime < new Date(`2000-01-01T13:00:00`);
            });
        } catch (error) {
            console.error("Error getting morning classes:", error);
            alert("获取早上的班级列表出错，请稍后再试。");
        }
    },

    recognizeSchedule: (file) => {
        return new Promise((resolve, reject) => {
            Tesseract.recognize(file, 'chi_sim')
                .then(({ data: { text } }) => {
                    console.log("Recognized text:", text);
                    const classes = TaskManager.parseSchedule(text);
                    Storage.setItem('classes', classes);
                    UI.updateClassList(classes);
                    resolve(classes);
                })
                .catch((error) => {
                    console.error("Error recognizing schedule:", error);
                    reject(error);
                });
        });
    },

    parseSchedule: (text) => {
        const classes = [];
        const lines = text.split('\n');
        const dayMap = {
            '一': '周一', '二': '周二', '三': '周三', '四': '周四', '五': '周五', '六': '周六', '日': '周日',
            '1': '周一', '2': '周二', '3': '周三', '4': '周四', '5': '周五', '6': '周六', '7': '周日'
        };

        for (let line of lines) {
            // 匹配格式：课程名 星期 时间 地点
            const match = line.match(/(.+?)\s+([\u4e00-\u9fa5一二三四五六日1-7])\s*(\d{1,2}:\d{2})[-~](\d{1,2}:\d{2})\s*(.+)?/);
            if (match) {
                classes.push({
                    name: match[1].trim(),
                    day: dayMap[match[2]] || match[2],
                    startTime: match[3],
                    endTime: match[4],
                    location: (match[5] || '').trim()
                });
            }
        }
        console.log("Parsed classes:", classes);
        return classes;
    },

    toggleTaskCompletion: (index) => {
        try {
            const tasks = Storage.getItem('tasks') || [];
            tasks[index].completed = !tasks[index].completed;
            Storage.setItem('tasks', tasks);
            UI.updateTaskList(tasks);
            console.log("Task completion toggled:", tasks[index]);
        } catch (error) {
            console.error("Error toggling task completion:", error);
            alert("更新任务状态时出错，请稍后再试。");
        }
    },

    addWeeklySchedule: (weeklySchedule) => {
        try {
            console.log("Adding weekly schedule:", weeklySchedule);
            Storage.setItem('weeklySchedule', weeklySchedule);
            TaskManager.generateSemesterSchedule(weeklySchedule);
            console.log("Weekly schedule added successfully");
        } catch (error) {
            console.error("Error adding weekly schedule:", error);
            alert("添加周课表时出错，请稍后再试");
        }
    },

    generateSemesterSchedule: (weeklySchedule) => {
        const semesterStart = new Date('2024-02-26'); // 假设学期开始日期
        const semesterEnd = new Date('2024-06-28');   // 假设学期结束日期
        const semesterClasses = [];

        for (let date = new Date(semesterStart); date <= semesterEnd; date.setDate(date.getDate() + 1)) {
            const dayOfWeek = date.toLocaleString('zh-CN', {weekday: 'long'});
            const dayClasses = weeklySchedule.filter(cls => cls.day === dayOfWeek);

            dayClasses.forEach(cls => {
                semesterClasses.push({
                    ...cls,
                    date: new Date(date)
                });
            });
        }

        Storage.setItem('semesterClasses', semesterClasses);
        UI.updateClassList(semesterClasses);
    },

    getClassesForDate: (date) => {
        const classes = Storage.getItem('classes') || [];
        const dayOfWeek = date.toLocaleString('zh-CN', {weekday: 'long'});
        console.log("Getting classes for:", dayOfWeek);
        const todayClasses = classes.filter(classInfo => classInfo.day === dayOfWeek);
        console.log("Classes found:", todayClasses);
        return todayClasses;
    },

    formatDate: (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    checkExpiredTasks: function() {
        const tasks = Storage.getItem('tasks') || [];
        const updatedTasks = this.removeExpiredTasks(tasks);
        if (updatedTasks.length !== tasks.length) {
            this.loadTasks(); // 重新加载任务列表
        }
    },

    deleteClass: (index) => {
        try {
            console.log("Deleting class at index:", index);
            const classes = Storage.getItem('classes') || [];
            classes.splice(index, 1);
            Storage.setItem('classes', classes);
            UI.updateClassList(classes);
            console.log("Class deleted successfully");
        } catch (error) {
            console.error("Error deleting class:", error);
            alert("删除课程时出错，请稍后再试。");
        }
    },

    getWeeklySchedule: () => {
        return Storage.getItem('weeklySchedule') || [];
    },

    // 每分钟检查一次过期任务（用于测试，实际使用可以改回每小时）
};

// 每分钟检查一次过期任务（用于测试，实际使用可以改回每小时）
setInterval(TaskManager.checkExpiredTasks.bind(TaskManager), 60000);

// 将 TaskManager 对象添加到全局作用域
window.TaskManager = TaskManager;
