// backend/server.js

// 1. MUST BE THE FIRST LINE
const dotenv = require('dotenv').config(); 

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Check if MONGO_URI was loaded
if (!process.env.MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI is undefined. Check .env file integrity.");
    // Optionally, use the file system to prove the file exists and read it
    // If you want to debug further, you can add 'fs' here and try reading the file
    process.exit(1); 
}

// Connect to the MongoDB database
connectDB(); 

const app = express();

// --- Middleware ---
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

// --- Placeholder Route ---
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to ĀtmaTrace Backend API' });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Note: The connectDB() function will also fail gracefully if the URI is bad, but this check catches the 'undefined' issue first.