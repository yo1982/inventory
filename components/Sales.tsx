
import React, { useState } from 'react';
import { Sale, Product, SaleItem } from '../types';
import Modal from './common/Modal';

interface SalesProps {
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Sales: React.FC<SalesProps> = ({ sales, setSales, products, setProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSale, setNewSale] = useState({ customer: '', date: new Date().toISOString().split('T')[0], promotionCost: '0' });
  const [items, setItems] = useState<SaleItem[]>([{ productId: '', quantity: 1, unitPrice: 0 }]);

  const handleItemChange = (index: number, field: keyof SaleItem, value: string | number) => {
    const newItems = [...items];
    let val = value;
    if (field === 'productId') {
        const product = products.find(p => p.id === value);
        if (product) {
            newItems[index] = { ...newItems[index], unitPrice: product.salePrice };
        }
    }
    
    if (typeof newItems[index][field] === 'number') {
        newItems[index] = { ...newItems[index], [field]: Number(val) };
    } else {
        newItems[index] = { ...newItems[index], [field]: val };
    }
    setItems(newItems);
  };
  
  const addItem = () => setItems([...items, { productId: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleAddSale = () => {
    const promotionCost = parseFloat(newSale.promotionCost) || 0;
    const validItems = items.filter(item => item.productId && item.quantity > 0);

    // Stock check
    for (const item of validItems) {
        const product = products.find(p => p.id === item.productId);
        if (!product || product.quantity < item.quantity) {
            alert(`لا يوجد مخزون كاف لمنتج: ${product?.name}`);
            return;
        }
    }

    const totalAmount = validItems.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId);
        return acc + (product?.salePrice || 0) * item.quantity;
    }, 0);
    
    const totalCostOfGoods = validItems.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId);
        return acc + (product?.actualUnitCost || 0) * item.quantity;
    }, 0);

    const netProfit = totalAmount - totalCostOfGoods - promotionCost;

    const sale: Sale = {
      id: crypto.randomUUID(),
      customer: newSale.customer,
      date: newSale.date,
      items: validItems.map(item => ({...item, unitPrice: products.find(p => p.id === item.productId)?.salePrice || 0 })),
      promotionCost,
      totalAmount,
      netProfit,
      status: 'new'
    };
    
    setSales(prev => [...prev, sale]);

    // Update product quantities
    const updatedProducts = [...products];
    validItems.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
            updatedProducts[productIndex].quantity -= item.quantity;
        }
    });
    setProducts(updatedProducts);
    
    // Reset form
    setIsModalOpen(false);
    setNewSale({ customer: '', date: new Date().toISOString().split('T')[0], promotionCost: '0' });
    setItems([{ productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleShipOrder = (saleId: string) => {
    setSales(prevSales => prevSales.map(s => s.id === saleId ? {...s, status: 'shipped'} : s));
    // Here you would call the Prime API. For now, we just log it.
    console.log(`Order ${saleId} has been sent to Prime for shipping.`);
    alert(`تم إرسال الطلب ${saleId} إلى شركة الشحن Prime.`);
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-700">المبيعات</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 shadow"
        >
          تسجيل عملية بيع
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-right">
            <thead>
                <tr className="bg-gray-100">
                    <th className="p-3 font-semibold text-sm">التاريخ</th>
                    <th className="p-3 font-semibold text-sm">العميل</th>
                    <th className="p-3 font-semibold text-sm">الإجمالي</th>
                    <th className="p-3 font-semibold text-sm">صافي الربح</th>
                    <th className="p-3 font-semibold text-sm">الحالة</th>
                    <th className="p-3 font-semibold text-sm">إجراء</th>
                </tr>
            </thead>
            <tbody>
                {sales.map(sale => (
                <tr key={sale.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{new Date(sale.date).toLocaleDateString('ar-EG')}</td>
                    <td className="p-3 text-sm font-medium">{sale.customer}</td>
                    <td className="p-3 text-sm font-bold text-green-600">{formatCurrency(sale.totalAmount)}</td>
                    <td className="p-3 text-sm font-bold text-blue-600">{formatCurrency(sale.netProfit)}</td>
                    <td className="p-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sale.status === 'shipped' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {sale.status === 'shipped' ? 'تم الشحن' : 'جديد'}
                        </span>
                    </td>
                    <td className="p-3 text-sm">
                        {sale.status !== 'shipped' && (
                            <button onClick={() => handleShipOrder(sale.id)} className="text-purple-600 hover:underline">
                                إرسال للشحن
                            </button>
                        )}
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title="تسجيل عملية بيع جديدة" onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <input type="text" placeholder="اسم العميل" value={newSale.customer} onChange={e => setNewSale({...newSale, customer: e.target.value})} className="w-full p-2 border rounded" />
            <input type="date" value={newSale.date} onChange={e => setNewSale({...newSale, date: e.target.value})} className="w-full p-2 border rounded" />
            
            <h4 className="font-bold mt-4">الأصناف</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 space-x-reverse">
                        <select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-2/3 p-2 border rounded">
                            <option value="">اختر منتج</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input type="number" placeholder="الكمية" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-1/3 p-2 border rounded" />
                        <button onClick={() => removeItem(index)} className="text-red-500 p-2 rounded hover:bg-red-100">X</button>
                    </div>
                ))}
            </div>
            <button onClick={addItem} className="text-sm text-blue-500 hover:underline">+ إضافة صنف آخر</button>
            
            <input type="number" placeholder="تكلفة الترويج/الخصم" value={newSale.promotionCost} onChange={e => setNewSale({...newSale, promotionCost: e.target.value})} className="w-full p-2 border rounded" />
            
            <button onClick={handleAddSale} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              تسجيل البيع
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Sales;
