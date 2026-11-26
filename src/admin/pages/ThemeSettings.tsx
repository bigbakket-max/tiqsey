import React, { useState, useEffect } from 'react';
import {
  Palette,
  Save,
  RotateCcw,
  Sun,
  Moon,
  Monitor,
  Layout,
  Sparkles,
  Megaphone,
  Check,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminToast } from '../contexts/AdminToastContext';
import { SkeletonBox } from '../components/AdminMotion';
import {
  ThemeSettingsConfig,
  DEFAULT_THEME_SETTINGS,
  loadAdminConfig,
  saveAdminConfig,
} from '../../utils/adminConfigClient';

export default function ThemeSettings() {
  const { user } = useAuth();
  const { notify } = useAdminToast();

  const [config, setConfig] = useState<ThemeSettingsConfig>(DEFAULT_THEME_SETTINGS);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const res = await loadAdminConfig<ThemeSettingsConfig>(
        'theme_settings',
        user?.email,
        DEFAULT_THEME_SETTINGS
      );
      if (active) {
        const merged = { ...DEFAULT_THEME_SETTINGS, ...(res.data || {}) };
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
    setSaving(true);
    const res = await saveAdminConfig('theme_settings', config, user?.email);
    setSaving(false);
    if (!res.ok) {
      notify('error', res.error || 'Could not save theme preferences.');
      return;
    }
    setSavedSnapshot(JSON.stringify(config));
    notify('success', 'Storefront theme preferences saved.');
  };

  const handleReset = () => {
    setConfig(DEFAULT_THEME_SETTINGS);
    notify('info', 'Restored default storefront theme layout. Click Save Changes to persist.');
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

  const radiusPreviewClass =
    config.borderRadius === 'sharp'
      ? 'rounded-md'
      : config.borderRadius === 'soft'
      ? 'rounded-2xl'
      : 'rounded-xl';

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Theme Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure public storefront presentation, layout density, and top announcement bar while keeping brand colors & fonts locked.
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
        <div className="lg:col-span-2 space-y-6">
          {/* Display Mode & Layout */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Palette className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Storefront Display Mode</h2>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              {(
                [
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System Auto', icon: Monitor },
                ] as const
              ).map((mode) => {
                const Icon = mode.icon;
                const selected = config.defaultColorMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setConfig({ ...config, defaultColorMode: mode.id })}
                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border font-semibold transition-all cursor-pointer ${
                      selected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Homepage Hero Layout
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {(
                  [
                    { id: 'immersive-search', title: 'Immersive Search', desc: 'Full-width visual hero with prominent destination finder' },
                    { id: 'split-editorial', title: 'Split Editorial', desc: 'Balanced headline left with featured attraction showcase' },
                    { id: 'compact-catalog', title: 'Compact Catalog', desc: 'Fast-scroll header putting top tickets immediately visible' },
                  ] as const
                ).map((item) => {
                  const selected = config.heroStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setConfig({ ...config, heroStyle: item.id })}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        selected
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{item.title}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">Catalog Card Density</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['comfortable', 'compact'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setConfig({ ...config, cardDensity: d })}
                      className={`py-2 rounded-xl border font-semibold capitalize cursor-pointer ${
                        config.cardDensity === d
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">Card Corner Radius</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['sharp', 'rounded', 'soft'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setConfig({ ...config, borderRadius: r })}
                      className={`py-2 rounded-xl border font-semibold capitalize cursor-pointer ${
                        config.borderRadius === r
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Announcement Bar & Experience Switches */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Megaphone className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Announcement Bar & Visual Cues</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Top Announcement Ribbon</p>
                  <p className="text-slate-500 dark:text-slate-400">Highlight instant ticket delivery or seasonal deals at the top of the storefront.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={config.showAnnouncementBar}
                  onClick={() => setConfig({ ...config, showAnnouncementBar: !config.showAnnouncementBar })}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    config.showAnnouncementBar ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.showAnnouncementBar ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {config.showAnnouncementBar && (
                <input
                  type="text"
                  value={config.announcementText}
                  onChange={(e) => setConfig({ ...config, announcementText: e.target.value })}
                  placeholder="Instant mobile tickets & free cancellation..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white"
                />
              )}

              <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Instant Confirmation Badges</p>
                  <p className="text-slate-500 dark:text-slate-400">Display instant mobile entry indicators on eligible attraction cards.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={config.showInstantConfirmationBadge}
                  onClick={() => setConfig({ ...config, showInstantConfirmationBadge: !config.showInstantConfirmationBadge })}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    config.showInstantConfirmationBadge ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.showInstantConfirmationBadge ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Storefront Motion Transitions</p>
                  <p className="text-slate-500 dark:text-slate-400">Enable smooth scroll reveals and hover transitions across ticket listings.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={config.enableMotionEffects}
                  onClick={() => setConfig({ ...config, enableMotionEffects: !config.enableMotionEffects })}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    config.enableMotionEffects ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.enableMotionEffects ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Live Storefront Miniature Preview */}
        <div className="space-y-4">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 sticky top-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Live Preview</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400 capitalize">{config.defaultColorMode}</span>
            </div>

            <div
              className={`border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden ${
                config.defaultColorMode === 'dark' ? 'bg-slate-950 text-white' : 'bg-[#F8F9FC] text-slate-900'
              }`}
            >
              {config.showAnnouncementBar && (
                <div className="bg-blue-600 text-white text-[10px] font-medium px-3 py-1.5 text-center truncate">
                  {config.announcementText || 'Instant mobile tickets available'}
                </div>
              )}
              <div className="p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-wider text-blue-600 dark:text-sky-400">TIQSEY</span>
                  <div className="flex gap-2 text-[10px] opacity-70">
                    <span>Attractions</span>
                    <span>Cities</span>
                    <span>Blog</span>
                  </div>
                </div>

                <div
                  className={`bg-gradient-to-r from-[#1e40af] via-[#2563eb] to-[#0284c7] text-white p-3.5 ${radiusPreviewClass} ${
                    config.heroStyle === 'compact-catalog' ? 'py-2.5' : 'py-5'
                  }`}
                >
                  <p className="text-xs font-bold">More Culture, More Experience</p>
                  <p className="text-[10px] text-blue-100 mt-0.5">
                    {config.heroStyle === 'split-editorial'
                      ? 'Split editorial spotlight active'
                      : config.heroStyle === 'compact-catalog'
                      ? 'Compact fast-browse layout'
                      : 'Immersive search hero active'}
                  </p>
                </div>

                <div className={`grid grid-cols-2 ${config.cardDensity === 'compact' ? 'gap-2' : 'gap-3'}`}>
                  {['Rijksmuseum', 'Colosseum'].map((item) => (
                    <div
                      key={item}
                      className={`border ${
                        config.defaultColorMode === 'dark'
                          ? 'bg-slate-900 border-slate-800'
                          : 'bg-white border-slate-200'
                      } ${radiusPreviewClass} ${config.cardDensity === 'compact' ? 'p-2' : 'p-3'}`}
                    >
                      <div className="h-10 rounded-lg bg-slate-200/70 dark:bg-slate-800 mb-2" />
                      <p className="text-[11px] font-bold truncate">{item}</p>
                      {config.showInstantConfirmationBadge && (
                        <p className="text-[9.5px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> Instant Entry
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Brand palette (Tiqsey Navy & Royal Blue) and Plus Jakarta Sans typography remain locked across both Admin Panel and storefront.
            </p>
          </section>
        </div>
      </div>
    </form>
  );
}
