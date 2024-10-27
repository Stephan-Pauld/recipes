import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  referenceUrl: {
    type: String,
    required: false,
  },
  instructions: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Recipe = mongoose.model('Recipe', recipeSchema);