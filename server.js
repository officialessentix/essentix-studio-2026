const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// IMPORT MODEL (Ensure your file is in /models/Product.js)
const Product = require('./models/product'); 

const app = express();
app.use(cors());
app.use(express.json());

// --- THE BRIDGE TO YOUR VAULT ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ ESSENTIX VAULT CONNECTED SUCCESSFULLY"))
    .catch(err => console.error("❌ CONNECTION ERROR:", err));

// THE API ROUTE (This sends the 30 items to your phone/website)
app.get('/api/products', async (req, res) => {
    try {
        const items = await Product.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: "Vault Access Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));