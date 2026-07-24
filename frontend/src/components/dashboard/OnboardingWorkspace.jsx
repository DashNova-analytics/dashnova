import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '@clerk/clerk-react';
import UploadZone from '../upload/UploadZone';
import DashboardAnalyticsLoader from '../common/DashboardAnalyticsLoader';
import { uploadService } from '../../services/uploadService';
import { syncDatabaseWithFiles } from '../../services/dbStore';
import { useToast } from '../ui/ToastContext';
import { 
  BarChart3, 
  Brain, 
  Activity, 
  TrendingUp, 
  FileText, 
  Download, 
  Sparkles, 
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function OnboardingWorkspace({ onDatasetUploaded }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { organization } = useOrganization();
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle file upload and immediate database sync
  const handleUploadComplete = async (file) => {
    setIsProcessing(true);
    try {
      // 1. Upload & parse file
      const res = await uploadService.uploadFile(file, null, organization?.id);
      
      // 2. Sync dataset into local DB store and backend
      await syncDatabaseWithFiles([res.file], organization?.name);

      if (toast?.success) {
        toast.success(`Dataset "${file.name}" ingested! Redirecting to Dashboard...`);
      }

      // 3. Callback or redirect directly to dashboard
      if (onDatasetUploaded) {
        onDatasetUploaded();
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to upload and sync dataset:', error);
      if (toast?.error) {
        toast.error(`Upload error: ${error.message || 'Failed to process dataset'}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate and download clean sample business ledger dataset (CSV)
  const handleDownloadSampleDataset = () => {
    const sampleCsv = `Order_ID,Order_Date,Customer_Name,Customer_Email,Product_Name,Category,Unit_Price,Quantity,Total_Amount,Region,Stock_Available
ORD-1001,2026-01-05,Acme Retail Corp,contact@acmeretail.com,Enterprise ERP Module,Software,1250.00,2,2500.00,North America,45
ORD-1002,2026-01-12,Nexus Technologies,finance@nexustech.io,Cloud Server License,Infrastructure,450.00,5,2250.00,Europe,120
ORD-1003,2026-01-18,Global Logistics Ltd,billing@globallogistics.com,API Integration Suite,Software,800.00,1,800.00,Asia Pacific,60
ORD-1004,2026-02-02,Summit Financial,ops@summitfin.com,Security Audit Service,Services,1500.00,1,1500.00,North America,15
ORD-1005,2026-02-14,Apex Solutions,info@apexsol.com,Enterprise ERP Module,Software,1250.00,3,3750.00,Europe,42
ORD-1006,2026-02-22,Vanguard Media,media@vanguard.com,Cloud Server License,Infrastructure,450.00,8,3600.00,North America,112
ORD-1007,2026-03-01,Starlight Digital,accounts@starlight.io,Analytics Add-on,Software,350.00,4,1400.00,Asia Pacific,85
ORD-1008,2026-03-10,Pinnacle Systems,support@pinnacle.com,API Integration Suite,Software,800.00,2,1600.00,Europe,58
ORD-1009,2026-03-25,Horizon Ventures,invest@horizon.com,Security Audit Service,Services,1500.00,2,3000.00,North America,13
ORD-1010,2026-04-04,Quantum Dynamics,admin@quantumd.io,Enterprise ERP Module,Software,1250.00,4,5000.00,Asia Pacific,38`;

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'dashnova_sample_business_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (toast?.info) {
      toast.info('Sample dataset downloaded! Drag and drop it into the upload zone above.');
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      desc: 'Interactive Revenue, Sales, AOV, and customer metrics auto-computed from raw records.'
    },
    {
      icon: Brain,
      title: 'AI Executive Analyst',
      desc: 'Generates strategic briefings, growth opportunities, and anomaly alerts instantly.'
    },
    {
      icon: Activity,
      title: 'Business Health Score',
      desc: '6-pillar financial health score measuring revenue growth, margins, and customer retention.'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Forecasting',
      desc: 'Statistical forecasting algorithms projecting upcoming quarterly sales trends.'
    },
    {
      icon: FileText,
      title: 'Executive Reports',
      desc: 'Export-ready board summaries and CSV data tables formatted for decision makers.'
    }
  ];

  if (isProcessing) {
    return <DashboardAnalyticsLoader message="Parsing dataset records & compiling dashboard analytics..." />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 font-sans py-4 sm:py-8">
      {/* Hero Welcome Box */}
      <div className="bg-gradient-to-b from-gray-900 to-black text-white p-6 sm:p-10 rounded-2xl shadow-xl relative overflow-hidden border border-gray-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gray-200 border border-white/15 text-xs font-semibold backdrop-blur-xs">
            <Sparkles size={13} className="text-amber-400" />
            <span>Workspace Ready</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome to DashNova
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
            Your workspace is ready. Upload your first CSV or Excel dataset to unlock AI-powered business analytics, insights, forecasting, and executive reports.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-400" />
              100% Isolated Workspace
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1">
              <Zap size={14} className="text-amber-400" />
              Automated Parsing & KPIs
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={14} className="text-blue-400" />
              No Manual Setup Required
            </span>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-base font-bold text-gray-900">Upload Your Dataset</h2>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: .CSV, .XLSX, .XLS spreadsheets containing orders, sales, or customer records.
            </p>
          </div>

          <button
            onClick={handleDownloadSampleDataset}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold rounded-lg transition cursor-pointer shrink-0"
          >
            <Download size={14} className="text-gray-600" />
            <span>Download Sample Dataset</span>
          </button>
        </div>

        {/* Drag & Drop Upload Zone */}
        <UploadZone onUploadComplete={handleUploadComplete} />

        <div className="text-center pt-2">
          <p className="text-[11px] text-gray-400">
            Once uploaded, DashNova automatically extracts all columns, computes financial metrics, and generates live dashboard charts.
          </p>
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unlocked Intelligence Modules</h3>
          <span className="text-[11px] font-medium text-gray-400">Powered by DashNova Engine</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div 
                key={idx}
                className="p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition duration-150 space-y-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center">
                  <IconComponent size={18} />
                </div>
                <h4 className="text-xs font-bold text-gray-900">{feat.title}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Uploads Section (Empty state) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-900">Recent Uploads</h3>
          <span className="text-[10px] font-semibold text-gray-400">0 Datasets Active</span>
        </div>

        <div className="p-8 text-center border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center bg-gray-50/50">
          <FileSpreadsheet size={28} className="text-gray-300 mb-2" />
          <p className="text-xs font-bold text-gray-700">No Datasets Uploaded Yet</p>
          <p className="text-[11px] text-gray-400 mt-1 max-w-sm">
            Drag and drop your spreadsheet file above or click "Download Sample Dataset" to test DashNova immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
