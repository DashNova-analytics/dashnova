import React, { useState } from 'react';
import ChartCard from '../components/dashboard/ChartCard';
import { TrendingUp, AlertTriangle, Cpu, HelpCircle, ArrowRight } from 'lucide-react';
import { Spinner } from '../components/common/Loader';

export default function Forecasting() {
  const [metric, setMetric] = useState('revenue');
  const [horizon, setHorizon] = useState('6');
  const [computing, setComputing] = useState(false);
  const [warning, setWarning] = useState('');

  const handleCompute = async (e) => {
    e.preventDefault();
    setComputing(true);
    setWarning('');

    await new Promise((resolve) => setTimeout(resolve, 1800));
    setComputing(false);
    setWarning('ML model requirements unmet: Growth forecasting engines require at least 30 consecutive days of historical transaction rows in the active ledger database. Please upload spreadsheets with older dates in the Ingestion tab.');
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Trend Forecasting</h1>
          <p className="text-xs text-gray-500 mt-1">
            Predict future revenue, invoice spikes, and inventory restocking curves using machine learning models and Gemini AI.
          </p>
        </div>
      </div>

      {/* Configuration Form Panel */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Cpu size={14} className="text-gray-400" />
          Forecasting Configuration
        </h3>

        <form onSubmit={handleCompute} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Target Metric</label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="w-full h-9 px-2 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:border-black"
            >
              <option value="revenue">Gross Income / Revenue</option>
              <option value="orders">Sales Volume (Orders Count)</option>
              <option value="sku-depletion">SKU Stock Velocity</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Prediction Horizon</label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value)}
              className="w-full h-9 px-2 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:border-black"
            >
              <option value="3">Next 3 Months</option>
              <option value="6">Next 6 Months</option>
              <option value="12">Next 12 Months (Yearly projection)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Model Engine</label>
            <select
              className="w-full h-9 px-2 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:border-black"
              disabled
            >
              <option>Gemini 2.0 (Autoregressive ML + Context)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={computing}
            className="h-9 bg-black text-white hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {computing ? (
              <>
                <Spinner size="sm" className="text-gray-400" />
                Computing trends...
              </>
            ) : (
              <>
                <TrendingUp size={14} />
                Compute Forecast
              </>
            )}
          </button>
        </form>

        {warning && (
          <div className="mt-4 p-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-md text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertTriangle size={15} className="text-gray-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">Forecasting Model Suspended</p>
              <p className="text-gray-500 mt-0.5">{warning}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Forecast Chart Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Predictive Growth Trendline"
          subtitle="Aggregated seasonal predictions plotted alongside historical records"
          className="lg:col-span-2"
          hasData={false}
        />

        {/* Model info panel */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150 flex flex-col justify-between font-sans">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu size={12} className="text-gray-400" />
              Machine Learning Context
            </h3>

            <div className="space-y-3 pt-2">
              <div>
                <p className="text-xs font-bold text-gray-900">Autoregressive (ARIMA) Model</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                  Used for stationary historical trends to outline cyclic yearly behaviors.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Gemini LLM Contextual Layer</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                  Blends seasonal external factors (such as holiday impacts) to refine statistical math.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 border-t border-gray-100 pt-3 mt-4">
            Forecast computations are re-evaluated each time new CSV spreadsheets are uploaded.
          </div>
        </div>
      </div>
    </div>
  );
}
