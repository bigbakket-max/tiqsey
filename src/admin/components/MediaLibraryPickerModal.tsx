import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Search,
  Upload,
  Image as ImageIcon,
  Film,
  FileText,
  Check,
  Loader2,
  RefreshCw,
  FolderOpen,
  AlertCircle,
} from 'lucide-react';
import type { MediaAssetItem, MediaCategory } from '../../types';
import {
  SUPABASE_STORAGE_BUCKET_LIST,
  getBucketConfig,
  type SupabaseBucketId,
} from '../../lib/supabase';
import {
  fetchMediaLibrary,
  uploadMediaChunked,
  formatStorageBytes,
  getStoredAdminEmail,
  type LiveBucketSummary,
} from '../../utils/mediaStorageClient';

export interface MediaLibraryPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAssetItem) => void;
  defaultBucket?: SupabaseBucketId;
  defaultFolder?: string;
  acceptTypes?: MediaCategory[];
  title?: string;
}

export const MediaLibraryPickerModal: React.FC<MediaLibraryPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  defaultBucket,
  defaultFolder,
  acceptTypes = ['image'],
  title = 'Select from Tiqsey Media Library',
}) => {
  const adminEmail = getStoredAdminEmail();
  const [activeBucket, setActiveBucket] = useState<SupabaseBucketId | 'all'>(defaultBucket || 'all');
  const [files, setFiles] = useState<MediaAssetItem[]>([]);
  const [buckets, setBuckets] = useState<LiveBucketSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAssetItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadLibrary = async (bucketScope: SupabaseBucketId | 'all') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMediaLibrary(adminEmail, bucketScope);
      setFiles(data.files);
      setBuckets(data.buckets);
      if (!data.connected && data.error) {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load media library.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const initialScope = defaultBucket || 'all';
    setActiveBucket(initialScope);
    setSelectedAsset(null);
    setSearchQuery('');
    loadLibrary(initialScope);
  }, [isOpen, defaultBucket]);

  const filteredFiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return files.filter((file) => {
      if (acceptTypes.length > 0 && !acceptTypes.includes(file.mediaType)) {
        return false;
      }
      if (!q) return true;
      return (
        file.name.toLowerCase().includes(q) ||
        file.path.toLowerCase().includes(q) ||
        file.bucket.toLowerCase().includes(q)
      );
    });
  }, [files, acceptTypes, searchQuery]);

  const uploadTargetBucket: SupabaseBucketId =
    activeBucket === 'all' ? defaultBucket || (acceptTypes.includes('video') ? 'admin-media' : 'media') : activeBucket;

  const acceptAttr = useMemo(() => {
    const parts: string[] = [];
    if (acceptTypes.includes('image')) parts.push('image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml');
    if (acceptTypes.includes('video')) parts.push('video/mp4,video/webm,video/quicktime');
    if (acceptTypes.includes('document')) parts.push('application/pdf');
    return parts.join(',');
  }, [acceptTypes]);

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadPercent(5);
    setError(null);
    try {
      const spec = getBucketConfig(uploadTargetBucket);
      const result = await uploadMediaChunked({
        file,
        bucket: uploadTargetBucket,
        folder: defaultFolder || spec.defaultFolder,
        adminEmail,
        onProgress: (pct) => setUploadPercent(pct),
      });
      await loadLibrary(activeBucket);
      setSelectedAsset(result.asset);
      onSelect(result.asset);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      setUploadPercent(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[88vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Permanent Supabase Storage · Choose an existing file or upload a new one
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadLibrary(activeBucket)}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Refresh library"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bucket Switcher + Search + Quick Upload */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => {
                setActiveBucket('all');
                loadLibrary('all');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                activeBucket === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              All Buckets
            </button>
            {SUPABASE_STORAGE_BUCKET_LIST.map((b) => {
              const live = buckets.find((x) => x.id === b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setActiveBucket(b.id);
                    loadLibrary(b.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeBucket === b.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{b.id}</span>
                  {live && (
                    <span className="text-[10px] opacity-75 tabular-nums">{live.fileCount}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media by filename or path..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptAttr}
              onChange={handleQuickUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading {uploadPercent}%</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload to {uploadTargetBucket}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mt-3 px-3.5 py-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* File Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <p className="text-xs font-medium">Loading Supabase Storage files...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <FolderOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No matching media files yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Upload a new file using the button above to store it permanently in Supabase Storage.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredFiles.map((file) => {
                const isSelected = selectedAsset?.id === file.id;
                return (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => setSelectedAsset(file)}
                    onDoubleClick={() => {
                      onSelect(file);
                      onClose();
                    }}
                    className={`group text-left rounded-xl border p-2 transition-all ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/25 bg-blue-50/40 dark:bg-blue-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {file.mediaType === 'image' ? (
                        <img
                          src={file.publicUrl}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : file.mediaType === 'video' ? (
                        <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                          <video
                            src={file.publicUrl}
                            className="w-full h-full object-cover opacity-80"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center">
                              <Film className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <FileText className="w-8 h-8 mb-1" />
                          <span className="text-[10px] font-mono uppercase">PDF</span>
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs font-medium text-slate-800 dark:text-slate-200 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate tabular-nums">
                      {formatStorageBytes(file.size)} · {file.bucket}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/40">
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {selectedAsset ? (
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Selected: {selectedAsset.name} ({selectedAsset.bucket}/{selectedAsset.path})
              </span>
            ) : (
              <span>Double-click any item or click Select Asset to insert its permanent URL</span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedAsset}
              onClick={() => {
                if (selectedAsset) {
                  onSelect(selectedAsset);
                  onClose();
                }
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Use Selected Media
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaLibraryPickerModal;
