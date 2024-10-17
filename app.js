console.log("App script loaded");

function logDeviceInfo() {
    console.log("User Agent:", navigator.userAgent);
    console.log("Screen Width:", screen.width);
    console.log("Screen Height:", screen.height);
    console.log("Window Inner Width:", window.innerWidth);
    console.log("Window Inner Height:", window.innerHeight);
}

function checkLocalStorage() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log("Local storage is working");
    } catch(e) {
        console.error("Local storage is not available:", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM content loaded");

    // 初始化应用
    Auth.checkLoginStatus();
    
    // 设置事件监听器
    document.getElementById('loginButton').addEventListener('touchstart', () => UI.showElement('authForm'));
    document.getElementById('submitLoginButton').addEventListener('touchstart', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        Auth.login(username, password);
    });
    document.getElementById('logoutButton').addEventListener('touchstart', Auth.logout);
    
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

