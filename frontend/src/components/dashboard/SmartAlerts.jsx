import React, { useState } from 'react';
import { Bell, AlertTriangle, TrendingUp, Package, Users, ArrowUpRight, Check, ShieldAlert } from 'lucide-react';
import { getDbState } from '../../services/dbStore';

export default function SmartAlerts({ onActionClick }) {
  const [dismissed, setDismissed] = useState([]);
  const dbState = getDbState();

  const alerts = (dbState.alerts && dbState.alerts.length > 0)
    ? dbState.alerts.map(a => ({
        ...a,
        icon: a.type === 'warning' ? Package : TrendingUp
      }))
    : [
        {
          id: 'a1',
          type: 'success',
          icon: TrendingUp,
          title: 'Dataset Ingestion Complete',
          message: 'All business metrics parsed successfully from uploaded dataset.',
          actionText: 'View Metrics',
          actionKey: 'revenue',
          time: 'Just now'
        }
      ];

  const handleDismiss = (id) => {
    setDismissed([...dismissed, id]);
  };

  const visibleAlerts = alerts.filter(a => !dismissed.includes(a.id));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition duration-150 shadow-xs font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold shrink-0">
            <Bell size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Smart Proactive Alerts</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Automated signal monitoring & anomaly detection engine.</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
          {visibleAlerts.length} Active Alerts
        </span>
      </div>

      <div className="divide-y divide-gray-100 pt-1">
        {visibleAlerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div key={alert.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  alert.type === 'critical' ? 'bg-red-100 text-red-700' :
                  alert.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <Icon size={14} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-950">{alert.title}</span>
                    <span className="text-[9px] text-gray-400 font-mono">{alert.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{alert.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => onActionClick && onActionClick(alert.actionKey, alert.title)}
                  className="h-7 px-2.5 bg-black text-white hover:bg-gray-800 text-[11px] font-bold rounded flex items-center gap-1 transition cursor-pointer"
                >
                  <span>{alert.actionText}</span>
                  <ArrowUpRight size={11} />
                </button>
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="h-7 px-2 border border-gray-200 text-gray-400 hover:text-black hover:border-gray-300 text-[10px] font-bold rounded transition cursor-pointer"
                  title="Dismiss alert"
                >
                  <Check size={12} />
                </button>
              </div>
            </div>
          );
        })}

        {visibleAlerts.length === 0 && (
          <div className="py-6 text-center text-xs text-gray-400">
            All system notifications cleared. Systems running smoothly!
          </div>
        )}
      </div>
    </div>
  );
}
