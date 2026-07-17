const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.use(express.static(__dirname));

const users = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password required" });
    }
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, error: "User already exists" });
    }
    const role = users.length === 0 ? 'admin' : 'user';
    users.push({ email, password, role });
    res.json({ success: true, message: "Registration successful!" });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true, user: { email: user.email, role: user.role } });
    } else {
        res.status(401).json({ success: false, error: "Invalid email or password" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is live and running on port ${PORT}`);
});
