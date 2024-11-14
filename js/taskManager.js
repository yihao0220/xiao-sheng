const TaskManager = {
    setupClassReminders() {
        const weeklySchedule = Storage.getItem('weeklySchedule') || [];
        if (weeklySchedule.length === 0) {
            console.log("No weekly schedule found");
            return;
        }

        const now = new Date();
        const currentDay = now.toLocaleString('zh-CN', { weekday: 'long' });
        
        console.log("Current day:", currentDay);
        console.log("Current time:", now.toLocaleTimeString());
        
        const todayClasses = weeklySchedule.filter(cls => cls.day === currentDay);
        console.log("Today's classes:", todayClasses);
        
        todayClasses.forEach(classInfo => {
            const [hours, minutes] = classInfo.startTime.split(':').map(Number);
            const classTime = new Date();
            classTime.setHours(hours, minutes, 0);
            
            const timeUntilClass = classTime.getTime() - now.getTime();
            console.log(`Time until ${classInfo.name}: ${timeUntilClass/60000} minutes`);
            
            if (timeUntilClass > 0 && timeUntilClass <= 24 * 60 * 60 * 1000) {
                const reminderTime = timeUntilClass - 15 * 60 * 1000;
                
                if (reminderTime > 0) {
                    console.log(`Setting reminder for ${classInfo.name} in ${reminderTime/60000} minutes`);
                    setTimeout(() => {
                        UI.showClassNotification({
                            ...classInfo,
                            message: `课程将在15分钟后开始`
                        });
                    }, reminderTime);
                }
            }
        });
    },

    initReminderSystem() {
        console.log("Initializing reminder system");
        this.setupClassReminders();
        
        setInterval(() => {
            console.log("Checking for class reminders...");
            this.setupClassReminders();
        }, 60000);
    },

    testReminder() {
        console.log("Testing reminder system...");
        const testClass = {
            name: "测试课程",
            startTime: new Date(Date.now() + 16 * 60 * 1000).toTimeString().slice(0, 5),
            day: new Date().toLocaleString('zh-CN', { weekday: 'long' })
        };
        
        UI.showClassNotification({
            ...testClass,
            message: "测试提醒"
        });
        
        return "提醒测试已启动";
    }
};

