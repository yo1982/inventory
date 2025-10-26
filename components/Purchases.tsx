
import React, { useState } from 'react';
import { Purchase, Product, PurchaseItem } from '../types';
import Modal from './common/Modal';

interface PurchasesProps {
  purchases: Purchase[];
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Purchases: React.FC<PurchasesProps> = ({ purchases, setPurchases, products, setProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPurchase, setNewPurchase] = useState({ supplier: '', date: new Date().toISOString().split('T')[0], shippingCost: '0', customsCost: '0' });
  const [items, setItems] = useState<PurchaseItem[]>([{ productId: '', quantity: 1, unitPrice: 0 }]);

  const handleItemChange = (index: number, field: keyof PurchaseItem, value: string | number) => {
    const newItems = [...items];
    if (typeof newItems[index][field] === 'number') {
        newItems[index] = { ...newItems[index], [field]: Number(value) };
    } else {
        newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { productId: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleAddPurchase = () => {
    const shippingCost = parseFloat(newPurchase.shippingCost) || 0;
    const customsCost = parseFloat(newPurchase.customsCost) || 0;
    const additionalCosts = shippingCost + customsCost;
    
    const validItems = items.filter(item => item.productId && item.quantity > 0 && item.unitPrice > 0);
    const totalItemsValue = validItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    const totalCost = totalItemsValue + additionalCosts;

    const purchase: Purchase = {
      id: crypto.randomUUID(),
      supplier: newPurchase.supplier,
      date: newPurchase.date,
      items: validItems,
      shippingCost,
      customsCost,
      totalCost,
    };
    
    setPurchases(prev => [...prev, purchase]);

    // Update product quantities and actual unit cost
    const updatedProducts = [...products];
    validItems.forEach(item => {
      const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) {
        const product = updatedProducts[productIndex];
        const itemValue = item.unitPrice * item.quantity;
        const costShare = totalItemsValue > 0 ? (itemValue / totalItemsValue) * additionalCosts : 0;
        const costPerUnit = costShare / item.quantity;

        const oldTotalCost = product.actualUnitCost * product.quantity;
        const newTotalCost = item.unitPrice * item.quantity + costShare;
        
        const newQuantity = product.quantity + item.quantity;
        product.actualUnitCost = (oldTotalCost + newTotalCost) / newQuantity;
        product.quantity = newQuantity;
      }
    });
    setProducts(updatedProducts);

    // Reset form
    setIsModalOpen(false);
    setNewPurchase({ supplier: '', date: new Date().toISOString().split('T')[0], shippingCost: '0', customsCost: '0' });
    setItems([{ productId: '', quantity: 1, unitPrice: 0 }]);
  };
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-700">المشتريات</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 shadow"
        >
          تسجيل عملية شراء
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 font-semibold text-sm">التاريخ</th>
              <th className="p-3 font-semibold text-sm">المورد</th>
              <th className="p-3 font-semibold text-sm">عدد الأصناف</th>
              <th className="p-3 font-semibold text-sm">التكلفة الإجمالية</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(purchase => (
              <tr key={purchase.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm">{new Date(purchase.date).toLocaleDateString('ar-EG')}</td>
                <td className="p-3 text-sm font-medium">{purchase.supplier}</td>
                <td className="p-3 text-sm">{purchase.items.length}</td>
                <td className="p-3 text-sm font-bold text-red-600">{formatCurrency(purchase.totalCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title="تسجيل عملية شراء جديدة" onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <input type="text" placeholder="اسم المورد" value={newPurchase.supplier} onChange={e => setNewPurchase({...newPurchase, supplier: e.target.value})} className="w-full p-2 border rounded" />
            <input type="date" value={newPurchase.date} onChange={e => setNewPurchase({...newPurchase, date: e.target.value})} className="w-full p-2 border rounded" />
            
            <h4 className="font-bold mt-4">الأصناف</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 space-x-reverse">
                        <select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-1/3 p-2 border rounded">
                            <option value="">اختر منتج</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input type="number" placeholder="الكمية" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="w-1/4 p-2 border rounded" />
                        <input type="number" placeholder="سعر الوحدة" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="w-1/4 p-2 border rounded" />
                        <button onClick={() => removeItem(index)} className="text-red-500 p-2 rounded hover:bg-red-100">X</button>
                    </div>
                ))}
            </div>
            <button onClick={addItem} className="text-sm text-blue-500 hover:underline">+ إضافة صنف آخر</button>
            
            <input type="number" placeholder="تكلفة الشحن" value={newPurchase.shippingCost} onChange={e => setNewPurchase({...newPurchase, shippingCost: e.target.value})} className="w-full p-2 border rounded" />
            <input type="number" placeholder="تكلفة الجمارك" value={newPurchase.customsCost} onChange={e => setNewPurchase({...newPurchase, customsCost: e.target.value})} className="w-full p-2 border rounded" />
            
            <button onClick={handleAddPurchase} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              تسجيل الشراء
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Purchases;
