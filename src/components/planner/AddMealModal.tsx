import React, { useState } from 'react';
import { DayOfWeek, MealSlot } from '../../lib/types';
import { useAppContext } from '../../context/AppContext';
import { X, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AddMealModalProps {
  day: DayOfWeek;
  slot: MealSlot;
  onClose: () => void;
}

export default function AddMealModal({ day, slot, onClose }: AddMealModalProps) {
  const { recipes, addPlannedMeal } = useAppContext();
  
  const [tab, setTab] = useState<'recipe' | 'custom'>('recipe');
  const [search, setSearch] = useState('');
  const [customName, setCustomName] = useState('');

  const filteredRecipes = recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddRecipe = (recipeId: string, recipeName: string) => {
    addPlannedMeal({
      dayOfWeek: day,
      slot: slot,
      name: recipeName,
      recipeId: recipeId
    });
    onClose();
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    addPlannedMeal({
      dayOfWeek: day,
      slot: slot,
      name: customName.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Meal</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{day} • {slot}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-6">
          <button 
            className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", tab === 'recipe' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500")}
            onClick={() => setTab('recipe')}
          >
            From Recipes
          </button>
          <button 
            className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", tab === 'custom' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500")}
            onClick={() => setTab('custom')}
          >
            Custom Meal
          </button>
        </div>

        {tab === 'recipe' && (
          <div className="space-y-4">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search your recipes..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-medium"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map(recipe => (
                  <div key={recipe.id} className="flex justify-between items-center p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors bg-slate-50 dark:bg-slate-800/50">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{recipe.name}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{recipe.category}</p>
                    </div>
                    <button 
                      onClick={() => handleAddRecipe(recipe.id, recipe.name)}
                      className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium py-4">No recipes found.</p>
              )}
            </div>
          </div>
        )}

        {tab === 'custom' && (
          <form onSubmit={handleAddCustom} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Meal Name</label>
              <input 
                type="text" 
                placeholder="e.g. Eating out" 
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 transition-colors font-medium text-sm"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-3 rounded-xl transition-colors"
            >
              Add Custom Meal
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
