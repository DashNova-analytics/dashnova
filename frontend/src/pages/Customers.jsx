import React, { useState, useEffect } from 'react';
import { useOrganization } from '@clerk/clerk-react';
import CustomerTable from '../components/tables/CustomerTable';
import { Users, Plus, X } from 'lucide-react';
import { customerService } from '../services/customerService';

export default function Customers() {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    region: 'North America',
  });

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.warn('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const { organization } = useOrganization();

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) return;
    setSubmitting(true);
    try {
      await customerService.createCustomer({
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone || null,
        region: newCustomer.region || 'North America',
        organizationId: organization?.id,
      });
      setShowAddModal(false);
      setNewCustomer({ name: '', email: '', phone: '', region: 'North America' });
      await loadCustomers();
    } catch (err) {
      console.warn('Error creating customer:', err);
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
            <Users size={18} className="text-gray-500" />
            Customers
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Shopper accounts and customer order summaries stored directly in your Neon database.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-9 px-4 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded flex items-center gap-1.5 transition cursor-pointer shrink-0"
        >
          <Plus size={14} />
          Add Customer
        </button>
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

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Add New Customer</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Customer / Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="contact@acme.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded focus:outline-none focus:border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Region</label>
                  <select
                    value={newCustomer.region}
                    onChange={(e) => setNewCustomer({ ...newCustomer, region: e.target.value })}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded focus:outline-none focus:border-black bg-white"
                  >
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia Pacific">Asia Pacific</option>
                    <option value="Latin America">Latin America</option>
                  </select>
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
                  {submitting ? 'Saving to Database...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

