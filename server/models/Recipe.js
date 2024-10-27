import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: {
    type: [String],
    default: [],
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  referenceUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add individual field indexes for better search performance
recipeSchema.index({ title: 1 });
recipeSchema.index({ ingredients: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ instructions: 1 });
recipeSchema.index({ category: 1 });
recipeSchema.index({ user: 1 });
recipeSchema.index({ createdAt: -1 });

export const Recipe = mongoose.model('Recipe', recipeSchema);