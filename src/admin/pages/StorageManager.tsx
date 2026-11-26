import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Image as ImageIcon,
  Video,
  Folder,
  FolderPlus,
  FolderOpen,
  Search,
  Filter,
  Upload,
  LayoutGrid,
  List,
  RefreshCw,
  PlugZap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  Replace,
  Trash2,
  X,
  FileText,
  ChevronRight,
  Pencil,
  RotateCcw,
  ExternalLink,
  Link2,
  Loader2,
  SlidersHorizontal,
  Play,
  Database,
  HardDrive,
  Plus,
  Globe,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { MediaAssetItem, MediaCategory, MediaFolderItem, MediaUsageRef } from '../../types';
import {
  SUPABASE_STORAGE_BUCKET_LIST,
  SAFE_STORAGE_MIME_TYPES,
  getBucketConfig,
  normalizeBucketName,
  isValidBucketName,
  type SupabaseBucketId,
  type SupabaseStorageConnectionReport,
} from '../../lib/supabase';
import {
  fetchMediaLibrary,
  testStorageConnection,
  checkDuplicateMedia,
  computeFileSha256,
  uploadMediaChunked,
  createStorageBucket,
  verifyAndRegisterCustomBucket,
  createStorageFolder,
  renameStorageFolder,
  deleteStorageFolder,
  fetchServerMediaUsage,
  deleteMediaFiles,
  downloadMediaFile,
  formatStorageBytes,
  type LiveBucketSummary,
  type MediaLibraryResponse,
} from '../../utils/mediaStorageClient';
import {
  findClientMediaReferences,
  mergeMediaReferences,
  replaceClientMediaReferences,
} from '../../utils/mediaReferences';
import { motion, AnimatePresence } from 'motion/react';
import { fetchJsonSafely } from '../../utils/safeFetch';
import { useAdminToast } from '../contexts/AdminToastContext';
import {
  ADMIN_EASE,
  ADMIN_TRANSITION_FAST,
  ADMIN_TRANSITION_SMOOTH,
  DiamondDotsSpinner,
  AnimatedCheckmark,
  AnimatedErrorIcon,
  AnimatedProgressBar,
  MediaGridSkeleton,
} from '../components/AdminMotion';

type MediaFilterType = 'all' | MediaCategory;
type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc';
type ViewMode = 'grid' | 'list';

interface UploadQueueItem {
  id: string;
  file: File;
  previewUrl?: string;
  bucket: SupabaseBucketId;
  folder: string;
  progress: number;
  stage: 'queued' | 'hashing' | 'uploading' | 'verifying' | 'done' | 'error' | 'reused';
  error?: string;
  asset?: MediaAssetItem;
  replaceOldPath?: string;
  replaceOldUrl?: string;
}

interface PendingDuplicatePrompt {
  file: File;
  bucket: SupabaseBucketId;
  folder: string;
  sha256Hash?: string;
  matchType: 'hash' | 'name';
  existing: MediaAssetItem;
  resolve: (choice: 'reuse' | 'replace' | 'keep-both' | 'cancel') => void;
}

interface DeleteConfirmState {
  kind: 'file' | 'folder';
  file?: MediaAssetItem;
  folder?: MediaFolderItem;
  references: MediaUsageRef[];
  loadingRefs: boolean;
  deleting: boolean;
}

const SUPABASE_SETUP_SQL = `-- 1. Optional Supabase metadata table for synced Tiqsey Media Library records
create table if not exists public.media_assets (
  id text primary key,
  bucket text not null,
  path text not null,
  folder text default '',
  file_name text not null,
  public_url text not null,
  mime_type text not null,
  media_type text not null,
  file_size bigint default 0,
  sha256_hash text,
  uploaded_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(bucket, path)
);

-- 2. Storage RLS Policies for all 7 Tiqsey buckets (Read, Upload, Update & Delete)
drop policy if exists "Tiqsey storage public read" on storage.objects;
drop policy if exists "Tiqsey storage upload" on storage.objects;
drop policy if exists "Tiqsey storage update" on storage.objects;
drop policy if exists "Tiqsey storage delete" on storage.objects;
drop policy if exists "Tiqsey storage authenticated write" on storage.objects;

create policy "Tiqsey storage public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('media','admin-media','blog','attractions','avatars','cities','attraction-photos'));

-- If running with the Tiqsey Node backend, privileged writes use SUPABASE_SERVICE_ROLE_KEY behind Admin Auth.
-- If hosting statically (direct browser -> Supabase), run the policies below so upload, replace, and delete work live:
create policy "Tiqsey storage upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id in ('media','admin-media','blog','attractions','avatars','cities','attraction-photos'));

create policy "Tiqsey storage update" on storage.objects
  for update to anon, authenticated
  using (bucket_id in ('media','admin-media','blog','attractions','avatars','cities','attraction-photos'))
  with check (bucket_id in ('media','admin-media','blog','attractions','avatars','cities','attraction-photos'));

create policy "Tiqsey storage delete" on storage.objects
  for delete to anon, authenticated
  using (bucket_id in ('media','admin-media','blog','attractions','avatars','cities','attraction-photos'));`;

const SUPABASE_DELETE_RLS_SQL = `drop policy if exists "Tiqsey storage public read" on storage.objects;
drop policy if exists "Tiqsey storage upload" on storage.objects;
drop policy if exists "Tiqsey storage update" on storage.objects;
drop policy if exists "Tiqsey storage delete" on storage.objects;

create policy "Tiqsey storage public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('media','admin-media','blog','attractions','avatars','cities','attraction-photos'));

create policy "Tiqsey storage upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id in ('media','admin-media','blog','attractions','avatars','cities','attraction-photos'));

create policy "Tiqsey storage update" on storage.objects
  for update to anon, authenticated
  using (bucket_id in ('media','admin-media','blog','attractions','avatars','cities','attraction-photos'))
  with check (bucket_id in ('media','admin-media','blog','attractions','avatars','cities','attraction-photos'));

create policy "Tiqsey storage delete" on storage.objects
  for delete to anon, authenticated
  using (bucket_id in ('media','admin-media','blog','attractions','avatars','cities','attraction-photos'));`;

function formatDateShort(iso?: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '—';
  }
}

export default function StorageManager() {
  const { user } = useAuth();
  const adminEmail = user?.email || 'admin@tiqsey.com';

  // Core library state
  const [library, setLibrary] = useState<MediaLibraryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncingBuckets, setSyncingBuckets] = useState<boolean>(false);
  const [testingConn, setTestingConn] = useState<boolean>(false);
  const [connReport, setConnReport] = useState<SupabaseStorageConnectionReport | null>(null);

  // Navigation & filter state
  const [selectedBucket, setSelectedBucket] = useState<SupabaseBucketId | 'all'>('all');
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaFilterType>('all');
  const [mimeFilter, setMimeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);
  const [showSqlDrawer, setShowSqlDrawer] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Upload & drag-drop state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [duplicatePrompt, setDuplicatePrompt] = useState<PendingDuplicatePrompt | null>(null);
  const multiUploadInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetRef = useRef<MediaAssetItem | null>(null);

  // Modals & inspector state
  const [inspectedFile, setInspectedFile] = useState<MediaAssetItem | null>(null);
  const [inspectedRefs, setInspectedRefs] = useState<MediaUsageRef[]>([]);
  const [loadingInspectedRefs, setLoadingInspectedRefs] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState | null>(null);
  const [rlsFixModal, setRlsFixModal] = useState<{
    pendingDelete: DeleteConfirmState;
    bucket: string;
    retrying: boolean;
    copied: boolean;
  } | null>(null);

  // Folder modals
  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [newFolderBucket, setNewFolderBucket] = useState<SupabaseBucketId>('media');
  const [savingFolder, setSavingFolder] = useState<boolean>(false);
  const [renameFolderTarget, setRenameFolderTarget] = useState<MediaFolderItem | null>(null);
  const [renameFolderValue, setRenameFolderValue] = useState<string>('');

  // Create New Bucket modal state
  const [createBucketOpen, setCreateBucketOpen] = useState<boolean>(false);
  const [newBucketName, setNewBucketName] = useState<string>('');
  const [newBucketPublic, setNewBucketPublic] = useState<boolean>(true);
  const [newBucketLimitMb, setNewBucketLimitMb] = useState<number>(50);
  const [newBucketMimePreset, setNewBucketMimePreset] = useState<'all' | 'images' | 'videos' | 'docs'>('all');
  const [creatingBucket, setCreatingBucket] = useState<boolean>(false);
  const [createBucketError, setCreateBucketError] = useState<string | null>(null);
  const [createBucketRlsHelper, setCreateBucketRlsHelper] = useState<{
    bucketId: string;
    sql: string;
    copied: boolean;
    verifying: boolean;
  } | null>(null);

  // Download progress state per file id (prevents duplicate clicks while processing)
  const [downloadingMap, setDownloadingMap] = useState<Record<string, number>>({});

  // Clipboard & global toast notifications
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const adminToast = useAdminToast();
  const previewUrlsRef = useRef<Set<string>>(new Set());

  const createLocalPreviewUrl = useCallback((file: File): string | undefined => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return undefined;
    try {
      const url = URL.createObjectURL(file);
      previewUrlsRef.current.add(url);
      return url;
    } catch {
      return undefined;
    }
  }, []);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current.clear();
    };
  }, []);

  const showToast = useCallback(
    (kind: 'success' | 'error' | 'info', message: string) => {
      adminToast.notify(kind, message);
    },
    [adminToast]
  );

  const loadLibrary = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const data = await fetchMediaLibrary(adminEmail, 'all');
        setLibrary(data);
        if (!data.connected && data.error && !silent) {
          showToast('error', data.error);
        }
      } catch (err: any) {
        showToast('error', err?.message || 'Unable to connect to Supabase Storage.');
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [adminEmail, showToast]
  );

  // Initial load + periodic automatic connection health check (every 60s)
  useEffect(() => {
    loadLibrary(false);
    const interval = setInterval(() => {
      loadLibrary(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [loadLibrary]);

  // Reset folder breadcrumb when switching buckets
  const handleSelectBucket = (bucket: SupabaseBucketId | 'all') => {
    setSelectedBucket(bucket);
    setCurrentFolder('');
    if (bucket !== 'all') {
      setNewFolderBucket(bucket);
    }
  };

  const handleTestConnection = async () => {
    setTestingConn(true);
    try {
      const report = await testStorageConnection(adminEmail);
      setConnReport(report);
      if (report.connected) {
        showToast(
          'success',
          `Connected to Supabase Storage (${report.verifiedBuckets}/${report.totalBuckets} buckets live · ${report.latencyMs}ms)`
        );
        await loadLibrary(true);
      } else {
        showToast('error', report.error || 'Disconnected from Supabase Storage.');
      }
    } catch (err: any) {
      showToast('error', err?.message || 'Connection test failed.');
    } finally {
      setTestingConn(false);
    }
  };

  const handleSyncBuckets = async () => {
    setSyncingBuckets(true);
    try {
      const res = await fetchJsonSafely<{ success?: boolean; buckets?: any[]; error?: string }>(
        '/api/admin/storage/sync-buckets',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'x-admin-email': adminEmail },
        }
      );
      if (res.isJson && res.ok) {
        showToast('success', 'All 7 Supabase Storage buckets verified and synced.');
        await loadLibrary(true);
      } else {
        showToast('error', res.data?.error || 'Bucket sync requires the live Node server connection.');
      }
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to sync buckets.');
    } finally {
      setSyncingBuckets(false);
    }
  };

  const copyText = async (value: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      showToast('success', `${label} copied to clipboard.`);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      showToast('error', 'Clipboard copy failed.');
    }
  };

  // Load linked references whenever a file is opened in the Inspector
  useEffect(() => {
    if (!inspectedFile) {
      setInspectedRefs([]);
      return;
    }
    let cancelled = false;
    setLoadingInspectedRefs(true);
    const clientRefs = findClientMediaReferences(inspectedFile.publicUrl, inspectedFile.path);
    fetchServerMediaUsage(adminEmail, inspectedFile.publicUrl, inspectedFile.path)
      .then((serverRefs) => {
        if (!cancelled) {
          setInspectedRefs(mergeMediaReferences(serverRefs, clientRefs));
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingInspectedRefs(false);
      });
    return () => {
      cancelled = true;
    };
  }, [inspectedFile, adminEmail]);

  const buckets: LiveBucketSummary[] = library?.buckets || [];
  const allFiles: MediaAssetItem[] = library?.files || [];
  const allFolders: MediaFolderItem[] = library?.folders || [];

  // Scope files & folders to selected bucket + currentFolder
  const scopedFolders = useMemo(() => {
    return allFolders.filter((fld) => {
      if (selectedBucket !== 'all' && fld.bucket !== selectedBucket) return false;
      if (searchQuery.trim()) {
        return fld.path.toLowerCase().includes(searchQuery.trim().toLowerCase());
      }
      if (selectedBucket === 'all') {
        return fld.parentFolder === '';
      }
      return fld.parentFolder === currentFolder;
    });
  }, [allFolders, selectedBucket, currentFolder, searchQuery]);

  const availableMimes = useMemo(() => {
    const set = new Set<string>();
    for (const f of allFiles) {
      if (f.mimeType) set.add(f.mimeType);
    }
    return Array.from(set).sort();
  }, [allFiles]);

  const filteredFiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = allFiles.filter((file) => {
      if (selectedBucket !== 'all' && file.bucket !== selectedBucket) return false;
      if (selectedBucket !== 'all' && currentFolder) {
        if (file.folder !== currentFolder && !file.folder.startsWith(`${currentFolder}/`)) {
          return false;
        }
      }
      if (mediaTypeFilter !== 'all' && file.mediaType !== mediaTypeFilter) return false;
      if (mimeFilter !== 'all' && file.mimeType !== mimeFilter) return false;
      if (q) {
        const hay = `${file.name} ${file.path} ${file.bucket} ${file.mimeType}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.updatedAt || a.createdAt || 0).getTime() - new Date(b.updatedAt || b.createdAt || 0).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'size-desc':
          return (b.size || 0) - (a.size || 0);
        case 'size-asc':
          return (a.size || 0) - (b.size || 0);
        case 'date-desc':
        default:
          return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
      }
    });

    return list;
  }, [allFiles, selectedBucket, currentFolder, mediaTypeFilter, mimeFilter, searchQuery, sortBy]);

  // Determine smart target bucket for a file when user is in "All Buckets" view
  const resolveUploadTarget = (file: File): { bucket: SupabaseBucketId; folder: string } => {
    if (selectedBucket !== 'all') {
      const spec = getBucketConfig(selectedBucket);
      const mime = file.type === 'image/jpg' ? 'image/jpeg' : file.type;
      if (!mime || spec.allowedMimeTypes.includes(mime)) {
        return { bucket: selectedBucket, folder: currentFolder || spec.defaultFolder };
      }
      // Route video/PDF dropped while on an image-only bucket to admin-media or media safely
      if (mime.startsWith('video/')) {
        return { bucket: 'admin-media', folder: 'videos' };
      }
      return { bucket: 'media', folder: 'uploads' };
    }

    if (file.type.startsWith('video/')) {
      return { bucket: 'admin-media', folder: 'videos' };
    }
    if (file.type === 'application/pdf') {
      return { bucket: 'media', folder: 'documents' };
    }
    return { bucket: 'media', folder: 'uploads' };
  };

  const askDuplicateDecision = (
    file: File,
    bucket: SupabaseBucketId,
    folder: string,
    sha256Hash: string | undefined,
    matchType: 'hash' | 'name',
    existing: MediaAssetItem
  ): Promise<'reuse' | 'replace' | 'keep-both' | 'cancel'> => {
    return new Promise((resolve) => {
      setDuplicatePrompt({
        file,
        bucket,
        folder,
        sha256Hash,
        matchType,
        existing,
        resolve,
      });
    });
  };

  const executeUploadQueueItem = async (item: UploadQueueItem, sha256Hash?: string) => {
    const updateItem = (patch: Partial<UploadQueueItem>) => {
      setUploadQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, ...patch } : q)));
    };

    try {
      const result = await uploadMediaChunked({
        file: item.file,
        bucket: item.bucket,
        folder: item.folder,
        adminEmail,
        sha256Hash,
        replaceOldPath: item.replaceOldPath,
        replaceOldUrl: item.replaceOldUrl,
        onProgress: (percent, stage) => {
          updateItem({ progress: percent, stage });
        },
      });

      // If this was a replace operation, also auto-update client-side references
      if (item.replaceOldUrl && result.asset.publicUrl) {
        const clientUpdated = replaceClientMediaReferences(item.replaceOldUrl, result.asset.publicUrl);
        const totalUpdated = mergeMediaReferences(result.updatedReferences, clientUpdated).length;
        showToast(
          'success',
          totalUpdated > 0
            ? `Replaced file and auto-updated ${totalUpdated} linked website reference${totalUpdated === 1 ? '' : 's'}.`
            : `Replaced file permanently in "${item.bucket}".`
        );
        if (inspectedFile && inspectedFile.publicUrl === item.replaceOldUrl) {
          setInspectedFile(result.asset);
        }
      }

      updateItem({ progress: 100, stage: 'done', asset: result.asset, error: undefined });

      // Optimistically insert the verified Supabase asset into library immediately so it appears without delay
      setLibrary((prev) => {
        if (!prev) return prev;
        const withoutOld = prev.files.filter(
          (f) => f.path !== result.asset.path && (!item.replaceOldPath || f.path !== item.replaceOldPath)
        );
        const nextFiles = [result.asset, ...withoutOld];
        return {
          ...prev,
          files: nextFiles,
          summary: {
            ...prev.summary,
            totalFiles: nextFiles.length,
            totalImages: nextFiles.filter((f) => f.mediaType === 'image').length,
            totalVideos: nextFiles.filter((f) => f.mediaType === 'video').length,
            totalDocuments: nextFiles.filter((f) => f.mediaType === 'document').length,
            totalBytes: nextFiles.reduce((s, f) => s + (Number(f.size) || 0), 0),
          },
        };
      });

      // Auto-dismiss completed Upload Activity item after 3.5s so the panel stays clean
      setTimeout(() => {
        setUploadQueue((prev) => prev.filter((q) => q.id !== item.id || q.stage !== 'done'));
      }, 3500);

      return result.asset;
    } catch (err: any) {
      updateItem({
        stage: 'error',
        error: err?.message || `Failed to upload ${item.file.name}`,
      });
      return null;
    }
  };

  const handleUploadFiles = async (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList || []);
    if (incoming.length === 0) return;

    let uploadedCount = 0;
    let reusedCount = 0;
    const uploadedAssets: MediaAssetItem[] = [];

    for (const file of incoming) {
      const target = resolveUploadTarget(file);
      const itemId = `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      const queueItem: UploadQueueItem = {
        id: itemId,
        file,
        previewUrl: createLocalPreviewUrl(file),
        bucket: target.bucket,
        folder: target.folder,
        progress: 3,
        stage: 'hashing',
      };
      setUploadQueue((prev) => [queueItem, ...prev.slice(0, 14)]);

      const sha256Hash = await computeFileSha256(file);
      let dupCheck = await checkDuplicateMedia(adminEmail, {
        bucket: target.bucket,
        filename: file.name,
        sha256Hash,
        folder: target.folder,
      });

      // Also check loaded files in memory when running on static hosting without SQLite backend
      if (!dupCheck.isDuplicate && allFiles.length > 0) {
        const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35).toLowerCase();
        const memMatch = allFiles.find(
          (f) =>
            f.bucket === target.bucket &&
            (f.size === file.size && f.name.toLowerCase().startsWith(cleanBase.slice(0, 18)))
        );
        if (memMatch) {
          dupCheck = { isDuplicate: true, matchType: 'name', existing: memMatch };
        }
      }

      let finalItem = queueItem;
      if (dupCheck.isDuplicate && dupCheck.existing && dupCheck.matchType) {
        const choice = await askDuplicateDecision(
          file,
          target.bucket,
          target.folder,
          sha256Hash,
          dupCheck.matchType,
          dupCheck.existing
        );
        setDuplicatePrompt(null);

        if (choice === 'cancel') {
          setUploadQueue((prev) => prev.filter((q) => q.id !== itemId));
          continue;
        }
        if (choice === 'reuse') {
          reusedCount += 1;
          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === itemId ? { ...q, progress: 100, stage: 'reused', asset: dupCheck.existing || undefined } : q
            )
          );
          setTimeout(() => {
            setUploadQueue((prev) => prev.filter((q) => q.id !== itemId || q.stage !== 'reused'));
          }, 3500);
          await copyText(dupCheck.existing.publicUrl, `reuse-${dupCheck.existing.id}`, 'Existing file URL');
          continue;
        }
        if (choice === 'replace') {
          finalItem = {
            ...queueItem,
            bucket: dupCheck.existing.bucket as SupabaseBucketId,
            folder: dupCheck.existing.folder || target.folder,
            replaceOldPath: dupCheck.existing.path,
            replaceOldUrl: dupCheck.existing.publicUrl,
          };
          setUploadQueue((prev) => prev.map((q) => (q.id === itemId ? finalItem : q)));
        }
      }

      const uploaded = await executeUploadQueueItem(finalItem, sha256Hash);
      if (uploaded) {
        uploadedCount += 1;
        uploadedAssets.push(uploaded);
      }
    }

    if (uploadedCount > 0) {
      // Ensure newly uploaded media is never hidden behind a mismatched filter (e.g. uploading an image while "Docs" tab is active)
      const firstUploaded = uploadedAssets[0];
      if (firstUploaded) {
        if (mediaTypeFilter !== 'all' && uploadedAssets.some((a) => a.mediaType !== mediaTypeFilter)) {
          setMediaTypeFilter('all');
        }
        if (mimeFilter !== 'all' && uploadedAssets.some((a) => a.mimeType !== mimeFilter)) {
          setMimeFilter('all');
        }
        if (searchQuery.trim()) {
          setSearchQuery('');
        }
        if (selectedBucket !== 'all' && firstUploaded.bucket !== selectedBucket) {
          setSelectedBucket(firstUploaded.bucket as SupabaseBucketId);
          setCurrentFolder('');
        }
      }

      showToast(
        'success',
        `Uploaded and verified ${uploadedCount} file${uploadedCount === 1 ? '' : 's'} in Supabase Storage.`
      );
      await loadLibrary(true);
    } else if (reusedCount > 0) {
      showToast('info', `Reused ${reusedCount} existing file${reusedCount === 1 ? '' : 's'} without duplicating storage.`);
    }
  };

  const handleRetryQueueItem = async (item: UploadQueueItem) => {
    setUploadQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, progress: 5, stage: 'uploading', error: undefined } : q))
    );
    const uploaded = await executeUploadQueueItem(item);
    if (uploaded) {
      showToast('success', `Retry succeeded for "${item.file.name}".`);
      await loadLibrary(true);
    }
  };

  const triggerReplaceFile = (asset: MediaAssetItem) => {
    replaceTargetRef.current = asset;
    replaceFileInputRef.current?.click();
  };

  const handleReplaceFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = replaceTargetRef.current;
    if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
    if (!file || !target) return;

    const itemId = `rep-${Date.now()}`;
    const queueItem: UploadQueueItem = {
      id: itemId,
      file,
      previewUrl: createLocalPreviewUrl(file),
      bucket: target.bucket as SupabaseBucketId,
      folder: target.folder || getBucketConfig(target.bucket).defaultFolder,
      progress: 5,
      stage: 'uploading',
      replaceOldPath: target.path,
      replaceOldUrl: target.publicUrl,
    };
    setUploadQueue((prev) => [queueItem, ...prev.slice(0, 14)]);
    const uploaded = await executeUploadQueueItem(queueItem);
    if (uploaded) {
      await loadLibrary(true);
    }
  };

  // Delete confirmation with linked-record scanning
  const openDeleteFileConfirm = async (file: MediaAssetItem) => {
    const clientRefs = findClientMediaReferences(file.publicUrl, file.path);
    setDeleteConfirm({
      kind: 'file',
      file,
      references: clientRefs,
      loadingRefs: true,
      deleting: false,
    });
    const serverRefs = await fetchServerMediaUsage(adminEmail, file.publicUrl, file.path);
    setDeleteConfirm((prev) =>
      prev && prev.kind === 'file' && prev.file?.id === file.id
        ? { ...prev, references: mergeMediaReferences(serverRefs, clientRefs), loadingRefs: false }
        : prev
    );
  };

  const openDeleteFolderConfirm = async (folder: MediaFolderItem) => {
    const folderFiles = allFiles.filter(
      (f) => f.bucket === folder.bucket && (f.folder === folder.path || f.folder.startsWith(`${folder.path}/`))
    );
    const clientRefs: MediaUsageRef[] = [];
    for (const f of folderFiles) {
      clientRefs.push(...findClientMediaReferences(f.publicUrl, f.path));
    }
    setDeleteConfirm({
      kind: 'folder',
      folder,
      references: mergeMediaReferences([], clientRefs),
      loadingRefs: false,
      deleting: false,
    });
  };

  const executeConfirmedDelete = async (overrideTarget?: DeleteConfirmState) => {
    const activeDelete = overrideTarget || deleteConfirm;
    if (!activeDelete) return;
    if (overrideTarget) {
      setRlsFixModal((prev) => (prev ? { ...prev, retrying: true } : null));
    } else {
      setDeleteConfirm((prev) => (prev ? { ...prev, deleting: true } : null));
    }

    try {
      if (activeDelete.kind === 'file' && activeDelete.file) {
        const target = activeDelete.file;
        const result = await deleteMediaFiles(adminEmail, target.bucket as SupabaseBucketId, [target.path]);
        if (!result.ok) {
          if (result.rlsBlocked || /row-level security|policy/i.test(result.error || '')) {
            setDeleteConfirm(null);
            setRlsFixModal({
              pendingDelete: { ...activeDelete, deleting: false },
              bucket: target.bucket,
              retrying: false,
              copied: false,
            });
            showToast(
              'info',
              `Run the 1-time Delete RLS policy in Supabase SQL Editor, then click "Retry Delete Now".`
            );
          } else {
            showToast('error', result.error || 'Failed to delete file.');
            setDeleteConfirm((prev) => (prev ? { ...prev, deleting: false } : null));
            setRlsFixModal((prev) => (prev ? { ...prev, retrying: false } : null));
          }
          return;
        }
        if (inspectedFile?.id === target.id) setInspectedFile(null);
        // Immediately remove from live state before background refresh
        setLibrary((prev) => {
          if (!prev) return prev;
          const nextFiles = prev.files.filter((f) => !(f.bucket === target.bucket && f.path === target.path));
          return {
            ...prev,
            files: nextFiles,
            summary: {
              ...prev.summary,
              totalFiles: nextFiles.length,
              totalImages: nextFiles.filter((f) => f.mediaType === 'image').length,
              totalVideos: nextFiles.filter((f) => f.mediaType === 'video').length,
              totalDocuments: nextFiles.filter((f) => f.mediaType === 'document').length,
              totalBytes: nextFiles.reduce((s, f) => s + (Number(f.size) || 0), 0),
            },
          };
        });
        showToast('success', `Deleted "${target.name}" permanently from Supabase Storage.`);
        setDeleteConfirm(null);
        setRlsFixModal(null);
        await loadLibrary(true);
      } else if (activeDelete.kind === 'folder' && activeDelete.folder) {
        const folder = activeDelete.folder;
        const result = await deleteStorageFolder(
          adminEmail,
          folder.bucket as SupabaseBucketId,
          folder.path,
          true
        );
        if (!result.ok) {
          if (result.rlsBlocked || /row-level security|policy/i.test(result.error || '')) {
            setDeleteConfirm(null);
            setRlsFixModal({
              pendingDelete: { ...activeDelete, deleting: false },
              bucket: folder.bucket,
              retrying: false,
              copied: false,
            });
            showToast(
              'info',
              `Run the 1-time Delete RLS policy in Supabase SQL Editor, then click "Retry Delete Now".`
            );
          } else {
            showToast('error', result.error || 'Failed to delete folder.');
            setDeleteConfirm((prev) => (prev ? { ...prev, deleting: false } : null));
            setRlsFixModal((prev) => (prev ? { ...prev, retrying: false } : null));
          }
          return;
        }
        if (currentFolder === folder.path) setCurrentFolder('');
        showToast('success', `Deleted folder "${folder.path}" and its files from Supabase Storage.`);
        setDeleteConfirm(null);
        setRlsFixModal(null);
        await loadLibrary(true);
      }
    } catch (err: any) {
      showToast('error', err?.message || 'Delete operation failed.');
      setDeleteConfirm((prev) => (prev ? { ...prev, deleting: false } : null));
      setRlsFixModal((prev) => (prev ? { ...prev, retrying: false } : null));
    }
  };

  // Create Folder
  const handleCreateFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newFolderName.trim().replace(/^\/+|\/+$/g, '');
    if (!cleaned) return;
    const bucketToUse = selectedBucket === 'all' ? newFolderBucket : selectedBucket;
    const fullFolderPath = currentFolder && selectedBucket !== 'all' ? `${currentFolder}/${cleaned}` : cleaned;

    setSavingFolder(true);
    try {
      const res = await createStorageFolder(adminEmail, bucketToUse, fullFolderPath);
      if (res.error) {
        showToast('error', res.error);
      } else {
        showToast('success', `Created folder "${fullFolderPath}" in ${bucketToUse}.`);
        setCreateFolderOpen(false);
        setNewFolderName('');
        await loadLibrary(true);
      }
    } finally {
      setSavingFolder(false);
    }
  };

  // Rename Folder
  const handleRenameFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameFolderTarget) return;
    const cleaned = renameFolderValue.trim().replace(/^\/+|\/+$/g, '');
    if (!cleaned || cleaned === renameFolderTarget.path) {
      setRenameFolderTarget(null);
      return;
    }

    setSavingFolder(true);
    try {
      const res = await renameStorageFolder(
        adminEmail,
        renameFolderTarget.bucket as SupabaseBucketId,
        renameFolderTarget.path,
        cleaned
      );
      if (!res.ok) {
        showToast('error', res.error || 'Failed to rename folder.');
      } else {
        let clientUpdatedCount = 0;
        for (const rep of res.urlReplacements || []) {
          clientUpdatedCount += replaceClientMediaReferences(rep.oldUrl, rep.newUrl).length;
        }
        showToast(
          'success',
          `Renamed folder to "${cleaned}" (${res.movedCount || 0} file${res.movedCount === 1 ? '' : 's'} moved${
            clientUpdatedCount > 0 ? `, ${clientUpdatedCount} linked refs updated` : ''
          }).`
        );
        if (currentFolder === renameFolderTarget.path) {
          setCurrentFolder(cleaned);
        }
        setRenameFolderTarget(null);
        await loadLibrary(true);
      }
    } finally {
      setSavingFolder(false);
    }
  };

  // Create New Bucket helpers & submit
  const getMimeTypesForPreset = (preset: 'all' | 'images' | 'videos' | 'docs'): string[] => {
    switch (preset) {
      case 'images':
        return ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'];
      case 'videos':
        return ['video/mp4', 'video/webm', 'video/quicktime'];
      case 'docs':
        return ['application/pdf'];
      case 'all':
      default:
        return [...SAFE_STORAGE_MIME_TYPES];
    }
  };

  const openCreateBucketModal = () => {
    setNewBucketName('');
    setNewBucketPublic(true);
    setNewBucketLimitMb(50);
    setNewBucketMimePreset('all');
    setCreateBucketError(null);
    setCreateBucketRlsHelper(null);
    setCreateBucketOpen(true);
  };

  const handleCreateBucketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creatingBucket) return;

    const normalizedId = normalizeBucketName(newBucketName);
    if (!isValidBucketName(normalizedId)) {
      setCreateBucketError(
        'Bucket name must be 2–63 characters using lowercase letters, numbers, and hyphens only.'
      );
      return;
    }

    const allowedMimeTypes = getMimeTypesForPreset(newBucketMimePreset);
    const fileSizeLimit = newBucketLimitMb * 1024 * 1024;

    setCreatingBucket(true);
    setCreateBucketError(null);
    setCreateBucketRlsHelper(null);

    try {
      const result = await createStorageBucket(adminEmail, {
        id: normalizedId,
        public: newBucketPublic,
        fileSizeLimit,
        allowedMimeTypes,
      });

      if (result.ok && result.bucket) {
        const createdBucket = result.bucket;
        setLibrary((prev) => {
          if (!prev) return prev;
          const exists = prev.buckets.some((b) => b.id === createdBucket.id);
          return {
            ...prev,
            buckets: exists
              ? prev.buckets.map((b) => (b.id === createdBucket.id ? createdBucket : b))
              : [...prev.buckets, createdBucket],
          };
        });
        setSelectedBucket(createdBucket.id);
        setCurrentFolder('');
        setNewFolderBucket(createdBucket.id);
        setCreateBucketOpen(false);
        setNewBucketName('');
        showToast('success', `Created Supabase Storage bucket "${createdBucket.id}".`);
        await loadLibrary(true);
        return;
      }

      if (result.rlsBlocked && result.sqlFix) {
        setCreateBucketRlsHelper({
          bucketId: normalizedId,
          sql: result.sqlFix,
          copied: false,
          verifying: false,
        });
        setCreateBucketError(null);
        return;
      }

      if (result.alreadyExists) {
        setCreateBucketError(result.error || `Bucket "${normalizedId}" already exists.`);
        await loadLibrary(true);
        return;
      }

      setCreateBucketError(result.error || 'Failed to create bucket.');
    } catch (err: any) {
      setCreateBucketError(err?.message || 'Failed to create bucket.');
    } finally {
      setCreatingBucket(false);
    }
  };

  const handleVerifyBucketAfterSql = async () => {
    if (!createBucketRlsHelper || createBucketRlsHelper.verifying) return;
    setCreateBucketRlsHelper((prev) => (prev ? { ...prev, verifying: true } : null));
    setCreateBucketError(null);

    try {
      const result = await verifyAndRegisterCustomBucket(adminEmail, {
        id: createBucketRlsHelper.bucketId,
        public: newBucketPublic,
        fileSizeLimit: newBucketLimitMb * 1024 * 1024,
        allowedMimeTypes: getMimeTypesForPreset(newBucketMimePreset),
      });

      if (result.ok && result.bucket) {
        const verified = result.bucket;
        setLibrary((prev) => {
          if (!prev) return prev;
          const exists = prev.buckets.some((b) => b.id === verified.id);
          return {
            ...prev,
            buckets: exists
              ? prev.buckets.map((b) => (b.id === verified.id ? verified : b))
              : [...prev.buckets, verified],
          };
        });
        setSelectedBucket(verified.id);
        setCurrentFolder('');
        setNewFolderBucket(verified.id);
        setCreateBucketOpen(false);
        setCreateBucketRlsHelper(null);
        setNewBucketName('');
        showToast('success', `Bucket "${verified.id}" verified and added to Tiqsey Media Storage.`);
        await loadLibrary(true);
      } else {
        setCreateBucketError(
          result.error || `Could not verify "${createBucketRlsHelper.bucketId}" yet. Run the SQL in Supabase first.`
        );
        setCreateBucketRlsHelper((prev) => (prev ? { ...prev, verifying: false } : null));
      }
    } catch (err: any) {
      setCreateBucketError(err?.message || 'Verification failed.');
      setCreateBucketRlsHelper((prev) => (prev ? { ...prev, verifying: false } : null));
    }
  };

  const handleDownload = async (file: MediaAssetItem) => {
    // Prevent duplicate download clicks while this file is already downloading
    if (downloadingMap[file.id] !== undefined) return;

    setDownloadingMap((prev) => ({ ...prev, [file.id]: 6 }));
    try {
      await downloadMediaFile(adminEmail, file, (pct) => {
        setDownloadingMap((prev) => ({ ...prev, [file.id]: pct }));
      });
      setDownloadingMap((prev) => ({ ...prev, [file.id]: 100 }));
      showToast('success', `Downloaded "${file.name}" successfully.`);
      setTimeout(() => {
        setDownloadingMap((prev) => {
          const next = { ...prev };
          delete next[file.id];
          return next;
        });
      }, 900);
    } catch (err: any) {
      setDownloadingMap((prev) => {
        const next = { ...prev };
        delete next[file.id];
        return next;
      });
      showToast('error', err?.message || 'Download failed.');
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const summary = library?.summary || {
    totalImages: 0,
    totalVideos: 0,
    totalDocuments: 0,
    totalFolders: 0,
    totalFiles: 0,
    totalBytes: 0,
    quotaBytes: 1024 * 1024 * 1024,
  };
  const isConnected = Boolean(library?.connected);
  const usagePercent = Math.min(100, summary.quotaBytes > 0 ? (summary.totalBytes / summary.quotaBytes) * 100 : 0);
  const displayBuckets = useMemo(() => {
    const merged = new Map<
      string,
      {
        id: SupabaseBucketId;
        label: string;
        description: string;
        maxSizeLabel: string;
        fileCount: number;
        existsInSupabase: boolean;
        public: boolean;
        isCustom?: boolean;
      }
    >();
    for (const b of SUPABASE_STORAGE_BUCKET_LIST) {
      merged.set(b.id, {
        id: b.id,
        label: b.label,
        description: b.description,
        maxSizeLabel: b.maxSizeLabel,
        fileCount: 0,
        existsInSupabase: false,
        public: b.public,
        isCustom: false,
      });
    }
    for (const live of buckets) {
      const existing = merged.get(live.id);
      merged.set(live.id, {
        id: live.id,
        label: live.label || existing?.label || live.id,
        description: live.description || existing?.description || `Storage bucket (${live.id})`,
        maxSizeLabel: live.maxSizeLabel || existing?.maxSizeLabel || '50 MB',
        fileCount: live.fileCount ?? 0,
        existsInSupabase: Boolean(live.existsInSupabase),
        public: live.public !== false,
        isCustom: live.isCustom ?? !existing,
      });
    }
    return Array.from(merged.values());
  }, [buckets]);
  const activeBucketConfig = selectedBucket === 'all' ? null : getBucketConfig(selectedBucket);
  const verifiedBucketsCount = displayBuckets.filter((b) => b.existsInSupabase).length;
  const normalizedPreviewBucketId = normalizeBucketName(newBucketName);

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-5">
      {/* Hidden file inputs */}
      <input
        ref={multiUploadInputRef}
        type="file"
        multiple
        accept={
          activeBucketConfig
            ? activeBucketConfig.allowedMimeTypes.join(',')
            : 'image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime,application/pdf'
        }
        onChange={(e) => {
          if (e.target.files?.length) {
            handleUploadFiles(e.target.files);
          }
          e.target.value = '';
        }}
        className="hidden"
      />
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime,application/pdf"
        onChange={handleReplaceFileSelected}
        className="hidden"
      />

      {/* Main Unified Storage Card (faithful to clean mockup layout + power tools) */}
      <section
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative bg-white dark:bg-slate-900 border rounded-2xl shadow-sm transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-lg'
            : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        {/* Smooth Animated Drag-and-Drop Full-Canvas Overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="absolute inset-0 z-30 rounded-2xl bg-blue-600/10 dark:bg-blue-500/15 backdrop-blur-[3px] border-2 border-dashed border-blue-500 flex flex-col items-center justify-center pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.92, y: 10, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.94, y: 6, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                className="bg-white/95 dark:bg-slate-900/95 px-7 py-5 rounded-2xl shadow-2xl border border-blue-200 dark:border-blue-800 text-center max-w-sm"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                  className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 border border-blue-200/70 dark:border-blue-800/70"
                >
                  <Upload className="w-6 h-6" />
                </motion.div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Drop files to upload to Supabase
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Destination:{' '}
                  <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
                    {selectedBucket === 'all'
                      ? 'Auto-routed bucket'
                      : `${selectedBucket}/${currentFolder || activeBucketConfig?.defaultFolder || 'uploads'}`}
                  </span>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 sm:p-7 space-y-6">
          {/* Top Header Row: Tiqsey Media Storage + Connected Status + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Tiqsey Media Storage
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${
                    loading && !library
                      ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      : isConnected
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/70'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/70'
                  }`}
                >
                  {loading && !library ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : isConnected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Disconnected</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {library?.projectId ? `Supabase Project ${library.projectId}` : 'Supabase Storage'} ·{' '}
                {verifiedBucketsCount}/{displayBuckets.length} buckets active
                {library?.mode === 'server'
                  ? ' · Live Server API'
                  : library?.mode === 'supabase-direct'
                  ? ' · Direct Browser -> Supabase'
                  : ''}
                {library?.latencyMs ? ` · ${library.latencyMs}ms` : ''}
                {library?.supabaseMediaTableSynced ? ' · Metadata synced' : ''}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                {testingConn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlugZap className="w-3.5 h-3.5" />}
                <span>{isConnected ? 'Test Connection' : 'Reconnect'}</span>
              </button>
              <button
                type="button"
                onClick={handleSyncBuckets}
                disabled={syncingBuckets}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                {syncingBuckets ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>Sync Buckets</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSqlDrawer((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  showSqlDrawer
                    ? 'border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>RLS & SQL</span>
              </button>
              <button
                type="button"
                onClick={() => loadLibrary(false)}
                disabled={loading}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Refresh media library"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Disconnected Alert Banner */}
          {!loading && library && !isConnected && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                <div className="text-xs text-rose-800 dark:text-rose-200">
                  <p className="font-semibold">Supabase Storage connection interrupted</p>
                  <p className="mt-0.5 opacity-90">
                    {library.error || connReport?.error || 'Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or click Reconnect.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConn}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold whitespace-nowrap shrink-0"
              >
                {testingConn ? 'Reconnecting...' : 'Retry Connection'}
              </button>
            </div>
          )}

          {/* Optional Collapsible SQL & RLS Policy Drawer */}
          {showSqlDrawer && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Supabase Schema & Least-Privilege Storage RLS Policies
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Run in your Supabase SQL Editor to enable dual-syncing to <code className="font-mono">public.media_assets</code> and strict admin-only write policies.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {library?.projectId && (
                    <a
                      href={`https://supabase.com/dashboard/project/${library.projectId}/sql/new`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                    >
                      <span>Open SQL Editor</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      copyText(SUPABASE_SETUP_SQL, 'sql-setup', 'Setup SQL');
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
                  </button>
                </div>
              </div>
              <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto leading-relaxed">
                {SUPABASE_SETUP_SQL}
              </pre>
            </div>
          )}

          {/* 3-Column KPI Strip (Images · Videos · Folders — clean mockup structure) */}
          <div className="grid grid-cols-3 gap-6 py-2 border-y border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => setMediaTypeFilter(mediaTypeFilter === 'image' ? 'all' : 'image')}
              className={`text-left py-2 px-3 -mx-3 rounded-xl transition-colors ${
                mediaTypeFilter === 'image'
                  ? 'bg-blue-50/70 dark:bg-blue-950/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <ImageIcon className="w-5 h-5 text-slate-800 dark:text-slate-200 mb-2.5" strokeWidth={1.75} />
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                {summary.totalImages.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Images</div>
            </button>

            <button
              type="button"
              onClick={() => setMediaTypeFilter(mediaTypeFilter === 'video' ? 'all' : 'video')}
              className={`text-left py-2 px-3 -mx-3 rounded-xl transition-colors ${
                mediaTypeFilter === 'video'
                  ? 'bg-blue-50/70 dark:bg-blue-950/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Video className="w-5 h-5 text-slate-800 dark:text-slate-200 mb-2.5" strokeWidth={1.75} />
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                {summary.totalVideos.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Videos</div>
            </button>

            <button
              type="button"
              onClick={() => setMediaTypeFilter('all')}
              className="text-left py-2 px-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <Folder className="w-5 h-5 text-slate-800 dark:text-slate-200 mb-2.5" strokeWidth={1.75} />
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                {summary.totalFolders.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Folders</div>
            </button>
          </div>

          {/* Storage Usage Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium tabular-nums">
                {formatStorageBytes(summary.totalBytes)} of {formatStorageBytes(summary.quotaBytes)} used
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                {summary.totalFiles} total files
                {summary.totalDocuments > 0 ? ` (${summary.totalDocuments} docs)` : ''}
              </span>
            </div>
            <div className="w-full sm:w-52 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${Math.max(summary.totalBytes > 0 ? 2 : 0, usagePercent)}%` }}
              />
            </div>
          </div>

          {/* Quick Bucket Switcher Tabs + New Bucket Action */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => handleSelectBucket('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                  selectedBucket === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-slate-100/80 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <span>All Buckets</span>
                <span className="opacity-75 tabular-nums">{summary.totalFiles}</span>
              </button>

              {displayBuckets.map((b) => {
                const isActive = selectedBucket === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBucket(b.id)}
                    title={`${b.description} (Max ${b.maxSizeLabel})`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                        : 'bg-slate-100/80 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{b.id}</span>
                    {!b.public && <Lock className="w-3 h-3 opacity-65" />}
                    <span className="opacity-70 tabular-nums">{b.fileCount}</span>
                  </button>
                );
              })}
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openCreateBucketModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors whitespace-nowrap shrink-0 mb-1"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>New bucket</span>
            </motion.button>
          </div>

          {/* Media Library Header + Filter Chips + Sort + View Toggle */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Media Library
                </h2>
                {activeBucketConfig && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    · {activeBucketConfig.label} (max {activeBucketConfig.maxSizeLabel})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Media type selector styled cleanly like mockup */}
                <div className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
                  {(
                    [
                      { id: 'all', label: 'All files' },
                      { id: 'image', label: 'Images' },
                      { id: 'video', label: 'Videos' },
                      { id: 'document', label: 'Docs' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setMediaTypeFilter(tab.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors ${
                        mediaTypeFilter === tab.id
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* New Folder */}
                <button
                  type="button"
                  onClick={() => {
                    if (selectedBucket !== 'all') setNewFolderBucket(selectedBucket);
                    setCreateFolderOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>New Folder</span>
                </button>

                {/* Grid / List View Switcher */}
                <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                    title="Grid view"
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                    title="List view"
                    aria-label="List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Bar + Filter Toggle (matching mockup's clean search strip) */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search media by filename, folder, or bucket..."
                  className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowFiltersPanel((v) => !v)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  showFiltersPanel || mimeFilter !== 'all' || sortBy !== 'date-desc'
                    ? 'border-blue-300 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title="Filter & Sort options"
                aria-label="Toggle filter and sort options"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Expandable Advanced Filter & Sort Row */}
            {showFiltersPanel && (
              <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <label className="font-medium text-slate-600 dark:text-slate-300">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="date-desc">Upload Date (Newest)</option>
                    <option value="date-asc">Upload Date (Oldest)</option>
                    <option value="name-asc">File Name (A–Z)</option>
                    <option value="name-desc">File Name (Z–A)</option>
                    <option value="size-desc">File Size (Largest)</option>
                    <option value="size-asc">File Size (Smallest)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-medium text-slate-600 dark:text-slate-300">MIME format:</label>
                  <select
                    value={mimeFilter}
                    onChange={(e) => setMimeFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="all">All formats</option>
                    {availableMimes.map((mime) => (
                      <option key={mime} value={mime}>
                        {mime}
                      </option>
                    ))}
                  </select>
                </div>

                {(mimeFilter !== 'all' || sortBy !== 'date-desc' || mediaTypeFilter !== 'all' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setMimeFilter('all');
                      setSortBy('date-desc');
                      setMediaTypeFilter('all');
                      setSearchQuery('');
                    }}
                    className="ml-auto text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Active Upload Queue Progress Panel with 4-Dot Diamond Loader, Thumbnails & Animated Progress */}
          <AnimatePresence initial={false}>
            {uploadQueue.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={ADMIN_TRANSITION_SMOOTH}
                className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {uploadQueue.some(
                      (q) => q.stage === 'queued' || q.stage === 'hashing' || q.stage === 'uploading' || q.stage === 'verifying'
                    ) ? (
                      <DiamondDotsSpinner size="xs" tone="amber" label="Uploading media files" />
                    ) : (
                      <AnimatedCheckmark size={18} />
                    )}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      Upload Activity ({uploadQueue.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setUploadQueue((prev) =>
                        prev.filter((q) => q.stage === 'uploading' || q.stage === 'hashing' || q.stage === 'verifying')
                      )
                    }
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    Clear completed
                  </button>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-0.5">
                  <AnimatePresence initial={false} mode="popLayout">
                    {uploadQueue.map((item) => {
                      const isUploadingStage =
                        item.stage === 'queued' ||
                        item.stage === 'hashing' ||
                        item.stage === 'uploading' ||
                        item.stage === 'verifying';
                      const barState =
                        item.stage === 'error'
                          ? 'error'
                          : item.stage === 'done' || item.stage === 'reused'
                          ? 'success'
                          : item.stage === 'verifying'
                          ? 'verifying'
                          : 'active';

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 18, scale: 0.97 }}
                          transition={{ duration: 0.2, ease: ADMIN_EASE }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs text-xs"
                        >
                          {/* Live File Thumbnail Preview */}
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 shrink-0 flex items-center justify-center">
                            {item.previewUrl && item.file.type.startsWith('image/') ? (
                              <img
                                src={item.previewUrl}
                                alt={item.file.name}
                                className={`w-full h-full object-cover transition-opacity duration-200 ${
                                  isUploadingStage ? 'opacity-75' : 'opacity-100'
                                }`}
                              />
                            ) : item.previewUrl && item.file.type.startsWith('video/') ? (
                              <video
                                src={item.previewUrl}
                                muted
                                playsInline
                                className="w-full h-full object-cover opacity-80"
                              />
                            ) : (
                              <FileText className="w-5 h-5 text-slate-400" />
                            )}
                            {isUploadingStage && (
                              <div className="absolute inset-0 bg-white/55 dark:bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center">
                                <DiamondDotsSpinner size="xs" tone="amber" label={`Uploading ${item.file.name}`} />
                              </div>
                            )}
                          </div>

                          {/* Filename, Metadata & Real-Time Animated Progress Bar */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                                  {item.file.name}
                                </p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate tabular-nums">
                                  {formatStorageBytes(item.file.size)} · {item.bucket}/{item.folder}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <AnimatePresence mode="wait">
                                  {item.stage === 'done' || item.stage === 'reused' ? (
                                    <motion.span
                                      key="done"
                                      initial={{ opacity: 0, scale: 0.85 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
                                    >
                                      <AnimatedCheckmark size={18} />
                                      <span>{item.stage === 'reused' ? 'Reused' : 'Verified'}</span>
                                    </motion.span>
                                  ) : item.stage === 'error' ? (
                                    <motion.span
                                      key="error"
                                      initial={{ opacity: 0, scale: 0.85 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400"
                                    >
                                      <AnimatedErrorIcon size={18} />
                                      <span>Failed</span>
                                    </motion.span>
                                  ) : (
                                    <motion.span
                                      key="progress"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 tabular-nums"
                                    >
                                      <span className="text-slate-400 font-medium">
                                        {item.stage === 'hashing'
                                          ? 'Preparing'
                                          : item.stage === 'verifying'
                                          ? 'Verifying'
                                          : 'Uploading'}
                                      </span>
                                      <span className="font-mono text-blue-600 dark:text-sky-400">
                                        {item.progress}%
                                      </span>
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            <AnimatedProgressBar
                              progress={item.progress}
                              state={barState}
                              heightClass="h-1.5"
                              className="mt-2"
                            />

                            {item.error && (
                              <motion.p
                                initial={{ opacity: 0, y: -3 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400"
                              >
                                {item.error}
                              </motion.p>
                            )}
                          </div>

                          {/* Row Actions */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.stage === 'error' && (
                              <button
                                type="button"
                                onClick={() => handleRetryQueueItem(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold text-[11px] hover:opacity-90"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Retry</span>
                              </button>
                            )}
                            {(item.stage === 'done' || item.stage === 'reused') && item.asset && (
                              <button
                                type="button"
                                onClick={() => setInspectedFile(item.asset!)}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-[11px]"
                              >
                                View
                              </button>
                            )}
                            {(item.stage === 'done' || item.stage === 'reused' || item.stage === 'error') && (
                              <button
                                type="button"
                                onClick={() => setUploadQueue((prev) => prev.filter((q) => q.id !== item.id))}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                title="Dismiss"
                                aria-label="Dismiss upload activity item"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Folder Breadcrumbs & Folders Row */}
          {(currentFolder || scopedFolders.length > 0) && (
            <div className="space-y-2.5">
              {currentFolder && selectedBucket !== 'all' && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setCurrentFolder('')}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedBucket}
                  </button>
                  {currentFolder.split('/').map((part, idx, arr) => {
                    const partial = arr.slice(0, idx + 1).join('/');
                    const isLast = idx === arr.length - 1;
                    return (
                      <React.Fragment key={partial}>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        {isLast ? (
                          <span className="font-semibold text-slate-900 dark:text-white">{part}</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setCurrentFolder(partial)}
                            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {part}
                          </button>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {scopedFolders.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {scopedFolders.map((fld) => (
                    <div
                      key={`${fld.bucket}:${fld.path}`}
                      className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBucket(fld.bucket as SupabaseBucketId);
                          setCurrentFolder(fld.path);
                        }}
                        className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                      >
                        <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {fld.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate tabular-nums">
                            {fld.fileCount} file{fld.fileCount === 1 ? '' : 's'}
                            {selectedBucket === 'all' ? ` · ${fld.bucket}` : ''}
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setRenameFolderTarget(fld);
                            setRenameFolderValue(fld.path);
                          }}
                          className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
                          title="Rename folder"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteFolderConfirm(fld)}
                          className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800"
                          title="Delete folder"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Media Library Content: Loading / Empty / Grid / List */}
          {loading && !library ? (
            <MediaGridSkeleton count={6} />
          ) : filteredFiles.length === 0 ? (
            <div className="py-14 px-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/30 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {searchQuery || mediaTypeFilter !== 'all' || mimeFilter !== 'all' || currentFolder
                  ? 'No media matches your current filter'
                  : 'Your Supabase Media Library is ready'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                {searchQuery || mediaTypeFilter !== 'all' || mimeFilter !== 'all' || currentFolder
                  ? summary.totalFiles > 0
                    ? `You have ${summary.totalFiles} file${summary.totalFiles === 1 ? '' : 's'} stored in Supabase Storage under other filters or folders.`
                    : 'Try clearing your search or filter to view all files.'
                  : 'Drag and drop images, videos, or PDF documents anywhere on this card, or click Upload Media below to permanently store them in Supabase Storage.'}
              </p>
              {(searchQuery || mediaTypeFilter !== 'all' || mimeFilter !== 'all' || currentFolder) && (
                <button
                  type="button"
                  onClick={() => {
                    setMediaTypeFilter('all');
                    setMimeFilter('all');
                    setSearchQuery('');
                    setCurrentFolder('');
                    setSelectedBucket('all');
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  <span>Show All Files ({summary.totalFiles})</span>
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredFiles.map((file) => {
                  const dlPct = downloadingMap[file.id];
                  const isDownloading = dlPct !== undefined;

                  return (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={ADMIN_TRANSITION_FAST}
                      className="group flex flex-col"
                    >
                      {/* Rounded Visual Card matching mockup */}
                      <div
                        onClick={() => setInspectedFile(file)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setInspectedFile(file);
                          }
                        }}
                        className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-800 cursor-pointer transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5"
                      >
                        {file.mediaType === 'image' ? (
                          <img
                            src={file.publicUrl}
                            alt={file.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        ) : file.mediaType === 'video' ? (
                          <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                            <video
                              src={file.publicUrl}
                              className="w-full h-full object-cover opacity-85"
                              muted
                              playsInline
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="w-11 h-11 rounded-full bg-black/65 backdrop-blur-xs text-white flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-400">
                            <FileText className="w-10 h-10 mb-2 text-slate-400" strokeWidth={1.5} />
                            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                              {file.mimeType.split('/')[1] || 'DOC'}
                            </span>
                          </div>
                        )}

                        {/* Live Download Progress Overlay on Card */}
                        <AnimatePresence>
                          {isDownloading && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={(e) => e.stopPropagation()}
                              className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-white z-10"
                            >
                              {dlPct >= 100 ? (
                                <AnimatedCheckmark size={30} className="bg-emerald-500/25 text-emerald-300" />
                              ) : (
                                <DiamondDotsSpinner size="md" tone="amber" label={`Downloading ${file.name}`} />
                              )}
                              <span className="text-xs font-semibold mt-2.5 tabular-nums">
                                {dlPct >= 100 ? 'Download Complete' : `Downloading · ${dlPct}%`}
                              </span>
                              <AnimatedProgressBar
                                progress={dlPct}
                                state={dlPct >= 100 ? 'success' : 'active'}
                                heightClass="h-1.5"
                                className="mt-2 max-w-[160px] bg-white/20"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Hover Quick Action Overlay */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
                        >
                          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-xs text-white p-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => copyText(file.publicUrl, `url-${file.id}`, 'Public URL')}
                              className="p-1.5 rounded-md hover:bg-white/15 transition-colors"
                              title="Copy public URL"
                            >
                              {copiedKey === `url-${file.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              disabled={isDownloading}
                              onClick={() => handleDownload(file)}
                              className="p-1.5 rounded-md hover:bg-white/15 transition-colors disabled:opacity-60"
                              title={isDownloading ? `Downloading (${dlPct}%)` : 'Download file'}
                            >
                              {isDownloading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-300" />
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerReplaceFile(file)}
                              className="p-1.5 rounded-md hover:bg-white/15 transition-colors"
                              title="Replace file"
                            >
                              <Replace className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => openDeleteFileConfirm(file)}
                            className="p-2 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white backdrop-blur-xs transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Clean Filename & Metadata Below Thumbnail (mockup style) */}
                      <div className="mt-2.5 px-0.5 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => setInspectedFile(file)}
                            className="text-sm font-medium text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block max-w-full text-left"
                            title={file.name}
                          >
                            {file.name}
                          </button>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate tabular-nums">
                            {formatStorageBytes(file.size)} · {file.bucket} · {formatDateShort(file.updatedAt || file.createdAt)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* High-Density List View */
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 px-4">File</th>
                    <th className="py-2.5 px-3">Bucket & Path</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-right">Size</th>
                    <th className="py-2.5 px-3">Uploaded</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-4">
                        <button
                          type="button"
                          onClick={() => setInspectedFile(file)}
                          className="flex items-center gap-3 text-left min-w-0 group"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                            {file.mediaType === 'image' ? (
                              <img src={file.publicUrl} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : file.mediaType === 'video' ? (
                              <Video className="w-4 h-4 text-slate-500" />
                            ) : (
                              <FileText className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <span className="font-medium text-slate-800 dark:text-slate-100 group-hover:text-blue-600 truncate max-w-[220px]">
                            {file.name}
                          </span>
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 max-w-[220px] truncate">
                        {file.bucket}/{file.path}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {file.mimeType}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {formatStorageBytes(file.size)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDateShort(file.updatedAt || file.createdAt)}
                      </td>
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => copyText(file.publicUrl, `row-url-${file.id}`, 'Public URL')}
                            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Copy public URL"
                          >
                            {copiedKey === `row-url-${file.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            disabled={downloadingMap[file.id] !== undefined}
                            onClick={() => handleDownload(file)}
                            className="inline-flex items-center gap-1 p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-65"
                            title={
                              downloadingMap[file.id] !== undefined
                                ? `Downloading (${downloadingMap[file.id]}%)`
                                : 'Download'
                            }
                          >
                            {downloadingMap[file.id] !== undefined ? (
                              <>
                                <DiamondDotsSpinner size="xs" tone="amber" label="Downloading" />
                                <span className="text-[10px] font-mono tabular-nums text-blue-600 dark:text-sky-400">
                                  {downloadingMap[file.id]}%
                                </span>
                              </>
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerReplaceFile(file)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Replace file"
                          >
                            <Replace className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteFileConfirm(file)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Full-Width Anchored Dark "Upload Media" CTA Button (exact mockup anchor) */}
          <button
            type="button"
            onClick={() => multiUploadInputRef.current?.click()}
            disabled={!isConnected && Boolean(library)}
            className="w-full py-3.5 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            <span>
              Upload Media
              {selectedBucket !== 'all'
                ? ` to ${selectedBucket}${currentFolder ? `/${currentFolder}` : ''}`
                : ''}
            </span>
          </button>
        </div>
      </section>

      {/* Media Inspector Modal (Image Preview, Video Player, Linked Usage, Copy, Download, Replace, Delete) */}
      <AnimatePresence>
        {inspectedFile && (
          <motion.div
            key="inspector-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
            onClick={() => setInspectedFile(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.2, ease: ADMIN_EASE }}
              className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media Preview Pane */}
              <div className="lg:w-3/5 bg-slate-950 flex items-center justify-center p-4 min-h-[280px] max-h-[55vh] lg:max-h-[90vh]">
                {inspectedFile.mediaType === 'image' ? (
                  <motion.img
                    key={inspectedFile.publicUrl}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22, ease: ADMIN_EASE }}
                    src={inspectedFile.publicUrl}
                    alt={inspectedFile.name}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg"
                  />
                ) : inspectedFile.mediaType === 'video' ? (
                  <video
                    key={inspectedFile.publicUrl}
                    src={inspectedFile.publicUrl}
                    controls
                    playsInline
                    className="max-w-full max-h-[75vh] rounded-lg bg-black"
                  />
                ) : (
                  <div className="text-center text-slate-300 space-y-3 p-8">
                    <FileText className="w-14 h-14 mx-auto text-slate-400" strokeWidth={1.5} />
                    <p className="text-sm font-semibold">{inspectedFile.name}</p>
                    <a
                      href={inspectedFile.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-slate-950 text-xs font-semibold"
                    >
                      <span>Open Document</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Details & Actions Pane */}
              <div className="lg:w-2/5 flex flex-col max-h-[90vh] overflow-y-auto p-5 space-y-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white break-all">
                      {inspectedFile.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                      {formatStorageBytes(inspectedFile.size)} · {inspectedFile.mimeType}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectedFile(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Metadata Fields */}
                <div className="space-y-2.5 text-xs border-y border-slate-100 dark:border-slate-800 py-4">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Bucket</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{inspectedFile.bucket}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Storage Path</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 text-right break-all">
                      {inspectedFile.path}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Uploaded</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {formatDateShort(inspectedFile.createdAt || inspectedFile.updatedAt)}
                    </span>
                  </div>
                  {inspectedFile.uploadedBy && (
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Uploaded By</span>
                      <span className="text-slate-800 dark:text-slate-200">{inspectedFile.uploadedBy}</span>
                    </div>
                  )}
                </div>

                {/* Copy URL & Path */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => copyText(inspectedFile.publicUrl, 'insp-url', 'Public URL')}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Copy Public URL</span>
                    </span>
                    {copiedKey === 'insp-url' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(`${inspectedFile.bucket}/${inspectedFile.path}`, 'insp-path', 'Storage path')}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Copy Storage Path</span>
                    </span>
                    {copiedKey === 'insp-path' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </button>
                </div>

                {/* Linked Website Usage */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Linked Website Records
                  </p>
                  {loadingInspectedRefs ? (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <DiamondDotsSpinner size="xs" tone="amber" label="Scanning records" />
                      <span>Scanning linked records...</span>
                    </div>
                  ) : inspectedRefs.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Not currently linked to any active activity, banner, blog, or favicon.
                    </p>
                  ) : (
                    <ul className="space-y-1.5 max-h-32 overflow-y-auto">
                      {inspectedRefs.map((ref, idx) => (
                        <li
                          key={`${ref.type}-${ref.id}-${idx}`}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 text-xs"
                        >
                          <span className="font-semibold text-amber-900 dark:text-amber-200">{ref.title}</span>
                          <span className="text-amber-700 dark:text-amber-400"> · {ref.field}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Primary File Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 mt-auto">
                  <button
                    type="button"
                    disabled={downloadingMap[inspectedFile.id] !== undefined}
                    onClick={() => handleDownload(inspectedFile)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-70"
                  >
                    {downloadingMap[inspectedFile.id] !== undefined ? (
                      <>
                        <DiamondDotsSpinner size="xs" tone="amber" label="Downloading file" />
                        <span className="tabular-nums">
                          {downloadingMap[inspectedFile.id] >= 100
                            ? 'Saved'
                            : `${downloadingMap[inspectedFile.id]}%`}
                        </span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerReplaceFile(inspectedFile)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200"
                  >
                    <Replace className="w-3.5 h-3.5" />
                    <span>Replace File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteFileConfirm(inspectedFile)}
                    className="col-span-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duplicate Detection Modal (Reuse / Replace / Keep Both) */}
      <AnimatePresence>
        {duplicatePrompt && (
          <motion.div
            key="duplicate-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.2, ease: ADMIN_EASE }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Duplicate Media Detected</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {duplicatePrompt.matchType === 'hash'
                      ? `An identical file already exists in "${duplicatePrompt.existing.bucket}".`
                      : `A file with a matching name already exists in "${duplicatePrompt.existing.bucket}".`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                  {duplicatePrompt.existing.mediaType === 'image' ? (
                    <img
                      src={duplicatePrompt.existing.publicUrl}
                      alt={duplicatePrompt.existing.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Video className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="min-w-0 text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {duplicatePrompt.existing.name}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                    {formatStorageBytes(duplicatePrompt.existing.size)} · {duplicatePrompt.existing.bucket}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => duplicatePrompt.resolve('reuse')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200"
                >
                  Reuse Existing File (Copy URL)
                </button>
                <button
                  type="button"
                  onClick={() => duplicatePrompt.resolve('replace')}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Replace Existing & Auto-Update Linked Records
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => duplicatePrompt.resolve('keep-both')}
                    className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Keep Both
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicatePrompt.resolve('cancel')}
                    className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal with Linked Website Reference Warning */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            key="delete-confirm-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4"
            onClick={() => !deleteConfirm.deleting && setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.2, ease: ADMIN_EASE }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {deleteConfirm.kind === 'folder' ? 'Delete Folder?' : 'Delete Media File?'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-all">
                    {deleteConfirm.kind === 'folder'
                      ? `Permanently delete folder "${deleteConfirm.folder?.path}" and all files inside it from "${deleteConfirm.folder?.bucket}".`
                      : `Permanently delete "${deleteConfirm.file?.name}" from Supabase Storage.`}
                  </p>
                </div>
              </div>

              {deleteConfirm.loadingRefs ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                  <DiamondDotsSpinner size="xs" tone="amber" label="Checking references" />
                  <span>Checking if this media is used on the website...</span>
                </div>
              ) : deleteConfirm.references.length > 0 ? (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Warning: Linked to {deleteConfirm.references.length} website record
                    {deleteConfirm.references.length === 1 ? '' : 's'}
                  </p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    Deleting this media may leave missing images/videos unless you replace it first:
                  </p>
                  <ul className="space-y-1 max-h-32 overflow-y-auto text-[11px] text-amber-900 dark:text-amber-200">
                    {deleteConfirm.references.map((r, i) => (
                      <li key={`${r.id}-${i}`}>
                        • <span className="font-semibold">{r.title}</span> ({r.field})
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 px-3 py-2 rounded-lg">
                  Safe to delete — no active activities, banners, blogs, or favicons reference this file.
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={deleteConfirm.deleting}
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirm.deleting || deleteConfirm.loadingRefs}
                  onClick={() => executeConfirmedDelete()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
                >
                  {deleteConfirm.deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{deleteConfirm.references.length > 0 ? 'Delete Anyway' : 'Delete Permanently'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Folder Modal */}
      <AnimatePresence>
        {createFolderOpen && (
          <motion.div
            key="create-folder-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
            onClick={() => setCreateFolderOpen(false)}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.2, ease: ADMIN_EASE }}
              onSubmit={handleCreateFolderSubmit}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Storage Folder</h3>
              {selectedBucket === 'all' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Target Bucket
                  </label>
                  <select
                    value={newFolderBucket}
                    onChange={(e) => setNewFolderBucket(e.target.value as SupabaseBucketId)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    {displayBuckets.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} — {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. summer-campaigns"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                {currentFolder && selectedBucket !== 'all' && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Created inside: <span className="font-mono">{selectedBucket}/{currentFolder}/</span>
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCreateFolderOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingFolder}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 disabled:opacity-50"
                >
                  {savingFolder && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Folder</span>
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Folder Modal */}
      <AnimatePresence>
        {renameFolderTarget && (
          <motion.div
            key="rename-folder-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
            onClick={() => setRenameFolderTarget(null)}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.2, ease: ADMIN_EASE }}
              onSubmit={handleRenameFolderSubmit}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Rename Folder</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Moves all files inside <span className="font-mono">{renameFolderTarget.path}</span> and automatically updates linked website URLs.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  New Folder Path
                </label>
                <input
                  type="text"
                  required
                  value={renameFolderValue}
                  onChange={(e) => setRenameFolderValue(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setRenameFolderTarget(null)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingFolder}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 disabled:opacity-50"
                >
                  {savingFolder && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Rename & Move Files</span>
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered 1-Step Supabase Delete Policy Modal (shown only on static hosting if Supabase blocks DELETE via RLS) */}
      <AnimatePresence>
        {rlsFixModal && (
          <motion.div
            key="rls-fix-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="fixed inset-0 z-[105] flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4"
            onClick={() => !rlsFixModal.retrying && setRlsFixModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.2, ease: ADMIN_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Enable Live Delete in Supabase (1-Time Setup)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      This site is running in <strong>Direct Browser → Supabase</strong> mode (static hosting). Supabase
                      allows uploads to <span className="font-mono font-semibold">{rlsFixModal.bucket}</span>, but blocks
                      deleting until you add the Delete policy once in your Supabase SQL Editor.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={rlsFixModal.retrying}
                  onClick={() => setRlsFixModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white">1. Copy SQL</div>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      Click <strong>Copy Delete SQL</strong> below.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white">2. Run in Supabase</div>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      Paste in Supabase SQL Editor and click <strong>Run</strong>.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white">3. Delete Live</div>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      Come back and click <strong>Retry Delete Now</strong>.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-100 text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
                    {SUPABASE_DELETE_RLS_SQL}
                  </pre>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        copyText(SUPABASE_DELETE_RLS_SQL, 'rls-delete-sql', 'Delete RLS SQL');
                        setRlsFixModal((prev) => (prev ? { ...prev, copied: true } : null));
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90"
                    >
                      {rlsFixModal.copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{rlsFixModal.copied ? 'SQL Copied!' : '1. Copy Delete SQL'}</span>
                    </button>
                    <a
                      href={`https://supabase.com/dashboard/project/${library?.projectId || 'lzjjwsvalvfkgwtzuime'}/sql/new`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <span>2. Open Supabase SQL Editor</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    type="button"
                    disabled={rlsFixModal.retrying}
                    onClick={() => executeConfirmedDelete(rlsFixModal.pendingDelete)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
                  >
                    {rlsFixModal.retrying ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>{rlsFixModal.retrying ? 'Deleting...' : '3. Retry Delete Now'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create New Supabase Storage Bucket Modal */}
      <AnimatePresence>
        {createBucketOpen && (
          <motion.div
            key="create-bucket-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4"
            onClick={() => !creatingBucket && !createBucketRlsHelper?.verifying && setCreateBucketOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.2, ease: ADMIN_EASE }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full ${
                createBucketRlsHelper ? 'max-w-2xl' : 'max-w-md'
              } bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden`}
            >
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Database className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {createBucketRlsHelper ? `Create Bucket "${createBucketRlsHelper.bucketId}" in Supabase` : 'Create Storage Bucket'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {createBucketRlsHelper
                        ? 'Run this 1-click SQL snippet once in Supabase SQL Editor, then verify'
                        : 'Add a new Supabase Storage bucket to organize and host Tiqsey media'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={creatingBucket || Boolean(createBucketRlsHelper?.verifying)}
                  onClick={() => setCreateBucketOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close create bucket modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {createBucketRlsHelper ? (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white">1. Copy SQL</div>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Copies bucket + storage policies for <span className="font-mono">{createBucketRlsHelper.bucketId}</span>.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white">2. Run in Supabase</div>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Paste into Supabase SQL Editor and click <strong>Run</strong>.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white">3. Verify & Add</div>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Return here and click <strong>Verify & Add Bucket</strong>.
                      </p>
                    </div>
                  </div>

                  <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-100 text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
                    {createBucketRlsHelper.sql}
                  </pre>

                  {createBucketError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{createBucketError}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          copyText(createBucketRlsHelper.sql, 'create-bucket-sql', 'Bucket SQL');
                          setCreateBucketRlsHelper((prev) => (prev ? { ...prev, copied: true } : null));
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90"
                      >
                        {createBucketRlsHelper.copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{createBucketRlsHelper.copied ? 'SQL Copied!' : '1. Copy Bucket SQL'}</span>
                      </button>
                      <a
                        href={`https://supabase.com/dashboard/project/${library?.projectId || 'lzjjwsvalvfkgwtzuime'}/sql/new`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <span>2. Open SQL Editor</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={createBucketRlsHelper.verifying}
                        onClick={() => {
                          setCreateBucketRlsHelper(null);
                          setCreateBucketError(null);
                        }}
                        className="px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        disabled={createBucketRlsHelper.verifying}
                        onClick={handleVerifyBucketAfterSql}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                      >
                        {createBucketRlsHelper.verifying ? (
                          <DiamondDotsSpinner size="xs" tone="white" label="Verifying bucket" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        <span>{createBucketRlsHelper.verifying ? 'Verifying...' : '3. Verify & Add Bucket'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateBucketSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                      Bucket name
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={newBucketName}
                      onChange={(e) => {
                        setNewBucketName(e.target.value);
                        if (createBucketError) setCreateBucketError(null);
                      }}
                      placeholder="e.g. tour-videos or hotel-galleries"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    />
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Lowercase letters, numbers, and hyphens (2–63 chars)</span>
                      {newBucketName.trim() && (
                        <span
                          className={`font-mono font-semibold ${
                            isValidBucketName(normalizedPreviewBucketId)
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-500'
                          }`}
                        >
                          {normalizedPreviewBucketId || 'invalid'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Public / Private Bucket Toggle */}
                  <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-start gap-2.5">
                      {newBucketPublic ? (
                        <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Public bucket</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {newBucketPublic
                            ? 'Anyone can view uploaded files via direct public URLs (recommended for website media).'
                            : 'Files require signed URLs or authenticated access to view.'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={newBucketPublic}
                      onClick={() => setNewBucketPublic((v) => !v)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        newBucketPublic ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                          newBucketPublic ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* File Size Limit & Allowed File Types */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                        Max file size
                      </label>
                      <select
                        value={newBucketLimitMb}
                        onChange={(e) => setNewBucketLimitMb(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      >
                        <option value={5}>5 MB</option>
                        <option value={10}>10 MB</option>
                        <option value={25}>25 MB</option>
                        <option value={50}>50 MB (Default)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                        Allowed file types
                      </label>
                      <select
                        value={newBucketMimePreset}
                        onChange={(e) => setNewBucketMimePreset(e.target.value as 'all' | 'images' | 'videos' | 'docs')}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      >
                        <option value="all">All Media (Images, Videos, PDF)</option>
                        <option value="images">Images Only</option>
                        <option value="videos">Videos Only</option>
                        <option value="docs">Documents (PDF)</option>
                      </select>
                    </div>
                  </div>

                  {createBucketError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{createBucketError}</span>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      disabled={creatingBucket}
                      onClick={() => setCreateBucketOpen(false)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingBucket || !isValidBucketName(normalizedPreviewBucketId)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {creatingBucket ? (
                        <>
                          <DiamondDotsSpinner size="xs" tone="white" label="Creating bucket" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create bucket</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
