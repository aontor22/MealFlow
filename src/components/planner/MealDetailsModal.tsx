import React, { useState } from 'react';
import { PlannedMeal } from '../../lib/types';
import { useAppContext } from '../../context/AppContext';
import { X, Trash2, Edit, Clock, Tag } from 'lucide-react';

interface MealDetailsModalProps {
  mealId: string;
  onClose: () => void;
}

export default function MealDetailsModal({ mealId, onClose }: MealDetailsModalProps) {
  const { plannedMeals, recipes, deletePlannedMeal, updatePlannedMeal } = useAppContext();
  
  const meal = plannedMeals.find(m => m.id === mealId);
  const recipe = meal?.recipeId ? recipes.find(r => r.id === meal?.recipeId) : null;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(meal?.name || '');

  if (!meal) return null;

  const handleDelete = () => {
    deletePlannedMeal(meal.id);
    onClose();
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      updatePlannedMeal({ ...meal, name: editName.trim() });
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-start mb-6 shrink-0">
          <div className="flex-1 pr-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{meal.dayOfWeek} • {meal.slot}</p>
            {isEditing ? (
              <div className="flex gap-2 mt-2">
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 font-bold text-lg"
                  autoFocus
                />
                <button onClick={handleSaveEdit} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm">Save</button>
                <button onClick={() => setIsEditing(false)} className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-3 py-1.5 rounded-lg font-bold text-sm">Cancel</button>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{meal.name}</h2>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
          {recipe ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md">
                  <Tag size={12} />
                  <span>{recipe.category}</span>
                </div>
                <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md">
                  <Clock size={12} />
                  <span>{recipe.prepTime}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Ingredients</p>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Steps</p>
                <div className="space-y-4">
                  {recipe.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
                    </div>
                  ))}
                  {recipe.steps.length === 0 && <p className="text-sm text-slate-500 italic">No steps provided.</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">This is a custom meal entry without a detailed recipe.</p>
            </div>
          )}
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Trash2 size={16} /> Delete
          </button>
          
          {!isEditing && (
             <button 
               onClick={() => setIsEditing(true)}
               className="flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
             >
               <Edit size={16} /> Edit Name
             </button>
          )}
        </div>
      </div>
    </div>
  );
}
