// 登录功能
document.getElementById("loginButton").addEventListener("click", function(event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    if (username && password) {
        document.getElementById("authForm").style.display = "none";
        document.getElementById("taskManager").style.display = "block";
    }
});

// 添加任务功能
document.getElementById("addTaskButton").addEventListener("click", function() {
    const taskName = document.getElementById("taskName").value;
    const startDate = document.getElementById("startDate").value;
    const startTime = document.getElementById("startTime").value;
    const endDate = document.getElementById("endDate").value;
    const endTime = document.getElementById("endTime").value;
    const priority = document.getElementById("priority").value;
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value;

    if (taskName) {
        const taskItem = document.createElement("li");
        taskItem.innerText = `任务: ${taskName}, 开始: ${startDate} ${startTime}, 结束: ${endDate} ${endTime}, 优先级: ${priority}, 分类: ${category}, 地点: ${location}`;
        document.getElementById("allTasks").appendChild(taskItem);
    }
});

// 清除搜索功能
document.getElementById("clearSearchButton").addEventListener("click", function() {
    document.getElementById("searchInput").value = "";
});

// 添加课程功能
document.getElementById("addClassButton").addEventListener("click", function(event) {
    event.preventDefault();
    const className = document.getElementById("className").value;
    const classDay = document.getElementById("classDay").value; // 获取星期几
    const classTime = document.getElementById("classTime").value;
    const classLocation = document.getElementById("classLocation").value || "无地点";

    if (className && classDay && classTime) {
        const classItem = document.createElement("p");
        classItem.innerText = `课程: ${className}, 时间: ${classDay} ${classTime}, 地点: ${classLocation}`;
        document.getElementById("notificationContainer").appendChild(classItem);
    }
});
