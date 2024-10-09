body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    width: 90%;
    max-width: 500px;
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1, h2 {
    color: #333;
    text-align: center;
    margin-bottom: 1.5rem;
}

h1 {
    font-size: 2rem;
    color: #2c3e50;
}

input, select, button {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

input:focus, select:focus {
    outline: none;
    border-color: #3498db;
}

button {
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #2980b9;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    background: #f8f9fa;
    margin-bottom: 10px;
    padding: 15px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

li button {
    width: auto;
    padding: 5px 10px;
    margin-left: 10px;
}

#authForm p {
    text-align: center;
    margin-top: 1rem;
}

#authForm a {
    color: #3498db;
    text-decoration: none;
}

#authForm a:hover {
    text-decoration: underline;
}

#taskManager {
    margin-top: 2rem;
}

.logout-btn {
    margin-top: 20px;
    background-color: #e74c3c;
}

.logout-btn:hover {
    background-color: #c0392b;
}

@media (max-width: 600px) {
    .container {
        width: 95%;
        padding: 1rem;
    }
}
