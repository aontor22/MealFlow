import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-8 pt-4 pb-4 border-t border-slate-200 dark:border-slate-800 mt-auto shrink-0">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs font-medium text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} MealFlow. Bento Grid styling.
        </p>
      </div>
    </footer>
  );
}
