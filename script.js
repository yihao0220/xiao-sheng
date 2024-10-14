// 获取今天的日期（星期几，1表示周一，7表示周日）
function getToday() {
    const today = new Date();
    return today.getDay(); // 返回值：0-6 (0表示周日)
}

// 获取本地存储中的课表
function getStoredClasses() {
    return JSON.parse(localStorage.getItem("classSchedule")) || {};
}

// 存储课表到本地存储
function storeClasses(classSchedule) {
    localStorage.setItem("classSchedule", JSON.stringify(classSchedule));
}

// 提醒今天的课程
function remindTodayClasses() {
    const today = getToday();
    const classSchedule = getStoredClasses();
    const todayClasses = classSchedule[today] || []; // 如果没有今天的课程，返回空数组

    if (todayClasses.length > 0) {
        alert("今天的课程有: " + todayClasses.map(c => `${c.name} (${c.time})`).join(", "));
    } else {
        console.log("今天没有课程");
    }
}

// 添加课程到课表
document.getElementById("addClassButton").addEventListener("click", function(event) {
    event.preventDefault();
    
    const className = document.getElementById("className").value;
    const classDay = document.getElementById("classDay").value; // 获取星期几
    const classTime = document.getElementById("classTime").value;
    const classLocation = document.getElementById("classLocation").value || "无地点";

    if (className && classTime) {
        const classSchedule = getStoredClasses();
        
        // 确保每个星期几都有一个数组存储课程
        if (!classSchedule[classDay]) {
            classSchedule[classDay] = [];
        }

        // 添加新的课程
        classSchedule[classDay].push({ name: className, time: classTime, location: classLocation });
        storeClasses(classSchedule);

        alert(`已添加课程: ${className}, 时间: ${classDay} ${classTime}, 地点: ${classLocation}`);
    }
});

// 页面加载时提醒今天的课程
document.addEventListener("DOMContentLoaded", function() {
    remindTodayClasses();
});
