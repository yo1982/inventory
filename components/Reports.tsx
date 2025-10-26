
import React, { useState, useMemo } from 'react';
import { Product, Sale, Purchase, Expense } from '../types';

interface ReportsProps {
  sales: Sale[];
  expenses: Expense[];
  products: Product[];
}

const Reports: React.FC<ReportsProps> = ({ sales, expenses, products }) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);

  const filteredData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filteredSales = sales.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= start && saleDate <= end;
    });

    const filteredExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= start && expenseDate <= end;
    });

    const totalSales = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalNetProfitOnSales = filteredSales.reduce((sum, s) => sum + s.netProfit, 0);
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const finalNetProfit = totalNetProfitOnSales - totalExpenses;

    return {
      filteredSales,
      filteredExpenses,
      totalSales,
      totalNetProfitOnSales,
      totalExpenses,
      finalNetProfit,
    };
  }, [sales, expenses, startDate, endDate]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-700">التقارير</h2>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center space-x-4 space-x-reverse">
        <label htmlFor="startDate" className="font-semibold">من:</label>
        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border rounded"/>
        <label htmlFor="endDate" className="font-semibold">إلى:</label>
        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border rounded"/>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
              <h4 className="text-blue-800 font-bold">إجمالي المبيعات</h4>
              <p className="text-2xl font-extrabold text-blue-900">{formatCurrency(filteredData.totalSales)}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <h4 className="text-yellow-800 font-bold">أرباح المبيعات</h4>
              <p className="text-2xl font-extrabold text-yellow-900">{formatCurrency(filteredData.totalNetProfitOnSales)}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center">
              <h4 className="text-red-800 font-bold">إجمالي المصروفات</h4>
              <p className="text-2xl font-extrabold text-red-900">{formatCurrency(filteredData.totalExpenses)}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
              <h4 className="text-green-800 font-bold">صافي الربح النهائي</h4>
              <p className="text-2xl font-extrabold text-green-900">{formatCurrency(filteredData.finalNetProfit)}</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">كشف المبيعات</h3>
            <div className="overflow-y-auto max-h-96">
                <table className="w-full text-right">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 font-semibold text-sm">التاريخ</th>
                            <th className="p-2 font-semibold text-sm">العميل</th>
                            <th className="p-2 font-semibold text-sm">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.filteredSales.map(s => (
                            <tr key={s.id} className="border-b">
                                <td className="p-2">{new Date(s.date).toLocaleDateString('ar-EG')}</td>
                                <td className="p-2">{s.customer}</td>
                                <td className="p-2 text-green-600 font-semibold">{formatCurrency(s.totalAmount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">كشف المصروفات</h3>
            <div className="overflow-y-auto max-h-96">
                <table className="w-full text-right">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 font-semibold text-sm">التاريخ</th>
                            <th className="p-2 font-semibold text-sm">الفئة</th>
                            <th className="p-2 font-semibold text-sm">المبلغ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.filteredExpenses.map(e => (
                            <tr key={e.id} className="border-b">
                                <td className="p-2">{new Date(e.date).toLocaleDateString('ar-EG')}</td>
                                <td className="p-2">{e.category}</td>
                                <td className="p-2 text-red-600 font-semibold">{formatCurrency(e.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
