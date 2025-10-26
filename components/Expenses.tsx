
import React, { useState } from 'react';
import { Expense } from '../types';
import Modal from './common/Modal';

interface ExpensesProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, setExpenses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ date: new Date().toISOString().split('T')[0], category: 'إعلانات', description: '', amount: '' });

  const handleAddExpense = () => {
    const expenseToAdd: Expense = {
      id: crypto.randomUUID(),
      date: newExpense.date,
      category: newExpense.category,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
    };
    setExpenses(prev => [...prev, expenseToAdd]);
    setNewExpense({ date: new Date().toISOString().split('T')[0], category: 'إعلانات', description: '', amount: '' });
    setIsModalOpen(false);
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-700">المصروفات العامة</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 shadow"
        >
          إضافة مصروف
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 font-semibold text-sm">التاريخ</th>
              <th className="p-3 font-semibold text-sm">الفئة</th>
              <th className="p-3 font-semibold text-sm">الوصف</th>
              <th className="p-3 font-semibold text-sm">المبلغ</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-600">{new Date(expense.date).toLocaleDateString('ar-EG')}</td>
                <td className="p-3 text-sm text-gray-800 font-medium">{expense.category}</td>
                <td className="p-3 text-sm text-gray-600">{expense.description}</td>
                <td className="p-3 text-sm text-red-600 font-bold">{formatCurrency(expense.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title="إضافة مصروف جديد" onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <input type="date" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} className="w-full p-2 border rounded" />
            <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="w-full p-2 border rounded">
              <option>إعلانات</option>
              <option>رواتب</option>
              <option>إيجار</option>
              <option>فواتير</option>
              <option>أخرى</option>
            </select>
            <input type="text" placeholder="الوصف" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} className="w-full p-2 border rounded" />
            <input type="number" placeholder="المبلغ" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="w-full p-2 border rounded" />
            <button onClick={handleAddExpense} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              إضافة
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Expenses;
