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
            const value = JSON.parse(localStorage.getItem(key));
            console.log(`Getting ${key} from storage:`, value);
            return value;
        } catch (error) {
            console.error(`Error getting ${key} from storage:`, error);
            return null;
        }
    },

    // 移除存储项
    removeItem: (key) => localStorage.removeItem(key) // 从 localStorage 中移除指定的键值对
};
