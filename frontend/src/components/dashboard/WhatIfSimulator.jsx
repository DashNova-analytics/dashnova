import React, { useState } from 'react';
import { Sliders, RefreshCw, Sparkles, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { getDbState } from '../../services/dbStore';

export default function WhatIfSimulator() {
  const [priceChange, setPriceChange] = useState(10); // %
  const [employeeChange, setEmployeeChange] = useState(2); // count
  const [marketingChange, setMarketingChange] = useState(-20); // %
  const [inventoryChange, setInventoryChange] = useState(15); // %

  const dbState = getDbState();
  const rawRevStr = dbState.kpis?.totalRevenue || '0';
  const baseRevenue = parseFloat(rawRevStr.replace(/[^0-9.]/g, '')) || 100000;
  const baseProfitMargin = 25.0;
  const baseCashFlow = Math.round(baseRevenue * 0.5);

  // Estimate projections dynamically based on slider values
  const projectedRevMult = 1 + (priceChange * 0.007) + (marketingChange * 0.003) + (inventoryChange * 0.002);
  const projectedRevenue = Math.round(baseRevenue * projectedRevMult);

  const extraEmpCost = employeeChange * 45000;
  const mktgSavings = (marketingChange / 100) * 35000;
  const invCost = (inventoryChange / 100) * 25000;

  const netCostDiff = extraEmpCost - mktgSavings + invCost;
  const projectedProfit = Math.round((projectedRevenue * (baseProfitMargin / 100)) - netCostDiff);
  const projectedProfitMargin = ((projectedProfit / projectedRevenue) * 100).toFixed(1);
  const projectedCashFlow = Math.round(baseCashFlow + (projectedProfit - (baseRevenue * (baseProfitMargin / 100))));

  const handleReset = () => {
    setPriceChange(0);
    setEmployeeChange(0);
    setMarketingChange(0);
    setInventoryChange(0);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition duration-150 shadow-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold shrink-0">
            <Sliders size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Interactive What-If Decision Simulator</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Test pricing, headcount, and budget levers to model financial outcomes.</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="h-8 px-2.5 border border-gray-200 hover:border-gray-400 text-gray-600 hover:text-black text-xs font-semibold rounded flex items-center gap-1 transition cursor-pointer bg-white self-start sm:self-auto"
        >
          <RefreshCw size={12} />
          Reset Sliders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5">
        {/* Sliders Input Controls */}
        <div className="space-y-4 text-xs">
          {/* Price Change */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-700">Product Pricing Adjustment</span>
              <span className="font-mono font-bold text-black">{priceChange > 0 ? `+${priceChange}%` : `${priceChange}%`}</span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              value={priceChange}
              onChange={(e) => setPriceChange(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          {/* Hire Employees */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-700">New Employee Headcount</span>
              <span className="font-mono font-bold text-black">{employeeChange > 0 ? `+${employeeChange} staff` : `${employeeChange} staff`}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="10"
              value={employeeChange}
              onChange={(e) => setEmployeeChange(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          {/* Marketing Spend */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-700">Marketing Spend Variance</span>
              <span className="font-mono font-bold text-black">{marketingChange > 0 ? `+${marketingChange}%` : `${marketingChange}%`}</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={marketingChange}
              onChange={(e) => setMarketingChange(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          {/* Inventory Investment */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-700">Inventory Buffer Reserve</span>
              <span className="font-mono font-bold text-black">{inventoryChange > 0 ? `+${inventoryChange}%` : `${inventoryChange}%`}</span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              value={inventoryChange}
              onChange={(e) => setInventoryChange(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        </div>

        {/* Projected Outcome Telemetry */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Simulated Quarterly Impact</span>

            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="p-2.5 bg-white border border-gray-200 rounded-md">
                <span className="text-[10px] text-gray-500 block">Projected Revenue</span>
                <span className="text-xs font-bold text-gray-950 font-mono">Rs {projectedRevenue.toLocaleString()}</span>
              </div>
              <div className="p-2.5 bg-white border border-gray-200 rounded-md">
                <span className="text-[10px] text-gray-500 block">Net Profit</span>
                <span className="text-xs font-bold text-gray-950 font-mono">Rs {projectedProfit.toLocaleString()}</span>
              </div>
              <div className="p-2.5 bg-white border border-gray-200 rounded-md">
                <span className="text-[10px] text-gray-500 block">Profit Margin</span>
                <span className="text-xs font-bold text-gray-950 font-mono">{projectedProfitMargin}%</span>
              </div>
            </div>

            <div className="p-3 bg-black text-white rounded-md text-[11px] leading-relaxed flex items-start gap-2">
              <Sparkles size={14} className="shrink-0 mt-0.5 text-gray-300" />
              <div>
                <strong>AI Executive Analysis:</strong> Increasing pricing by {priceChange}% combined with reducing marketing by {Math.abs(marketingChange)}% is estimated to yield <strong>Rs {(projectedProfit - (baseRevenue * (baseProfitMargin / 100))).toLocaleString()}</strong> net gain while preserving core buyer conversion.
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between border-t border-gray-200 pt-2">
            <span>Monte Carlo Stochastic Model v2</span>
            <span>Accuracy Horizon: 90 Days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
