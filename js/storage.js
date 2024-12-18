// Storage 对象：用于处理本地存储的操作
const Storage = {
    // 设置存储项
    setItem: (key, value) => {
        try {
            console.log(`Setting ${key} in storage:`, value); // 输出日志，显示正在设置的键和值
            localStorage.setItem(key, JSON.stringify(value)); // 将值转换为 JSON 字符串并存储到 localStorage
            console.log(`${key} set successfully`); // 输出成功设置的日志
        } catch (error) {
            console.error(`Error setting ${key} in storage:`, error); // 如果出错，输出错误日志
            throw error; // 抛出错误以便上层捕获
        }
    },

    // 获取存储项
    getItem: (key) => {
        try {
            const value = localStorage.getItem(key);
            console.log(`Raw value for ${key} from localStorage:`, value);
            if (value === null) {
                console.log(`No data found for key: ${key}`);
                return null;
            }
            const parsedValue = JSON.parse(value);
            console.log(`Parsed value for ${key}:`, parsedValue);
            return parsedValue;
        } catch (error) {
            console.error(`Error getting ${key} from storage:`, error);
            return null;
        }
    },

    // 移除存储项
    removeItem: (key) => localStorage.removeItem(key) // 从 localStorage 中移除指定的键值对
};

// 添加数据导出功能
const DataBackup = {
    exportData() {
        const data = {
            tasks: Storage.getItem('tasks') || [],
            weeklySchedule: Storage.getItem('weeklySchedule') || [],
            lastBackup: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `task-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    },
    
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    Storage.setItem('tasks', data.tasks);
                    Storage.setItem('weeklySchedule', data.weeklySchedule);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    }
};
