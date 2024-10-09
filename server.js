const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 连接到 MongoDB（请确保您已安装并运行了 MongoDB）
mongoose.connect('mongodb://localhost/task_manager', { useNewUrlParser: true, useUnifiedTopology: true });

// 定义用户模型
const User = mongoose.model('User', {
    username: String,
    password: String
});

// 定义任务模型
const Task = mongoose.model('Task', {
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    dueDate: Date,
    priority: String,
    category: String
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 注册
app.post('/api/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        await user.save();
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

// 登录
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
            res.json({ token: token });
        } else {
            res.status(401).send('Wrong password');
        }
    } catch {
        res.status(500).send();
    }
});

// 中间件：验证 JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.userId = user.userId;
        next();
    });
}

// 获取任务
app.get('/api/tasks', authenticateToken, async (req, res) => {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
});

// 添加任务
app.post('/api/tasks', authenticateToken, async (req, res) => {
    const task = new Task({
        userId: req.userId,
        name: req.body.name,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        category: req.body.category
    });
    await task.save();
    res.status(201).send();
});

// 编辑任务
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send();
});

// 删除任务
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).send();
});

// 检查认证状态
app.get('/api/check-auth', authenticateToken, (req, res) => {
