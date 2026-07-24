import React, { useState } from 'react';
import { Target, Plus, CheckCircle2, TrendingUp, Clock, X } from 'lucide-react';
import { getDbState } from '../../services/dbStore';

export default function GoalTracker() {
  const [showAddModal, setShowAddModal] = useState(false);
  const dbState = getDbState();

  const [goals, setGoals] = useState(
    dbState.goals && dbState.goals.length > 0
      ? dbState.goals
      : [
          {
            id: 'g1',
            title: 'Uploaded Dataset Revenue Goal',
            target: dbState.kpis?.totalRevenue || 'Rs 1,00,000',
            current: dbState.kpis?.totalRevenue || 'Rs 0',
            progress: 100,
            status: 'On Track',
            estimate: 'Derived from uploaded transaction ledger',
            type: 'revenue'
          }
        ]
  );

  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newTitle || !newTarget) return;

    setGoals([...goals, {
      id: `g_${Date.now()}`,
      title: newTitle,
      target: newTarget,
      current: 'Rs 0',
      progress: 15,
      status: 'In Progress',
      estimate: 'Tracking initiated just now',
      type: 'custom'
    }]);

    setNewTitle('');
    setNewTarget('');
    setShowAddModal(false);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition duration-150 shadow-xs font-sans">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold shrink-0">
              <Target size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">Executive Goal Tracking</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Automated progress tracking & velocity run-rate estimation.</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="h-8 px-3 bg-black text-white hover:bg-gray-800 text-xs font-bold rounded flex items-center gap-1 transition cursor-pointer"
          >
            <Plus size={13} />
            Set Goal
          </button>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {goals.map((g) => (
            <div key={g.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-950 truncate max-w-[170px]">{g.title}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    g.progress >= 100 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {g.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs mb-1">
                  <span className="text-gray-500 text-[11px]">Current: <strong className="text-gray-900 font-mono">{g.current}</strong></span>
                  <span className="text-gray-400 text-[10px]">Target: <strong className="text-gray-700 font-mono">{g.target}</strong></span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full transition-all duration-500 ${g.progress >= 100 ? 'bg-emerald-600' : 'bg-black'}`}
                    style={{ width: `${Math.min(g.progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-200/60 font-mono">
                <Clock size={11} className="text-gray-400 shrink-0" />
                <span className="truncate">{g.estimate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-xl max-w-md w-full p-6 shadow-xl animate-fade-in font-sans relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-bold text-gray-900 mb-4">Set Strategic Business Goal</h3>

            <form onSubmit={handleAddGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Goal Metric Title</label>
                <input
                  type="text"
                  placeholder="e.g. Q3 ARR Growth Target"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Target Threshold</label>
                <input
                  type="text"
                  placeholder="e.g. Rs 15,00,000 or 1,500 active users"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:text-black rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded text-xs font-bold"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
