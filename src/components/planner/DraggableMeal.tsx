import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { PlannedMeal } from '../../lib/types';
import { useAppContext } from '../../context/AppContext';
import { Utensils, Trash2, GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DraggableMealProps {
  key?: React.Key;
  meal: PlannedMeal;
  isOverlay?: boolean;
  onClick?: (meal: PlannedMeal) => void;
}

export default function DraggableMeal({ meal, isOverlay, onClick }: DraggableMealProps) {
  const { deletePlannedMeal } = useAppContext();
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: meal.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "group relative flex items-center bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border transition-shadow",
        isOverlay ? "border-indigo-500 shadow-lg cursor-grabbing scale-105 z-50" : "border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
        isDragging ? "opacity-40" : "",
        !isOverlay && onClick ? "cursor-pointer" : ""
      )}
      onClick={(e) => {
        if (!isOverlay && onClick) {
          // Prevent drag triggers from firing the click
          onClick(meal);
        }
      }}
    >
      <div 
        {...listeners} 
        {...attributes} 
        className={cn(
          "text-slate-300 hover:text-slate-500 dark:hover:text-slate-400 p-1 -ml-2 cursor-grab active:cursor-grabbing",
          isOverlay ? "cursor-grabbing" : ""
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={16} />
      </div>
      
      <div className="ml-1 flex-1 overflow-hidden">
        <p className="text-xs font-semibold text-slate-800 dark:text-white truncate leading-tight">
          {meal.name}
        </p>
      </div>

      {!isOverlay && (
        <button 
          onClick={() => deletePlannedMeal(meal.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all shrink-0"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
