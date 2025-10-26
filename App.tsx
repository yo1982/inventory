
import React, { useState, useMemo } from 'react';
import { Product, Sale, Purchase, Expense, View } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Purchases from './components/Purchases';
import Expenses from './components/Expenses';
import Reports from './components/Reports';

// Sample Data
const sampleProducts: Product[] = [
  { id: 'p1', name: 'ثلاجة ديجيتال', sku: 'LG-REF-001', quantity: 15, purchasePrice: 1500, actualUnitCost: 1550, salePrice: 2200 },
  { id: 'p2', name: 'غسالة أوتوماتيك', sku: 'SAM-WSH-002', quantity: 25, purchasePrice: 1200, actualUnitCost: 1240, salePrice: 1800 },
  { id: 'p3', name: 'ميكروويف 30 لتر', sku: 'SHP-MW-003', quantity: 40, purchasePrice: 300, actualUnitCost: 315, salePrice: 450 },
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [products, setProducts] = useLocalStorage<Product[]>('products', sampleProducts);
  const [sales, setSales] = useLocalStorage<Sale[]>('sales', []);
  const [purchases, setPurchases] = useLocalStorage<Purchase[]>('purchases', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);

  const renderView = () => {
    const props = { products, setProducts, sales, setSales, purchases, setPurchases, expenses, setExpenses };
    switch (view) {
      case 'dashboard':
        return <Dashboard {...props} />;
      case 'inventory':
        return <Inventory products={products} setProducts={setProducts} sales={sales} purchases={purchases} />;
      case 'sales':
        return <Sales {...props} />;
      case 'purchases':
        return <Purchases {...props} />;
      case 'expenses':
        return <Expenses expenses={expenses} setExpenses={setExpenses} />;
      case 'reports':
        return <Reports {...props} />;
      default:
        return <Dashboard {...props} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
