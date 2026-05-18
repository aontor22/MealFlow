import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Recipe, PlannedMeal, GroceryItem, DayOfWeek, MealSlot, Theme } from '../lib/types';

interface AppContextType {
  recipes: Recipe[];
  plannedMeals: PlannedMeal[];
  groceryItems: GroceryItem[];
  theme: Theme;
  
  // Recipes
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  toggleFavoriteRecipe: (id: string) => void;

  // Planned Meals
  addPlannedMeal: (meal: Omit<PlannedMeal, 'id'>) => void;
  updatePlannedMeal: (meal: PlannedMeal) => void;
  deletePlannedMeal: (id: string) => void;
  movePlannedMeal: (mealId: string, newDay: DayOfWeek, newSlot: MealSlot) => void;

  // Grocery List
  generateGroceryList: () => void;
  addGroceryItem: (item: Omit<GroceryItem, 'id'>) => void;
  toggleGroceryItem: (id: string) => void;
  deleteGroceryItem: (id: string) => void;
  clearGroceryList: () => void;

  // Theme
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('mp_recipes');
    return saved ? JSON.parse(saved) : [];
  });

  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>(() => {
    const saved = localStorage.getItem('mp_plannedMeals');
    return saved ? JSON.parse(saved) : [];
  });

  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('mp_groceryItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('mp_theme');
    if (saved) return saved as Theme;
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  });

  useEffect(() => {
    localStorage.setItem('mp_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('mp_plannedMeals', JSON.stringify(plannedMeals));
  }, [plannedMeals]);

  useEffect(() => {
    localStorage.setItem('mp_groceryItems', JSON.stringify(groceryItems));
  }, [groceryItems]);

  useEffect(() => {
    localStorage.setItem('mp_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    setRecipes((prev) => [...prev, { ...recipe, id: uuidv4() }]);
  };

  const updateRecipe = (updatedRecipe: Recipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );
  };

  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    // also remove from planned meals if someone deletes it, or just leave it as custom name
  };

  const toggleFavoriteRecipe = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const addPlannedMeal = (meal: Omit<PlannedMeal, 'id'>) => {
    setPlannedMeals((prev) => [...prev, { ...meal, id: uuidv4() }]);
  };

  const updatePlannedMeal = (meal: PlannedMeal) => {
    setPlannedMeals((prev) =>
      prev.map((m) => (m.id === meal.id ? meal : m))
    );
  };

  const deletePlannedMeal = (id: string) => {
    setPlannedMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const movePlannedMeal = (mealId: string, newDay: DayOfWeek, newSlot: MealSlot) => {
    setPlannedMeals((prev) =>
      prev.map((m) =>
        m.id === mealId ? { ...m, dayOfWeek: newDay, slot: newSlot } : m
      )
    );
  };

  const generateGroceryList = () => {
    const itemsMap = new Map<string, GroceryItem>();

    plannedMeals.forEach((meal) => {
      if (meal.recipeId) {
        const recipe = recipes.find((r) => r.id === meal.recipeId);
        if (recipe && recipe.ingredients) {
          recipe.ingredients.forEach((ing) => {
            const cleanIng = ing.trim();
            if (cleanIng) {
              const key = cleanIng.toLowerCase();
              if (!itemsMap.has(key)) {
                itemsMap.set(key, {
                  id: uuidv4(),
                  name: cleanIng,
                  category: 'Generated', // simple category logic
                  purchased: false,
                });
              }
            }
          });
        }
      }
    });

    const newItems = Array.from(itemsMap.values());
    
    // Merge with existing non-generated or unpurchased non-overlapping items if you want, 
    // but for simplicity let's just append generated ones that aren't already there.
    setGroceryItems((prev) => {
      const combined = [...prev];
      newItems.forEach((newItem) => {
        if (!combined.some(i => i.name.toLowerCase() === newItem.name.toLowerCase())) {
          combined.push(newItem);
        }
      });
      return combined;
    });
  };

  const addGroceryItem = (item: Omit<GroceryItem, 'id'>) => {
    setGroceryItems((prev) => [...prev, { ...item, id: uuidv4() }]);
  };

  const toggleGroceryItem = (id: string) => {
    setGroceryItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, purchased: !i.purchased } : i))
    );
  };

  const deleteGroceryItem = (id: string) => {
    setGroceryItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearGroceryList = () => {
    setGroceryItems([]);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AppContext.Provider
      value={{
        recipes,
        plannedMeals,
        groceryItems,
        theme,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        toggleFavoriteRecipe,
        addPlannedMeal,
        updatePlannedMeal,
        deletePlannedMeal,
        movePlannedMeal,
        generateGroceryList,
        addGroceryItem,
        toggleGroceryItem,
        deleteGroceryItem,
        clearGroceryList,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
