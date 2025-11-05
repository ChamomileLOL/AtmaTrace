// backend/models/Thought.js
const mongoose = require('mongoose');

const thoughtSchema = mongoose.Schema(
    {
        // The thought itself ("I feel anxious about tomorrow's meeting.")
        content: {
            type: String,
            required: [true, 'Please add thought content'],
        },
        // The user who logged the thought (required for security and filtering)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true, // Will be required after Auth is setup
            ref: 'User', // Links to the User model (which we will create next)
        },
        // Emotional tag for initial analysis
        emotionTag: {
            type: String,
            required: true,
            enum: ['Joy', 'Fear', 'Anger', 'Calm', 'Neutral', 'Other'],
            default: 'Neutral',
        },
        // Used for Graph Traversal (DSA)
        parentThought: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thought',
            default: null, // The first thought in a sequence has no parent
        },
        // Calculated metric for DSA algorithms
        distanceFromSource: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Thought', thoughtSchema);