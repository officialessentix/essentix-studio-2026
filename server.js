const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Product = require('./models/product'); 

const app = express();
app.use(cors());
app.use(express.json());

// 1. CONNECT TO MONGO
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ VAULT ONLINE"))
    .catch(err => console.error("❌ CONNECTION ERROR:", err));

// 2. DEFINE THE ORDER MODEL [cite: 2026-01-05]
const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String,
    email: String,
    pincode: String,
    city: String,
    address: String,
    landmark: { type: String, default: "N/A" }, // Landmark is optional [cite: 2026-01-05]
    items: Array,
    total: Number,
    status: { type: String, default: "Pending" },
    date: { type: Date, default: Date.now }
}));

// 3. THE ROUTES
app.get('/api/products', async (req, res) => {
    try {
        const items = await Product.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// This specific route stops the "Cannot POST" error
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true });
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));