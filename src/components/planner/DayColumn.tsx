import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DayOfWeek, MealSlot, PlannedMeal } from '../../lib/types';
import DraggableMeal from './DraggableMeal';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SlotDropzoneProps {
  key?: React.Key;
  day: DayOfWeek;
  slot: MealSlot;
  meals: PlannedMeal[];
  onAddClick: (day: DayOfWeek, slot: MealSlot) => void;
  onMealClick?: (meal: PlannedMeal) => void;
}

function SlotDropzone({ day, slot, meals, onAddClick, onMealClick }: SlotDropzoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${day}-${slot}`,
  });

  const slotMeals = meals.filter(m => m.slot === slot);

  // Subtle colors based on slot for visual hierarchy
  const slotColors: Record<string, string> = {
    'Breakfast': 'text-orange-600 bg-orange-50/50 dark:bg-orange-950/20',
    'Lunch': 'text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20',
    'Dinner': 'text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20',
    'Snacks': 'text-pink-600 bg-pink-50/50 dark:bg-pink-950/20'
  };

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "min-h-[100px] p-3 rounded-2xl transition-colors border",
        slotColors[slot] || "bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-800",
        isOver ? "border-indigo-400 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/30" : "border-slate-100 dark:border-slate-800"
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <span className={cn("text-[9px] font-bold uppercase tracking-widest", (slotColors[slot] || "").split(' ')[0])}>{slot}</span>
        <button 
          onClick={() => onAddClick(day, slot)}
          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1 bg-white/50 dark:bg-slate-800/50 rounded flex items-center justify-center shrink-0"
        >
          <Plus size={12} strokeWidth={3} />
        </button>
      </div>
      
      <div className="space-y-2">
        {slotMeals.map(meal => (
          <DraggableMeal key={meal.id} meal={meal} onClick={onMealClick} />
        ))}
        {slotMeals.length === 0 && !isOver && (
          <div className="h-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center opacity-40">
             <Plus size={14} className="text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
}

export interface DayColumnProps {
  key?: React.Key;
  day: DayOfWeek;
  slots: MealSlot[];
  meals: PlannedMeal[];
  onAddClick: (day: DayOfWeek, slot: MealSlot) => void;
  onMealClick?: (meal: PlannedMeal) => void;
}

export default function DayColumn({ day, slots, meals, onAddClick, onMealClick }: DayColumnProps) {
  return (
    <div className="flex-col gap-3 min-w-[260px] snap-center flex overflow-hidden">
      <div className="text-center mb-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day.substring(0,3)}</p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{day}</p>
      </div>
      <div className="space-y-3 flex-1 flex flex-col overflow-y-auto pr-1">
        {slots.map(slot => (
          <SlotDropzone key={slot} day={day} slot={slot} meals={meals} onAddClick={onAddClick} onMealClick={onMealClick} />
        ))}
      </div>
    </div>
  );
}
