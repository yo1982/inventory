
import React from 'react';
import { View } from '../types';
import { ChartBarIcon, CubeIcon, ShoppingCartIcon, TruckIcon, DocumentTextIcon, BanknotesIcon, HomeIcon } from './common/Icons';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: 'dashboard', label: 'الرئيسية', icon: <HomeIcon /> },
    { view: 'inventory', label: 'المخزون', icon: <CubeIcon /> },
    { view: 'purchases', label: 'المشتريات', icon: <TruckIcon /> },
    { view: 'sales', label: 'المبيعات', icon: <ShoppingCartIcon /> },
    { view: 'expenses', label: 'المصروفات', icon: <BanknotesIcon /> },
    { view: 'reports', label: 'التقارير', icon: <ChartBarIcon /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">نظامي المحاسبي</h1>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.view} className="px-4">
              <button
                onClick={() => setView(item.view)}
                className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                  currentView === item.view
                    ? 'bg-blue-500 text-white shadow'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <span className="w-6 h-6">{item.icon}</span>
                <span className="mx-4 font-semibold">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
