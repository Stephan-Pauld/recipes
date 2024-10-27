import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import RecipeForm from './components/RecipeForm';
import { BookOpen } from 'lucide-react';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-amber-50">
        <header className="bg-amber-700 text-amber-50 p-6 shadow-lg">
          <div className="container mx-auto flex items-center gap-3">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Family Recipe Collection</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <RecipeForm />
          </div>
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;