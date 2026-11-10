import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  Edit2, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  ExternalLink,
  Calendar,
  CheckCircle2,
  Layers,
  Flame,
  Ticket,
  Compass,
  Landmark,
  Sliders,
  AlertCircle,
  Upload,
  Percent,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdminPagination } from '../components/AdminPagination';
import { PromotionalBanner } from '../../types';
import { 
  getStoredBanners, 
  deleteBanner, 
  toggleBannerStatus, 
  reorderBanners, 
  duplicateBanner, 
  resetToDefaultBanners,
  BANNER_UPDATE_EVENT 
} from '../../utils/bannerStorage';
import BannerCard from '../../components/BannerCard';
import LargeBannerManager from '../components/LargeBannerManager';

export default function PromotionalBanners() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'large-hero' | 'promo-cards'>(
    searchParams.get('tab') === 'cards' ? 'promo-cards' : 'large-hero'
  );
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedBannerIds, setSelectedBannerIds] = useState<string[]>([]);
  const [copiedBannerId, setCopiedBannerId] = useState<string | null>(null);

  const stats = React.useMemo(() => {
    const now = new Date().toISOString().substring(0, 10);
    const total = banners.length;
    const active = banners.filter(b => b.isActive && (!b.startDate || b.startDate <= now) && (!b.endDate || b.endDate >= now)).length;
    const inactive = banners.filter(b => !b.isActive).length;
    const scheduled = banners.filter(b => b.isActive && !!b.startDate && b.startDate > now).length;
    const expired = banners.filter(b => b.isActive && !!b.endDate && b.endDate < now).length;
    return { total, active, inactive, scheduled, expired };
  }, [banners]);

  const handleCopyBannerId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedBannerId(id);
    setTimeout(() => setCopiedBannerId(null), 2000);
  };

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const loadData = () => {
    const list = getStoredBanners();
    setBanners(list);
  };

  useEffect(() => {
    loadData();
    window.addEventListener(BANNER_UPDATE_EVENT, loadData);
    return () => window.removeEventListener(BANNER_UPDATE_EVENT, loadData);
  }, []);

  const handleToggleActive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = toggleBannerStatus(id);
    showToast(nextState ? 'Banner activated' : 'Banner disabled');
  };

  const handleDelete = (id: string) => {
    deleteBanner(id);
    setDeleteConfirmId(null);
    showToast('Banner deleted successfully');
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (banners.length >= 6) {
      showToast('Maximum limit of 6 banners reached.', 'info');
      return;
    }
    const dup = duplicateBanner(id);
    if (dup) {
      showToast('Banner duplicated');
    }
  };

  const handleMove = (globalIndex: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    if (globalIndex === -1) return;

    if (direction === 'up' && globalIndex === 0) return;
    if (direction === 'down' && globalIndex === banners.length - 1) return;

    const newIndex = direction === 'up' ? globalIndex - 1 : globalIndex + 1;
    const reordered = [...banners];
    const [moved] = reordered.splice(globalIndex, 1);
    reordered.splice(newIndex, 0, moved);

    reorderBanners(reordered.map(b => b.id));
    showToast('Banner display order updated');
  };

  // Drag and drop event handlers
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, globalIndex: number) => {
    if (globalIndex === -1) return;
    
    e.dataTransfer.setData('text/plain', globalIndex.toString());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(globalIndex);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnter = (globalIndex: number) => {
    if (globalIndex !== -1 && draggedIndex !== null && draggedIndex !== globalIndex) {
      setDragOverIndex(globalIndex);
    }
  };

  const handleDragLeave = () => {
    // No-op
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetGlobalIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    const sourceGlobalIndex = draggedIndex;
    if (sourceGlobalIndex === null || sourceGlobalIndex === -1 || targetGlobalIndex === -1 || sourceGlobalIndex === targetGlobalIndex) {
      return;
    }

    const reordered = [...banners];
    const [moved] = reordered.splice(sourceGlobalIndex, 1);
    reordered.splice(targetGlobalIndex, 0, moved);

    reorderBanners(reordered.map(b => b.id));
    showToast('Banner display order updated');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all promotional banners to default design templates? Custom changes will be restored to original presets.')) {
      resetToDefaultBanners();
      showToast('Promotional banners reset to defaults');
    }
  };

  // Filter banners
  const filteredBanners = banners.filter(b => {
    const matchesSearch = 
      (b.title && b.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.promoCode && b.promoCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.badgeText && b.badgeText.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.destinationUrl && b.destinationUrl.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTemplate = templateFilter === 'all' || b.template === templateFilter;

    const now = new Date().toISOString().substring(0, 10);
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = b.isActive && (!b.startDate || b.startDate <= now) && (!b.endDate || b.endDate >= now);
    } else if (statusFilter === 'inactive') {
      matchesStatus = !b.isActive;
    } else if (statusFilter === 'scheduled') {
      matchesStatus = b.isActive && !!b.startDate && b.startDate > now;
    } else if (statusFilter === 'expired') {
      matchesStatus = b.isActive && !!b.endDate && b.endDate < now;
    }

    return matchesSearch && matchesTemplate && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage) || 1;
  const paginatedBanners = filteredBanners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isAllSelected = paginatedBanners.length > 0 && paginatedBanners.every(b => selectedBannerIds.includes(b.id));
  const isSomeSelected = selectedBannerIds.length > 0;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBannerIds(paginatedBanners.map(b => b.id));
    } else {
      setSelectedBannerIds([]);
    }
  };

  const handleToggleRowSelection = (id: string) => {
    setSelectedBannerIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkSetStatus = (activate: boolean) => {
    if (selectedBannerIds.length === 0) return;
    selectedBannerIds.forEach(id => {
      const banner = banners.find(b => b.id === id);
      if (banner && banner.isActive !== activate) {
        toggleBannerStatus(id);
      }
    });
    loadData();
    setSelectedBannerIds([]);
    showToast(`${selectedBannerIds.length} banners ${activate ? 'activated' : 'disabled'}`);
  };

  const handleBulkDelete = () => {
    if (selectedBannerIds.length === 0) return;
    if (window.confirm(`Delete ${selectedBannerIds.length} selected promotional banners? This cannot be undone.`)) {
      selectedBannerIds.forEach(id => deleteBanner(id));
      loadData();
      setSelectedBannerIds([]);
      showToast(`${selectedBannerIds.length} banners deleted`);
    }
  };

  const getTemplateBadge = (template: string) => {
    switch (template) {
      case 'readymade-image':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40">
            <Sparkles className="w-3 h-3 text-sky-600" />
            Ready-Made
          </span>
        );
      case 'play-passes':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
            <Flame className="w-3 h-3 text-purple-600" />
            Play Passes
          </span>
        );
      case 'stadium-pass':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40">
            <Ticket className="w-3 h-3 text-teal-600" />
            Stadium
          </span>
        );
      case 'water-parks':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
            <Compass className="w-3 h-3 text-emerald-600" />
            Water Parks
          </span>
        );
      case 'city-guide':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40">
            <Landmark className="w-3 h-3 text-rose-600" />
            City Guide
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Custom
          </span>
        );
    }
  };

  const getCampaignStatusBadge = (banner: PromotionalBanner) => {
    const now = new Date().toISOString().substring(0, 10);
    if (!banner.isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          Disabled
        </span>
      );
    }
    if (banner.startDate && banner.startDate > now) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200/50">
          <Calendar className="w-3 h-3" />
          Scheduled
        </span>
      );
    }
    if (banner.endDate && banner.endDate < now) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200/50">
          <AlertCircle className="w-3 h-3" />
          Expired
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        Active
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Promotional Banners
            </h1>
            <span className="px-3 py-0.5 bg-red-50 dark:bg-red-950/60 text-brand border border-red-200/60 dark:border-red-800/60 rounded-full text-xs font-bold shadow-xs">
              Marketing & Deals
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage large panoramic featured homepage banners, trending activity carousels, and promotional deal cards.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab('large-hero');
            setSearchParams({ tab: 'large-hero' });
          }}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'large-hero'
              ? 'border-brand text-brand'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-brand" />
          <span>Large Homepage Banner (Carousel)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 dark:bg-red-950/60 text-brand">
            Featured
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('promo-cards');
            setSearchParams({ tab: 'cards' });
          }}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'promo-cards'
              ? 'border-[#0284c7] text-[#0284c7]'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-[#0284c7]" />
          <span>Activity Promo Cards (Grid)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 dark:bg-sky-950/60 text-[#0284c7]">
            {banners.length}
          </span>
        </button>
      </div>

      {activeTab === 'large-hero' ? (
        <LargeBannerManager />
      ) : (
        <div className="space-y-6">
          {/* Action Buttons for Promo Cards */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-2xs cursor-pointer"
            >
              {showLivePreview ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
              <span>{showLivePreview ? 'Hide Preview' : 'Show Preview'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (banners.length >= 6) {
                  showToast('Maximum limit of 6 banners reached. Please delete a banner first.', 'info');
                } else {
                  navigate('/promotional-banners/new?type=readymade');
                }
              }}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer ${
                banners.length >= 6 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                  : 'bg-[#0f172a] hover:bg-slate-800 text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Ready-Made</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (banners.length >= 6) {
                  showToast('Maximum limit of 6 banners reached. Please delete a banner first.', 'info');
                } else {
                  navigate('/promotional-banners/new');
                }
              }}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer ${
                banners.length >= 6 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                  : 'bg-[#4f46e5] hover:bg-indigo-700 text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Banner</span>
            </button>
          </div>


      {/* 4 Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Live */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ACTIVE LIVE</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {banners.filter(b => b.isActive).length}
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Campaigns</span>
            </div>
          </div>
        </div>

        {/* Scheduled / Future */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SCHEDULED / FUTURE</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {banners.filter(b => b.isActive && b.startDate && new Date(b.startDate) > new Date()).length}
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Banners</span>
            </div>
          </div>
        </div>

        {/* Ready-Made Artwork */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">READY-MADE ARTWORK</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {banners.filter(b => b.template === 'readymade-image').length}
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Uploads</span>
            </div>
          </div>
        </div>

        {/* Coupons & Codes */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">COUPONS & CODES</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {banners.filter(b => !!b.promoCode).length}
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Promos Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Frontend Section Preview Box (Collapsible) */}
      {showLivePreview && (
        <div className="bg-[#0b1120] rounded-2xl p-5 md:p-6 border border-slate-800/80 shadow-2xl overflow-hidden text-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/60 gap-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-100">
                  Live Homepage Banner Grid Preview
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Showing active banners in real-time display sequence</p>
              </div>
            </div>

            {/* Viewport device switcher tool */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/80 p-0.5">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                title="Desktop View (4 columns)"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  previewViewport === 'desktop' 
                    ? 'bg-white/10 text-white' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('tablet')}
                title="Tablet View (2 columns)"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  previewViewport === 'tablet' 
                    ? 'bg-white/10 text-white' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                title="Mobile View (1 column)"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  previewViewport === 'mobile' 
                    ? 'bg-white/10 text-white' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="transition-all duration-300">
            <div className={`grid gap-4 ${
              previewViewport === 'desktop' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-full' 
                : previewViewport === 'tablet'
                ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 max-w-sm mx-auto'
            }`}>
              {banners.filter(b => b.isActive).length > 0 ? (
                banners.filter(b => b.isActive).map((banner) => (
                  <div key={banner.id} className="relative group/preview">
                    <BannerCard banner={banner} mode="preview" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center gap-1 z-20">
                      <button
                        type="button"
                        onClick={() => navigate(`/promotional-banners/edit/${banner.id}`)}
                        className="p-1.5 bg-slate-950/80 hover:bg-slate-950 text-white rounded-md text-xs font-bold backdrop-blur-md shadow-md border border-white/20"
                        title="Edit banner"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-slate-400 text-sm">
                  No banners are currently marked as active. Enable a banner below to preview it on the homepage.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Table & Management Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs relative">
        {/* Status Tabs Bar */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
            {[
              { id: 'all', label: 'All Banners', count: stats.total },
              { id: 'active', label: 'Active', count: stats.active },
              { id: 'inactive', label: 'Disabled', count: stats.inactive },
              { id: 'scheduled', label: 'Scheduled', count: stats.scheduled },
              { id: 'expired', label: 'Expired', count: stats.expired }
            ].map(tab => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    isActive 
                      ? 'bg-blue-700/80 text-white' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-3 justify-between items-center bg-white dark:bg-slate-900">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search by title, promo code..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-9.5 pr-8 py-2 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-slate-400 text-slate-800 dark:text-slate-200" 
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={templateFilter}
                onChange={(e) => {
                  setTemplateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer pr-2"
              >
                <option value="all">All Templates</option>
                <option value="play-passes">Play Passes</option>
                <option value="stadium-pass">Stadium Pass</option>
                <option value="water-parks">Water Parks</option>
                <option value="city-guide">City Guide</option>
                <option value="readymade-image">Ready-Made Artwork</option>
                <option value="custom">Custom Design</option>
              </select>
            </div>

            {(searchTerm !== "" || templateFilter !== "all" || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setTemplateFilter("all");
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-sky-400 px-2 py-1.5 transition-colors cursor-pointer shrink-0"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* High-Density Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[1000px]">
            <colgroup>
              <col className="w-[4%]" />
              <col className="w-[8%]" />
              <col className="w-[36%]" />
              <col className="w-[14%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                    title="Select all on this page"
                  />
                </th>
                <th className="px-4 py-3 text-center">ORDER</th>
                <th className="px-4 py-3">BANNER & ID</th>
                <th className="px-4 py-3 text-center">TEMPLATE</th>
                <th className="px-4 py-3 text-center">PROMO CODE</th>
                <th className="px-4 py-3 text-center">STATUS</th>
                <th className="px-5 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {paginatedBanners.length > 0 ? (
                paginatedBanners.map((banner, index) => {
                  const globalIndex = banners.findIndex(b => b.id === banner.id);
                  const isFirst = globalIndex === 0;
                  const isLast = globalIndex === banners.length - 1;
                  const isDragged = globalIndex === draggedIndex;
                  const isDragOver = globalIndex === dragOverIndex;
                  const isSelected = selectedBannerIds.includes(banner.id);
                  const isCopied = copiedBannerId === banner.id;

                  return (
                    <tr 
                      key={banner.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, globalIndex)}
                      onDragOver={handleDragOver}
                      onDragEnd={handleDragEnd}
                      onDragEnter={() => handleDragEnter(globalIndex)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, globalIndex)}
                      className={`transition-colors duration-150 ${
                        isSelected 
                          ? 'bg-blue-50/50 dark:bg-blue-950/25' 
                          : isDragged 
                          ? 'opacity-40 bg-slate-50 dark:bg-slate-800/50 cursor-grabbing' 
                          : isDragOver 
                          ? 'bg-blue-50/50 dark:bg-blue-950/20 border-t-2 border-t-blue-500' 
                          : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRowSelection(banner.id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                        />
                      </td>

                      {/* Order Column */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                            #{banner.order}
                          </span>
                          <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-500" />
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={(e) => handleMove(globalIndex, 'up', e)}
                              disabled={isFirst}
                              title="Move Up"
                              className={`p-0.5 rounded ${isFirst ? 'text-slate-200 dark:text-slate-800 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer'}`}
                            >
                              <ArrowUp className="w-2.5 h-2.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleMove(globalIndex, 'down', e)}
                              disabled={isLast}
                              title="Move Down"
                              className={`p-0.5 rounded ${isLast ? 'text-slate-200 dark:text-slate-800 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer'}`}
                            >
                              <ArrowDown className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Banner Preview & Content & ID */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-20 aspect-[16/10] shrink-0 rounded-lg overflow-hidden shadow-2xs border border-slate-200/80 dark:border-slate-800 relative bg-slate-950">
                            <div className="absolute top-0 left-0 w-[240px] origin-top-left transform scale-[0.3333]">
                              <BannerCard banner={banner} mode="preview" />
                            </div>
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[240px]" title={banner.title}>
                                {banner.title || <span className="text-slate-400 font-normal italic">Untitled Banner</span>}
                              </p>
                              <a
                                href="/#/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 transition-colors shrink-0"
                                title="View live promo cards on homepage"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleCopyBannerId(banner.id)}
                                className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                                title="Click to copy Banner ID"
                              >
                                {isCopied ? (
                                  <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Copy className="w-2.5 h-2.5" />
                                )}
                                <span className="truncate max-w-[120px]">{banner.id}</span>
                              </button>
                              {banner.subtitle && (
                                <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                  {banner.subtitle}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Template */}
                      <td className="px-4 py-3 text-center">
                        {getTemplateBadge(banner.template)}
                      </td>

                      {/* Promo Code */}
                      <td className="px-4 py-3 text-center">
                        {banner.promoCode ? (
                          <span className="font-mono text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/40">
                            {banner.promoCode}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs font-medium">—</span>
                        )}
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 select-none">
                          <button
                            type="button"
                            onClick={(e) => handleToggleActive(banner.id, e)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              banner.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            aria-label={`Toggle active for ${banner.title}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                                banner.isActive ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <span className={`text-[10px] font-black uppercase tracking-wider w-14 text-left ${
                            banner.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                          }`}>
                            {banner.isActive ? 'ACTIVE' : 'OFF'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => navigate(`/promotional-banners/edit/${banner.id}`)}
                            title="Edit Banner"
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer group"
                          >
                            <Edit2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDuplicate(banner.id, e)}
                            title="Duplicate Banner"
                            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group"
                          >
                            <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                          </button>

                          {deleteConfirmId === banner.id ? (
                            <div className="flex items-center gap-1 ml-1 bg-red-50 dark:bg-red-950/40 p-0.5 rounded-md border border-red-200 dark:border-red-800">
                              <span className="text-[10px] text-red-600 dark:text-red-400 font-bold px-0.5">Del?</span>
                              <button
                                type="button"
                                onClick={() => handleDelete(banner.id)}
                                className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(banner.id)}
                              title="Delete Banner"
                              className="p-1.5 text-red-500 dark:text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer group"
                            >
                              <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400">
                    <Layers className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2 animate-bounce" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">No promotional banners found</p>
                    <p className="text-xs text-slate-400 mt-1">Try relaxing search terms or selecting another status tab.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Floating Bulk Actions Bar */}
        <AnimatePresence>
          {isSomeSelected && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.18 }}
              className="m-4 p-3 bg-slate-900 dark:bg-slate-950 text-white rounded-xl shadow-xl border border-slate-800 flex items-center justify-between gap-4 flex-wrap"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {selectedBannerIds.length}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  banners selected on this page
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleBulkSetStatus(true)}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" /> Bulk Activate
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSetStatus(false)}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  Bulk Disable
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBannerIds([])}
                  className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Deselect All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer & Pagination */}
        {filteredBanners.length > 0 && (
          <AdminPagination
            currentPage={currentPage}
            totalItems={filteredBanners.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemUnitName="banners"
          />
        )}
      </div>
    </div>
  )}
</div>
);
}

