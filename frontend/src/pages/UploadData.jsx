import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '@clerk/clerk-react';
import UploadZone from '../components/upload/UploadZone';
import { FileSpreadsheet, Trash2, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { uploadService } from '../services/uploadService';
import { syncDatabaseWithFiles } from '../services/dbStore';
import { useToast } from '../components/ui/ToastContext';

export default function UploadData() {
  const navigate = useNavigate();
  const toast = useToast();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    const loadFiles = async () => {
      const files = await uploadService.getUploadedFiles();
      setUploadedFiles(files);
    };
    loadFiles();
  }, []);

  const { organization } = useOrganization();

  const handleUploadComplete = async (file) => {
    try {
      // Save to upload service — this now reads and stores real file content
      const res = await uploadService.uploadFile(file, null, organization?.id);
      const updatedFiles = [res.file, ...uploadedFiles];
      setUploadedFiles(updatedFiles);

      // Auto-sync: parse the files and populate the database immediately
      await syncDatabaseWithFiles(updatedFiles, organization?.name);
      setSyncMessage(`"${file.name}" uploaded and synchronized — ${res.file.recordsDiscovered} data rows parsed.`);

      if (toast?.success) {
        toast.success(`Dataset "${file.name}" ingested! Redirecting to Dashboard...`);
      }

      // Automatically redirect immediately to Dashboard page
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to upload and sync file:', error);
      setSyncMessage(`Failed to upload "${file.name}": ${error.message || 'Unknown error'}`);
      if (toast?.error) {
        toast.error(`Failed to process dataset: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleRemoveFile = async (id) => {
    await uploadService.removeUploadedFile(id);
    const updatedFiles = uploadedFiles.filter((f) => f.id !== id);
    setUploadedFiles(updatedFiles);

    try {
      // Re-sync the database without the removed file
      await syncDatabaseWithFiles(updatedFiles);
      setSyncMessage(updatedFiles.length > 0
        ? 'File removed. Database re-synchronized with remaining files.'
        : '');
    } catch (error) {
      console.error('Failed to sync database after removing file:', error);
      setSyncMessage('File removed, but the backend database sync failed.');
    }
  };

  const handleSyncDatabase = async () => {
    setSyncing(true);
    setSyncMessage('');
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // Re-parse all files and populate the database
      await syncDatabaseWithFiles(uploadedFiles, organization?.name);
      setSyncMessage('Database successfully synchronized. All dashboards and analytics have been refreshed with your uploaded data.');
    } catch (error) {
      console.error('Failed to synchronize database:', error);
      setSyncMessage('Database sync failed. Please check backend connectivity.');
    } finally {
      setSyncing(false);
    }
  };


  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Upload Data</h1>
          <p className="text-xs text-gray-500 mt-1">
            Upload CSV sheets, Excel files, or ledger reports to automatically compile business dashboards and AI insights.
          </p>
        </div>

        {uploadedFiles.length > 0 && (
          <button
            onClick={handleSyncDatabase}
            disabled={syncing}
            className="h-9 px-4 bg-black hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 text-white text-xs font-bold rounded flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
            Synchronize Database
          </button>
        )}
      </div>

      {syncMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md text-xs flex items-start justify-between gap-3 leading-normal">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-green-600" />
            <span>{syncMessage}</span>
          </div>
          <button 
            onClick={() => setSyncMessage('')} 
            className="text-green-600 hover:text-green-800 font-bold focus:outline-none shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Drag & Drop zone */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Spreadsheet Ingestion Zone</h3>
        <UploadZone onUploadComplete={handleUploadComplete} />
      </div>

      {/* Uploaded Files Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition duration-150">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900">Ingested Spreadsheets</h3>
          <p className="text-xs text-gray-400 mt-0.5">Spreadsheets parsed and processed in the current active business session.</p>
        </div>

        {uploadedFiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                  <th className="px-6 py-3">File Name</th>
                  <th className="px-6 py-3">Format</th>
                  <th className="px-6 py-3">File Size</th>
                  <th className="px-6 py-3">Discovered Rows</th>
                  <th className="px-6 py-3">Ingested At</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {uploadedFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 text-xs font-bold text-gray-900 flex items-center gap-2">
                      <FileSpreadsheet size={14} className="text-gray-400 shrink-0" />
                      {file.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">{file.type}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">{file.size}</td>
                    <td className="px-6 py-4 text-xs text-gray-800 font-semibold font-mono">{file.recordsDiscovered} rows</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">{file.uploadedAt}</td>
                    <td className="px-6 py-4 text-xs">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {file.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-right">
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-red-500 hover:text-red-700 font-bold focus:outline-none flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center border-t border-gray-100 flex flex-col items-center justify-center min-h-[220px]">
            <FileSpreadsheet size={24} className="text-gray-300 mb-2" />
            <span className="text-xs font-semibold text-gray-700">No spreadsheets uploaded yet</span>
            <p className="text-[10px] text-gray-400 mt-1 max-w-[280px] leading-relaxed">
              Drag and drop sales reports, customer sheets, or bills to begin data processing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
