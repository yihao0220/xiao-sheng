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

function loadAuth() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'js/auth.js';
        script.onload = () => {
            console.log('auth.js loaded successfully');
            resolve();
        };
        script.onerror = () => reject(new Error('Failed to load auth.js'));
        document.head.appendChild(script);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM content loaded");
    logDeviceInfo();
    checkLocalStorage();

    try {
        await loadAuth();
        // 初始化应用
        Auth.checkLoginStatus();
        
        // 设置事件监听器
        document.getElementById('loginButton').addEventListener('click', () => {
            console.log("Login button clicked");
            UI.showElement('authForm');
        });
        document.getElementById('submitLoginButton').addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Submit login button clicked");
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            Auth.login(username, password);
        });
        document.getElementById('logoutButton').addEventListener('click', Auth.logout);
        
        // 加载现有的课程和任务
        TaskManager.loadClasses();
        TaskManager.loadTasks();

        // 检查未完成的任务并显示提醒
        UI.showUnfinishedTasks();

        console.log("Event listeners set up");
    } catch (error) {
        console.error("Failed to load Auth:", error);
        alert("An error occurred while loading the application. Please check the console for more information.");
    }
});

window.onerror = function(message, source, lineno, colno, error) {
    console.error("Global error:", message, "at", source, ":", lineno);
    alert("An error occurred. Please check the console for more information.");
