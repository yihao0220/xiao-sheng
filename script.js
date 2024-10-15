document.addEventListener("DOMContentLoaded", function() {
    const authForm = document.getElementById("authForm");
    const taskManager = document.getElementById("taskManager");
    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");

    // 显示未完成任务
    function showUnfinishedTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const unfinishedTasks = tasks.filter(task => !task.completed);

        if (unfinishedTasks.length > 0) {
            let message = "您有以下未完成的任务:\n";
            unfinishedTasks.forEach(task => {
                message += `- ${task.name}\n`;
            });
            alert(message);
        }
    }

    // 检查本地存储中是否有登录信息
    function checkLoginStatus() {
        if (localStorage.getItem("isLoggedIn") === "true") {
            authForm.style.display = "none";
            taskManager.style.display = "block";
            showUnfinishedTasks();
        } else {
            authForm.style.display = "block";
            taskManager.style.display = "none";
        }
    }

    // 登录按钮事件
    loginButton.addEventListener("click", function(event) {
        event.preventDefault();
        if (loginUsername.value && loginPassword.value) {
            localStorage.setItem("isLoggedIn", "true");
            checkLoginStatus();
        }
    });

    // 退出登录按钮事件
    logoutButton.addEventListener("click", function() {
        localStorage.removeItem("isLoggedIn");
        checkLoginStatus();
    });

    // 初始化检查登录状态
    checkLoginStatus();
});
