
import React, { useMemo } from 'react';
import { Product, Sale, Purchase, Expense } from '../types';
import Card from './common/Card';
import { BanknotesIcon, ChartPieIcon, CubeIcon, CurrencyDollarIcon } from './common/Icons';

interface DashboardProps {
  sales: Sale[];
  products: Product[];
  expenses: Expense[];
  purchases: Purchase[];
}

const Dashboard: React.FC<DashboardProps> = ({ sales, products, expenses }) => {

  const stats = useMemo(() => {
    const totalSales = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const netProfit = sales.reduce((acc, sale) => acc + sale.netProfit, 0);
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const inventoryValue = products.reduce((acc, product) => acc + (product.actualUnitCost * product.quantity), 0);
    
    return {
      totalSales,
      netProfit: netProfit - totalExpenses,
      inventoryValue,
      totalExpenses
    };
  }, [sales, products, expenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
  };

  const recentSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-700">لوحة التحكم</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="إجمالي المبيعات" value={formatCurrency(stats.totalSales)} icon={<CurrencyDollarIcon />} color="blue" />
        <Card title="صافي الربح" value={formatCurrency(stats.netProfit)} icon={<ChartPieIcon />} color="green" />
        <Card title="قيمة المخزون" value={formatCurrency(stats.inventoryValue)} icon={<CubeIcon />} color="indigo" />
        <Card title="إجمالي المصروفات" value={formatCurrency(stats.totalExpenses)} icon={<BanknotesIcon />} color="red" />
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-4 text-gray-700">أحدث المبيعات</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 font-semibold text-sm">رقم الطلب</th>
                <th className="p-3 font-semibold text-sm">العميل</th>
                <th className="p-3 font-semibold text-sm">التاريخ</th>
                <th className="p-3 font-semibold text-sm">المبلغ الإجمالي</th>
                <th className="p-3 font-semibold text-sm">صافي الربح</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.length > 0 ? recentSales.map(sale => (
                <tr key={sale.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-600">{sale.id.slice(0, 8)}</td>
                  <td className="p-3 text-sm text-gray-800 font-medium">{sale.customer}</td>
                  <td className="p-3 text-sm text-gray-600">{new Date(sale.date).toLocaleDateString('ar-EG')}</td>
                  <td className="p-3 text-sm text-green-600 font-semibold">{formatCurrency(sale.totalAmount)}</td>
                  <td className="p-3 text-sm text-blue-600 font-semibold">{formatCurrency(sale.netProfit)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">لا توجد مبيعات حديثة.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
