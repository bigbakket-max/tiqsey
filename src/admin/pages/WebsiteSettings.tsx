import React, { useState, useEffect } from 'react';
import {
  Globe,
  Save,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  Search,
  Share2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminToast } from '../contexts/AdminToastContext';
import { SkeletonBox } from '../components/AdminMotion';
import {
  WebsiteSettingsConfig,
  DEFAULT_WEBSITE_SETTINGS,
  loadAdminConfig,
  saveAdminConfig,
  sanitizeUrlOrEmpty,
} from '../../utils/adminConfigClient';

export default function WebsiteSettings() {
  const { user } = useAuth();
  const { notify } = useAdminToast();

  const [config, setConfig] = useState<WebsiteSettingsConfig>(DEFAULT_WEBSITE_SETTINGS);
  const [savedSnapshot, setSavedSnapshot] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const res = await loadAdminConfig<WebsiteSettingsConfig>(
        'website_settings',
        user?.email,
        DEFAULT_WEBSITE_SETTINGS
      );
      if (active) {
        const merged: WebsiteSettingsConfig = {
          ...DEFAULT_WEBSITE_SETTINGS,
          ...(res.data || {}),
          socialLinks: {
            ...DEFAULT_WEBSITE_SETTINGS.socialLinks,
            ...(res.data?.socialLinks || {}),
          },
        };
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
    if (!config.siteName.trim()) {
      notify('warning', 'Site name cannot be empty.');
      return;
    }

    // Validate social URLs
    const socialEntries = Object.entries(config.socialLinks) as Array<[keyof WebsiteSettingsConfig['socialLinks'], string]>;
    for (const [key, value] of socialEntries) {
      if (value.trim() && !sanitizeUrlOrEmpty(value)) {
        notify('error', `Invalid ${key} URL. Please use a full https:// address.`);
        return;
      }
    }

    setSaving(true);
    const res = await saveAdminConfig('website_settings', config, user?.email);
    setSaving(false);
    if (!res.ok) {
      notify('error', res.error || 'Failed to save website settings.');
      return;
    }
    setSavedSnapshot(JSON.stringify(config));
    notify('success', 'Website settings saved successfully.');
  };

  const handleReset = () => {
    setConfig(DEFAULT_WEBSITE_SETTINGS);
    notify('info', 'Restored default website settings. Click Save Changes to persist.');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonBox className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonBox className="h-96 lg:col-span-2 rounded-2xl" />
          <SkeletonBox className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Website Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage storefront brand identity, contact details, search engine metadata, and maintenance status.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
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
        {/* Left Column: Core & SEO */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Identity */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Globe className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Brand & Contact Identity</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Site Name</label>
                <input
                  type="text"
                  required
                  value={config.siteName}
                  onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tagline</label>
                <input
                  type="text"
                  value={config.tagline}
                  onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Support Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={config.supportEmail}
                    onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Support Phone</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={config.supportPhone}
                    onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Business Address</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={config.officeAddress}
                    onChange={(e) => setConfig({ ...config, officeAddress: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SEO Metadata + Live SERP Preview */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">SEO & Search Engine Preview</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Default Meta Title</label>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">{config.seoTitle.length} / 70</span>
                </div>
                <input
                  type="text"
                  maxLength={120}
                  value={config.seoTitle}
                  onChange={(e) => setConfig({ ...config, seoTitle: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Meta Description</label>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">{config.seoDescription.length} / 160</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={config.seoDescription}
                  onChange={(e) => setConfig({ ...config, seoDescription: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <p className="text-[11px] text-slate-500 font-mono">https://tiqsey.com</p>
                <p className="text-sm font-semibold text-blue-700 dark:text-sky-400 line-clamp-1">
                  {config.seoTitle || `${config.siteName} — ${config.tagline}`}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {config.seoDescription || 'No meta description provided.'}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Social & Maintenance */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Share2 className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Social Profiles</h2>
            </div>

            <div className="space-y-3 text-xs">
              {(
                [
                  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/tiqsey_official' },
                  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/tiqsey' },
                  { key: 'twitter', label: 'X / Twitter', placeholder: 'https://x.com/tiqsey' },
                  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@tiqsey' },
                ] as const
              ).map((item) => (
                <div key={item.key}>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">{item.label}</label>
                  <input
                    type="url"
                    value={config.socialLinks[item.key]}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        socialLinks: { ...config.socialLinks, [item.key]: e.target.value },
                      })
                    }
                    placeholder={item.placeholder}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Maintenance Banner</h2>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={config.maintenanceMode}
                onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  config.maintenanceMode ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-slate-500 dark:text-slate-400">
                Display a scheduled maintenance notice to storefront visitors without blocking admin access.
              </p>
              <textarea
                rows={3}
                value={config.maintenanceMessage}
                onChange={(e) => setConfig({ ...config, maintenanceMessage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
              />
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
