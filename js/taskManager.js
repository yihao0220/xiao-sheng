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
        try {
            console.log("Adding class:", classInfo);
            const classes = Storage.getItem('classes') || [];
            classes.push(classInfo);
            Storage.setItem('classes', classes);
            UI.updateClassList(classes);
            console.log("Classes after adding:", classes);
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
        try {
            const classes = Storage.getItem('classes') || [];
            const today = new Date().toLocaleString('zh-CN', {sweekday: 'long'});
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
                return classTime < new Date(`2000-01-01T13:00:00`);
            });
        } catch (error) {
            console.error("Error getting morning classes:", error);
            alert("获取早上的班级列表时出错，请稍后再试。");
        }
    }
};
s
