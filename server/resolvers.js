import { Recipe } from './models/Recipe.js';

export const resolvers = {
  Query: {
    recipes: () => Recipe.find(),
    recipe: (_, { id }) => Recipe.findById(id),
  },
  Mutation: {
    createRecipe: async (_, { title, referenceUrl, instructions, story }) => {
      const recipe = new Recipe({
        title,
        referenceUrl,
        instructions,
        story,
      });
      return recipe.save();
    },
  },
};