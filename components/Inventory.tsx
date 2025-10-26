
import React, { useState, useMemo } from 'react';
import { Product, Sale, Purchase } from '../types';
import Modal from './common/Modal';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  purchases: Purchase[];
}

const Inventory: React.FC<InventoryProps> = ({ products, setProducts, sales, purchases }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', quantity: '0', purchasePrice: '0', salePrice: '0' });

  const handleAddProduct = () => {
    const productToAdd: Product = {
      id: crypto.randomUUID(),
      name: newProduct.name,
      sku: newProduct.sku,
      quantity: parseInt(newProduct.quantity, 10),
      purchasePrice: parseFloat(newProduct.purchasePrice),
      actualUnitCost: parseFloat(newProduct.purchasePrice), // Initial cost is purchase price
      salePrice: parseFloat(newProduct.salePrice),
    };
    setProducts(prev => [...prev, productToAdd]);
    setNewProduct({ name: '', sku: '', quantity: '0', purchasePrice: '0', salePrice: '0' });
    setIsModalOpen(false);
  };

  const itemMovement = useMemo(() => {
    if (!selectedProduct) return [];
    
    const movements: {date: string; type: string; quantity: number; details: string}[] = [];

    purchases.forEach(p => {
        p.items.forEach(item => {
            if (item.productId === selectedProduct.id) {
                movements.push({
                    date: p.date,
                    type: 'شراء',
                    quantity: item.quantity,
                    details: `من المورد: ${p.supplier}`
                });
            }
        });
    });

    sales.forEach(s => {
        s.items.forEach(item => {
            if (item.productId === selectedProduct.id) {
                movements.push({
                    date: s.date,
                    type: 'بيع',
                    quantity: -item.quantity,
                    details: `للعميل: ${s.customer}`
                });
            }
        });
    });

    return movements.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedProduct, purchases, sales]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-700">إدارة المخزون</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 shadow"
        >
          إضافة منتج جديد
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 font-semibold text-sm">اسم المنتج</th>
              <th className="p-3 font-semibold text-sm">SKU</th>
              <th className="p-3 font-semibold text-sm">الكمية الحالية</th>
              <th className="p-3 font-semibold text-sm">تكلفة الوحدة الفعلية</th>
              <th className="p-3 font-semibold text-sm">سعر البيع</th>
              <th className="p-3 font-semibold text-sm">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm font-medium">{product.name}</td>
                <td className="p-3 text-sm text-gray-600">{product.sku}</td>
                <td className={`p-3 text-sm font-bold ${product.quantity < 10 ? 'text-red-500' : 'text-green-600'}`}>{product.quantity}</td>
                <td className="p-3 text-sm text-gray-600">{formatCurrency(product.actualUnitCost)}</td>
                <td className="p-3 text-sm text-gray-600">{formatCurrency(product.salePrice)}</td>
                <td className="p-3 text-sm">
                  <button onClick={() => setSelectedProduct(product)} className="text-blue-500 hover:underline">
                    عرض الحركة
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title="إضافة منتج جديد" onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <input type="text" placeholder="اسم المنتج" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-2 border rounded" />
            <input type="text" placeholder="SKU" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} className="w-full p-2 border rounded" />
            <input type="number" placeholder="الكمية" value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: e.target.value})} className="w-full p-2 border rounded" />
            <input type="number" placeholder="سعر الشراء" value={newProduct.purchasePrice} onChange={e => setNewProduct({...newProduct, purchasePrice: e.target.value})} className="w-full p-2 border rounded" />
            <input type="number" placeholder="سعر البيع" value={newProduct.salePrice} onChange={e => setNewProduct({...newProduct, salePrice: e.target.value})} className="w-full p-2 border rounded" />
            <button onClick={handleAddProduct} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              إضافة
            </button>
          </div>
        </Modal>
      )}

      {selectedProduct && (
        <Modal title={`حركة الصنف: ${selectedProduct.name}`} onClose={() => setSelectedProduct(null)}>
            <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-right">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 font-semibold text-sm">التاريخ</th>
                            <th className="p-2 font-semibold text-sm">النوع</th>
                            <th className="p-2 font-semibold text-sm">الكمية</th>
                            <th className="p-2 font-semibold text-sm">التفاصيل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemMovement.map((move, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2 text-sm text-gray-600">{new Date(move.date).toLocaleDateString('ar-EG')}</td>
                                <td className={`p-2 text-sm font-medium ${move.type === 'شراء' ? 'text-green-600' : 'text-red-600'}`}>{move.type}</td>
                                <td className={`p-2 text-sm font-bold ${move.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>{move.quantity}</td>
                                <td className="p-2 text-sm text-gray-500">{move.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default Inventory;
