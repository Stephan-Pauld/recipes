import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import {
  ArrowLeft,
  Clock,
  User,
  Tag as TagIcon,
  Link as LinkIcon,
} from "lucide-react";
import Comments from "./Comments";

const GET_RECIPE = gql`
  query GetRecipe($id: ID!) {
    recipe(id: $id) {
      id
      title
      category {
        name
      }
      user {
        username
      }
      tags
      ingredients
      instructions
      referenceUrl
      createdAt
    }
  }
`;

function RecipeDetails() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_RECIPE, {
    variables: { id },
  });

  const cleanIngredientText = (text: string) => {
    return text
      .split("\n")
      .map((line) => line.trim().replace(/^[-•*]\s*/, ""))
      .filter((line) => line.length > 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">Error loading recipe: {error.message}</p>
        </div>
      </div>
    );
  }

  const { recipe } = data;
  const ingredients = cleanIngredientText(recipe.ingredients);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-6 group transition-colors"
      >
        <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
        <span>Back to Recipes</span>
      </Link>

      {/* Recipe header */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-8 text-white">
          <h1 className="text-3xl font-serif font-bold mb-4">{recipe.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-amber-100">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{recipe.user.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-white text-sm">
              {recipe.category.name}
            </span>
          </div>
        </div>

        {/* Recipe content */}
        <div className="p-6">
          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TagIcon className="h-5 w-5 text-amber-600" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Ingredients
            </h2>
            <div className="prose prose-amber max-w-none">
              <ul className="list-disc pl-5 space-y-1">
                {ingredients.map((ingredient: string, index: number) => (
                  <li key={index} className="text-gray-700">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Instructions
            </h2>
            <div className="prose prose-amber max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">
                {recipe.instructions}
              </p>
            </div>
          </div>

          {/* Reference URL */}
          {recipe.referenceUrl && (
            <div className="pt-6 border-t border-gray-200">
              <a
                href={recipe.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
              >
                <LinkIcon className="h-4 w-4" />
                <span>View Reference</span>
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          <Comments recipeId={recipe.id} />
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
