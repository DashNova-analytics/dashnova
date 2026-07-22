import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, FileText, AlertCircle } from 'lucide-react';

export default function UploadZone({ onUploadComplete, allowedTypes = ['.csv', '.xlsx', '.xls'] }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (selectedFile) => {
    if (!selectedFile) return;

    // Check file extension
    const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    if (!allowedTypes.includes(extension)) {
      setError(`Unsupported file format. Please upload ${allowedTypes.join(', ')} only.`);
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress bar updates
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setProgress(i);
      }

      setUploading(false);
      if (onUploadComplete) {
        onUploadComplete(selectedFile);
      }
    } catch (err) {
      setError('Failed to upload and parse file. Please try again.');
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto font-sans">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? onButtonClick : undefined}
        className={`w-full min-h-[220px] p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition duration-150
          ${dragActive ? 'border-black bg-gray-50/50' : 'border-gray-200 hover:border-gray-400 bg-white'}
          ${uploading ? 'cursor-not-allowed pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={allowedTypes.join(',')}
          onChange={handleChange}
          disabled={uploading}
        />

        {uploading ? (
          <div className="w-full max-w-xs space-y-4">
            <div className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center mx-auto">
              <UploadCloud size={18} className="text-gray-400 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-950">Uploading and parsing business ledger...</p>
              <p className="text-[10px] text-gray-400 mt-1 truncate">{file?.name}</p>
            </div>
            
            {/* Progress Bar Container */}
            <div className="space-y-1.5">
              <div className="w-full bg-gray-100 h-1 rounded overflow-hidden">
                <div 
                  className="bg-black h-full transition-all duration-150 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <div className="flex justify-between text-[9px] text-gray-400 font-medium font-mono">
                <span>{progress}% complete</span>
                <span>{(file?.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          </div>
        ) : file && !error ? (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full border border-green-100 bg-green-50 flex items-center justify-center mx-auto">
              <CheckCircle size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-green-700">Successfully Ingested</p>
              <p className="text-[10px] text-gray-400 mt-1">{file.name}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-[10px] text-gray-500 hover:text-black hover:underline"
            >
              Upload another file
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center mx-auto">
              <UploadCloud size={18} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-950">
                Drag and drop your spreadsheet, or <span className="underline">browse files</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-1.5">
                Supports CSV, XLSX, or XLS (e.g. sales ledger, invoicing list, billing exports)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded text-xs flex items-start gap-2.5">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Upload Error</p>
            <p className="mt-0.5 text-red-600/90 leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
