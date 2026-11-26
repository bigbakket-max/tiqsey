import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Download,
  Globe,
  Receipt,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminToast } from '../contexts/AdminToastContext';
import { SkeletonBox } from '../components/AdminMotion';
import {
  PlatformSettingsConfig,
  DEFAULT_PLATFORM_SETTINGS,
  loadAdminConfig,
  saveAdminConfig,
} from '../../utils/adminConfigClient';

export default function AdminSettings() {
  const { user } = useAuth();
  const { notify } = useAdminToast();

  const [config, setConfig] = useState<PlatformSettingsConfig>(DEFAULT_PLATFORM_SETTINGS);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const res = await loadAdminConfig<PlatformSettingsConfig>(
        'platform_settings',
        user?.email,
        DEFAULT_PLATFORM_SETTINGS
      );
      if (active) {
        const merged = { ...DEFAULT_PLATFORM_SETTINGS, ...(res.data || {}) };
        setConfig(merged);
        setSavedSnapshot(JSON.stringify(merged));
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user?.email]);

  const isDirty = savedSnapshot !== '' && JSON.stringify(config) !== savedSnapshot;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (config.taxPercent < 0 || config.taxPercent > 50 || config.serviceFeePercent < 0 || config.serviceFeePercent > 50) {
      notify('warning', 'Tax and service fee percentages must be between 0% and 50%.');
      return;
    }
    setSaving(true);
    const res = await saveAdminConfig('platform_settings', config, user?.email);
    setSaving(false);
    if (!res.ok) {
      notify('error', res.error || 'Could not save platform settings.');
      return;
    }
    setSavedSnapshot(JSON.stringify(config));
    notify('success', 'Platform settings updated successfully.');
  };

  const handleReset = () => {
    setConfig(DEFAULT_PLATFORM_SETTINGS);
    notify('info', 'Restored default platform settings. Click Save Changes to persist.');
  };

  const handleExportBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      exportedBy: user?.email || 'admin',
      platformSettings: config,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiqsey-settings-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('success', 'Downloaded platform configuration backup JSON.');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonBox className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonBox className="h-80 lg:col-span-2 rounded-2xl" />
          <SkeletonBox className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure localization, booking workflows, fee percentages, and administrator notifications.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Defaults
          </button>
          <button
            type="submit"
            disabled={saving || !isDirty}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Localization & Currency */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Globe className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Regional & Localization Defaults</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Default Currency</label>
                <select
                  value={config.defaultCurrency}
                  onChange={(e) =>
                    setConfig({ ...config, defaultCurrency: e.target.value as PlatformSettingsConfig['defaultCurrency'] })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-mono"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Storefront Language</label>
                <select
                  value={config.defaultLanguage}
                  onChange={(e) =>
                    setConfig({ ...config, defaultLanguage: e.target.value as PlatformSettingsConfig['defaultLanguage'] })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white"
                >
                  <option value="en">English (EN)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                  <option value="de">Deutsch (DE)</option>
                  <option value="it">Italiano (IT)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Operations Timezone</label>
                <select
                  value={config.timezone}
                  onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white"
                >
                  <option value="Europe/Amsterdam">Europe/Amsterdam (CET)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Booking & Fee Rules */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Receipt className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Booking References & Checkout Fees</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Order Reference Prefix</label>
                <input
                  type="text"
                  maxLength={10}
                  value={config.bookingPrefix}
                  onChange={(e) => setConfig({ ...config, bookingPrefix: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Default VAT / Tax (%)</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  step="0.5"
                  value={config.taxPercent}
                  onChange={(e) => setConfig({ ...config, taxPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Service Fee (%)</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  step="0.5"
                  value={config.serviceFeePercent}
                  onChange={(e) => setConfig({ ...config, serviceFeePercent: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Auto-Confirm Instant Tickets</p>
                <p className="text-slate-500 dark:text-slate-400">
                  Automatically mark eligible bookings as confirmed upon successful checkout.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={config.autoConfirmBookings}
                onClick={() => setConfig({ ...config, autoConfirmBookings: !config.autoConfirmBookings })}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                  config.autoConfirmBookings ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.autoConfirmBookings ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Bell className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Email Alert Preferences</h2>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {(
                [
                  {
                    key: 'emailNewBookingAlerts',
                    title: 'New Booking Alerts',
                    desc: 'Send instant email alerts when a customer completes an order.',
                  },
                  {
                    key: 'emailCancellationAlerts',
                    title: 'Cancellation & Refund Notices',
                    desc: 'Notify operations immediately when an order is cancelled or refunded.',
                  },
                  {
                    key: 'emailDailyDigest',
                    title: 'Daily Performance Summary',
                    desc: 'Deliver an automated end-of-day revenue and ticket volume recap.',
                  },
                ] as const
              ).map((item) => (
                <div key={item.key} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={config[item.key]}
                    onClick={() => setConfig({ ...config, [item.key]: !config[item.key] })}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                      config[item.key] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        config[item.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Administrator Security Summary */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Administrator Access</h2>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <p className="text-[11px] text-slate-400">Active Session</p>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{user?.name || 'System Admin'}</p>
                <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {user?.email || 'admin@tiqsey.com'}
                </p>
              </div>

              <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
                <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                  Authorized Admin Accounts
                </p>
                <ul className="space-y-1 font-mono text-[11px] pl-1">
                  <li>· admin@tiqsey.com</li>
                  <li>· superadmin@tiqsey.com</li>
                  <li>· bigbakket@gmail.com</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
