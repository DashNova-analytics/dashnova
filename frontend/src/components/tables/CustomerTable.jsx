import React from 'react';
import DataTable from './DataTable';
import { Users } from 'lucide-react';

export default function CustomerTable({
  customers = [],
  loading = false,
  searchValue,
  onSearchChange,
  page = 1,
  totalPages = 1,
  onPageChange
}) {
  const columns = [
    {
      header: 'Customer ID',
      accessor: 'id',
      render: (row) => <span className="font-mono text-[11px] text-gray-500 font-medium">{row.id}</span>
    },
    {
      header: 'Customer Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.name}</p>
          <p className="text-[10px] text-gray-400 font-medium">{row.email}</p>
        </div>
      )
    },
    {
      header: 'Sales Invoiced',
      accessor: 'sales',
      render: (row) => <span className="font-semibold text-gray-900">{row.sales || '—'}</span>
    },
    {
      header: 'Total Orders',
      accessor: 'orders',
      render: (row) => <span className="font-medium text-gray-800">{row.orders || '—'}</span>
    },
    {
      header: 'Region',
      accessor: 'region',
      render: (row) => <span className="text-gray-600 font-medium">{row.region || '—'}</span>
    },
    {
      header: 'Last Active',
      accessor: 'lastActive',
      render: (row) => <span className="text-gray-500 font-mono text-[10px]">{row.lastActive || '—'}</span>
    }
  ];

  return (
    <DataTable
      title="Customer Analytics Ledger"
      description="List of customers parsed from billing software exports or custom CSV/Excel sheets."
      columns={columns}
      data={customers}
      loading={loading}
      searchPlaceholder="Search customers by name, region or email..."
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      emptyTitle="No Customers Ingested"
      emptyDescription="Upload your business records, sales ledgers, or invoice lists to compile active customer profiles."
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onExport={() => console.log('Exporting customers data...')}
    />
  );
}
