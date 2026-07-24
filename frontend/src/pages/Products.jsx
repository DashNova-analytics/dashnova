import React, { useState, useEffect } from 'react';
import { useOrganization } from '@clerk/clerk-react';
import ProductTable from '../components/tables/ProductTable';
import { Package, Plus, X } from 'lucide-react';
import { productService } from '../services/productService';

export default function Products() {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    sku: '',
  });

  const { organization } = useOrganization();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data || []);
    } catch (err) {
      console.warn('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    setSubmitting(true);
    try {
      await productService.createProduct({
        name: newProduct.name,
        category: newProduct.category || 'General',
        price: parseFloat(newProduct.price) || 0,
        stock: parseInt(newProduct.stock, 10) || 50,
        sku: newProduct.sku || undefined,
        organizationId: organization?.id,
      });
      setShowAddModal(false);
      setNewProduct({ name: '', category: '', price: '', stock: '', sku: '' });
      await loadProducts();
    } catch (err) {
      console.warn('Error creating product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Package size={18} className="text-gray-500" />
            Products Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Catalog listings and inventory trackers stored in your Neon database.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-9 px-4 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded flex items-center gap-1.5 transition cursor-pointer shrink-0"
        >
          <Plus size={14} />
          Add Product
        </button>
      </div>

      {/* Product Table List */}
      <ProductTable
        products={products}
        loading={loading}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        page={1}
        totalPages={1}
      />

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Cloud License"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded focus:outline-none focus:border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Unit Price (Rs) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="299.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Stock Level</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Software"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">SKU (Optional)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-9 px-4 text-xs font-bold text-gray-500 hover:text-gray-800 rounded border border-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-9 px-4 text-xs font-bold text-white bg-black hover:bg-gray-800 rounded cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving to Database...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

