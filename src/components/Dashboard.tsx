import React from 'react';
import { ViewState } from '../App';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Calendar as CalendarIcon, ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface DashboardProps {
  setCurrentView: (view: ViewState) => void;
}

export default function Dashboard({ setCurrentView }: DashboardProps) {
  const { recipes, plannedMeals, groceryItems } = useAppContext();

  const favoriteCount = recipes.filter(r => r.isFavorite).length;
  const thisWeekCount = plannedMeals.length;
  const unpurchasedCount = groceryItems.filter(i => !i.purchased).length;

  const todayStr = format(new Date(), 'EEEE, MMMM do');

  const stats = [
    { label: 'Total Recipes', value: recipes.length, icon: BookOpen, accent: 'text-indigo-500' },
    { label: 'Favorites', value: favoriteCount, icon: Heart, accent: 'text-pink-500' },
    { label: 'Planned Meals', value: thisWeekCount, icon: CalendarIcon, accent: 'text-emerald-500' },
  ];

  return (
    <div className="animate-in fade-in duration-500 grid flex-1 grid-cols-1 md:grid-cols-12 gap-6 h-full pb-16 md:pb-0">
      
      <header className="col-span-1 md:col-span-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back!</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Today is {todayStr}. What\'s for dinner?</p>
        </div>
        <button 
          onClick={() => setCurrentView('planner')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2"
        >
          Plan Meals <ArrowRight size={16} />
        </button>
      </header>

      {/* Primary Stats - visually taking 3 columns each on large screens */}
      {stats.map((stat, i) => (
        <div key={i} className="col-span-1 md:col-span-4 lg:col-span-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[140px]">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
            <stat.icon className={cn("mb-1", stat.accent)} size={20} />
          </div>
        </div>
      ))}
      
      {/* Prominent Action Card */}
      <div 
        onClick={() => setCurrentView('recipes')}
        className="col-span-1 md:col-span-12 lg:col-span-3 bg-indigo-600 text-white p-5 rounded-3xl shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-4 cursor-pointer hover:bg-indigo-700 transition-colors"
      >
        <div className="bg-white/20 p-3 rounded-2xl">
          <BookOpen strokeWidth={3} size={24} />
        </div>
        <div>
          <p className="font-bold">New Recipe</p>
          <p className="text-xs text-indigo-100">Add your creations</p>
        </div>
      </div>

      <div className="col-span-1 md:col-span-7 lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm min-h-[300px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Recipes</h2>
          <button onClick={() => setCurrentView('recipes')} className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline">
            View all
          </button>
        </div>
        
        <div className="space-y-3 flex-1">
          {recipes.slice(0, 4).length > 0 ? (
            recipes.slice(0, 4).map(recipe => (
              <div key={recipe.id} className="flex justify-between items-center p-3 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/50 border border-indigo-100/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm uppercase">
                    {recipe.name.substring(0,2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight mb-1">{recipe.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{recipe.category} • {recipe.prepTime}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="h-full border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-6">
                <BookOpen size={24} className="mb-2 opacity-50" />
                <p className="text-sm font-medium text-center">No recipes yet.</p>
             </div>
          )}
        </div>
      </div>

      <div className="col-span-1 md:col-span-5 lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[300px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Grocery Needs</h2>
          <button onClick={() => setCurrentView('grocery')} className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline">
            Export PDF
          </button>
        </div>
        
        <div className="flex-1 space-y-2 overflow-y-auto pr-2">
          {groceryItems.filter(i => !i.purchased).slice(0, 6).length > 0 ? (
            groceryItems.filter(i => !i.purchased).slice(0, 6).map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 shrink-0"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{item.name}</span>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-6">
              <ShoppingCart className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm font-medium">Your list is empty!</p>
            </div>
          )}
        </div>
        <button onClick={() => setCurrentView('grocery')} className="mt-4 w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-500 dark:text-slate-400 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          Manage Groceries
        </button>
      </div>
    </div>
  );
}
