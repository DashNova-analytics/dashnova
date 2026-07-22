import React from 'react';
import DataTable from './DataTable';
import { Package } from 'lucide-react';

export default function ProductTable({
  products = [],
  loading = false,
  searchValue,
  onSearchChange,
  page = 1,
  totalPages = 1,
  onPageChange
}) {
  const columns = [
    {
      header: 'SKU / Code',
      accessor: 'sku',
      render: (row) => <span className="font-mono text-[11px] text-gray-500 font-medium">{row.sku}</span>
    },
    {
      header: 'Product Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.name}</p>
          <p className="text-[10px] text-gray-400 font-medium">{row.category || 'Uncategorized'}</p>
        </div>
      )
    },
    {
      header: 'Stock Level',
      accessor: 'stock',
      render: (row) => {
        const isLow = row.stock < 10;
        return (
          <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-gray-800'}`}>
            {row.stock !== null && row.stock !== undefined ? row.stock : '—'}
          </span>
        );
      }
    },
    {
      header: 'Unit Price',
      accessor: 'price',
      render: (row) => <span className="font-medium text-gray-900">{row.price || '—'}</span>
    },
    {
      header: 'Units Sold',
      accessor: 'soldCount',
      render: (row) => <span className="font-medium text-gray-700">{row.soldCount || '—'}</span>
    },
    {
      header: 'Revenue Generated',
      accessor: 'revenue',
      render: (row) => <span className="font-semibold text-gray-900">{row.revenue || '—'}</span>
    }
  ];

  return (
    <DataTable
      title="Product & Catalog Inventory"
      description="Stock levels and catalog performance extracted from ledger imports or business uploads."
      columns={columns}
      data={products}
      loading={loading}
      searchPlaceholder="Search products by SKU or name..."
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      emptyTitle="No Products Discovered"
      emptyDescription="Upload your inventory sheets, sales ledgers, or billing products list to compile active SKU tables."
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onExport={() => console.log('Exporting products data...')}
    />
  );
}
