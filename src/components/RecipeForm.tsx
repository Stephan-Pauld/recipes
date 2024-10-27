import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Plus, Loader2 } from 'lucide-react';

const CREATE_RECIPE = gql`
  mutation CreateRecipe($title: String!, $referenceUrl: String, $instructions: String!, $story: String) {
    createRecipe(
      title: $title
      referenceUrl: $referenceUrl
      instructions: $instructions
      story: $story
    ) {
      id
      title
    }
  }
`;

function RecipeForm() {
  const [formData, setFormData] = useState({
    title: '',
    referenceUrl: '',
    instructions: '',
    story: '',
  });
  const [error, setError] = useState('');

  const [createRecipe, { loading }] = useMutation(CREATE_RECIPE, {
    onCompleted: () => {
      setFormData({ title: '', referenceUrl: '', instructions: '', story: '' });
      setError('');
      alert('Recipe added successfully!');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      setError('Failed to add recipe. Please try again later.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createRecipe({ variables: formData });
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="h-6 w-6 text-amber-700" />
        <h2 className="text-2xl font-semibold text-gray-800">Add New Recipe</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Recipe Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            placeholder="Grandma's Famous Chocolate Cake"
          />
        </div>

        <div>
          <label htmlFor="referenceUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Reference URL (optional)
          </label>
          <input
            type="url"
            id="referenceUrl"
            name="referenceUrl"
            value={formData.referenceUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            placeholder="https://example.com/recipe"
          />
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
            Instructions *
          </label>
          <textarea
            id="instructions"
            name="instructions"
            required
            value={formData.instructions}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            placeholder="Enter detailed recipe instructions..."
          />
        </div>

        <div>
          <label htmlFor="story" className="block text-sm font-medium text-gray-700 mb-1">
            Story or Additional Notes (optional)
          </label>
          <textarea
            id="story"
            name="story"
            value={formData.story}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            placeholder="Share the story behind this recipe..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Adding Recipe...
            </>
          ) : (
            'Add Recipe'
          )}
        </button>
      </form>
    </div>
  );
}

export default RecipeForm;