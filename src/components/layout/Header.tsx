import React from 'react';
import { Utensils, Calendar, BookOpen, ShoppingCart, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { ViewState } from '../../App';
import { cn } from '../../lib/utils';

interface HeaderProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

export default function Header({ currentView, setCurrentView }: HeaderProps) {
  const { theme, toggleTheme } = useAppContext();

  const navItems = [
    { id: 'dashboard' as ViewState, label: 'Dashboard', icon: Utensils },
    { id: 'planner' as ViewState, label: 'Weekly Planner', icon: Calendar },
    { id: 'recipes' as ViewState, label: 'Recipes', icon: BookOpen },
    { id: 'grocery' as ViewState, label: 'Grocery List', icon: ShoppingCart },
  ];

  return (
    <>
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col p-6 shrink-0">
        <div 
          className="flex items-center gap-3 mb-10 cursor-pointer" 
          onClick={() => setCurrentView('dashboard')}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">M</div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MealFlow</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "flex justify-start items-center gap-3 px-4 py-3 w-full rounded-xl transition-colors font-semibold text-sm",
                currentView === item.id
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                  : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors font-semibold text-sm box-border"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </aside>
      
      {/* Mobile Top Header (Minimal) */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">M</div>
          <span>MealFlow</span>
        </div>
        <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-2 z-50 pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={cn(
              "flex flex-col items-center p-2 rounded-xl text-[10px] font-semibold gap-1",
              currentView === item.id
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
