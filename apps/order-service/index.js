const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_electronics_key';

// Authentication Verification Middleware
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Login required to access checkout" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired session token" });
        req.user = user;
        next();
    });
};

app.post('/api/orders', authenticate, async (req, res) => {
    const { productId, quantity, amount } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO orders (user_email, product_id, quantity, total_amount) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.email, productId, quantity, amount]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5002, () => console.log('Order processor ready on port 5002'));