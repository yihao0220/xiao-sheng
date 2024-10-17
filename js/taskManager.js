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
                // 如果有照片，将其转换为 base64 字符串
                if (classInfo.photo instanceof File) {
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        classInfo.photo = reader.result;
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
            alert("加载课程列表时出错，请稍后再试。");
        }
    },

    getClassesForToday: () => {
        try {
            const classes = Storage.getItem('classes') || [];
            const today = new Date().toLocaleString('zh-CN', {weekday: 'long'});
            return classes.filter(classInfo => classInfo.day === today);
        } catch (error) {
            console.error("Error getting classes for today:", error);
            alert("获取今天的班级列表时出错，请稍后再试。");
        }
    },

    getMorningClasses: () => {
        try {
            const todayClasses = TaskManager.getClassesForToday();
            return todayClasses.filter(classInfo => {
                const classTime = new Date(`2000-01-01T${classInfo.time}`);
