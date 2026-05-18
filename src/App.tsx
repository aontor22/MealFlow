/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './components/Dashboard';
import MealPlanner from './components/planner/MealPlanner';
import RecipeManager from './components/recipes/RecipeManager';
import GroceryList from './components/grocery/GroceryList';

export type ViewState = 'dashboard' | 'planner' | 'recipes' | 'grocery';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  return (
    <AppProvider>
      <div className="h-screen w-full bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col md:flex-row font-sans overflow-hidden">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
            {currentView === 'planner' && <MealPlanner />}
            {currentView === 'recipes' && <RecipeManager />}
            {currentView === 'grocery' && <GroceryList />}
            <Footer />
          </div>
        </main>
      </div>
    </AppProvider>
  );
}
