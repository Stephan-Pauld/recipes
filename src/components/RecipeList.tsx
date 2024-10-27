import React, { useState, useCallback } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Loader2, Utensils, Clock, User, ChefHat, Heart } from "lucide-react";
import SearchBar from "./SearchBar";

const GET_RECIPES = gql`
  query GetRecipes($search: String) {
    recipes(search: $search) {
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
      createdAt
    }
  }
`;

function RecipeList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredRecipe, setHoveredRecipe] = useState<string | null>(null);
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_RECIPES, {
    variables: {
      search: searchTerm,
    },
    fetchPolicy: "cache-and-network",
  });

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(parseInt(dateString));
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const renderContent = useCallback(() => {
    if (error) {
      return (
        <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-fade-in">
          Error loading recipes: {error.message}
        </div>
      );
    }

    if (!loading && !data?.recipes?.length) {
      return (
        <div className="text-center py-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto transform transition-all duration-500 hover:scale-105">
            <div className="relative">
              <div className="bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Utensils className="h-12 w-12 text-amber-600" />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-amber-200 rounded-full filter blur-xl opacity-50 animate-blob" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No recipes found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search"
                : "Get started by adding your first recipe!"}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data?.recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
            onMouseEnter={() => setHoveredRecipe(recipe.id)}
            onMouseLeave={() => setHoveredRecipe(null)}
            onClick={() => handleRecipeClick(recipe.id)}
          >
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.white/10)_1px,transparent_0)] [background-size:16px_16px] opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>

              <div className="relative p-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 text-white mb-4 relative">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 transition-transform duration-300 group-hover:scale-110">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {recipe.user.username}
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                      <Heart
                        className={`h-5 w-5 transition-all duration-300 cursor-pointer ${
                          hoveredRecipe === recipe.id
                            ? "fill-white scale-110"
                            : "scale-100"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                      {recipe.title}
                    </h3>
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-8 bg-gradient-to-b from-amber-300 to-amber-400 rounded-r-full transform transition-all duration-300 group-hover:h-12 group-hover:bg-gradient-to-b group-hover:from-amber-400 group-hover:to-amber-500" />
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200 shadow-sm transition-all duration-300 hover:shadow-md hover:from-amber-200 hover:to-amber-100">
                      <ChefHat className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                      {recipe.category.name}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 shadow-sm hover:bg-amber-100 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mb-6 bg-gradient-to-br from-amber-50/80 to-amber-50/40 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 group-hover:shadow-inner">
                  <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Ingredients
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line pl-4 border-l-2 border-amber-200">
                    {recipe.ingredients}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm pt-4 border-t border-amber-100">
                  <div className="flex items-center text-amber-700 group/time">
                    <Clock className="h-4 w-4 mr-1.5 transition-transform duration-300 group-hover/time:rotate-12" />
                    {formatDate(recipe.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }, [data, loading, error, searchTerm, hoveredRecipe, handleRecipeClick]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-amber-200 rounded-full filter blur-3xl opacity-20" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-amber-300 rounded-full filter blur-3xl opacity-20" />
        </div>

        <h1 className="font-serif text-4xl font-bold text-amber-800 mb-4 relative">
          Kitchen Keepsakes
        </h1>
        <p className="text-lg text-amber-700 max-w-2xl mx-auto">
          Preserving family traditions, one recipe at a time
        </p>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {loading && !data?.recipes && (
        <div className="flex items-center justify-center p-12">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-200 rounded-full filter blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-white p-8 rounded-2xl shadow-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent" />
            </div>
          </div>
        </div>
      )}

      {renderContent()}
    </div>
  );
}

export default RecipeList;
