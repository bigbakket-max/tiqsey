import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Upload, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Info, 
  Layers, 
  ExternalLink,
  Laptop,
  Smartphone,
  Bookmark,
  Sparkles,
  FileCheck,
  ShieldCheck,
  RotateCcw,
  Check,
  X,
  Sliders,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaviconConfig, 
  DEFAULT_FAVICON_CONFIG, 
  fetchActiveFavicon, 
  validateFaviconFile, 
  saveFaviconToBackend, 
  resetFaviconToDefault,
  applyFaviconToDocument,
  FAVICON_EVENT_NAME
} from '../../utils/faviconManager';

export default function FaviconManagement() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [activeFavicon, setActiveFavicon] = useState<FaviconConfig>(DEFAULT_FAVICON_CONFIG);
  const [pendingFile, setPendingFile] = useState<{
    file: File;
    dataUrl: string;
    format: 'png' | 'ico' | 'svg' | 'jpg' | 'jpeg' | 'webp';
    mimeType: string;
    dimensions: { width: number; height: number };
    warning?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Preview options
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('dark');
  const [activePreviewTab, setActivePreviewTab] = useState<'all' | '16' | '32' | '48' | '180'>('all');

  // Load active favicon on mount
  useEffect(() => {
    loadFavicon();

    const handleFaviconUpdate = (e: any) => {
      if (e.detail) {
        setActiveFavicon(e.detail);
      }
    };
    window.addEventListener(FAVICON_EVENT_NAME, handleFaviconUpdate);
    return () => window.removeEventListener(FAVICON_EVENT_NAME, handleFaviconUpdate);
  }, []);

  const loadFavicon = async () => {
    setIsLoading(true);
    try {
      const config = await fetchActiveFavicon();
      setActiveFavicon(config);
    } catch (err: any) {
      console.error('Error loading favicon:', err);
      showNotification('Failed to load active favicon settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Handle file selection and validation
  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setValidationError(null);

    const validation = await validateFaviconFile(file);
    if (!validation.valid || !validation.dataUrl || !validation.format) {
      setValidationError(validation.error || 'Invalid favicon file.');
      showNotification(validation.error || 'Invalid file format or size.', 'error');
      return;
    }

    setPendingFile({
      file,
      dataUrl: validation.dataUrl,
      format: validation.format,
      mimeType: validation.mimeType || file.type || 'image/png',
      dimensions: validation.dimensions || { width: 512, height: 512 },
      warning: validation.warning,
    });

    if (validation.warning) {
      showNotification(validation.warning, 'info');
    } else {
      showNotification(`File "${file.name}" loaded for preview. Click "Save Changes" to publish.`, 'info');
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  // Save changes action
  const handleSaveChanges = async () => {
    if (!pendingFile) return;

    setIsSaving(true);
    try {
      const adminEmail = user?.email || 'admin@tiqsey.com';
      const updatedConfig = await saveFaviconToBackend({
        dataUrl: pendingFile.dataUrl,
        format: pendingFile.format,
        fileName: pendingFile.file.name,
        fileSize: pendingFile.file.size,
        dimensions: pendingFile.dimensions,
        adminEmail,
      });

      setActiveFavicon(updatedConfig);
      setPendingFile(null);
      showNotification('Favicon updated successfully across the entire Tiqsey website!', 'success');
    } catch (err: any) {
      console.error('Error saving favicon:', err);
      showNotification(err.message || 'Failed to save favicon. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default action
  const handleResetToDefault = async () => {
    setIsResetting(true);
    try {
      const adminEmail = user?.email || 'admin@tiqsey.com';
      const defaultConfig = await resetFaviconToDefault(adminEmail);
      setActiveFavicon(defaultConfig);
      setPendingFile(null);
      setShowResetModal(false);
      showNotification('Favicon reset to original Tiqsey brand defaults.', 'success');
    } catch (err: any) {
      console.error('Error resetting favicon:', err);
      showNotification(err.message || 'Failed to reset favicon.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Cancel pending upload
  const handleCancelPending = () => {
    setPendingFile(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showNotification('Pending favicon changes cancelled.', 'info');
  };

  // Determine current image to display in previews
  const previewImageSrc = pendingFile ? pendingFile.dataUrl : activeFavicon.url;
  const isCustomActive = !activeFavicon.isDefault;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border ${
            notification.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
              : notification.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800'
              : 'bg-sky-50 dark:bg-sky-950/90 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-800'
          }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />}
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Website Favicon</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live in Production
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage the browser tab icon, desktop bookmark graphic, and mobile Apple Touch shortcut icon across Tiqsey.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Inspect on live public site"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Site</span>
          </a>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Replace Favicon</span>
          </button>

          {isCustomActive && (
            <button
              onClick={() => setShowResetModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/80 transition-colors cursor-pointer"
              title="Reset to default brand favicon"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          )}

          <button
            onClick={loadFavicon}
            disabled={isLoading}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Reload from server"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input 
        ref={fileInputRef}
        type="file"
        accept=".png,.ico,.svg,.jpg,.jpeg,.webp,image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files)}
      />

      {/* Pending changes banner */}
      {pendingFile && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-500/40 dark:border-amber-400/30 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-amber-900 dark:text-amber-200">
                Unsaved Favicon Replacement Ready
              </p>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                You have staged <span className="font-bold underline">{pendingFile.file.name}</span> ({pendingFile.dimensions.width}×{pendingFile.dimensions.height}px, {(pendingFile.file.size / 1024).toFixed(1)} KB). Check previews below and click Save Changes to publish.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <button
              onClick={handleCancelPending}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all cursor-pointer active:scale-95"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Upload & Current Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Active Specs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Drop Zone Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-500" />
                Upload New Favicon
              </h2>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Max 5MB</span>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[0.99]' 
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-blue-50/20'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Click to browse or drag & drop image
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Supports standard formats: <strong className="text-slate-700 dark:text-slate-300">PNG, ICO, SVG, JPG, WebP</strong>
              </p>

              {/* Format badges */}
              <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
                {['PNG (Recommended)', 'ICO', 'SVG (Vector)', 'JPG', 'WebP'].map(fmt => (
                  <span key={fmt} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Active Favicon Details Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                Current Active Favicon
              </h2>
              <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                activeFavicon.isDefault 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' 
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
              }`}>
                {activeFavicon.isDefault ? 'Default Brand Logo' : 'Custom Upload'}
              </span>
            </div>

            {/* Visual Icon Showcase */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <div className="relative w-20 h-20 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center p-2 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[size:10px_10px] bg-white dark:bg-slate-900 shrink-0">
                <img 
                  src={activeFavicon.url} 
                  alt="Active Favicon" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/favicon.png';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {activeFavicon.fileName || 'tiqsey-favicon.png'}
                </p>
                <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase">
                    {activeFavicon.format}
                  </span>
                  <span>•</span>
                  <span>
                    {activeFavicon.dimensions?.width || 512} × {activeFavicon.dimensions?.height || 512} px
                  </span>
                  <span>•</span>
                  <span>
                    {((activeFavicon.fileSize || 43581) / 1024).toFixed(1)} KB
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                  Updated: {new Date(activeFavicon.updatedAt).toLocaleDateString()} at {new Date(activeFavicon.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Metadata Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-400">MIME Content Type:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{activeFavicon.mimeType || 'image/png'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-400">Relative URL:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 truncate max-w-[200px]" title={activeFavicon.url}>
                  {activeFavicon.url}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-500 dark:text-slate-400">Apple Touch Support:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Supported (180×180)
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400">Managed By:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{activeFavicon.updatedBy || 'admin@tiqsey.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Size Interactive Context Previews (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-5">
            {/* Previews Header with Theme Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-sky-500" />
                  Live Context Previews
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Visual simulation of how the favicon appears across devices, browser tabs, bookmarks, and mobile home screens.
                </p>
              </div>

              {/* Dark / Light Browser Mockup Theme Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-center">
                <button
                  onClick={() => setPreviewTheme('light')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewTheme === 'light' 
                      ? 'bg-white text-slate-900 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setPreviewTheme('dark')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewTheme === 'dark' 
                      ? 'bg-slate-950 text-white shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Dark</span>
                </button>
              </div>
            </div>

            {/* Standard Sizes Tab Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 dark:border-slate-800/80">
              {[
                { id: 'all', label: 'All Previews' },
                { id: '16', label: '16×16 Browser Tab' },
                { id: '32', label: '32×32 Bookmarks' },
                { id: '48', label: '48×48 Desktop Shortcut' },
                { id: '180', label: '180×180 Apple Touch' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activePreviewTab === tab.id
                      ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-400/40'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 1. 16x16 px: Browser Tab Simulation */}
            {(activePreviewTab === 'all' || activePreviewTab === '16') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-blue-500" />
                    16×16 px — Browser Tab
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Standard desktop browser tab</span>
                </div>

                <div className={`rounded-xl border p-3 shadow-inner ${
                  previewTheme === 'dark' 
                    ? 'bg-[#181a1f] border-slate-800 text-slate-200' 
                    : 'bg-[#e5e7eb] border-slate-300 text-slate-800'
                }`}>
                  {/* Browser Window Controls */}
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>

                  {/* Active Tab Mockup */}
                  <div className="flex items-center gap-1 max-w-sm">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-t-xl text-xs font-medium border-t border-x ${
                      previewTheme === 'dark' 
                        ? 'bg-[#282c34] border-slate-700/60 text-white' 
                        : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                    }`}>
                      <img 
                        src={previewImageSrc} 
                        alt="16x16" 
                        className="w-4 h-4 rounded-xs shrink-0 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/favicon.png'; }}
                      />
                      <span className="truncate max-w-[170px] font-bold">Tiqsey - Best Attractions & Experiences</span>
                      <X className="w-3 h-3 text-slate-400 hover:text-slate-600 shrink-0 ml-1 cursor-pointer" />
                    </div>

                    {/* Secondary Inactive Tab */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 truncate opacity-60">
                      <div className="w-3.5 h-3.5 rounded-xs bg-slate-400/40" />
                      <span className="truncate max-w-[100px]">Google Search</span>
                    </div>
                  </div>

                  {/* Address Bar Mockup */}
                  <div className={`p-2 rounded-b-xl border-t flex items-center gap-2 text-xs ${
                    previewTheme === 'dark' 
                      ? 'bg-[#282c34] border-slate-700/60 text-slate-400' 
                      : 'bg-white border-slate-300 text-slate-600'
                  }`}>
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="truncate font-mono text-[11px]">https://tiqsey.com/attractions</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 32x32 px: Bookmarks Bar Simulation */}
            {(activePreviewTab === 'all' || activePreviewTab === '32') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    32×32 px — Bookmarks & Pinned Tabs
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">High-DPI Retina bookmark bar</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-3 overflow-x-auto ${
                  previewTheme === 'dark' 
                    ? 'bg-[#1e222b] border-slate-800 text-slate-200' 
                    : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}>
                  {/* Bookmark Item for Tiqsey */}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-2xs ${
                    previewTheme === 'dark' 
                      ? 'bg-slate-800/90 border-slate-700 text-white' 
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}>
                    <img 
                      src={previewImageSrc} 
                      alt="32x32" 
                      className="w-5 h-5 rounded-xs object-contain shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/favicon.png'; }}
                    />
                    <span>Tiqsey Tickets</span>
                  </div>

                  {/* Dummy Other Bookmarks */}
                  <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 opacity-60">
                    <div className="w-4 h-4 rounded-xs bg-red-400/40" />
                    <span>YouTube</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 opacity-60">
                    <div className="w-4 h-4 rounded-xs bg-blue-400/40" />
                    <span>GitHub</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. 48x48 px: Desktop Shortcut / High-DPI */}
            {(activePreviewTab === 'all' || activePreviewTab === '48') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-500" />
                    48×48 px — Desktop App & Taskbar Shortcut
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Windows Taskbar & macOS Dock preview</span>
                </div>

                <div className={`p-4 rounded-xl border flex items-center justify-around sm:justify-start sm:gap-8 ${
                  previewTheme === 'dark' 
                    ? 'bg-[#181a1f] border-slate-800' 
                    : 'bg-slate-100 border-slate-200'
                }`}>
                  {/* Taskbar icon with indicator */}
                  <div className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-md p-1.5 flex items-center justify-center transition-transform group-hover:scale-105">
                      <img 
                        src={previewImageSrc} 
                        alt="48x48" 
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/favicon.png'; }}
                      />
                    </div>
                    <span className="w-2 h-0.5 rounded-full bg-blue-500" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Tiqsey</span>
                  </div>

                  {/* Windows Tile / Desktop shortcut */}
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-lg p-2.5 flex items-center justify-center">
                      <img 
                        src={previewImageSrc} 
                        alt="Desktop tile" 
                        className="w-full h-full object-contain drop-shadow-md"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/favicon.png'; }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[80px] truncate">Tiqsey Web</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. 180x180 px: Apple Touch Icon (Mobile Home Screen) */}
            {(activePreviewTab === 'all' || activePreviewTab === '180') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    180×180 px — Apple Touch Icon (iOS & Android)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Mobile Home Screen Shortcut</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden p-6 border border-slate-300 dark:border-slate-800 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 flex flex-col items-center justify-center text-center shadow-md">
                  {/* Subtle Wallpaper Grid pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:16px_16px] opacity-10 pointer-events-none" />

                  {/* iOS Style Squircle Icon Container */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[22%] bg-white dark:bg-slate-900 shadow-2xl border border-white/20 p-3 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 duration-200">
                      <img 
                        src={previewImageSrc} 
                        alt="180x180 Apple Touch Icon" 
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/favicon.png'; }}
                      />
                    </div>
                    <p className="text-xs font-bold text-white mt-2 drop-shadow-md tracking-wide">
                      Tiqsey
                    </p>
                    <span className="text-[10px] text-indigo-200/80 mt-0.5">
                      Standard Apple Touch Icon (180×180 px)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines & Best Practices Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Favicon Best Practices & Standards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white mb-1">📐 Aspect Ratio</p>
                <p className="text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Always use a <strong>1:1 square ratio</strong> (e.g. 512×512 px). Non-square icons may stretch or distort on mobile shortcuts.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white mb-1">🎨 Contrast & Colors</p>
                <p className="text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Ensure strong contrast against both light and dark browser tab themes. Solid bold colors like Tiqsey Red work brilliantly.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white mb-1">⚡ Instant Cache Busting</p>
                <p className="text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                  When you save, version query parameters update dynamically so all user browser tabs immediately display the new graphic.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white mb-1">📱 Mobile Shortcuts</p>
                <p className="text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                  The system automatically provisions the <strong>Apple Touch Icon (180×180)</strong> for iOS Safari "Add to Home Screen" actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Reset to Brand Favicon?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This will remove the current custom favicon and restore the original red Tiqsey brand emblem across all browser tabs and mobile shortcuts.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetToDefault}
                disabled={isResetting}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>Yes, Reset</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
