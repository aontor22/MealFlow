import React, { useState } from 'react';
import { Recipe } from '../../lib/types';
import { X, Plus, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface RecipeFormProps {
  initialRecipe?: Recipe;
  onClose: () => void;
}

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Other'];

export default function RecipeForm({ initialRecipe, onClose }: RecipeFormProps) {
  const { addRecipe, updateRecipe } = useAppContext();
  
  const [name, setName] = useState(initialRecipe?.name || '');
  const [category, setCategory] = useState(initialRecipe?.category || CATEGORIES[0]);
  const [prepTime, setPrepTime] = useState(initialRecipe?.prepTime || '');
  
  const [ingredients, setIngredients] = useState<string[]>(initialRecipe?.ingredients || ['']);
  const [steps, setSteps] = useState<string[]>(initialRecipe?.steps || ['']);

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empties
    const validIngredients = ingredients.map(i => i.trim()).filter(Boolean);
    const validSteps = steps.map(s => s.trim()).filter(Boolean);

    if (!name.trim()) {
      alert("Recipe name is required");
      return;
    }

    const recipeData = {
      name: name.trim(),
      category,
      prepTime: prepTime.trim() || 'N/A',
      ingredients: validIngredients,
      steps: validSteps,
      isFavorite: initialRecipe?.isFavorite || false,
    };

    if (initialRecipe) {
      updateRecipe({ ...recipeData, id: initialRecipe.id });
    } else {
      addRecipe(recipeData);
    }
    onClose();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-bold">{initialRecipe ? 'Edit Recipe' : 'New Recipe'}</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Detail out your ingredients and steps.</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recipe Name *</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
              placeholder="e.g. Spaghetti Bolognese"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 transition-colors font-medium cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Prep & Cook Time</label>
            <input 
              type="text" 
              value={prepTime}
              onChange={e => setPrepTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
              placeholder="e.g. 30 mins"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ingredients</label>
            <button type="button" onClick={() => setIngredients([...ingredients, ''])} className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline">
              <Plus size={14} strokeWidth={3} /> Add Item
            </button>
          </div>
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2">
              <input 
                type="text" 
                value={ing}
                onChange={e => handleIngredientChange(idx, e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 transition-colors font-medium text-sm"
                placeholder="e.g. 2 cups of flour"
              />
              <button 
                type="button" 
                onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-xl border border-transparent hover:bg-red-50 dark:hover:bg-red-900/20"
                disabled={ingredients.length === 1}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cooking Steps</label>
            <button type="button" onClick={() => setSteps([...steps, ''])} className="text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline">
              <Plus size={14} strokeWidth={3} /> Add Step
            </button>
          </div>
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="shrink-0 w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold mt-1 text-slate-500">
                {idx + 1}
              </span>
              <textarea 
                value={step}
                onChange={e => handleStepChange(idx, e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 transition-colors resize-none font-medium text-sm"
                placeholder="Describe this step..."
                rows={2}
              />
              <button 
                type="button" 
                onClick={() => setSteps(steps.filter((_, i) => i !== idx))}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0 items-start self-start rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                disabled={steps.length === 1}
              >
                <Trash2 size={20} className="mt-1" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-6 flex gap-3 justify-end border-t border-slate-100 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 pb-4">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors text-sm">
            {initialRecipe ? 'Save Changes' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}
