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
  Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

export default function PromotionalBanners() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const getTemplateBadge = (template: string) => {
    switch (template) {
      case 'readymade-image':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Ready-Made Artwork
          </span>
        );
      case 'play-passes':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
            <Flame className="w-3.5 h-3.5 text-purple-600" />
            Play Passes
          </span>
        );
      case 'stadium-pass':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40">
            <Ticket className="w-3.5 h-3.5 text-teal-600" />
            Stadium Pass
          </span>
        );
      case 'water-parks':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            Water Parks
          </span>
        );
      case 'city-guide':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40">
            <Landmark className="w-3.5 h-3.5 text-rose-600" />
            City Guide
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Promotional Banners
            </h1>
            <span className="px-3 py-0.5 bg-sky-50 dark:bg-sky-950/60 text-[#0284c7] dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60 rounded-full text-xs font-bold shadow-xs">
              {banners.length} total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage homepage banners, discount campaigns, playground cards, and custom promotional visuals.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-2xs cursor-pointer"
          >
            {showLivePreview ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span>{showLivePreview ? 'Hide Preview' : 'Show Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/promotional-banners/new?type=readymade')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0f172a] hover:bg-slate-800 text-white transition-colors shadow-2xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Ready-Made</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/promotional-banners/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#4f46e5] hover:bg-indigo-700 text-white transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Banner</span>
          </button>
        </div>
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
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
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
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9.5 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-400 text-slate-800 dark:text-slate-200" 
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-2xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Template:</span>
              <select 
                value={templateFilter}
                onChange={(e) => {
                  setTemplateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-colors text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
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

            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-colors text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Disabled</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[950px]">
            <thead className="bg-white dark:bg-slate-900 text-slate-400 font-bold text-[11px] tracking-wider uppercase border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-4 w-20">ORDER</th>
                <th className="px-5 py-4">BANNER PREVIEW & CONTENT</th>
                <th className="px-5 py-4 text-center">TEMPLATE</th>
                <th className="px-5 py-4 text-center">PROMO CODE</th>
                <th className="px-5 py-4 text-center">TARGET ACTION</th>
                <th className="px-5 py-4 text-center">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginatedBanners.length > 0 ? (
                paginatedBanners.map((banner, index) => {
                  const globalIndex = banners.findIndex(b => b.id === banner.id);
                  const isFirst = globalIndex === 0;
                  const isLast = globalIndex === banners.length - 1;
                  const isDragged = globalIndex === draggedIndex;
                  const isDragOver = globalIndex === dragOverIndex;

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
                      className={`transition-all duration-200 group border-b border-slate-100 dark:border-slate-800/80 ${
                        isDragged 
                          ? 'opacity-40 bg-slate-50 dark:bg-slate-800/50 cursor-grabbing' 
                          : isDragOver 
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-t-2 border-t-indigo-500' 
                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      {/* Order Column */}
                      <td className="px-5 py-4.5 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 text-xs shadow-2xs shrink-0">
                            {banner.order}
                          </div>
                          <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 cursor-grab group-hover:text-slate-400 dark:group-hover:text-slate-400 active:cursor-grabbing transition-colors" />
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={(e) => handleMove(globalIndex, 'up', e)}
                              disabled={isFirst}
                              title="Move Up"
                              className={`p-0.5 rounded transition-all ${
                                isFirst 
                                  ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' 
                                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer'
                              }`}
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleMove(globalIndex, 'down', e)}
                              disabled={isLast}
                              title="Move Down"
                              className={`p-0.5 rounded transition-all ${
                                isLast 
                                  ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed' 
                                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer'
                              }`}
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                    {/* Banner Preview & Content */}
                    <td className="px-5 py-4.5 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="w-28 aspect-[16/10] shrink-0 rounded-xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-800 relative bg-slate-950">
                          {/* Scaled BannerCard */}
                          <div className="absolute top-0 left-0 w-[280px] origin-top-left transform scale-[0.4]">
                            <BannerCard banner={banner} mode="preview" />
                          </div>
                        </div>
                        <div className="space-y-0.5 min-w-0 max-w-xs">
                          {banner.subtitle && (
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                              {banner.subtitle}
                            </p>
                          )}
                          <p className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                            {banner.title || <span className="text-slate-400 font-normal italic">Untitled Banner</span>}
                          </p>
                          {banner.highlightText && (
                            <p className="text-xs font-bold text-blue-600 dark:text-sky-400 truncate inline-flex items-center gap-1">
                              <span>{banner.highlightText}</span>
                              <ExternalLink className="w-3 h-3 inline" />
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Template Badge */}
                    <td className="px-5 py-4.5 align-middle text-center">
                      {getTemplateBadge(banner.template)}
                    </td>

                    {/* Promo Code */}
                    <td className="px-5 py-4.5 align-middle text-center">
                      {banner.promoCode ? (
                        <div className="inline-block px-3 py-1 rounded-lg bg-[#fef3c7]/60 dark:bg-amber-950/30 border border-[#fde68a] dark:border-amber-900/40 text-[#92400e] dark:text-amber-300 font-mono text-xs font-bold">
                          {banner.promoCode}
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">—</span>
                      )}
                    </td>

                    {/* Target Action */}
                    <td className="px-5 py-4.5 align-middle text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          banner.destinationType === 'destination'
                            ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300'
                            : banner.destinationType === 'activity'
                            ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {banner.destinationType === 'destination' ? 'DESTINATION' : banner.destinationType === 'activity' ? 'ACTIVITY' : 'SECTION'}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]" title={banner.destinationUrl || '#'}>
                          {banner.destinationUrl || 'deals'}
                        </span>
                      </div>
                    </td>

                    {/* Status & Custom Toggle */}
                    <td className="px-5 py-4.5 align-middle text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleToggleActive(banner.id, e)}
                          title={banner.isActive ? 'Click to disable' : 'Click to activate'}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            banner.isActive ? 'bg-[#10b981]' : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        >
                          <div 
                            className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-1 left-1 transform transition-transform duration-200 ease-in-out ${
                              banner.isActive ? 'translate-x-5' : 'translate-x-0'
                            }`} 
                          />
                        </button>
                        <div>{getCampaignStatusBadge(banner)}</div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4.5 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/promotional-banners/edit/${banner.id}`)}
                          title="Edit Banner"
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDuplicate(banner.id, e)}
                          title="Duplicate Banner"
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {deleteConfirmId === banner.id ? (
                          <div className="flex items-center gap-1 ml-1 bg-red-50 dark:bg-red-950/40 p-1 rounded-lg border border-red-200 dark:border-red-800">
                            <span className="text-[11px] text-red-600 dark:text-red-400 font-bold px-1">Delete?</span>
                            <button
                              type="button"
                              onClick={() => handleDelete(banner.id)}
                              className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-bold transition-colors cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(banner.id)}
                            title="Delete Banner"
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <Layers className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">No promotional banners found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or template filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 text-xs">
          <div className="text-slate-400">
            Showing {filteredBanners.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredBanners.length)} of {filteredBanners.length} results
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${
                  currentPage === page
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

