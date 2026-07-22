import React, { useState, useEffect } from 'react';
import CustomerTable from '../components/tables/CustomerTable';
import { Users } from 'lucide-react';
import { getDbState } from '../services/dbStore';

export default function Customers() {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const dbState = getDbState();
      setCustomers(dbState.customers || []);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Users size={18} className="text-gray-500" />
          Customers
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review and audit compiled shopper accounts, invoicing summaries, and total order volumes processed.
        </p>
      </div>

      {/* Customer Table List */}
      <CustomerTable
        customers={customers}
        loading={loading}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        page={1}
        totalPages={1}
      />
    </div>
  );
}
