// 获取今天的日期
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// 添加新任务
function addTask() {
    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    
    if (taskName && dueDate) {
        const task = { name: taskName, dueDate: dueDate };
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        document.getElementById('taskName').value = '';
        document.getElementById('dueDate').value = '';
        
        showTodayTasks();
    } else {
        alert('请填写任务名称和截止日期！');
    }
}

// 显示今天的任务
function showTodayTasks() {
    const todayDate = getTodayDate();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const todayTasks = tasks.filter(task => new Date(task.dueDate) >= new Date(todayDate));
    
    const taskList = document.getElementById('todayTasks');
    taskList.innerHTML = '';
    
    todayTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.name} (截止日期: ${task.dueDate})`;
        taskList.appendChild(li);
    });
}

// 页面加载时显示今天的任务
window.onload = showTodayTasks;
