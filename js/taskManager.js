const TaskManager = {
    addTask: (task) => {
        try {
            const tasks = Storage.getItem('tasks') || [];
            tasks.push(task);
            Storage.setItem('tasks', tasks);
            UI.updateTaskList(tasks);
            console.log("Task added successfully:", task);
        } catch (error) {
            console.error("Error adding task:", error);
            alert("添加任务时出错，请稍后再试。");
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
            const tasks = Storage.getItem('tasks') || [];
            tasks.splice(index, 1);
            Storage.setItem('tasks', tasks);
            UI.updateTaskList(tasks);
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("删除任务时出错，请稍后再试。");
        }
    },
    loadTasks: () => {
        try {
            const tasks = Storage.getItem('tasks') || [];
            UI.updateTaskList(tasks);
        } catch (error) {
            console.error("Error loading tasks:", error);
            alert("加载任务列表时出错，请稍后再试。");
        }
    },

    addClass: (classInfo) => {
        return new Promise((resolve, reject) => {
            try {
                console.log("Adding class:", classInfo);
                const classes = Storage.getItem('classes') || [];
                if (classInfo.photo instanceof File) {
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        classInfo.photo = reader.result;  // This will be a base64 string
                        classes.push(classInfo);
                        Storage.setItem('classes', classes);
                        UI.updateClassList(classes);
                        console.log("Classes after adding:", classes);
                        resolve();
                    };
                    reader.onerror = function(error) {
                        console.error("Error reading file:", error);
                        reject(error);
                    };
                    reader.readAsDataURL(classInfo.photo);
                } else {
                    classes.push(classInfo);
                    Storage.setItem('classes', classes);
                    UI.updateClassList(classes);
                    console.log("Classes after adding:", classes);
                    resolve();
                }
            } catch (error) {
                console.error("Error adding class:", error);
                reject(error);
            }
        });
    },

    loadClasses: () => {
        try {
            console.log("Loading classes");
            const classes = Storage.getItem('classes') || [];
            UI.updateClassList(classes);
            console.log("Loaded classes:", classes);
        } catch (error) {
            console.error("Error loading classes:", error);
            alert("加载课程列表时出错，请稍再试。");
        }
    },

    getClassesForToday: () => {
        const classes = Storage.getItem('classes') || [];
        const today = new Date().toLocaleString('zh-CN', {weekday: 'long'});
        return classes.filter(classInfo => classInfo.day === today);
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
            alert("获取早上的班级列表时出错，请稍后再试。");
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
            '一': '周一', '二': '周二', '三': '周三', '四': '周四', '五': '周五', '六': '周六', '日': '周日'
        };

        for (let line of lines) {
            // 匹配格式：课程名 星期 时间 地点
            const match = line.match(/(.+?)\s+(.)?\s*(\d{1,2}:\d{2})[-~](\d{1,2}:\d{2})\s*(.+)?/);
            if (match) {
                classes.push({
                    name: match[1].trim(),
                    day: dayMap[match[2]] || match[2] || '',
                    startTime: match[3],
                    endTime: match[4],
                    location: (match[5] || '').trim()
                });
            }
        }
        console.log("Parsed classes:", classes);
        return classes;
    }
};

// 将 TaskManager 对象添加到全局作用域
window.TaskManager = TaskManager;
