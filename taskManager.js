const TaskManager = {
    addTask: (task) => {
        const tasks = Storage.getItem('tasks') || [];
        tasks.push(task);
        Storage.setItem('tasks', tasks);
        UI.updateTaskList(tasks);
    },
    editTask: (index, updatedTask) => {
        const tasks = Storage.getItem('tasks') || [];
        tasks[index] = updatedTask;
        Storage.setItem('tasks', tasks);
        UI.updateTaskList(tasks);
    },
    deleteTask: (index) => {
        const tasks = Storage.getItem('tasks') || [];
        tasks.splice(index, 1);
        Storage.setItem('tasks', tasks);
        UI.updateTaskList(tasks);
    },
    loadTasks: () => {
        const tasks = Storage.getItem('tasks') || [];
        UI.updateTaskList(tasks);
    },

    addClass: (classInfo) => {
        console.log("Adding class:", classInfo);
        const classes = Storage.getItem('classes') || [];
        classes.push(classInfo);
        Storage.setItem('classes', classes);
        UI.updateClassList(classes);
        console.log("Classes after adding:", classes);
    },

    loadClasses: () => {
        console.log("Loading classes");
        const classes = Storage.getItem('classes') || [];
        UI.updateClassList(classes);
        console.log("Loaded classes:", classes);
    },

    getClassesForToday: () => {
        const classes = Storage.getItem('classes') || [];
        const today = new Date().toLocaleString('zh-CN', {weekday: 'long'});
        return classes.filter(classInfo => classInfo.day === today);
    },

    getMorningClasses: () => {
        const todayClasses = TaskManager.getClassesForToday();
        return todayClasses.filter(classInfo => {
            const classTime = new Date(`2000-01-01T${classInfo.time}`);
            return classTime < new Date(`2000-01-01T13:00:00`);
        });
    }
};
