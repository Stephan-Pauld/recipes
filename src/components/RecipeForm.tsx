import React, { useState, useCallback } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Plus,
  Loader2,
  Tags,
  X,
  ChefHat,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

const CREATE_RECIPE = gql`
  mutation CreateRecipe(
    $title: String!
    $categoryId: ID!
    $tags: [String!]!
    $ingredients: String!
    $instructions: String!
    $referenceUrl: String
  ) {
    createRecipe(
      title: $title
      categoryId: $categoryId
      tags: $tags
      ingredients: $ingredients
      instructions: $instructions
      referenceUrl: $referenceUrl
    ) {
      id
      title
      category {
        id
        name
      }
      tags
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
    }
  }
`;

function RecipeForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    ingredients: "",
    instructions: "",
    referenceUrl: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [error, setError] = useState("");

  const {
    data: categoriesData,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useQuery(GET_CATEGORIES);

  const [createRecipe, { loading: recipeLoading }] = useMutation(
    CREATE_RECIPE,
    {
      onCompleted: () => {
        toast.success("Recipe added successfully!");
        navigate("/");
      },
      onError: (error) => {
        console.error("Mutation error:", error);
        toast.error(error.message || "Failed to add recipe");
        setError(
          error.message || "Failed to add recipe. Please try again later."
        );
      },
    }
  );

  const [createCategory, { loading: categoryLoading }] = useMutation(
    CREATE_CATEGORY,
    {
      onCompleted: async (data) => {
        await refetchCategories();
        setFormData({ ...formData, categoryId: data.createCategory.id });
        setNewCategory("");
        setShowNewCategoryInput(false);
        toast.success("Category added successfully!");
      },
      onError: (error) => {
        console.error("Category creation error:", error);
        toast.error(error.message || "Failed to create category");
        setError(
          error.message || "Failed to create category. Please try again."
        );
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.categoryId && !showNewCategoryInput) {
      setError("Please select a category");
      return;
    }

    if (tags.length === 0) {
      setError("Please add at least one tag");
      return;
    }

    try {
      await createRecipe({
        variables: {
          ...formData,
          tags,
          referenceUrl: formData.referenceUrl || undefined,
        },
      });
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "categoryId" && value === "new") {
      setShowNewCategoryInput(true);
      return;
    }

    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError("Category name cannot be empty");
      return;
    }
    try {
      await createCategory({ variables: { name: newCategory.trim() } });
    } catch (err) {
      console.error("Add category error:", err);
    }
  };

  const handleIngredientsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let value = e.target.value;
    const lines = value.split("\n");

    const processedLines = lines.map((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("• ")) {
        return "• " + trimmedLine;
      }
      return line;
    });

    setFormData({ ...formData, ingredients: processedLines.join("\n") });
  };

  const handleIngredientsKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const cursorPosition = textarea.selectionStart;
      const currentValue = textarea.value;

      const newValue =
        currentValue.slice(0, cursorPosition) +
        "\n• " +
        currentValue.slice(cursorPosition);

      setFormData({ ...formData, ingredients: newValue });

      setTimeout(() => {
        textarea.selectionStart = cursorPosition + 3;
        textarea.selectionEnd = cursorPosition + 3;
      }, 0);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim()) {
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
        toast.success(`Tag "${currentTag.trim()}" added!`, { duration: 2000 });
      } else {
        toast.error("Tag already exists!", { duration: 2000 });
      }
      setCurrentTag("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (index: number) => {
    const removedTag = tags[index];
    setTags(tags.filter((_, i) => i !== index));
    toast("Tag removed", {
      icon: "🗑️",
      duration: 2000,
    });
  };

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-200 rounded-full filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-3/4 right-1/4 w-32 h-32 bg-amber-300 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
        {/* Header gradient */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-xl shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Recipe
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Title input with floating label */}
            <div className="relative">
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="block w-full px-4 py-3 text-lg border-2 border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 peer placeholder-transparent"
                placeholder="Recipe Title"
              />
              <label
                htmlFor="title"
                className="absolute left-4 -top-2.5 bg-white px-2 text-sm text-amber-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-amber-600 peer-focus:text-sm"
              >
                Recipe Title
              </label>
            </div>

            {/* Category selection with animated dropdown */}
            <div className="relative">
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category *
              </label>
              <div className="space-y-3">
                <select
                  id="categoryId"
                  name="categoryId"
                  required={!showNewCategoryInput}
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                  disabled={showNewCategoryInput}
                >
                  <option value="">Select a category</option>
                  {categoriesData?.categories.map(
                    (category: { id: string; name: string }) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    )
                  )}
                  <option value="new">+ Add New Category</option>
                </select>

                {showNewCategoryInput && (
                  <div className="flex gap-2 animate-fade-in">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category name"
                      className="flex-1 px-4 py-2 border-2 border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={categoryLoading}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      {categoryLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <ChefHat className="h-5 w-5" />
                      )}
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategoryInput(false);
                        setNewCategory("");
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags input with animated chips */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tags *
              </label>
              <div className="space-y-2">
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      id="tags"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="w-full pl-4 pr-12 py-3 border-2 border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      placeholder="Add tags (e.g., spicy, vegetarian, quick)"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                      press Enter
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-5 w-5" />
                    Add Tag
                  </button>
                </div>

                {/* Tags display with enhanced animations */}
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200 shadow-sm group hover:shadow-md transition-all duration-300 animate-fade-in"
                    >
                      <span className="flex items-center">
                        <Tags className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                        {tag}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="ml-2 p-0.5 hover:bg-amber-200 rounded-full focus:outline-none group-hover:text-amber-600 transition-colors duration-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Helper text */}
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs">
                    <i>i</i>
                  </span>
                  Add descriptive tags to help others find your recipe
                </p>
              </div>
            </div>

            {/* Reference URL input with icon */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                id="referenceUrl"
                name="referenceUrl"
                value={formData.referenceUrl}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                placeholder="https://example.com/recipe"
              />
            </div>

            {/* Ingredients textarea with bullet points */}
            <div>
              <label
                htmlFor="ingredients"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ingredients List *
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                required
                value={formData.ingredients}
                onChange={handleIngredientsChange}
                onKeyDown={handleIngredientsKeyDown}
                rows={6}
                className="w-full px-4 py-3 border-2 border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 font-mono"
                placeholder="• 2 cups flour&#10;• 1 cup sugar&#10;• 1 tsp vanilla extract"
              />
            </div>

            {/* Instructions textarea */}
            <div>
              <label
                htmlFor="instructions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cooking Instructions *
              </label>
              <textarea
                id="instructions"
                name="instructions"
                required
                value={formData.instructions}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border-2 border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter step-by-step cooking instructions..."
              />
            </div>
          </div>

          {/* Submit button with loading state */}
          <button
            type="submit"
            disabled={recipeLoading || categoryLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group"
          >
            {recipeLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Adding Recipe...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 transition-transform group-hover:rotate-180" />
                Add Recipe
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;
