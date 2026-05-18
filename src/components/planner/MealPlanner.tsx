import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { DndContext, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { DAYS_OF_WEEK, MealSlot, PlannedMeal } from '../../lib/types';
import DayColumn from './DayColumn';
import DraggableMeal from './DraggableMeal';
import AddMealModal from './AddMealModal';
import MealDetailsModal from './MealDetailsModal';

const MEAL_SLOTS: MealSlot[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export default function MealPlanner() {
  const { plannedMeals, movePlannedMeal } = useAppContext();
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [modalTargetDay, setModalTargetDay] = useState<typeof DAYS_OF_WEEK[number]>('Monday');
  const [modalTargetSlot, setModalTargetSlot] = useState<MealSlot>('Dinner');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (over) {
      const [newDay, newSlot] = String(over.id).split('-');
      
      const meal = plannedMeals.find(m => m.id === active.id);
      if (meal && (meal.dayOfWeek !== newDay || meal.slot !== newSlot)) {
        movePlannedMeal(meal.id, newDay as any, newSlot as MealSlot);
      }
    }
  };

  const openAddModal = (day: typeof DAYS_OF_WEEK[number], slot: MealSlot) => {
    setModalTargetDay(day);
    setModalTargetSlot(slot);
    setIsAddModalOpen(true);
  };

  const activeMeal = activeId ? plannedMeals.find(m => m.id === activeId) : null;

  return (
    <div className="animate-in fade-in duration-300 pb-16 md:pb-0 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">This Week's Schedule</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Drag and drop meals to organize your week.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 h-full snap-x snap-mandatory hide-scrollbar">
            {DAYS_OF_WEEK.map((day) => (
              <DayColumn 
                key={day} 
                day={day} 
                slots={MEAL_SLOTS} 
                meals={plannedMeals.filter(m => m.dayOfWeek === day)} 
                onAddClick={openAddModal}
                onMealClick={(meal) => setSelectedMealId(meal.id)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeMeal ? <DraggableMeal meal={activeMeal} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {isAddModalOpen && (
        <AddMealModal 
          day={modalTargetDay} 
          slot={modalTargetSlot} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}

      {selectedMealId && (
        <MealDetailsModal 
          mealId={selectedMealId}
          onClose={() => setSelectedMealId(null)}
        />
      )}
    </div>
  );
}
