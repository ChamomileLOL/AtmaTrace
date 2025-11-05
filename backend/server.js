// backend/server.js

// 1. MUST BE THE FIRST LINE to load .env variables
const dotenv = require('dotenv').config(); 

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
// Import Error Handler middleware
const { errorHandler } = require('./middleware/errorMiddleware');


// Check if MONGO_URI was loaded
if (!process.env.MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI is undefined. Check .env file integrity.");
    process.exit(1); 
}

// Connect to the MongoDB database
connectDB(); 

const app = express();

// --- Middleware ---
// Enable CORS for frontend communication
app.use(cors()); 
// Allows server to accept JSON data
app.use(express.json()); 
// Allows server to accept URL-encoded form data
app.use(express.urlencoded({ extended: false })); 

// --- Placeholder Route ---
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to ĀtmaTrace Backend API' });
});

// --- Application Routes ---
// Thought Routes (The Self Observation Data)
app.use('/api/thoughts', require('./routes/thoughtRoutes'));
// User/Auth Routes (The False Self Login)
app.use('/api/users', require('./routes/userRoutes'));

// --- Error Handling Middleware ---
// MUST be below all other app.use() and routes to catch errors
app.use(errorHandler); 

// --- Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));