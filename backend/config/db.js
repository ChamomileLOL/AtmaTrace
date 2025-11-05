// backend/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // The connection string is retrieved securely from the .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: The MONGO_URI is not defined or connection failed: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;