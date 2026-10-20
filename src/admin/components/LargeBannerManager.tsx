import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  CheckCircle2, 
  Image as ImageIcon, 
  ExternalLink, 
  Sliders, 
  Clock, 
  Check, 
  X, 
  ChevronRight,
  Monitor,
  Tablet,
  Smartphone,
  Upload,
  Globe,
  MapPin,
  Tag
} from 'lucide-react';
import { LargeHeroBannerConfig, LargeHeroBannerSlide } from '../../types';
import { 
  getStoredLargeHeroBannerConfig, 
  saveStoredLargeHeroBannerConfig,
  addLargeBannerSlide,
  updateLargeBannerSlide,
  deleteLargeBannerSlide,
  toggleLargeBannerSlide,
  reorderLargeBannerSlides,
  resetLargeHeroBannerConfig,
  LARGE_BANNER_UPDATE_EVENT 
} from '../../utils/bannerStorage';
import LargeFeaturedBanner from '../../components/LargeFeaturedBanner';
import { POPULAR_ATTRACTIONS } from '../../data/mockData';

// Scenic travel preset images
const PRESET_BANNER_IMAGES = [
  {
    name: 'South Korea (Reference Artwork)',
    url: '/assets/aistudio/image_ea5bb7e3.png',
    tag: 'Official Reference'
  },
  {
    name: 'Tokyo, Japan (Mt. Fuji & Sakura)',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=85',
    tag: 'Trending Japan'
  },
  {
    name: 'Dubai (Desert Safari & Skyline)',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=85',
    tag: 'Middle East'
  },
  {
    name: 'Bali (Sunset Temple & Coasts)',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=85',
    tag: 'Tropical'
  },
  {
    name: 'Paris (Louvre & City of Lights)',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=85',
    tag: 'Europe'
  },
  {
    name: 'Swiss Alps (Mountains & Lakes)',
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1920&q=85',
    tag: 'Nature'
  },
  {
    name: 'Singapore (Marina Bay Night)',
    url: 'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?auto=format&fit=crop&w=1920&q=85',
    tag: 'Southeast Asia'
  }
];

export default function LargeBannerManager() {
  const [config, setConfig] = useState<LargeHeroBannerConfig>(getStoredLargeHeroBannerConfig());
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editingSlide, setEditingSlide] = useState<LargeHeroBannerSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for slide edit/add
  const [formData, setFormData] = useState<Partial<LargeHeroBannerSlide>>({
    title: '',
    subtitle: '',
    badgeText: '',
    partnerLogosText: '',
    imageUrl: '/assets/aistudio/image_ea5bb7e3.png',
    ctaText: 'BOOK NOW',
    destinationUrl: 'Seoul',
    destinationType: 'destination',
    textStyle: 'golden-glow',
    isActive: true,
    highlightOffer: ''
  });

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadData = () => {
    setConfig(getStoredLargeHeroBannerConfig());
  };

  useEffect(() => {
    loadData();
    window.addEventListener(LARGE_BANNER_UPDATE_EVENT, loadData);
    return () => window.removeEventListener(LARGE_BANNER_UPDATE_EVENT, loadData);
  }, []);

  const handleMasterToggle = () => {
    const nextState = !config.isEnabled;
    const updated = { ...config, isEnabled: nextState };
    saveStoredLargeHeroBannerConfig(updated);
    setConfig(updated);
    showToast(nextState ? 'Large banner enabled on homepage' : 'Large banner disabled on homepage');
  };

  const handlePartnerToggle = () => {
    const nextState = !config.showPartnerBadges;
    const updated = { ...config, showPartnerBadges: nextState };
    saveStoredLargeHeroBannerConfig(updated);
    setConfig(updated);
    showToast(nextState ? 'Partner branding enabled' : 'Partner branding hidden');
  };

  const handleIntervalChange = (interval: number) => {
    const updated = { ...config, autoPlayInterval: interval };
    saveStoredLargeHeroBannerConfig(updated);
    setConfig(updated);
    showToast(`Autoplay interval set to ${interval === 0 ? 'Paused' : `${interval / 1000}s`}`);
  };

  const handleOpenAddModal = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      badgeText: 'TRENDING NOW',
      partnerLogosText: 'thrillophilia.com  |  Imagine your Korea  |  KOREA TOURISM ORGANIZATION',
      imageUrl: '/assets/aistudio/image_ea5bb7e3.png',
      ctaText: 'BOOK NOW',
      destinationUrl: 'Seoul',
      destinationType: 'destination',
      textStyle: 'golden-glow',
      isActive: true,
      order: config.slides.length + 1,
      highlightOffer: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (slide: LargeHeroBannerSlide) => {
    setEditingSlide(slide);
    setFormData({ ...slide });
    setIsModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      showToast('Please enter a banner title', 'info');
      return;
    }
    if (!formData.imageUrl?.trim()) {
      showToast('Please select or provide an image URL', 'info');
      return;
    }

    if (editingSlide) {
      updateLargeBannerSlide({
        ...(formData as LargeHeroBannerSlide),
        id: editingSlide.id,
        order: editingSlide.order
      });
      showToast('Slide updated successfully');
    } else {
      addLargeBannerSlide({
        title: formData.title || '',
        subtitle: formData.subtitle || '',
        badgeText: formData.badgeText || '',
        partnerLogosText: formData.partnerLogosText || '',
        imageUrl: formData.imageUrl || '/assets/aistudio/image_ea5bb7e3.png',
        ctaText: formData.ctaText || 'BOOK NOW',
        destinationUrl: formData.destinationUrl || 'Seoul',
        destinationType: (formData.destinationType as any) || 'destination',
        textStyle: (formData.textStyle as any) || 'golden-glow',
        isActive: formData.isActive ?? true,
        order: config.slides.length + 1,
        highlightOffer: formData.highlightOffer || ''
      });
      showToast('New slide added to large homepage banner');
    }

    setIsModalOpen(false);
  };

  const handleDeleteSlide = (id: string) => {
    if (window.confirm('Delete this banner slide?')) {
      deleteLargeBannerSlide(id);
      showToast('Slide deleted');
    }
  };

  const handleToggleActive = (id: string) => {
    const next = toggleLargeBannerSlide(id);
    showToast(next ? 'Slide activated' : 'Slide deactivated');
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= config.slides.length) return;

    const reordered = [...config.slides];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    reorderLargeBannerSlides(reordered.map(s => s.id));
    showToast('Slide order updated');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset the large homepage banner to reference design presets (including South Korea, Japan, Dubai, Bali)?')) {
      resetLargeHeroBannerConfig();
      showToast('Large banner slides reset to reference defaults');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData(prev => ({ ...prev, imageUrl: result }));
        showToast('Image uploaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl text-sm font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Control Banner Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Master Enable/Disable Switch */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMasterToggle}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                config.isEnabled ? 'bg-[#ff6b00]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  config.isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <span className="text-sm font-black text-slate-900 dark:text-white block">
                Show on Homepage
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {config.isEnabled ? 'Active and visible to all users' : 'Hidden from homepage'}
              </span>
            </div>
          </div>

          {/* Autoplay Speed Selector */}
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4 sm:pl-6">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Autoplay:</span>
            <select
              value={config.autoPlayInterval}
              onChange={(e) => handleIntervalChange(Number(e.target.value))}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
            >
              <option value={3000}>3 seconds</option>
              <option value={5000}>5 seconds (Default)</option>
              <option value={7000}>7 seconds</option>
              <option value={10000}>10 seconds</option>
              <option value={0}>Paused (Manual only)</option>
            </select>
          </div>

          {/* Partner Badges Toggle */}
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4 sm:pl-6">
            <input 
              type="checkbox"
              id="partnerBadgeToggle"
              checked={config.showPartnerBadges}
              onChange={handlePartnerToggle}
              className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] border-slate-300 cursor-pointer"
            />
            <label htmlFor="partnerBadgeToggle" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              Partner Logos / Badges
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {showLivePreview ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span>{showLivePreview ? 'Hide Preview' : 'Show Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Reset to Reference Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#ff6b00] hover:bg-[#e05e00] text-white shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Banner Slide</span>
          </button>
        </div>
      </div>

      {/* Live Interactive Preview Box */}
      {showLivePreview && (
        <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black tracking-wider uppercase text-slate-300">
                Live Interactive Banner Preview
              </span>
            </div>

            {/* Viewport switcher */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  previewViewport === 'desktop' ? 'bg-[#ff6b00] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('tablet')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  previewViewport === 'tablet' ? 'bg-[#ff6b00] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  previewViewport === 'mobile' ? 'bg-[#ff6b00] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div 
            className={`mx-auto transition-all duration-300 ${
              previewViewport === 'desktop' ? 'max-w-full' :
              previewViewport === 'tablet' ? 'max-w-[768px]' : 'max-w-[420px]'
            }`}
          >
            <LargeFeaturedBanner previewConfig={config} />
          </div>
        </div>
      )}

      {/* Slide Table / Cards List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Promotional Carousel Slides ({config.slides.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Reorder, edit content, or toggle visibility for each slide in the hero banner.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Slide</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {config.slides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                slide.isActive ? 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40' : 'bg-slate-50/50 dark:bg-slate-900/40 opacity-60'
              }`}
            >
              {/* Left Info with Thumbnail */}
              <div className="flex items-center gap-4">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveSlide(index, 'up')}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === config.slides.length - 1}
                    onClick={() => handleMoveSlide(index, 'down')}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="relative w-28 sm:w-36 aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[9px] font-black text-white">
                    #{index + 1}
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                      {slide.title}
                    </h4>
                    {slide.badgeText && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40">
                        {slide.badgeText}
                      </span>
                    )}
                    {slide.isActive ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        Draft
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-md">
                    {slide.subtitle || 'No subtitle'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-semibold">
                      <Tag className="w-3 h-3 text-[#ff6b00]" />
                      <span>CTA: "{slide.ctaText || 'BOOK NOW'}"</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <MapPin className="w-3 h-3 text-sky-500" />
                      <span>Target: {slide.destinationUrl} ({slide.destinationType})</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {/* Active Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(slide.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    slide.isActive 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' 
                      : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}
                >
                  {slide.isActive ? 'Active' : 'Disabled'}
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(slide)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit Slide"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Delete Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {config.slides.length === 0 && (
            <div className="p-12 text-center">
              <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No slides created yet
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Add your first promotional slide or reset to reference defaults.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  Load Reference Defaults
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#ff6b00] text-white"
                >
                  Add Slide
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {editingSlide ? 'Edit Banner Slide' : 'Add New Banner Slide'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure visual typography, scenic background, and call to action.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSlide} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Banner Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SOUTH KOREA"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">If 2 words (e.g. SOUTH KOREA), displays on 2 stacked lines</p>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. YOUR K-CULTURE TRIP AWAITS"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                  />
                </div>
              </div>

              {/* Partner Logos Text & Promotional Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Partner Badges (Separated by |)
                  </label>
                  <input
                    type="text"
                    placeholder="thrillophilia.com | Imagine your Korea | Korea Tourism"
                    value={formData.partnerLogosText || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, partnerLogosText: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Promo Ribbon Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TRENDING DESTINATION or 20% OFF"
                    value={formData.badgeText || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, badgeText: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                  />
                </div>
              </div>

              {/* Background Image Selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Background Scenic Photo <span className="text-rose-500">*</span>
                </label>

                {/* Preset Thumbnails */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {PRESET_BANNER_IMAGES.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: preset.url }))}
                      className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 text-left group transition-all ${
                        formData.imageUrl === preset.url 
                          ? 'border-[#ff6b00] ring-2 ring-[#ff6b00]/30 shadow-md scale-[1.02]' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[9px] font-bold text-white leading-tight truncate">
                          {preset.name}
                        </span>
                      </div>
                      {formData.imageUrl === preset.url && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#ff6b00] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom URL or Upload */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Custom Image URL or file path"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Call to Action & Typography Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BOOK NOW"
                    value={formData.ctaText || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Typography Glow Theme
                  </label>
                  <select
                    value={formData.textStyle || 'golden-glow'}
                    onChange={(e) => setFormData(prev => ({ ...prev, textStyle: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                  >
                    <option value="golden-glow">✨ Golden Warm Glow (Reference Style)</option>
                    <option value="modern-white">⚪ Modern Crisp White</option>
                    <option value="sunset-amber">🌅 Sunset Vibrant Amber</option>
                    <option value="neon-cyan">💎 Futuristic Neon Cyan</option>
                  </select>
                </div>
              </div>

              {/* Target Link & Destination Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Link Target Type
                  </label>
                  <select
                    value={formData.destinationType || 'destination'}
                    onChange={(e) => setFormData(prev => ({ ...prev, destinationType: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                  >
                    <option value="destination">City / Destination</option>
                    <option value="activity">Specific Activity / Attraction</option>
                    <option value="section">Page Section (e.g. #hot-deals)</option>
                    <option value="custom">Custom URL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Value
                  </label>
                  {formData.destinationType === 'activity' ? (
                    <select
                      value={formData.destinationUrl || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, destinationUrl: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                    >
                      <option value="kor-gyeongbokgung">Gyeongbokgung Palace & Royal Hanbok Experience (Seoul)</option>
                      <option value="kor-nseoultower">N Seoul Tower Observatory (Seoul)</option>
                      {POPULAR_ATTRACTIONS.slice(0, 10).map(att => (
                        <option key={att.id} value={att.id}>
                          {att.name} ({att.city})
                        </option>
                      ))}
                    </select>
                  ) : formData.destinationType === 'destination' ? (
                    <select
                      value={formData.destinationUrl || 'Seoul'}
                      onChange={(e) => setFormData(prev => ({ ...prev, destinationUrl: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                    >
                      <option value="Seoul">Seoul, South Korea</option>
                      <option value="Tokyo">Tokyo, Japan</option>
                      <option value="Dubai">Dubai, UAE</option>
                      <option value="Bali">Bali, Indonesia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Paris">Paris, France</option>
                      <option value="Rome">Rome, Italy</option>
                      <option value="Barcelona">Barcelona, Spain</option>
                      <option value="Amsterdam">Amsterdam, Netherlands</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. #hot-deals or https://..."
                      value={formData.destinationUrl || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, destinationUrl: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
                    />
                  )}
                </div>
              </div>

              {/* Active Toggle in Form */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="slideActiveToggle"
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#ff6b00] focus:ring-[#ff6b00] border-slate-300 cursor-pointer"
                />
                <label htmlFor="slideActiveToggle" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Slide is Active and visible in carousel
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#ff6b00] hover:bg-[#e05e00] text-white shadow-md hover:shadow-lg transition-all"
                >
                  {editingSlide ? 'Update Slide' : 'Save & Publish Slide'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
