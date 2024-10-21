// TaskManager 对象：管理任务和课程的核心功能模块
const TaskManager = {
    // 添加新任务
    addTask: (task) => {
        try {
            console.log("TaskManager: Adding task:", task);
            const tasks = Storage.getItem('tasks') || [];
            tasks.push(task);
            Storage.setItem('tasks', tasks);
            console.log("TaskManager: Task added to storage, total tasks:", tasks.length);
            return true;
        } catch (error) {
            console.error("TaskManager: Error adding task:", error);
            UI.showError("添加任务时出错，请稍后再试。");
            return false;
        }
    },

    // 编辑现有任务
    editTask: (index, updatedTask) => {
        try {
            console.log("Editing task at index:", index, "with data:", updatedTask); // 日志：正在编辑任务
            const tasks = Storage.getItem('tasks') || []; // 从存储中获取任务数组
            tasks[index] = updatedTask; // 用更新后的任务替换原有任务
            Storage.setItem('tasks', tasks); // 保存更新后的任务数组
            UI.updateTaskList(tasks); // 更新UI显的任务列表
            console.log("Task edited successfully"); // 日志：任务编辑成功
        } catch (error) {
            console.error("Error editing task:", error); // 错误日志：编辑任务时出错
            alert("编辑任务时出错，请稍后再试。"); // 显示错误消息给用户
        }
    },

    // 删除任务
    deleteTask: (index) => {
        try {
            console.log("Deleting task at index:", index); // 日志：正在删除任务
            const tasks = Storage.getItem('tasks') || []; // 从存储中获取任务数组
            tasks.splice(index, 1); // 从数组中移除指定索引的任务
            Storage.setItem('tasks', tasks); // 保存更新后的任务数组
            UI.updateTaskList(tasks); // 更新UI显示的任务列表
            console.log("Task deleted successfully"); // 日志：任务删除成功
        } catch (error) {
            console.error("Error deleting task:", error); // 错误日志：删除任务时出错
            alert("删除任务时出错，请稍后再试。"); // 显示错误消息给用户
        }
    },

    // 加载所有任务
    loadTasks: () => {
        try {
            console.log("Loading tasks");
            let tasks = Storage.getItem('tasks') || [];
            console.log("Tasks from storage:", tasks);
            tasks = TaskManager.removeExpiredTasks(tasks);
            console.log("Tasks after removing expired:", tasks);
            UI.updateTaskList(tasks);
            console.log("Task list updated, total tasks:", tasks.length);
        } catch (error) {
            console.error("Error loading tasks:", error);
            UI.showError("加载任务列表时出错，请稍后再试。");
        }
    },

    // 除过期任务
    removeExpiredTasks: (tasks) => {
        const now = new Date(); // 获取当前时间
        const updatedTasks = tasks.filter(task => {
            if (!task.endDate || !task.endTime) {
                console.warn("Task missing end date or time:", task); // 警告日志：任务缺少结束日期或时间
                return true; // 保留没有结束日期或时间的任务
            }
            const endDate = new Date(task.endDate + 'T' + task.endTime); // 创建任务结束时间的Date对象
            return endDate > now; // 保留未过期的任务
        });
        if (updatedTasks.length !== tasks.length) {
            Storage.setItem('tasks', updatedTasks); // 如果有任务被移除，更新存储
            console.log("Expired tasks removed, remaining tasks:", updatedTasks.length); // 日志：显示移除过期任务后的剩余任务数
        }
        return updatedTasks; // 返回更新后的任务数组
    },

    // 添加课程信息
    addClass: (classInfo) => {
        try {
            console.log("Adding class:", classInfo); // 日志：正在添加课程
            const classes = Storage.getItem('classes') || []; // 从存储中取课程数组
            classes.push(classInfo); // 添加新课程
            Storage.setItem('classes', classes); // 保存更新后的课程数组
            UI.updateClassList(classes); // 更新UI显示的课程列表
            console.log("Class added successfully:", classInfo); // 日志：课程添加成功
        } catch (error) {
            console.error("Error adding class:", error); // 错误日志：添加课程时出错
            alert("添加课程时出错，请稍后再试。"); // 显示错误消息给用户
        }
    },

    // 加载所有课程
    loadClasses: () => {
        try {
            console.log("Loading classes"); // 日志：正在加载课程
            const classes = Storage.getItem('classes') || []; // 从存储中获取课程数组
            UI.updateClassList(classes); // 更新UI显示的课程列表
            console.log("Loaded classes:", classes); // 日志：显示加载的课程
        } catch (error) {
            console.error("Error loading classes:", error); // 错误日志：加载课程时出错
            alert("加载课程列表时出错，请稍后再试。"); // 显示错误消息给用户
        }
    },

    // 获取今天的课程
    getClassesForToday: () => {
        const classes = Storage.getItem('classes') || [];
        const today = new Date().toLocaleString('zh-CN', {weekday: 'long'});
        return classes.filter(classInfo => classInfo.day === today);
    },

    // 获取早上的课程
    getMorningClasses: () => {
        try {
            const todayClasses = TaskManager.getClassesForToday(); // 获取今天的课程
            return todayClasses.filter(classInfo => {
                const classTime = new Date(`2000-01-01T${classInfo.time}`); // 创建课程时间的Date对象
                return classTime < new Date(`2000-01-01T13:00:00`); // 筛选出13:00前的课程
            });
        } catch (error) {
            console.error("Error getting morning classes:", error); // 错误日志：获取早上课程时出错
            alert("获取早上的班级列表出错，请稍后再试。"); // 显示错误消息给用户
        }
    },

    // 识别课程表图片
    recognizeSchedule: (file) => {
        return new Promise((resolve, reject) => {
            Tesseract.recognize(file, 'chi_sim') // 使用Tesseract.js识别中文简体文字
                .then(({ data: { text } }) => {
                    console.log("Recognized text:", text); // 日志：显示识别出的文字
                    const classes = TaskManager.parseSchedule(text); // 解析识别出的文字
                    Storage.setItem('classes', classes); // 保存解析后的课程信息
                    UI.updateClassList(classes); // 更新UI显示的课程列表
                    resolve(classes); // 解析成功，返回课程数组
                })
                .catch((error) => {
                    console.error("Error recognizing schedule:", error); // 错误日志：识别课程表时出错
                    reject(error); // 识别失败，返回错误
                });
        });
    },

    // 解析课程表文本
    parseSchedule: (text) => {
        const classes = []; // 初始化课程数组
        const lines = text.split('\n'); // 将文本按行分割
        const dayMap = {
            '一': '周一', '二': '周二', '三': '周三', '四': '周四', '五': '周五', '六': '周六', '日': '周日',
            '1': '周一', '2': '周二', '3': '周三', '4': '周四', '5': '周五', '6': '周六', '7': '周日'
        }; // 定义星期映射

        for (let line of lines) {
            // 匹配格式：课程名 星期 时间 地点
            const match = line.match(/(.+?)\s+([\u4e00-\u9fa5一二三四五六日1-7])\s*(\d{1,2}:\d{2})[-~](\d{1,2}:\d{2})\s*(.+)?/);
            if (match) {
                classes.push({
                    name: match[1].trim(), // 课程名
                    day: dayMap[match[2]] || match[2], // 星期
                    startTime: match[3], // 开始时间
                    endTime: match[4], // 结束时间
                    location: (match[5] || '').trim() // 地点（如果有）
                });
            }
        }
        console.log("Parsed classes:", classes); // 日志：显示解析后的课程
        return classes; // 返回解析后的课程数组
    },

    // 切换任务完成状态
    toggleTaskCompletion: (index) => {
        try {
            const tasks = Storage.getItem('tasks') || []; // 从存储中获取任务数组
            tasks[index].completed = !tasks[index].completed; // 切换任务的完成状态
            Storage.setItem('tasks', tasks); // 保存更新后的任务数组
            UI.updateTaskList(tasks); // 更新UI显示的任务列表
            console.log("Task completion toggled:", tasks[index]); // 日志：显示切换后的任务状态
        } catch (error) {
            console.error("Error toggling task completion:", error); // 错误日志：切换任务完成状态时出错
            alert("更新任务状态时出错，请稍后再试。"); // 显示错误消息给用户
        }
    },

    // 添加周课表
    addWeeklySchedule: (weeklySchedule) => {
        try {
            console.log("Adding weekly schedule:", weeklySchedule); // 日志：正在添加周课表
            Storage.setItem('weeklySchedule', weeklySchedule); // 保存周课表
            TaskManager.generateSemesterSchedule(weeklySchedule); // 生成学期课表
            console.log("Weekly schedule added successfully"); // 日志：周课表添加成功
        } catch (error) {
            console.error("Error adding weekly schedule:", error); // 错误日志：添加周课表时出错
            alert("添加周课表时出错，请稍后再试"); // 显示错误消息给用户
        }
    },

    // 生成学期课表
    generateSemesterSchedule: (weeklySchedule) => {
        const semesterStart = new Date('2024-02-26'); // 学期开始日期
        const semesterEnd = new Date('2024-06-28');   // 学期结束日期
        const semesterClasses = []; // 初始化学期课程数组

        for (let date = new Date(semesterStart); date <= semesterEnd; date.setDate(date.getDate() + 1)) {
            const dayOfWeek = date.toLocaleString('zh-CN', {weekday: 'long'}); // 获取星期几（中文）
            const dayClasses = weeklySchedule.filter(cls => cls.day === dayOfWeek); // 筛选出当天的课程

            dayClasses.forEach(cls => {
                semesterClasses.push({
                    ...cls,
                    date: new Date(date) // 为每节课添加具体日期
                });
            });
        }

        Storage.setItem('semesterClasses', semesterClasses); // 保存学期课表
        UI.updateClassList(semesterClasses); // 更新UI显示的课程列表
    },

    // 获取指定日期的课程
    getClassesForDate: (date) => {
        const classes = Storage.getItem('classes') || [];
        const dayOfWeek = date.toLocaleString('zh-CN', {weekday: 'long'});
        return classes.filter(classInfo => classInfo.day === dayOfWeek);
    },

    // 格式化日期
    formatDate: (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    // 检查并移除过期任务
    checkExpiredTasks: function() {
        const tasks = Storage.getItem('tasks') || []; // 从存储中获取任务数组
        const updatedTasks = this.removeExpiredTasks(tasks); // 移除过期任务
        if (updatedTasks.length !== tasks.length) {
            this.loadTasks(); // 如果有任务被移除，重新加载任务列表
        }
    },

    // 删除课程
    deleteClass: (index) => {
        try {
            console.log("Deleting class at index:", index); // 日志：正在删除课程
            const classes = Storage.getItem('classes') || []; // 从存储中获取课程数组
            classes.splice(index, 1); // 从数组中移除指定索引的课程
            Storage.setItem('classes', classes); // 保存更新后的课程数组
            UI.updateClassList(classes); // 更新UI显示的课程列表
            console.log("Class deleted successfully"); // 日志：课程删除成功
        } catch (error) {
            console.error("Error deleting class:", error); // 错误日志：删除课程时出错
            alert("删除课程时出错，请稍后再试。"); // 显示错误消息给用户
        }
    },

    // 获取周课表
    getWeeklySchedule: () => {
        return Storage.getItem('weeklySchedule') || []; // 从存储中获取周课表，如果没有则返回空数组
    },
};

// 每分钟检查一次过期任务（用于测试，实际使用可以改回每小时）
setInterval(TaskManager.checkExpiredTasks.bind(TaskManager), 60000);

// 将 TaskManager 对象添加到全局作用域
window.TaskManager = TaskManager;

// 注意：这里不需要额外的闭合大括号和分号，因为它们已经在对象定义的末尾了

