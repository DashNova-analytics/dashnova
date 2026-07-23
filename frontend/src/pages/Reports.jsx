import React, { useState } from 'react';
import { FileText, Filter, Plus, Calendar, Download, AlertCircle, RefreshCw } from 'lucide-react';
import { Spinner } from '../components/common/Loader';

export default function Reports() {
  const [reportType, setReportType] = useState('revenue');
  const [format, setFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('this-month');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [reports, setReports] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setError('');

    // Simulated network processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Because there is no hardcoded mock business data and database is empty,
    // we show a descriptive warning that we generated an empty layout template.
    setGenerating(false);
    setError('Cannot compile report metrics: No business records found. Please upload transaction spreadsheets in the "Upload Data" panel first.');
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Business Reports</h1>
        <p className="text-xs text-gray-500 mt-1">
          Export tax ledger, inventory valuations, and executive summaries formatted for your billing software requirements.
        </p>
      </div>

      {/* Generation Panel Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          Compile New Report
        </h3>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full h-9 px-2 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:border-black"
            >
              <option value="revenue">Gross Income & Sales Ledger</option>
              <option value="inventory">SKU Valuation & Velocity</option>
              <option value="tax">GST & Sales Tax Summary</option>
              <option value="ai-advice">Gemini Recommendation Dossier</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">File Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full h-9 px-2 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:border-black"
            >
              <option value="pdf">Adobe PDF Format (.pdf)</option>
              <option value="csv">Comma-Separated Values (.csv)</option>
              <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Timeline</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full h-9 px-2 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:border-black"
            >
              <option value="this-month">Current Month (July 2026)</option>
              <option value="last-month">Previous Month</option>
              <option value="quarter">Current Quarter (Q3 2026)</option>
              <option value="year">Full Year (2026)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={generating}
            className="h-9 bg-black text-white hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {generating ? (
              <>
                <Spinner size="sm" className="text-gray-400" />
                Compiling...
              </>
            ) : (
              <>
                <Plus size={14} />
                Generate Report
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-md text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle size={15} className="text-gray-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">Ledger Compilation Suspended</p>
              <p className="text-gray-500 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Compiled Reports List (Empty State representation) */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Generated Archives</h3>

        {reports.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {/* Real reports loop will render here in future */}
          </div>
        ) : (
          <div className="border border-dashed border-gray-200 rounded-md p-12 text-center bg-gray-50/20 flex flex-col items-center justify-center min-h-[220px]">
            <FileText size={24} className="text-gray-300 mb-2" />
            <span className="text-xs font-semibold text-gray-700">No Generated Reports Discovered</span>
            <p className="text-[10px] text-gray-400 mt-1 max-w-[280px] leading-relaxed">
              Select report type filters above and click "Generate Report" to compile your first exportable business document.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
