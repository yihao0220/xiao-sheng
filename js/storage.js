const Storage = {
    setItem: (key, value) => {
        try {
            console.log(`Setting ${key} in storage:`, value);
            localStorage.setItem(key, JSON.stringify(value));
            console.log(`${key} set successfully`);
        } catch (error) {
            console.error(`Error setting ${key} in storage:`, error);
            throw error; // 抛出错误以便上层捕获
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
