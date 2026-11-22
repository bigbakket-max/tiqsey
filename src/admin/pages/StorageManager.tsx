import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  HardDrive,
  FolderOpen,
  Upload,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Image as ImageIcon,
  Film,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  SUPABASE_STORAGE_BUCKET_LIST,
  type SupabaseBucketId,
} from '../../lib/supabase';

interface LiveBucketInfo {
  id: SupabaseBucketId;
  label: string;
  description: string;
  public: boolean;
  fileSizeLimit: number;
  maxSizeLabel: string;
  allowedMimeTypes: string[];
  defaultFolder: string;
  existsInSupabase: boolean;
  fileCount: number;
}

interface StoredFileItem {
  name: string;
  path: string;
  bucket: string;
  publicUrl: string;
  size: number;
  mimeType: string;
  createdAt: string | null;
  updatedAt: string | null;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Failed to read file'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function StorageManager() {
  const { user } = useAuth();
  const adminEmail = user?.email || 'admin@tiqsey.com';

  const [buckets, setBuckets] = useState<LiveBucketInfo[]>(
    SUPABASE_STORAGE_BUCKET_LIST.map((b) => ({
      ...b,
      fileSizeLimit: b.maxSizeBytes,
      existsInSupabase: false,
      fileCount: 0,
    }))
  );
  const [selectedBucket, setSelectedBucket] = useState<SupabaseBucketId>('media');
  const [files, setFiles] = useState<StoredFileItem[]>([]);
  const [connected, setConnected] = useState<boolean>(true);
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [loadingBuckets, setLoadingBuckets] = useState<boolean>(true);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const authHeaders = useCallback(
    () => ({
      'Content-Type': 'application/json',
      'x-admin-email': adminEmail,
    }),
    [adminEmail]
  );

  const fetchBuckets = useCallback(async () => {
    setLoadingBuckets(true);
    try {
      const resp = await fetch('/api/admin/storage/buckets', {
        headers: { 'x-admin-email': adminEmail },
      });
      if (!resp.ok) throw new Error('Failed to fetch storage buckets');
      const data = await resp.json();
      setConnected(Boolean(data.connected));
      setDashboardUrl(data.dashboardUrl || null);
      if (Array.isArray(data.buckets) && data.buckets.length > 0) {
        setBuckets(data.buckets);
      }
    } catch (err: any) {
      showToast(err?.message || 'Unable to load storage buckets', 'error');
    } finally {
      setLoadingBuckets(false);
    }
  }, [adminEmail, showToast]);

  const fetchFiles = useCallback(
    async (bucketId: SupabaseBucketId) => {
      setLoadingFiles(true);
      try {
        const resp = await fetch(`/api/admin/storage/buckets/${encodeURIComponent(bucketId)}/files`, {
          headers: { 'x-admin-email': adminEmail },
        });
        if (!resp.ok) {
          setFiles([]);
          return;
        }
        const data = await resp.json();
        setFiles(Array.isArray(data.files) ? data.files : []);
      } catch {
        setFiles([]);
      } finally {
        setLoadingFiles(false);
      }
    },
    [adminEmail]
  );

  useEffect(() => {
    fetchBuckets();
  }, [fetchBuckets]);

  useEffect(() => {
    fetchFiles(selectedBucket);
  }, [selectedBucket, fetchFiles]);

  const activeBucketInfo =
    buckets.find((b) => b.id === selectedBucket) || buckets[0];

  const handleSyncBuckets = async () => {
    setSyncing(true);
    try {
      const resp = await fetch('/api/admin/storage/sync-buckets', {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Sync failed');
      const okCount = Array.isArray(data.results)
        ? data.results.filter((r: any) => r.ok).length
        : 0;
      showToast(`Verified and synced ${okCount} of 7 Supabase Storage buckets.`);
      await fetchBuckets();
      await fetchFiles(selectedBucket);
    } catch (err: any) {
      showToast(err?.message || 'Failed to sync storage buckets', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleUploadFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || !activeBucketInfo) return;
    setUploading(true);
    let uploadedCount = 0;
    let firstError: string | null = null;

    try {
      for (const file of Array.from(fileList)) {
        const normalizedMime = file.type === 'image/jpg' ? 'image/jpeg' : file.type;
        if (!activeBucketInfo.allowedMimeTypes.includes(normalizedMime)) {
          firstError = `"${file.name}" (${file.type || 'unknown'}) is not allowed in "${activeBucketInfo.id}".`;
          continue;
        }
        if (file.size > activeBucketInfo.fileSizeLimit) {
          firstError = `"${file.name}" exceeds the ${activeBucketInfo.maxSizeLabel} limit for "${activeBucketInfo.id}".`;
          continue;
        }

        const dataUrl = await readFileAsDataUrl(file);
        const resp = await fetch(
          `/api/admin/storage/buckets/${encodeURIComponent(activeBucketInfo.id)}/upload`,
          {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
              dataUrl,
              filename: file.name,
              folder: activeBucketInfo.defaultFolder,
            }),
          }
        );
        const data = await resp.json();
        if (!resp.ok) {
          firstError = data.error || `Failed to upload ${file.name}`;
        } else {
          uploadedCount += 1;
        }
      }

      if (uploadedCount > 0) {
        showToast(`Uploaded ${uploadedCount} file${uploadedCount > 1 ? 's' : ''} to "${activeBucketInfo.id}".`);
        await Promise.all([fetchBuckets(), fetchFiles(activeBucketInfo.id)]);
      } else if (firstError) {
        showToast(firstError, 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = async (file: StoredFileItem) => {
    setDeletingPath(file.path);
    try {
      const resp = await fetch(
        `/api/admin/storage/buckets/${encodeURIComponent(file.bucket)}/files`,
        {
          method: 'DELETE',
          headers: authHeaders(),
          body: JSON.stringify({ paths: [file.path] }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Delete failed');
      showToast(`Deleted ${file.name} from "${file.bucket}".`);
      setFiles((prev) => prev.filter((item) => item.path !== file.path));
      setBuckets((prev) =>
        prev.map((b) =>
          b.id === file.bucket ? { ...b, fileCount: Math.max(0, b.fileCount - 1) } : b
        )
      );
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete file', 'error');
    } finally {
      setDeletingPath(null);
    }
  };

  const handleCopyUrl = async (file: StoredFileItem) => {
    try {
      await navigator.clipboard.writeText(file.publicUrl);
      setCopiedPath(file.path);
      setTimeout(() => setCopiedPath(null), 1800);
    } catch {
      showToast('Unable to copy URL to clipboard', 'error');
    }
  };

  const filteredFiles = files.filter((f) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q);
  });

  const totalFiles = buckets.reduce((sum, b) => sum + (b.fileCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-rose-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/60 dark:border-emerald-800/60">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Cloud Media Storage
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  connected
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {connected ? `${buckets.length} Active Buckets · ${totalFiles} Files` : 'Local Fallback Mode'}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage all 7 Supabase Storage buckets with automatic MIME validation, size limits, and public CDN URLs.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSyncBuckets}
            disabled={syncing || !connected}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {syncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>{syncing ? 'Syncing...' : 'Sync All 7 Buckets'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              fetchBuckets();
              fetchFiles(selectedBucket);
            }}
            disabled={loadingBuckets || loadingFiles}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingBuckets || loadingFiles ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {dashboardUrl && (
            <a
              href={dashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition"
            >
              <span>Supabase Storage</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Buckets Grid + File Explorer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: All 7 Buckets */}
        <div className="xl:col-span-4 space-y-2.5">
          {buckets.map((bucket) => {
            const isSelected = bucket.id === selectedBucket;
            return (
              <button
                key={bucket.id}
                type="button"
                onClick={() => setSelectedBucket(bucket.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50/80 dark:bg-sky-950/30 border-sky-400 dark:border-sky-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FolderOpen
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {bucket.id}
                    </span>
                    {bucket.public && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60">
                        Public
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                    {bucket.fileCount} {bucket.fileCount === 1 ? 'file' : 'files'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-1">
                  {bucket.description}
                </p>
                <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Limit: {bucket.maxSizeLabel}
                  </span>
                  <span className="truncate">
                    {bucket.allowedMimeTypes.length} MIME types
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Selected Bucket Files & Uploader */}
        <div className="xl:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {activeBucketInfo && (
            <>
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeBucketInfo.id}
                    </h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Max {activeBucketInfo.maxSizeLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Allowed: {activeBucketInfo.allowedMimeTypes.join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={activeBucketInfo.allowedMimeTypes.join(',')}
                    onChange={(e) => handleUploadFiles(e.target.files)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || !connected}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
                  >
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploading ? 'Uploading...' : `Upload to ${activeBucketInfo.id}`}</span>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-5 py-3 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Filter files in ${activeBucketInfo.id}...`}
                  className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Files Grid */}
              <div className="p-5">
                {loadingFiles ? (
                  <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
                    <span className="text-xs font-medium">Loading files from {activeBucketInfo.id}...</span>
                  </div>
                ) : filteredFiles.length === 0 ? (
                  <div className="py-14 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
                    <FolderOpen className="w-9 h-9 text-slate-300 dark:text-slate-700 mx-auto mb-2.5" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {searchQuery ? 'No matching files found' : `No files uploaded in "${activeBucketInfo.id}" yet`}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Click "Upload to {activeBucketInfo.id}" above to add {activeBucketInfo.allowedMimeTypes.some((m) => m.startsWith('video/')) ? 'images or videos' : 'images'} (up to {activeBucketInfo.maxSizeLabel}).
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFiles.map((file) => {
                      const isImage =
                        file.mimeType.startsWith('image/') ||
                        /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(file.name);
                      const isVideo =
                        file.mimeType.startsWith('video/') ||
                        /\.(mp4|webm|mov)$/i.test(file.name);

                      return (
                        <div
                          key={file.path}
                          className="group rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 overflow-hidden flex flex-col"
                        >
                          <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800/60 relative flex items-center justify-center overflow-hidden">
                            {isImage ? (
                              <img
                                src={file.publicUrl}
                                alt={file.name}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : isVideo ? (
                              <video
                                src={file.publicUrl}
                                controls
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileText className="w-8 h-8 text-slate-400" />
                            )}
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/75 text-white flex items-center gap-1">
                              {isVideo ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                              {formatBytes(file.size)}
                            </span>
                          </div>

                          <div className="p-3 flex-1 flex flex-col justify-between gap-2.5">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate" title={file.path}>
                                {file.name}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5" title={file.path}>
                                {file.path}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCopyUrl(file)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                              >
                                {copiedPath === file.path ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-500" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy URL</span>
                                  </>
                                )}
                              </button>

                              <a
                                href={file.publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open in new tab"
                                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-sky-600 transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>

                              <button
                                type="button"
                                onClick={() => handleDeleteFile(file)}
                                disabled={deletingPath === file.path}
                                title="Delete file"
                                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:border-rose-200 dark:hover:border-rose-800 transition cursor-pointer disabled:opacity-50"
                              >
                                {deletingPath === file.path ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
