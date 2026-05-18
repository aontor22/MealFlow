import React from 'react';
import { Recipe } from '../../lib/types';
import { Clock, Tag, Heart, Edit, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppContext } from '../../context/AppContext';

interface RecipeCardProps {
  key?: React.Key;
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onEdit }: RecipeCardProps) {
  const { toggleFavoriteRecipe, deleteRecipe } = useAppContext();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-800 group relative flex flex-col h-[280px]">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">{recipe.name}</h3>
          <button 
            onClick={() => toggleFavoriteRecipe(recipe.id)}
            className="text-slate-300 hover:text-pink-500 transition-colors shrink-0 mt-1"
          >
            <Heart size={20} className={cn(recipe.isFavorite ? "fill-pink-500 text-pink-500" : "")} />
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md">
            <Tag size={12} />
            <span>{recipe.category}</span>
          </div>
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md mb-2 sm:mb-0">
            <Clock size={12} />
            <span>{recipe.prepTime}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ingredients ({recipe.ingredients.length})</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {recipe.ingredients.join(' • ')}
          </p>
        </div>
      </div>
      
      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity top-0 left-0 w-full h-full bg-white/70 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center gap-4">
        <button 
          onClick={() => onEdit(recipe)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-2xl shadow-lg transition-transform hover:scale-105"
        >
          <Edit size={20} />
        </button>
        <button 
          onClick={() => {
            if(window.confirm('Are you sure you want to delete this recipe?')) {
              deleteRecipe(recipe.id);
            }
          }}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl shadow-lg transition-transform hover:scale-105"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
