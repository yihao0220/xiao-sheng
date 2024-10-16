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
});
