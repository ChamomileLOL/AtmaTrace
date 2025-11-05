// backend/routes/thoughtRoutes.js
const express = require('express');
const router = express.Router();
const { addThought, getThoughts } = require('../controllers/thoughtController');
const { protect } = require('../middleware/authMiddleware'); // <-- NEW IMPORT

// Protect all thought routes
router.post('/', protect, addThought); // <-- PROTECTED
router.get('/', protect, getThoughts);  // <-- PROTECTED

module.exports = router;