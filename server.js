const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// लाइव सर्वर पर सभी डोमेन्स को अलाउ करने के लिए CORS कॉन्फ़िगरेशन
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

const users = []; 

app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, error: "Email address is already registered!" });
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
        res.status(401).json({ success: false, error: "Invalid email or password!" });
    }
});

app.post('/api/traffic-control', (req, res) => {
    const { url, action } = req.body;
    res.json({ 
        success: true, 
        message: `Campaign ${action} initialized for ${url}`,
        activeBots: action === 'start' ? 148 : 0
    });
});

// लाइव क्लाउड होस्टिंग dynamic पोर्ट्स यूज़ करती है, इसलिए PORT की सेटिंग बदली
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🟢 Backend is live and running on port ${PORT}`);
});
