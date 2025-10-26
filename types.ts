
export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  purchasePrice: number;
  actualUnitCost: number;
  salePrice: number;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Purchase {
  id:string;
  date: string;
  supplier: string;
  items: PurchaseItem[];
  shippingCost: number;
  customsCost: number;
  totalCost: number;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  date: string;
  customer: string;
  items: SaleItem[];
  promotionCost: number;
  totalAmount: number;
  netProfit: number;
  status?: 'new' | 'shipped';
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

export type View = 'dashboard' | 'inventory' | 'sales' | 'purchases' | 'expenses' | 'reports';
