import React from 'react';
import { TableSkeleton } from '../common/Loader';
import EmptyState from '../common/EmptyState';
import { ChevronLeft, ChevronRight, Search, FileDown } from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  title,
  description,
  searchPlaceholder = 'Search records...',
  searchValue,
  onSearchChange,
  onExport,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no active records compiled in this table.',
  page = 1,
  totalPages = 1,
  onPageChange
}) {
  const normalizeRows = (value) => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      if (Array.isArray(value.data)) return value.data;
      if (Array.isArray(value.items)) return value.items;
      if (Array.isArray(value.customers)) return value.customers;
    }
    return [];
  };

  const rows = normalizeRows(data);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden font-sans hover:border-gray-300 transition duration-150">
      {/* Table Toolbar */}
      <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {title && <h3 className="text-sm font-bold text-gray-900 tracking-tight">{title}</h3>}
          {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        </div>
        
        <div className="flex items-center gap-3">
          {onSearchChange && (
            <div className="relative flex items-center w-52 sm:w-64">
              <Search size={13} className="absolute left-2.5 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-8 pl-8 pr-3 border border-gray-200 rounded text-xs bg-gray-50 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          )}
          
          {onExport && (
            <button
              onClick={onExport}
              className="h-8 px-2.5 bg-white border border-gray-200 hover:border-gray-400 text-gray-700 hover:text-black rounded text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileDown size={13} />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={5} cols={columns.length || 4} />
          </div>
        ) : rows.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-[10px] font-bold text-gray-400 tracking-wider uppercase"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50/50 transition">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-3.5 text-xs text-gray-800">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6">
            <EmptyState title={emptyTitle} description={emptyDescription} />
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {rows.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[11px] text-gray-500 font-medium">
            Page {page} of {totalPages || 1}
          </span>
          
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange && onPageChange(page - 1)}
              className="w-7 h-7 border border-gray-200 hover:border-gray-400 rounded flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange && onPageChange(page + 1)}
              className="w-7 h-7 border border-gray-200 hover:border-gray-400 rounded flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
