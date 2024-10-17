const Storage = {
    setItem: (key, value) => {
        try {
            console.log(`Setting ${key} in storage:`, value);
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting ${key} in storage:`, error);
            alert("存储数据时出错，请确保您的浏览器支持本地存储。");
        }
    },
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
    removeItem: (key) => localStorage.removeItem(key)
};
