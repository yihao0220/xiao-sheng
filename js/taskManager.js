// TaskManager 对象：管理任务和课程的核心功能模块
const TaskManager = {
    // 添加新任务
    addTask: (task) => {
        try {
            console.log("TaskManager: 正在添加任务:", task);
            const tasks = Storage.getItem('tasks') || [];
            if (!task.name) {
                throw new Error("任务名称不能为空");
            }
            if (!task.times || task.times.length === 0) {
                throw new Error("至少需要添加一个时间段");
            }
            tasks.push(task);
            Storage.setItem('tasks', tasks);
            console.log("TaskManager: 任务已添加到存储，总任务数:", tasks.length);
            return true;
        } catch (error) {
            console.error("TaskManager: 添加任务时出错:", error.message);
            UI.showError("添加任务失败: " + error.message);
            return false;
        }
    },

    // 编辑现有任务
    editTask: (index, updatedTask) => {
        try {
            console.log("TaskManager: 正在编辑索引为", index, "的任务，更新数据:", updatedTask);
            const tasks = Storage.getItem('tasks') || [];
            if (index < 0 || index >= tasks.length) {
                throw new Error("无效的任务索引");
            }
            tasks[index] = updatedTask;
            Storage.setItem('tasks', tasks);
            UI.updateTaskList(tasks);
            console.log("TaskManager: 任务编辑成功");
            return true;
        } catch (error) {
            console.error("TaskManager: 编辑任务时出错:", error.message);
            UI.showError("编辑任务失败: " + error.message);
            return false;
        }
    },

    // 删除任务
    deleteTask: (index) => {
        try {
            console.log("TaskManager: 正在删除索引为", index, "的任务");
            const tasks = Storage.getItem('tasks') || [];
            if (index < 0 || index >= tasks.length) {
                throw new Error("无效的任务索引");
            }
            tasks.splice(index, 1);
            Storage.setItem('tasks', tasks);
            UI.updateTaskList(tasks);
            console.log("TaskManager: 任务删除成功");
            return true;
        } catch (error) {
            console.error("TaskManager: 删除任务时出错:", error.message);
            UI.showError("删除任务失败: " + error.message);
            return false;
        }
    },

    // 加载所有任务
    loadTasks: () => {
        try {
            console.log("Loading tasks");
            let tasks = Storage.getItem('tasks');
            console.log("Raw tasks from storage:", tasks);
            
            if (tasks === null || tasks === undefined) {
                console.log("No tasks found in storage, initializing empty array");
                tasks = [];
            } else if (!Array.isArray(tasks)) {
                console.error("Invalid tasks data in storage:", tasks);
                tasks = [];
            }
            
            console.log("Tasks from storage:", tasks);
            tasks = TaskManager.removeExpiredTasks(tasks);
            console.log("Tasks after removing expired:", tasks);
            
            if (!Array.isArray(tasks)) {
                console.error("removeExpiredTasks returned invalid data:", tasks);
                tasks = [];
            }
            
            UI.updateTaskList(tasks);
            console.log("Task list updated, total tasks:", tasks.length);
        } catch (error) {
            console.error("Error loading tasks:", error);
            UI.showError("加载任务列表时出错，请稍后再试。");
        }
    },

    // 除过期任务
    removeExpiredTasks: (tasks) => {
        if (!Array.isArray(tasks)) {
            console.error("Invalid tasks array in removeExpiredTasks:", tasks);
            return [];
        }
        const now = new Date();
        const updatedTasks = tasks.filter(task => {
            if (!task || !task.times || !Array.isArray(task.times) || task.times.length === 0) {
                console.warn("Task with invalid structure:", task);
                return false;
            }
            return task.times.some(time => {
                if (!time.date) return true; // 如果没有日期，认为任务未过期
                const taskEndDate = new Date(time.date + 'T' + (time.endTime || '23:59:59'));
                return taskEndDate > now;
            });
        });
        console.log("Removed expired tasks, remaining tasks:", updatedTasks.length);
        return updatedTasks;
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
            console.log("Loading classes");
            const weeklySchedule = Storage.getItem('weeklySchedule') || [];
            UI.updateClassList(weeklySchedule);
            console.log("Loaded classes:", weeklySchedule);
        } catch (error) {
            console.error("Error loading classes:", error);
            UI.showError("加载课程列表时出错，请稍后再试。");
        }
    },

    // 获取今天的课程
    getClassesForToday: () => {
        const today = new Date();
        return TaskManager.getClassesForDate(today);
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
            '一': '周一', '': '周二', '三': '周三', '四': '周四', '五': '周五', '六': '周六', '日': '周日',
            '1': '周一', '2': '周二', '3': '周三', '4': '周四', '5': '周五', '6': '周六', '7': '周日'
        }; // 定义星期映射

        for (let line of lines) {
            // 匹配格式：课程名 星期 时间 地点
            const match = line.match(/(.+?)\s+([\u4e00-\u9fa5一三四五六日1-7])\s*(\d{1,2}:\d{2})[-~](\d{1,2}:\d{2})\s*(.+)?/);
            if (match) {
                classes.push({
                    name: match[1].trim(), // 课程名
                    day: dayMap[match[2]] || match[2], // 星期
                    startTime: match[3], // 开始时
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
            console.log("Task completion toggled:", tasks[index]); // 日志：显示切换的务状态
        } catch (error) {
            console.error("Error toggling task completion:", error); // 错误日志：切换任务完成状态时出错
            alert("更新任务状态时出错，请稍后再试。"); // 显示错误消息给用户
        }
    },

    // 添加周课表
    addWeeklySchedule: () => {
        try {
            const weeklySchedule = [];
            const inputs = document.querySelectorAll('#weeklyScheduleTemplate .course-input');
            inputs.forEach(input => {
                if (input.value.trim()) {
                    weeklySchedule.push({
                        name: input.value.trim(),
                        day: ['周一', '周二', '周三', '周四', '周五'][input.dataset.day],
                        time: input.dataset.time
                    });
                }
            });

            console.log("Adding weekly schedule:", weeklySchedule);
            Storage.setItem('weeklySchedule', weeklySchedule);
            UI.updateClassList(weeklySchedule);
            console.log("Weekly schedule added successfully");
            
            // 添加成功保存的提醒
            UI.showSuccess("周课表已成功保存！");
        } catch (error) {
            console.error("Error adding weekly schedule:", error);
            UI.showError("添加周课表时错，请稍后再试");
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
        const weeklySchedule = Storage.getItem('weeklySchedule') || [];
        const dayOfWeek = date.toLocaleString('zh-CN', {weekday: 'long'});
        return weeklySchedule.filter(classInfo => classInfo.day === dayOfWeek);
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

    // 获取周课表
    getWeeklySchedule: () => {
        return Storage.getItem('weeklySchedule') || []; // 从存储中获取周课表，如果没则返回空数组
    },

    // 添加新方法：获取任务统计信息
    getTaskStats: () => {
        try {
            const tasks = Storage.getItem('tasks') || [];
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.completed).length;
            const pendingTasks = totalTasks - completedTasks;
            console.log("TaskManager: 任务统计 - 总数:", totalTasks, "已完成:", completedTasks, "待完成:", pendingTasks);
            return { totalTasks, completedTasks, pendingTasks };
        } catch (error) {
            console.error("TaskManager: 获取任务统计时出错:", error.message);
            return { totalTasks: 0, completedTasks: 0, pendingTasks: 0 };
        }
    },

    // 在 TaskManager 对象中添加以下方法
    removeExpiredTasks: () => {
        try {
            const tasks = Storage.getItem('tasks') || [];
            const currentDate = new Date();
            
            const updatedTasks = tasks.filter(task => {
                if (!task.times || task.times.length === 0) {
                    return true;
                }
                
                return task.times.some(time => {
                    if (!time.date) return true;
                    const taskEndDate = new Date(time.date + 'T' + (time.endTime || '23:59:59'));
                    return taskEndDate > currentDate;
                });
            });

            if (updatedTasks.length !== tasks.length) {
                Storage.setItem('tasks', updatedTasks);
                console.log(`已删除 ${tasks.length - updatedTasks.length} 个过期任务`);
                UI.updateTaskList(updatedTasks);
            }
        } catch (error) {
            console.error("删除过期任务时出错:", error);
        }
    }
};

// 每分钟检查一次过期任务（用于测试，实际使用可以改回每小时）
setInterval(TaskManager.checkExpiredTasks.bind(TaskManager), 60000);

// 将 TaskManager 对象添加到全局作用域
window.TaskManager = TaskManager;

// 注意：这里不需要额外的闭合大括号和分号，因为它们已经在对象定义的末尾了
