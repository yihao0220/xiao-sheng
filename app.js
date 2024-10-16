document.addEventListener('DOMContentLoaded', () => {
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

    // 检查是否需要显示提醒
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
        UI.showMorningReminder();
    } else if (hour >= 13) {
        UI.showAfternoonReminder();
    }

    // 加载现有的课程
    TaskManager.loadClasses();
});

// 在文件末尾添加以下代码

function checkReminders() {
    const now = new Date();
    const hour = now.getHours();
    const lastCheckDate = localStorage.getItem('lastCheckDate');
    const today = now.toDateString();

    if (lastCheckDate !== today) {
        if (hour < 12) {
            UI.showMorningReminder();
        } else if (hour >= 13) {
            UI.showAfternoonReminder();
        }
        localStorage.setItem('lastCheckDate', today);
    }
}

// 每小时检查一次
setInterval(checkReminders, 3600000);

// 页面加载时立即检查一次
checkReminders();
