const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_electronics_key';

// Mock user store for local setup
const users = [];

app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;
    users.push({ email, password });
    res.status(21).json({ message: "User registered successfully" });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
});

app.listen(5000, () => console.log('Auth service spinning on port 5000'));