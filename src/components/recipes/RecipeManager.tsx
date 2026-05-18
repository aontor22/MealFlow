import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Plus, Search, Filter, BookOpen } from 'lucide-react';
import RecipeCard from './RecipeCard';
import RecipeForm from './RecipeForm';
import { Recipe } from '../../lib/types';

export default function RecipeManager() {
  const { recipes } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>(undefined);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(recipes.map(r => r.category)))];

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const handeCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecipe(undefined);
  };

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (isFormOpen) {
    return <RecipeForm initialRecipe={editingRecipe} onClose={handeCloseForm} />;
  }

  return (
    <div className="animate-in fade-in duration-300 pb-16 md:pb-0 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recipes</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Manage your favorite meals and ingredients.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2"
        >
          <Plus size={16} /> New Recipe
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm shrink-0">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
          />
        </div>
        <div className="relative sm:w-48 shrink-0">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-indigo-500 font-medium text-sm appearance-none cursor-pointer relative"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pr-2 pb-4 flex-1">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-slate-500 dark:text-slate-400 flex-1 flex flex-col items-center justify-center">
          <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No recipes found</h3>
          <p className="text-sm">We couldn\'t find any recipes matching your search.</p>
          <button 
            onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
            className="text-indigo-600 font-bold text-sm mt-4 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
