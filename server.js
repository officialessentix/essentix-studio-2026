const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Product = require('./models/product'); 

const app = express();
app.use(cors());
app.use(express.json());

// 1. VAULT CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ ESSENTIX VAULT CONNECTED"))
    .catch(err => console.error("❌ CONNECTION ERROR:", err));

// 2. DEFINE THE ORDER MODEL (Inside server.js for simplicity)
const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String,
    email: String,
    pincode: String,
    city: String,
    address: String,
    landmark: { type: String, default: "N/A" }, //
    items: Array,
    total: Number,
    status: { type: String, default: "Pending" },
    date: { type: Date, default: Date.now }
}));

// 3. API ROUTES (Define these BEFORE app.listen)

// Get Products (For your Shirts/Tees/Sweats grids)
app.get('/api/products', async (req, res) => {
    try {
        const items = await Product.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: "Vault Access Error" });
    }
});

// Receive Orders (Fixes the "Cannot POST" error)
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true, message: "Order stored in Vault" });
    } catch (err) {
        console.error("Order Save Error:", err);
        res.status(500).send("Vault Error");
    }
});

// 4. START SERVER (Always at the very bottom)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));