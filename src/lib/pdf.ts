import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { GroceryItem } from './types';

// Extend jsPDF interface to avoid TS errors with autotable
interface jsPDFCustom extends jsPDF {
  autoTable: (options: any) => void;
}

export function exportGroceryListToPDF(items: GroceryItem[]) {
  const doc = new jsPDF() as jsPDFCustom;
  
  doc.setFontSize(20);
  doc.text('Grocery List', 14, 22);

  const tableData = items.map((item) => [
    item.purchased ? '[X]' : '[ ]',
    item.name,
    item.category
  ]);

  doc.autoTable({
    startY: 30,
    head: [['Status', 'Item Name', 'Category']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
    styles: { fontSize: 12 },
  });

  doc.save('grocery-list.pdf');
}
