import React, { useState, useEffect } from 'react';
import ProductTable from '../components/tables/ProductTable';
import { Package } from 'lucide-react';
import { getDbState } from '../services/dbStore';

export default function Products() {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const dbState = getDbState();
      setProducts(dbState.products || []);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Package size={18} className="text-gray-500" />
          Products Catalog
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Catalog listings and inventory trackers compiled from transaction invoices or supplier files.
        </p>
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
    </div>
  );
}
