setupClassReminders: () => {
    const weeklySchedule = Storage.getItem('weeklySchedule') || [];
    if (weeklySchedule.length === 0) {
        console.log("No weekly schedule found");
        return;
    }

    const now = new Date();
    const currentDay = now.toLocaleString('zh-CN', { weekday: 'long' });
    
    console.log("Current day:", currentDay);
    console.log("Current time:", now.toLocaleTimeString());
    
    // 获取今天的课程
    const todayClasses = weeklySchedule.filter(cls => cls.day === currentDay);
    console.log("Today's classes:", todayClasses);
    
    todayClasses.forEach(classInfo => {
        // 解析课程时间
        const [hours, minutes] = classInfo.startTime.split(':').map(Number);
        const classTime = new Date();
        classTime.setHours(hours, minutes, 0);
        
        // 计算距离上课还有多少毫秒
        const timeUntilClass = classTime.getTime() - now.getTime();
        console.log(`Time until ${classInfo.name}: ${timeUntilClass/60000} minutes`);
        
        // 如果课程还没开始且在24小时内
        if (timeUntilClass > 0 && timeUntilClass <= 24 * 60 * 60 * 1000) {
            // 设置15分钟提醒
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

initReminderSystem: () => {
    console.log("Initializing reminder system");
    // 立即检查一次
    TaskManager.setupClassReminders();
    
    // 每分钟检查一次
    setInterval(() => {
        console.log("Checking for class reminders...");
        TaskManager.setupClassReminders();
    }, 60000);
}

