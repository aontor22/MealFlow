export type Recipe = {
  id: string;
  name: string;
  category: string;
  prepTime: string;
  ingredients: string[];
  steps: string[];
  isFavorite: boolean;
};

export type MealSlot = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
] as const;
export type DayOfWeek = typeof DAYS_OF_WEEK[number];

export type PlannedMeal = {
  id: string;
  dayOfWeek: DayOfWeek;
  slot: MealSlot;
  name: string;
  recipeId?: string;
};

export type GroceryItem = {
  id: string;
  name: string;
  category: string;
  purchased: boolean;
};

export type AppData = {
  recipes: Recipe[];
  plannedMeals: PlannedMeal[];
  groceryItems: GroceryItem[];
};

export type Theme = 'light' | 'dark';
