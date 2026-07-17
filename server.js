const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// CORS को बेहतर तरीके से कॉन्फ़िगर किया
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// मेमोरी में डेटा रखने के लिए (ध्यान रहे: सर्वर रीस्टार्ट होने पर ये डिलीट हो जाएगा)
const users = []; 

// रूट होम चेक करने के लिए
app.get('/', (req, res) => {
    res.send("Server is running perfectly!");
});

app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password are required" });
    }

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

// पोर्ट सेटिंग: Render के लिए सबसे सुरक्षित तरीका
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🟢 Backend is live and running on port ${PORT}`);
});
