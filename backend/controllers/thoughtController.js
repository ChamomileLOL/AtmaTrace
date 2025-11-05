// backend/controllers/thoughtController.js (DSA-Integrated Version)
const asyncHandler = require('express-async-handler'); 
const Thought = require('../models/Thought'); 

// Utility function to find the most recent, emotionally related parent thought
const findParentThought = async (userId, emotionTag) => {
    // 1. Search Criteria: Find the most recent thought by the current user.
    // 2. Filter 1: Prioritize thoughts with the same emotion tag.
    // 3. Filter 2: If no emotional match, fall back to the absolute most recent thought.

    let parentThought = null;

    // Attempt 1: Find the most recent thought with a matching emotion tag
    parentThought = await Thought.findOne({ 
        user: userId, 
        emotionTag: emotionTag 
    }).sort({ createdAt: -1 }); // Sort descending by creation time

    if (parentThought) {
        return parentThought;
    }

    // Attempt 2: If no matching emotion found, find the absolute most recent thought
    parentThought = await Thought.findOne({ 
        user: userId 
    }).sort({ createdAt: -1 });

    // If no thought exists at all, parentThought will be null, which is correct (the root node)
    return parentThought; 
};

// @desc    Add a new Thought (Node)
// @route   POST /api/thoughts
// @access  Private
const addThought = asyncHandler(async (req, res) => {
    // User ID is securely accessed from the protect middleware
    const userId = req.user.id; 
    const { content, emotionTag } = req.body;

    if (!content) {
        res.status(400);
        throw new Error('Please add thought content');
    }

    // --- DSA / Graph Traversal Logic ---
    const parent = await findParentThought(userId, emotionTag);

    // Determine parent ID and distance
    const parentThoughtId = parent ? parent._id : null;
    const distanceFromSource = parent ? parent.distanceFromSource + 1 : 0;
    // --- END DSA Logic ---


    const thought = await Thought.create({
        content,
        emotionTag: emotionTag || 'Neutral',
        user: userId, 
        parentThought: parentThoughtId, // <-- LINKED TO PARENT
        distanceFromSource: distanceFromSource, // <-- DISTANCE CALCULATED
    });

    res.status(201).json(thought);
});

// @desc    Get all Thoughts for the authenticated user
// @route   GET /api/thoughts
// @access  Private
const getThoughts = asyncHandler(async (req, res) => {
    const thoughts = await Thought.find({ user: req.user.id })
        .populate('parentThought') // Fetch the actual parent thought object
        .sort({ createdAt: -1 });

    res.status(200).json(thoughts);
});

module.exports = {
    addThought,
    getThoughts,
};