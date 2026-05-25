'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Plus, Warehouse, AlertTriangle, Box, MapPin,
  Pencil, Trash2, TrendingUp, Layers,
} from 'lucide-react';
import { getMessages } from '@/lib/i18n';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable, Column } from '@/components/DataTable';
import { ToastContainer, ToastItem } from '@/components/Toast';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function InventoryPage() {
  const params = useParams();
  const locale = params.locale as 'ar' | 'en';
  const isRTL = locale === 'ar';
  const t = getMessages(locale);

  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [stock, setStock] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'warehouses' | 'stock'>('products');
  const [loading, setLoading] = useState(true);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const addToast = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);

  // Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'product' | 'warehouse'; id: number; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Forms
  const [productForm, setProductForm] = useState({
    sku: '', name: '', nameEn: '', category: '', unit: 'piece',
    costPrice: 0, salePrice: 0, minStock: 0, maxStock: 0, barcode: '',
    warehouseId: '', initialQuantity: 0,
  });
  const [warehouseForm, setWarehouseForm] = useState({ name: '', nameEn: '', code: '', location: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchWarehouses(), fetchStock()]);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const res = await fetch('/api/inventory/products');
    const data = await res.json();
    setProducts(data.products || []);
  };

  const fetchWarehouses = async () => {
    const res = await fetch('/api/inventory/warehouses');
    const data = await res.json();
    setWarehouses(data.warehouses || []);
  };

  const fetchStock = async () => {
    const res = await fetch('/api/inventory/stock');
    const data = await res.json();
    setStock(data.stock || []);
  };

  const resetProductForm = () => {
    setProductForm({
      sku: '', name: '', nameEn: '', category: '', unit: 'piece',
      costPrice: 0, salePrice: 0, minStock: 0, maxStock: 0, barcode: '',
      warehouseId: '', initialQuantity: 0,
    });
    setEditingProduct(null);
  };

  const resetWarehouseForm = () => {
    setWarehouseForm({ name: '', nameEn: '', code: '', location: '' });
    setEditingWarehouse(null);
  };

  const openAddProduct = () => { resetProductForm(); setProductModalOpen(true); };
  const openAddWarehouse = () => { resetWarehouseForm(); setWarehouseModalOpen(true); };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    const stockItem = product.stockItems?.[0];
    setProductForm({
      sku: product.sku || '', name: product.name || '', nameEn: product.nameEn || '',
      category: product.category || '', unit: product.unit || 'piece',
      costPrice: product.costPrice || 0, salePrice: product.salePrice || 0,
      minStock: product.minStock || 0, maxStock: product.maxStock || 0,
      barcode: product.barcode || '',
      warehouseId: stockItem?.warehouseId?.toString() || '',
      initialQuantity: stockItem?.quantity || 0,
    });
    setProductModalOpen(true);
  };

  const openEditWarehouse = (wh: any) => {
    setEditingWarehouse(wh);
    setWarehouseForm({
      name: wh.name || '', nameEn: wh.nameEn || '', code: wh.code || '', location: wh.location || '',
    });
    setWarehouseModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/inventory/products?id=${editingProduct.id}` : '/api/inventory/products';
    const method = editingProduct ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productForm),
    });
    if (res.ok) {
      addToast(editingProduct ? (isRTL ? 'تم تعديل المنتج بنجاح' : 'Product updated successfully') : (isRTL ? 'تم إضافة المنتج بنجاح' : 'Product added successfully'), 'success');
      setProductModalOpen(false);
      resetProductForm();
      fetchProducts(); fetchStock();
    } else {
      addToast(isRTL ? 'حدث خطأ' : 'An error occurred', 'error');
    }
  };

  const handleWarehouseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingWarehouse ? `/api/inventory/warehouses?id=${editingWarehouse.id}` : '/api/inventory/warehouses';
    const method = editingWarehouse ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(warehouseForm),
    });
    if (res.ok) {
      addToast(editingWarehouse ? (isRTL ? 'تم تعديل المستودع بنجاح' : 'Warehouse updated successfully') : (isRTL ? 'تم إضافة المستودع بنجاح' : 'Warehouse added successfully'), 'success');
      setWarehouseModalOpen(false);
      resetWarehouseForm();
      fetchWarehouses();
    } else {
      addToast(isRTL ? 'حدث خطأ' : 'An error occurred', 'error');
    }
  };

  const openDelete = (type: 'product' | 'warehouse', item: any) => {
    setDeleteTarget({ type, id: item.id, name: item.name });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const endpoint = deleteTarget.type === 'product'
      ? `/api/inventory/products?id=${deleteTarget.id}`
      : `/api/inventory/warehouses?id=${deleteTarget.id}`;
    const res = await fetch(endpoint, { method: 'DELETE' });
    setDeleteLoading(false);
    setDeleteDialogOpen(false);
    if (res.ok) {
      addToast(isRTL ? 'تم الحذف بنجاح' : 'Deleted successfully', 'success');
      if (deleteTarget.type === 'product') { fetchProducts(); fetchStock(); }
      else { fetchWarehouses(); }
    } else {
      const data = await res.json();
      addToast(data.error || (isRTL ? 'فشل الحذف' : 'Delete failed'), 'error');
    }
  };

  // Stats
  const totalStockQty = stock.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const totalStockValue = stock.reduce((sum, s) => sum + (s.quantity || 0) * (s.avgCost || 0), 0);
  const lowStockCount = stock.filter((s) => s.quantity <= (s.product?.minStock || 0)).length;

  // Product columns
  const productColumns: Column[] = [
    { key: 'sku', label: t.inventory.sku, sortable: true },
    { key: 'name', label: t.app.name, sortable: true },
    { key: 'category', label: t.inventory.category, sortable: true, render: (row) => row.category || '-' },
    { key: 'costPrice', label: t.inventory.costPrice, sortable: true, align: 'right', render: (row) => row.costPrice?.toLocaleString() },
    { key: 'salePrice', label: t.inventory.salePrice, sortable: true, align: 'right', render: (row) => row.salePrice?.toLocaleString() },
    { key: 'unit', label: t.inventory.unit, render: (row) => <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">{row.unit}</span> },
    {
      key: 'isActive',
      label: t.app.status,
      render: (row) => (
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {row.isActive ? t.app.active : t.app.inactive}
        </span>
      ),
    },
  ];

  // Stock columns
  const stockColumns: Column[] = [
    { key: 'productName', label: t.app.name, render: (row) => row.product?.name },
    { key: 'sku', label: t.inventory.sku, render: (row) => <span className="font-mono text-xs text-gray-500">{row.product?.sku}</span> },
    { key: 'warehouse', label: t.inventory.warehouses, render: (row) => row.warehouse?.name },
    { key: 'quantity', label: t.inventory.quantity, sortable: true, align: 'right', render: (row) => <span className="font-bold">{(row.quantity || 0).toLocaleString()}</span> },
    { key: 'avgCost', label: t.inventory.costPrice, sortable: true, align: 'right', render: (row) => (row.avgCost || 0).toLocaleString() },
    { key: 'stockValue', label: t.inventory.stockValue, sortable: true, align: 'right', render: (row) => ((row.quantity || 0) * (row.avgCost || 0)).toLocaleString() },
    {
      key: 'status',
      label: t.app.status,
      render: (row) =>
        row.quantity <= (row.product?.minStock || 0) ? (
          <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-100 px-2.5 py-1 rounded-full font-medium">
            <AlertTriangle className="w-3 h-3" />
            {t.inventory.lowStock}
          </span>
        ) : (
          <span className="text-xs text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-medium">{t.app.active}</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} duration={4000} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.app.inventory}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {isRTL ? 'إدارة المنتجات والمستودعات والمخزون' : 'Manage products, warehouses & stock'}
          </p>
        </div>
        {activeTab === 'products' && (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={openAddProduct}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t.inventory.addProduct}
          </motion.button>
        )}
        {activeTab === 'warehouses' && (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={openAddWarehouse}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t.inventory.addWarehouse}
          </motion.button>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package, label: t.inventory.products, value: products.length, color: 'bg-blue-500' },
          { icon: Warehouse, label: t.inventory.warehouses, value: warehouses.length, color: 'bg-indigo-500' },
          { icon: Layers, label: isRTL ? 'إجمالي المخزون' : 'Total Stock', value: totalStockQty.toLocaleString(), color: 'bg-emerald-500' },
          { icon: AlertTriangle, label: t.inventory.lowStock, value: lowStockCount, color: 'bg-red-500' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl">
          {([
            { key: 'products', label: t.inventory.products, icon: Package },
            { key: 'warehouses', label: t.inventory.warehouses, icon: Warehouse },
            { key: 'stock', label: t.inventory.stock, icon: Layers },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ====== PRODUCTS TAB ====== */}
      <AnimatePresence mode="wait">
        {activeTab === 'products' && (
          <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <DataTable
              data={products}
              columns={productColumns}
              title={t.inventory.products}
              searchPlaceholder={isRTL ? 'بحث في المنتجات...' : 'Search products...'}
              pageSizeOptions={[5, 10, 25, 50]}
              defaultPageSize={10}
              showExport={true}
              showImport={true}
              showPrint={true}
              showActions={true}
              actions={{ edit: true, delete: true }}
              onEdit={openEditProduct}
              onDelete={(row) => openDelete('product', row)}
              emptyMessage={t.app.noData}
              loading={loading}
              locale={locale}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== WAREHOUSES TAB ====== */}
      <AnimatePresence mode="wait">
        {activeTab === 'warehouses' && (
          <motion.div key="warehouses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {warehouses.length === 0 ? (
              <div className="text-center py-16 text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <Warehouse className="w-14 h-14 mx-auto mb-3 opacity-40" />
                <p>{t.app.noData}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {warehouses.map((wh, i) => (
                  <motion.div
                    key={wh.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Warehouse className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditWarehouse(wh)} className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors" title={t.app.edit}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => openDelete('warehouse', wh)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title={t.app.delete}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{wh.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-mono">{wh.code}</p>
                    {wh.location && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {wh.location}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
                        <p className="text-xs text-gray-400">{isRTL ? 'المنتجات' : 'Products'}</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{wh.stockItems?.length || 0}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
                        <p className="text-xs text-gray-400">{isRTL ? 'الكمية' : 'Quantity'}</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {wh.stockItems?.reduce((sum: number, s: any) => sum + (s.quantity || 0), 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== STOCK TAB ====== */}
      <AnimatePresence mode="wait">
        {activeTab === 'stock' && (
          <motion.div key="stock" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
            {/* Stock Value Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-lg shadow-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">{isRTL ? 'إجمالي الكمية' : 'Total Quantity'}</p>
                    <p className="text-2xl font-bold">{totalStockQty.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ delay: 0.05 }} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg shadow-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">{t.inventory.stockValue}</p>
                    <p className="text-2xl font-bold">{totalStockValue.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-5 text-white shadow-lg shadow-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">{t.inventory.lowStock}</p>
                    <p className="text-2xl font-bold">{lowStockCount}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <DataTable
              data={stock}
              columns={stockColumns}
              title={t.inventory.stock}
              searchPlaceholder={isRTL ? 'بحث في المخزون...' : 'Search stock...'}
              pageSizeOptions={[5, 10, 25, 50]}
              defaultPageSize={10}
              showExport={true}
              showImport={false}
              showPrint={true}
              showActions={false}
              emptyMessage={t.app.noData}
              loading={loading}
              locale={locale}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== PRODUCT MODAL ====== */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => { setProductModalOpen(false); resetProductForm(); }}
        title={editingProduct ? `${t.app.edit} - ${editingProduct.name}` : t.inventory.addProduct}
        size="lg"
      >
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.inventory.sku} <span className="text-red-500">*</span></label>
              <input type="text" required value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="PRD-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.app.name} <span className="text-red-500">*</span></label>
              <input type="text" required value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.inventory.category}</label>
              <input type="text" value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.inventory.unit}</label>
              <input type="text" value={productForm.unit}
                onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="piece / kg / box" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.inventory.costPrice}</label>
              <input type="number" min="0" step="0.01" value={productForm.costPrice}
                onChange={(e) => setProductForm({ ...productForm, costPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.inventory.salePrice}</label>
              <input type="number" min="0" step="0.01" value={productForm.salePrice}
                onChange={(e) => setProductForm({ ...productForm, salePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.inventory.minStock}</label>
              <input type="number" min="0" value={productForm.minStock}
                onChange={(e) => setProductForm({ ...productForm, minStock: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.inventory.maxStock}</label>
              <input type="number" min="0" value={productForm.maxStock}
                onChange={(e) => setProductForm({ ...productForm, maxStock: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{isRTL ? '📦 ربط بالمستودع' : '📦 Link to Warehouse'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.inventory.warehouses}</label>
                <select value={productForm.warehouseId}
                  onChange={(e) => setProductForm({ ...productForm, warehouseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">{isRTL ? '-- اختر مستودع --' : '-- Select Warehouse --'}</option>
                  {warehouses.map((w) => (<option key={w.id} value={w.id}>{w.name} ({w.code})</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{isRTL ? 'الكمية الابتدائية' : 'Initial Quantity'}</label>
                <input type="number" min="0" value={productForm.initialQuantity}
                  onChange={(e) => setProductForm({ ...productForm, initialQuantity: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-colors">
              {t.app.save}
            </motion.button>
            <button type="button" onClick={() => { setProductModalOpen(false); resetProductForm(); }}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              {t.app.cancel}
            </button>
          </div>
        </form>
      </Modal>

      {/* ====== WAREHOUSE MODAL ====== */}
      <Modal
        isOpen={warehouseModalOpen}
        onClose={() => { setWarehouseModalOpen(false); resetWarehouseForm(); }}
        title={editingWarehouse ? `${t.app.edit} - ${editingWarehouse.name}` : t.inventory.addWarehouse}
        size="md"
      >
        <form onSubmit={handleWarehouseSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.app.name} <span className="text-red-500">*</span></label>
              <input type="text" required value={warehouseForm.name}
                onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.app.code} <span className="text-red-500">*</span></label>
              <input type="text" required value={warehouseForm.code}
                onChange={(e) => setWarehouseForm({ ...warehouseForm, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="WH-002" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.app.address}</label>
              <input type="text" value={warehouseForm.location}
                onChange={(e) => setWarehouseForm({ ...warehouseForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-colors">
              {t.app.save}
            </motion.button>
            <button type="button" onClick={() => { setWarehouseModalOpen(false); resetWarehouseForm(); }}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              {t.app.cancel}
            </button>
          </div>
        </form>
      </Modal>

      {/* ====== DELETE CONFIRM ====== */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={isRTL ? '⚠️ تأكيد الحذف' : '⚠️ Confirm Delete'}
        message={deleteTarget ? `${isRTL ? 'هل أنت متأكد من حذف' : 'Are you sure you want to delete'} "${deleteTarget.name}"? ${isRTL ? 'لا يمكن التراجع عن هذا الإجراء.' : 'This action cannot be undone.'}` : ''}
        confirmText={t.app.delete}
        cancelText={t.app.cancel}
        isLoading={deleteLoading}
      />
    </div>
  );
}
