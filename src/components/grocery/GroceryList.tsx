import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ShoppingCart, Check, Plus, Trash2, Printer, Download, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { exportGroceryListToPDF } from '../../lib/pdf';
import { GroceryItem } from '../../lib/types';

export default function GroceryList() {
  const { groceryItems, generateGroceryList, toggleGroceryItem, deleteGroceryItem, addGroceryItem, clearGroceryList } = useAppContext();
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Produce');

  const categories = ['Produce', 'Meat', 'Dairy', 'Pantry', 'Frozen', 'Other', 'Generated'];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addGroceryItem({
      name: newItemName.trim(),
      category: newItemCategory,
      purchased: false,
    });
    setNewItemName('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    exportGroceryListToPDF(groceryItems);
  };

  // Group items by category
  const groupedItems = groceryItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  return (
    <div className="animate-in fade-in duration-300 pb-16 md:pb-0 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Grocery List</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {groceryItems.filter(i => !i.purchased).length} items remaining to buy.
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <button 
            onClick={generateGroceryList}
            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <RefreshCw size={16} /> Auto-Generate
          </button>
          
          {groceryItems.length > 0 && (
            <>
              <button 
                onClick={handlePrint}
                className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <Printer size={16} /> Print
              </button>
              <button 
                onClick={handleExportPDF}
                className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <Download size={16} /> PDF
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 print:shadow-none print:border-none print:p-0 flex-1 flex flex-col">
        <form onSubmit={handleAddItem} className="flex gap-3 mb-8 print:hidden">
          <input 
            type="text" 
            placeholder="Add an item..." 
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
          />
          <select 
            value={newItemCategory}
            onChange={e => setNewItemCategory(e.target.value)}
            className="w-32 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 text-sm font-medium cursor-pointer"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl transition-colors flex items-center justify-center">
            <Plus size={20} />
          </button>
        </form>

        {groceryItems.length > 0 ? (
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {(Object.entries(groupedItems) as [string, GroceryItem[]][]).map(([category, items]) => {
              if (items.length === 0) return null;
              
              return (
                <div key={category} className="print:break-inside-avoid space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">{category}</p>
                  
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleGroceryItem(item.id)}>
                          <div className={cn(
                            "w-5 h-5 flex justify-center items-center rounded-md text-white transition-all shrink-0",
                            item.purchased ? "bg-indigo-600" : "border-2 border-slate-300 dark:border-slate-600"
                          )}>
                            {item.purchased && <Check strokeWidth={4} size={14} />}
                          </div>
                          <span className={cn(
                            "text-sm font-medium transition-all",
                            item.purchased ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-800 dark:text-slate-200"
                          )}>
                            {item.name}
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => deleteGroceryItem(item.id)}
                          className="text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all print:hidden"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="pt-6 print:hidden text-center mt-4">
              <button 
                onClick={() => {
                  if (window.confirm('Clear all grocery items?')) {
                    clearGroceryList();
                  }
                }}
                className="text-slate-400 hover:text-red-500 dark:text-slate-500 font-bold text-xs uppercase tracking-wider"
              >
                Clear entire list
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
            <ShoppingCart size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium mb-6">Your list is empty. Add custom items above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
