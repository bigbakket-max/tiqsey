import React, { useState, useEffect } from 'react';
import {
  Menu,
  Plus,
  Save,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Link2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminToast } from '../contexts/AdminToastContext';
import { SkeletonBox } from '../components/AdminMotion';
import {
  NavigationMenusConfig,
  NavigationMenuItem,
  DEFAULT_NAVIGATION_MENUS,
  loadAdminConfig,
  saveAdminConfig,
  sanitizeUrlOrEmpty,
} from '../../utils/adminConfigClient';

export default function MenusManager() {
  const { user } = useAuth();
  const { notify } = useAdminToast();

  const [menus, setMenus] = useState<NavigationMenusConfig>(DEFAULT_NAVIGATION_MENUS);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [activeTab, setActiveTab] = useState<'header' | 'footer'>('header');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newTab, setNewTab] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const res = await loadAdminConfig<NavigationMenusConfig>(
        'navigation_menus',
        user?.email,
        DEFAULT_NAVIGATION_MENUS
      );
      if (active) {
        const merged: NavigationMenusConfig = {
          headerItems: Array.isArray(res.data?.headerItems)
            ? res.data.headerItems
            : DEFAULT_NAVIGATION_MENUS.headerItems,
          footerItems: Array.isArray(res.data?.footerItems)
            ? res.data.footerItems
            : DEFAULT_NAVIGATION_MENUS.footerItems,
        };
        setMenus(merged);
        setSavedSnapshot(JSON.stringify(merged));
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user?.email]);

  const currentItems = activeTab === 'header' ? menus.headerItems : menus.footerItems;
  const isDirty = savedSnapshot !== '' && JSON.stringify(menus) !== savedSnapshot;

  const setCurrentItems = (nextItems: NavigationMenuItem[]) => {
    setMenus((prev) =>
      activeTab === 'header'
        ? { ...prev, headerItems: nextItems }
        : { ...prev, footerItems: nextItems }
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newLabel.trim();
    const safeUrl = sanitizeUrlOrEmpty(newUrl);
    if (!label) {
      notify('warning', 'Enter a menu label.');
      return;
    }
    if (!safeUrl) {
      notify('error', 'Enter a valid relative path (e.g. /attractions) or https:// URL.');
      return;
    }
    const item: NavigationMenuItem = {
      id: `${activeTab}-${Date.now()}`,
      label,
      url: safeUrl,
      visible: true,
      openInNewTab: newTab,
    };
    setCurrentItems([...currentItems, item]);
    setNewLabel('');
    setNewUrl('');
    setNewTab(false);
  };

  const handleUpdateItem = (id: string, patch: Partial<NavigationMenuItem>) => {
    setCurrentItems(currentItems.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= currentItems.length) return;
    const copy = [...currentItems];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    setCurrentItems(copy);
  };

  const handleDelete = (id: string) => {
    setCurrentItems(currentItems.filter((it) => it.id !== id));
  };

  const handleSave = async () => {
    for (const item of [...menus.headerItems, ...menus.footerItems]) {
      if (!item.label.trim()) {
        notify('warning', 'All menu items must have a label.');
        return;
      }
      if (!sanitizeUrlOrEmpty(item.url)) {
        notify('error', `Invalid link URL on "${item.label}". Use relative paths or http/https URLs.`);
        return;
      }
    }

    setSaving(true);
    const res = await saveAdminConfig('navigation_menus', menus, user?.email);
    setSaving(false);
    if (!res.ok) {
      notify('error', res.error || 'Could not save navigation menus.');
      return;
    }
    setSavedSnapshot(JSON.stringify(menus));
    notify('success', 'Navigation menus saved successfully.');
  };

  const handleReset = () => {
    setMenus(DEFAULT_NAVIGATION_MENUS);
    notify('info', 'Restored default header and footer menus. Click Save Menus to persist.');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonBox className="h-10 w-64" />
        <SkeletonBox className="h-72 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Menus</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize public header and footer navigation links, reorder items, and control visibility.
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
            type="button"
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Menus'}
          </button>
        </div>
      </div>

      {/* Live Preview Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Live {activeTab === 'header' ? 'Header Navigation' : 'Footer Links'} Preview
        </p>
        <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#0b1120] via-[#0f172a] to-[#020617] text-white flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-black tracking-wider">TIQSEY</span>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {currentItems.filter((i) => i.visible).length === 0 ? (
              <span className="text-slate-400 italic">No visible links</span>
            ) : (
              currentItems
                .filter((i) => i.visible)
                .map((item) => (
                  <span key={item.id} className="inline-flex items-center gap-1 text-slate-200 font-medium">
                    {item.label}
                    {item.openInNewTab && <ExternalLink className="w-3 h-3 opacity-60" />}
                  </span>
                ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('header')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeTab === 'header'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Header Menu ({menus.headerItems.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('footer')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeTab === 'footer'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Footer Menu ({menus.footerItems.length})
              </button>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {currentItems.filter((i) => i.visible).length} visible
            </span>
          </div>

          {currentItems.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <Menu className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No items in this menu yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">Use the form on the right to add your first navigation link.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
                    !item.visible ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateItem(item.id, { label: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-900 dark:text-white"
                      aria-label="Menu label"
                    />
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => handleUpdateItem(item.id, { url: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-mono text-slate-700 dark:text-slate-300"
                      aria-label="Menu URL"
                    />
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      title="Move up"
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === currentItems.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      title="Move down"
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateItem(item.id, { visible: !item.visible })}
                      title={item.visible ? 'Hide link' : 'Show link'}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateItem(item.id, { openInNewTab: !item.openInNewTab })}
                      title="Toggle open in new tab"
                      className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                        item.openInNewTab ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      title="Remove item"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Menu Link Form */}
        <form
          onSubmit={handleAddItem}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 h-fit"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Link2 className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Add {activeTab === 'header' ? 'Header' : 'Footer'} Link
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Link Label</label>
              <input
                type="text"
                required
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. City Passes"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Destination URL</label>
              <input
                type="text"
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="/attractions or https://..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-mono text-slate-900 dark:text-white"
              />
            </div>
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={newTab}
                onChange={(e) => setNewTab(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Open link in a new browser tab</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </button>
        </form>
      </div>
    </div>
  );
}
