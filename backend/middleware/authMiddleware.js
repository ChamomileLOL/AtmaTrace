// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Protects routes by checking for a valid JWT in the header
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (it is formatted as 'Bearer TOKEN')
            token = req.headers.authorization.split(' ')[1];

            // Verify token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token payload (excluding the password field)
            req.user = await User.findById(decoded.id).select('-password');

            // If user is found, proceed to the next middleware/controller
            if (!req.user) {
                res.status(401); // Unauthorized
                throw new Error('User not found');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401); // Unauthorized
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };