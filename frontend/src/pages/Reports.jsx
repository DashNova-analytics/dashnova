import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Filter, 
  Plus, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Printer, 
  X,
  FileSpreadsheet,
  Building2,
  Calendar,
  TrendingUp,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useOrganization } from '@clerk/clerk-react';
import { Spinner } from '../components/common/Loader';
import { getDbState } from '../services/dbStore';
import { compileReport, downloadReportFile } from '../services/reportGenerator';
import { useToast } from '../components/ui/ToastContext';

export default function Reports() {
  const { organization } = useOrganization();
  const toast = useToast();

  const [reportType, setReportType] = useState('revenue');
  const [format, setFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('this-month');
  const [generating, setGenerating] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const [dbState, setDbState] = useState(() => getDbState());

  // Load persistent reports from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dashnova_generated_reports');
      if (saved) {
        setReports(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse saved reports:', e);
    }
  }, []);

  // Save reports to localStorage whenever updated
  const saveReportsToStorage = (updatedList) => {
    setReports(updatedList);
    try {
      localStorage.setItem('dashnova_generated_reports', JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save reports:', e);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);

    // Refresh dbState
    const currentDb = getDbState();
    setDbState(currentDb);

    // Simulated short compilation delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newReport = compileReport({
      reportType,
      format,
      dateRange,
      dbState: currentDb,
      organizationName: organization?.name,
    });

    const updated = [newReport, ...reports];
    saveReportsToStorage(updated);

    setGenerating(false);

    if (toast?.success) {
      toast.success(`Report "${newReport.title}" compiled successfully!`);
    }

    // Auto-open generated report preview
    setSelectedReport(newReport);
  };

  const handleDeleteReport = (id, e) => {
    e?.stopPropagation();
    const updated = reports.filter((r) => r.id !== id);
    saveReportsToStorage(updated);
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
    if (toast?.info) {
      toast.info('Report removed from archives.');
    }
  };

  const handleDownload = (report, e) => {
    e?.stopPropagation();
    downloadReportFile(report);
    if (toast?.success) {
      toast.success(`Downloaded ${report.format.toUpperCase()} report: ${report.title}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const hasCustomData = Boolean(dbState?.hasData && dbState?.products?.length > 0);

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Business Reports & Analytics Dossier</h1>
          <p className="text-xs text-gray-500 mt-1">
            Generate executive revenue ledgers, tax compliance summaries, and AI recommendations derived directly from your active business datasets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            hasCustomData 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hasCustomData ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {hasCustomData ? 'Active Ingested Dataset' : 'Sample Business Mode'}
          </span>
        </div>
      </div>

      {!hasCustomData && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 flex items-start gap-3">
          <Sparkles className="text-black shrink-0 mt-0.5" size={16} />
          <div className="leading-relaxed">
            <p className="font-semibold text-gray-900">Sample Dataset Active for Report Generation</p>
            <p className="mt-0.5 text-gray-500">
              No custom transaction spreadsheets have been uploaded yet. DashNova will automatically compile your reports using built-in enterprise sample datasets. Upload custom files in the <span className="font-medium text-gray-800">Upload Data</span> panel to build custom organization reports.
            </p>
          </div>
        </div>
      )}

      {/* Generation Form Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          Compile Custom Business Report
        </h3>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full h-9 px-3 border border-gray-200 rounded-md text-xs bg-white text-gray-900 focus:outline-none focus:border-black transition"
            >
              <option value="revenue">Gross Income & Sales Ledger</option>
              <option value="inventory">SKU Valuation & Stock Velocity</option>
              <option value="tax">GST & Sales Tax Summary</option>
              <option value="ai-advice">Gemini AI Strategic Dossier</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">File Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full h-9 px-3 border border-gray-200 rounded-md text-xs bg-white text-gray-900 focus:outline-none focus:border-black transition"
            >
              <option value="pdf">Adobe PDF Document (.pdf)</option>
              <option value="csv">Comma-Separated Values (.csv)</option>
              <option value="xlsx">Excel Workbook (.xlsx)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Timeline Period</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full h-9 px-3 border border-gray-200 rounded-md text-xs bg-white text-gray-900 focus:outline-none focus:border-black transition"
            >
              <option value="Current Month">Current Month (July 2026)</option>
              <option value="Previous Month">Previous Month</option>
              <option value="Current Quarter">Current Quarter (Q3 2026)</option>
              <option value="Full Year 2026">Full Year 2026</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={generating}
            className="h-9 bg-black text-white hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {generating ? (
              <>
                <Spinner size="sm" className="text-gray-400" />
                Compiling Ledger...
              </>
            ) : (
              <>
                <Plus size={14} />
                Generate Report
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Archives List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FileText size={15} className="text-gray-400" />
            Generated Report Archives ({reports.length})
          </h3>
          {reports.length > 0 && (
            <button
              onClick={() => {
                saveReportsToStorage([]);
                setSelectedReport(null);
              }}
              className="text-[11px] font-medium text-gray-400 hover:text-red-600 transition"
            >
              Clear Archives
            </button>
          )}
        </div>

        {reports.length > 0 ? (
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-md overflow-hidden">
            {reports.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className="p-4 hover:bg-gray-50/80 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 shrink-0 mt-0.5">
                    {r.format === 'xlsx' ? (
                      <FileSpreadsheet size={16} className="text-emerald-600" />
                    ) : r.format === 'csv' ? (
                      <FileText size={16} className="text-blue-600" />
                    ) : (
                      <FileText size={16} className="text-gray-800" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-gray-900">{r.title}</h4>
                      <span className="text-[10px] font-mono uppercase bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                        {r.format}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {r.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 max-w-xl">
                      {r.summary}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Building2 size={11} />
                        {r.orgName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {r.generatedAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReport(r);
                    }}
                    className="h-8 px-2.5 text-xs font-medium text-gray-700 hover:text-black bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded flex items-center gap-1.5 transition"
                  >
                    <Eye size={13} />
                    View
                  </button>
                  <button
                    onClick={(e) => handleDownload(r, e)}
                    className="h-8 px-2.5 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded flex items-center gap-1.5 transition"
                  >
                    <Download size={13} />
                    Download
                  </button>
                  <button
                    onClick={(e) => handleDeleteReport(r.id, e)}
                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded flex items-center justify-center transition"
                    title="Delete report"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-200 rounded-md p-10 text-center bg-gray-50/30 flex flex-col items-center justify-center min-h-[200px]">
            <FileText size={28} className="text-gray-300 mb-2" />
            <span className="text-xs font-semibold text-gray-800">No Reports Compiled Yet</span>
            <p className="text-[11px] text-gray-400 mt-1 max-w-[320px] leading-relaxed">
              Select your desired report type and file format above, then click <span className="font-semibold text-gray-700">"Generate Report"</span> to compile your first executive dossier.
            </p>
          </div>
        )}
      </div>

      {/* Report Inspection Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl font-sans">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-bold text-xs">
                  DN
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{selectedReport.title}</h3>
                    <span className="text-[10px] font-mono bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded">
                      {selectedReport.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {selectedReport.orgName} • Compiled {selectedReport.generatedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="h-8 px-2.5 text-xs font-medium text-gray-700 hover:text-black bg-white border border-gray-200 rounded flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer size={13} />
                  Print
                </button>
                <button
                  onClick={() => handleDownload(selectedReport)}
                  className="h-8 px-3 text-xs font-semibold text-white bg-black hover:bg-gray-800 rounded flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download size={13} />
                  Export {selectedReport.format.toUpperCase()}
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="w-8 h-8 text-gray-400 hover:text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition cursor-pointer ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body / Report Document */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white" id="report-print-area">
              {/* Executive Summary Box */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Executive Briefing & Scope
                </span>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  {selectedReport.summary}
                </p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedReport.metricsCards?.map((m, idx) => (
                  <div key={idx} className="p-3.5 border border-gray-200 rounded-lg bg-white">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block truncate">
                      {m.label}
                    </span>
                    <span className="text-base font-bold text-gray-900 block mt-1">
                      {m.value}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">
                      {m.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Data Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Detailed Data Breakdown
                </h4>
                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-800">
                    <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <tr>
                        {selectedReport.tableHeaders?.map((h, idx) => (
                          <th key={idx} className="px-4 py-2.5 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedReport.tableRows?.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-gray-50/50">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Strategic Future Recommendations */}
              <div className="border-t border-gray-100 pt-5">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-black" />
                  Strategic Future Recommendations
                </h4>
                <div className="space-y-2">
                  {selectedReport.recommendations?.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-gray-50/80 border border-gray-200/80 rounded-md text-xs text-gray-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-[11px] text-gray-500">
              <span>DashNova Business Intelligence Engine • Verified Audit</span>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-700 font-semibold hover:text-black transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
