document.addEventListener("DOMContentLoaded", function() {
    // 登录功能
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", function(event) {
            event.preventDefault();
            const username = document.getElementById("loginUsername").value;
            const password = document.getElementById("loginPassword").value;
            if (username && password) {
                document.getElementById("authForm").style.display = "none";
                document.getElementById("taskManager").style.display = "block";
            }
        });
    }

    // 添加任务功能
    const addTaskButton = document.getElementById("addTaskButton");
    if (addTaskButton) {
        addTaskButton.addEventListener("click", function() {
            let taskName = document.getElementById("taskName").value;
            let startDate = document.getElementById("startDate").value;
            let startTime = document.getElementById("startTime").value;
            let endDate = document.getElementById("endDate").value;
            let endTime = document.getElementById("endTime").value;
            let priority = document.getElementById("priority").value;
            let category = document.getElementById("category").value;
            let location = document.getElementById("location").value;

            if (taskName) {
                const taskItem = document.createElement("li");
                taskItem.innerText = `任务: ${taskName}, 开始: ${startDate} ${startTime}, 结束: ${endDate} ${endTime}, 优先级: ${priority}, 分类: ${category}, 地点: ${location}`;
                document.getElementById("allTasks").appendChild(taskItem);
            }
        });
    }

    // 清除搜索功能
    const clearSearchButton = document.getElementById("clearSearchButton");
    if (clearSearchButton) {
        clearSearchButton.addEventListener("click", function() {
            document.getElementById("searchInput").value = "";
        });
    }

    // 添加课程功能
    const addClassButton = document.getElementById("addClassButton");
    if (addClassButton) {
        addClassButton.addEventListener("click", function(event) {
            event.preventDefault();
            let className = document.getElementById("className").value;
            let classDay = document.getElementById("classDay").value;
            let classTime = document.getElementById("classTime").value;
            let classLocation = document.getElementById("classLocation").value || "无地点";

            if (className && classDay && classTime) {
                const classItem = document.createElement("p");
                classItem.innerText = `课程: ${className}, 时间: ${classDay} ${classTime}, 地点: ${classLocation}`;
                document.getElementById("notificationContainer").appendChild(classItem);
            }
        });
    }
});
