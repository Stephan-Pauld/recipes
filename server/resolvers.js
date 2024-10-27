import { Recipe } from './models/Recipe.js';
import { Category } from './models/Category.js';
import { User } from './models/User.js';
import { Comment } from './models/Comment.js';
import { generateToken, requireAuth } from './utils/auth.js';
import mongoose from 'mongoose';

export const resolvers = {
  Query: {
    me: requireAuth((_, __, { user }) => {
      return User.findById(user.id);
    }),

    recipes: async (_, { search }) => {
      try {
        let query = {};

        if (search) {
          const searchRegex = new RegExp(search, 'i');

          // Find users matching the search term
          const users = await User.find({ username: searchRegex });
          const userIds = users.map(user => user._id);

          // Find categories matching the search term
          const categories = await Category.find({ name: searchRegex });
          const categoryIds = categories.map(cat => cat._id);

          query.$or = [
            { title: searchRegex },
            { ingredients: searchRegex },
            { tags: searchRegex },
            { instructions: searchRegex },
            { user: { $in: userIds } },
            { category: { $in: categoryIds } }
          ];
        }

        return await Recipe.find(query)
          .populate('category')
          .populate('user', '-password')
          .sort({ createdAt: -1 })
          .exec();
      } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }
    },

    // ... rest of the resolvers remain the same ...
  },
  // ... rest of the file remains the same ...
};