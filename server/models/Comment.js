import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Add index for faster queries
commentSchema.index({ recipe: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

export const Comment = mongoose.model('Comment', commentSchema);