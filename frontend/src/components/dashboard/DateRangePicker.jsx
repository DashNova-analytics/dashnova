import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, RotateCcw, Filter, X } from 'lucide-react';

export const PRESETS = [
  { id: '7d', label: 'Last 7 Days', shortLabel: '7D' },
  { id: '30d', label: 'Last 30 Days', shortLabel: '30D' },
  { id: '90d', label: 'Last 90 Days', shortLabel: '90D' },
  { id: 'ytd', label: 'Year to Date', shortLabel: 'YTD' },
  { id: 'all', label: 'All Time', shortLabel: 'All' },
  { id: 'custom', label: 'Custom Range', shortLabel: 'Custom' },
];

export default function DateRangePicker({ selectedRange, onRangeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRangeType, setTempRangeType] = useState(selectedRange?.rangeType || '7d');
  const [tempStartDate, setTempStartDate] = useState(selectedRange?.startDate || '');
  const [tempEndDate, setTempEndDate] = useState(selectedRange?.endDate || '');
  const dropdownRef = useRef(null);

  useEffect(() => {
    setTempRangeType(selectedRange?.rangeType || '7d');
    setTempStartDate(selectedRange?.startDate || '');
    setTempEndDate(selectedRange?.endDate || '');
  }, [selectedRange?.rangeType, selectedRange?.startDate, selectedRange?.endDate]);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = (type, start = tempStartDate, end = tempEndDate) => {
    onRangeChange({
      rangeType: type,
      startDate: start,
      endDate: end,
    });
    setIsOpen(false);
  };

  const handlePresetClick = (presetId) => {
    setTempRangeType(presetId);
    if (presetId !== 'custom') {
      handleApply(presetId);
    }
  };

  const handleReset = () => {
    setTempRangeType('7d');
    setTempStartDate('');
    setTempEndDate('');
    handleApply('7d', '', '');
  };

  // Helper text to render on trigger button
  const getTriggerLabel = () => {
    if (selectedRange?.rangeType === 'custom') {
      if (selectedRange.startDate && selectedRange.endDate) {
        return `${selectedRange.startDate} to ${selectedRange.endDate}`;
      }
      return 'Custom Range';
    }
    const preset = PRESETS.find((p) => p.id === selectedRange?.rangeType);
    return preset ? preset.label : 'Last 7 Days';
  };

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      {/* Date Picker Button Trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 bg-white border border-gray-200 rounded-md p-1 shadow-xs w-full sm:w-auto">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-2 hidden lg:flex items-center gap-1 shrink-0">
          <Filter size={11} className="text-gray-400" />
          Period:
        </span>
        
        {/* Quick Chip Selector bar - Responsive horizontal scroll on mobile */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded p-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {PRESETS.map((p) => {
            const isActive = selectedRange?.rangeType === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetClick(p.id)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-black text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                {p.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Dropdown Toggle Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 sm:h-7 px-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold rounded flex items-center justify-between gap-2 transition cursor-pointer w-full sm:w-auto shrink-0"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Calendar size={13} className="text-gray-500 shrink-0" />
            <span className="truncate">{getTriggerLabel()}</span>
          </span>
          <ChevronDown size={12} className={`text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto right-0 sm:right-0 mt-2 w-full sm:w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-3.5 sm:p-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-black" />
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Filter Dashboard Period</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5 rounded hover:bg-gray-100"
            >
              <X size={14} />
            </button>
          </div>

          {/* Preset Buttons Grid */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Time Presets</label>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESETS.map((p) => {
                const isSelected = tempRangeType === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setTempRangeType(p.id);
                      if (p.id !== 'custom') {
                        handleApply(p.id);
                      }
                    }}
                    className={`h-8 px-2 text-xs font-medium rounded flex items-center justify-between border transition cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    <span>{p.label}</span>
                    {isSelected && <Check size={12} className="text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Date Range Inputs */}
          {tempRangeType === 'custom' && (
            <div className="space-y-3 pt-2 border-t border-gray-100 animate-in fade-in duration-150">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Custom Date Interval</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[10px] text-gray-500 mb-1">Start Date</span>
                  <input
                    type="date"
                    value={tempStartDate}
                    onChange={(e) => setTempStartDate(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-black bg-gray-50"
                  />
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 mb-1">End Date</span>
                  <input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-black bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-semibold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={11} />
              Reset All
            </button>
            <div className="flex items-center gap-1.5">
              {tempRangeType === 'custom' && (
                <button
                  type="button"
                  onClick={() => handleApply('custom', tempStartDate, tempEndDate)}
                  disabled={!tempStartDate || !tempEndDate}
                  className="h-7 px-3 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded cursor-pointer disabled:opacity-40"
                >
                  Apply Range
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
