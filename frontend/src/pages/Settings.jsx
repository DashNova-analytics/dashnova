import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '../components/ui/ToastContext';
import {
  User,
  Building2,
  Palette,
  Bell,
  ShieldCheck,
  Key,
  Plus,
  Lock,
  Check,
  Globe,
  HelpCircle,
  Play
} from 'lucide-react';
import { useOrganization } from "@clerk/clerk-react";
import { UserProfile } from '@clerk/clerk-react';
import OrganizationProfile from '../components/clerk/OrganizationProfile';


export default function Settings() {
  const { user } = useUser();
  const toast = useToast();
  const { organization, membership } = useOrganization();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabQuery = searchParams.get('tab');
  const [activeSubTab, setActiveSubTab] = useState(tabQuery || 'profile');

  useEffect(() => {
    if (tabQuery && ['profile', 'organization', 'appearance', 'notifications', 'security', 'api-keys', 'onboarding-tour'].includes(tabQuery)) {
      setActiveSubTab(tabQuery);
    }
  }, [tabQuery]);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dashnova_theme') || 'light';
  });

  const handleToggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('dashnova_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      toast.success('Dark theme successfully enabled.');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      toast.success('Light theme successfully enabled.');
    }
  };

  const [apiKeys, setApiKeys] = useState([
    { name: 'Default Public Key', key: 'pk_live_51Nv••••••••••••••••••••3aB', status: 'Active', created: '2026-06-15' },
  ]);

  const subTabs = [
    { id: 'profile', name: 'Profile Settings', icon: User },
    { id: 'organization', name: 'Organization', icon: Building2 },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security & Access', icon: ShieldCheck },
    { id: 'api-keys', name: 'Developer API Keys', icon: Key },
    { id: 'onboarding-tour', name: 'Guided Tutorial', icon: HelpCircle },
  ];

  const handleCreateApiKey = () => {
    const newKey = {
      name: `Custom Service Token (${apiKeys.length + 1})`,
      key: 'sk_live_new_key_••••••••••••••••' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      status: 'Active',
      created: new Date().toISOString().split('T')[0]
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success('New API key generated successfully.');
  };

  const handleRevokeKey = (index) => {
    setApiKeys(apiKeys.filter((_, i) => i !== index));
    toast.success('API key successfully revoked.');
  };

  const handleSubTabChange = (tabId) => {
    setActiveSubTab(tabId);
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage user profiles, billing workspaces, system configurations, and secure API credentials.
        </p>
      </div>

      {/* Settings Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sub-Tab Navigation */}
        <div className="flex flex-col border border-gray-200 rounded-lg bg-white py-2 hover:border-gray-300 transition duration-150">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSubTabChange(tab.id)}
                className={`w-full text-left h-9 px-4 text-xs font-bold flex items-center gap-2.5 transition cursor-pointer focus:outline-none
                  ${isActive
                    ? 'bg-gray-50 text-black border-l-2 border-black font-bold'
                    : 'text-gray-400 hover:text-black hover:bg-gray-50/50'
                  }
                `}
              >
                <tab.icon size={13} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Right Configuration Form */}
        <div className="lg:col-span-3">
          {activeSubTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4 hover:border-gray-300 transition duration-150">
                <h3 className="text-sm font-bold text-gray-900">User Account Portal</h3>
                <p className="text-xs text-gray-400 mt-0.5">Your profile is securely synced live through enterprise systems.</p>
              </div>
              <UserProfile />
            </div>
          )}

          {activeSubTab === 'organization' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4 hover:border-gray-300 transition duration-150">
                <h3 className="text-sm font-bold text-gray-900">Workspace Portal</h3>
                <p className="text-xs text-gray-400 mt-0.5">Create and coordinate shared enterprise workspaces powered by Organizations.</p>
              </div>
              {/* <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold">Organization</h3>
                  <p className="text-xs text-gray-500">
                    Workspace information managed through Clerk.
                  </p>
                </div>

                {organization ? (
                  <div className="grid grid-cols-2 gap-6 text-sm">

                    <div>
                      <p className="text-gray-400 text-xs">Organization Name</p>
                      <p className="font-semibold">{organization.name}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs">Organization ID</p>
                      <p className="font-mono">{organization.id}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs">Slug</p>
                      <p>{organization.slug || "-"}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs">Your Role</p>
                      <p>{membership?.role}</p>
                    </div>

                  </div>
                ) : (
                  <p>No organization selected.</p>
                )}
              </div> */}
              <OrganizationProfile />
            </div>
          )}

          {activeSubTab === 'appearance' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150 font-sans space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Appearance Settings</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">Adjust the visual balance of the platform interface.</p>
              </div>

              <div className="space-y-4 max-w-lg border-t border-gray-100 pt-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Display Theme</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => handleToggleTheme('light')}
                      className={`border rounded-md p-3 text-center cursor-pointer shadow-xs transition ${theme === 'light'
                        ? 'border-black bg-white'
                        : 'border-gray-200 bg-gray-50/20 hover:border-gray-400'
                        }`}
                    >
                      {theme === 'light' && <Check size={14} className="mx-auto mb-1 text-black" />}
                      <span className={`text-xs font-bold ${theme === 'light' ? 'text-black' : 'text-gray-500'}`}>Enterprise Light</span>
                    </div>
                    <div
                      onClick={() => handleToggleTheme('dark')}
                      className={`border rounded-md p-3 text-center cursor-pointer shadow-xs transition ${theme === 'dark'
                        ? 'border-white bg-gray-900'
                        : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                        }`}
                    >
                      {theme === 'dark' && <Check size={14} className="mx-auto mb-1 text-white" />}
                      <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-400'}`}>Enterprise Dark</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'notifications' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150 font-sans space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">Manage trigger events for reports and analytical alerts.</p>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 w-4 h-4 border-gray-300 rounded focus:ring-0 accent-black" />
                    <div>
                      <p className="text-xs font-bold text-gray-950">Email Compilation Reports</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Receive a compiled spreadsheet of gross statistics each Monday.</p>
                    </div>
                  </label>


                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 w-4 h-4 border-gray-300 rounded focus:ring-0 accent-black" />
                    <div>
                      <p className="text-xs font-bold text-gray-950">Critical Low-Stock Warnings</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Alert immediately when SKU velocity models predict exhaustion under 7 days.</p>
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => triggerFeedback('Notification rules updated successfully.')}
                  className="mt-2 h-8 px-4 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition cursor-pointer"
                >
                  Update Preferences
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'security' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150 font-sans space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Security & Access</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">Protect workspace records with password guidelines and MFA keys.</p>
              </div>

              <div className="space-y-4 max-w-lg border-t border-gray-100 pt-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Unified Security</label>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Two-factor credentials, session logs, and password alterations are unified inside the ** User Profile Control Panel**.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSubTab('profile');
                    triggerFeedback('Redirected to  User Profile dashboard.');
                  }}
                  className="h-8 px-4 border border-black text-black hover:bg-gray-50 text-xs font-bold rounded transition cursor-pointer"
                >
                  Configure Security inside Your profile
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'api-keys' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Developer API Keys</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Securely query compiled database ledgers programmatically.</p>
                </div>

                <button
                  onClick={handleCreateApiKey}
                  className="h-8 px-2.5 bg-black text-white hover:bg-gray-800 text-xs font-bold rounded flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus size={13} />
                  Generate New Key
                </button>
              </div>

              {/* API Keys Table */}
              <div className="border border-gray-200 rounded-md overflow-hidden mt-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                      <th className="px-4 py-2.5">Key Label</th>
                      <th className="px-4 py-2.5">Key Value</th>
                      <th className="px-4 py-2.5">Created</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {apiKeys.map((k, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="px-4 py-3 font-bold text-gray-900">{k.name}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{k.key}</td>
                        <td className="px-4 py-3 text-gray-400 font-mono text-[10px]">{k.created}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleRevokeKey(idx)}
                            className="text-red-600 hover:text-red-700 font-bold cursor-pointer"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'onboarding-tour' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition duration-150 font-sans space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Guided Onboarding Tutorial</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">Re-launch or manage the step-by-step guidance overlays.</p>
              </div>

              <div className="border-t border-gray-100 pt-6 max-w-lg space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  The interactive guided tour directs you through creating organizations, using the workspace switcher, syncing spreadsheet ledger files, and accessing advanced analytics dashboards.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      localStorage.removeItem('dashnova_tour_completed');
                      localStorage.setItem('dashnova_tour_step', '0');
                      window.location.reload();
                    }}
                    className="h-8 px-4 bg-black text-white hover:bg-gray-800 text-xs font-bold rounded flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Play size={13} />
                    Start Onboarding Tour
                  </button>

                  <button
                    onClick={() => {
                      localStorage.setItem('dashnova_tour_completed', 'true');
                      localStorage.removeItem('dashnova_tour_step');
                      window.location.reload();
                    }}
                    className="h-8 px-4 border border-gray-200 hover:border-gray-400 text-xs font-bold text-gray-600 hover:text-black rounded transition cursor-pointer"
                  >
                    Reset Completed State
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
