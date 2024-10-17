document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM content loaded");

    // 初始化应用
    Auth.checkLoginStatus();
    
    // 设置事件监听器
    document.getElementById('loginButton').addEventListener('click', () => UI.showElement('authForm'));
    document.getElementById('submitLoginButton').addEventListener('click', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        Auth.login(username, password);
    });
    document.getElementById('logoutButton').addEventListener('click', Auth.logout);
    
    // 设置任务相关的事件监听器
    // ...

    const addClassButton = document.getElementById('addClassButton');
    const classPhotoInput = document.getElementById('classPhoto');

    addClassButton.addEventListener('click', (e) => {
        e.preventDefault();
        const classInfo = {
            name: document.getElementById('className').value,
            day: document.getElementById('classDay').value,
            time: document.getElementById('classTime').value,
            location: document.getElementById('classLocation').value,
            photo: ''
        };

        if (classPhotoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                classInfo.photo = e.target.result;
                TaskManager.addClass(classInfo);
            };
            reader.readAsDataURL(classPhotoInput.files[0]);
        } else {
            TaskManager.addClass(classInfo);
        }
    });

    // 加载现有的课程
    TaskManager.loadClasses();

    // 检查未完成的任务并显示提醒
    UI.showUnfinishedTasks();

    // 检查是否需要显示课程提醒
    checkClassReminders();
});

function checkClassReminders() {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
        UI.showMorningReminder();
    } else if (hour >= 13) {
        UI.showAfternoonReminder();
    }
}

// 每小时检查一次课程提醒
setInterval(checkClassReminders, 3600000);
