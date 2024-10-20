function generateWeeklyScheduleTemplate() {
    const timeSlots = [
        "8:00 - 9:40", "10:00 - 11:40", "14:00 - 15:40", "16:00 - 17:40", "19:00 - 20:40"
    ];
    const tbody = document.querySelector("#weeklyScheduleTemplate tbody");
    if (!tbody) {
        console.error("Weekly schedule template tbody not found");
        return; // 如果找不到 tbody，直接返回
    }
    tbody.innerHTML = '';

    timeSlots.forEach((slot, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${slot}</td>
            ${Array(5).fill().map((_, dayIndex) => `
                <td>
                    <input type="text" class="form-control course-input" data-time="${slot}" data-day="${dayIndex}">
                </td>
            `).join('')}
        `;
        tbody.appendChild(row);
    });
}

function initializeApp() {
    // ... 其他初始化代码 ...

    generateWeeklyScheduleTemplate();

    // ... 其他初始化代码 ...
}

// 确保在 DOM 加载完成后调用 initializeApp
document.addEventListener('DOMContentLoaded', initializeApp);
