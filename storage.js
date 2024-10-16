const Storage = {
    setItem: (key, value) => {
        console.log(`Setting ${key} in storage:`, value);
        localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
        const value = JSON.parse(localStorage.getItem(key));
        console.log(`Getting ${key} from storage:`, value);
        return value;
    },
    removeItem: (key) => localStorage.removeItem(key)
};
