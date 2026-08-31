import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Sparkles, 
  Upload, 
  UploadCloud,
  Eye, 
  Flame, 
  Ticket, 
  Compass, 
  Landmark, 
  Globe, 
  CheckCircle2, 
  Layers, 
  Copy,
  Calendar,
  Link as LinkIcon,
  Tag,
  Palette,
  Image as ImageIcon,
  HelpCircle,
  Smartphone,
  Tablet,
  Monitor,
  Zap,
  Sliders,
  Check,
  AlertCircle,
  FileImage,
  RefreshCw,
  ExternalLink,
  Megaphone,
  Info
} from 'lucide-react';
import { PromotionalBanner, BannerTemplateType } from '../../types';
import { 
  getStoredBanners, 
  addBanner, 
  updateBanner, 
  deleteBanner 
} from '../../utils/bannerStorage';
import BannerCard from '../../components/BannerCard';

const TEMPLATE_PRESETS: {
  id: BannerTemplateType;
  name: string;
  desc: string;
  badge: string;
  color: string;
  defaultBg: string;
  defaultBadgeIcon: 'flame' | 'ticket' | 'compass' | 'landmark' | 'sparkles';
}[] = [
  {
    id: 'readymade-image',
    name: 'Ready-made Image Banner',
    desc: 'Upload a completed banner graphic or promotional flyer (PNG, JPG, WebP) with zero editing required',
    badge: 'READY-MADE',
    color: '#4f46e5',
    defaultBg: '#0d0f14',
    defaultBadgeIcon: 'sparkles'
  },
  {
    id: 'play-passes',
    name: 'Play Passes Deal',
    desc: 'Purple background with floating % tickets, flame deal badge, and copy code button',
    badge: 'PLAY DEAL',
    color: '#7700e6',
    defaultBg: '#7700e6',
    defaultBadgeIcon: 'flame'
  },
  {
    id: 'stadium-pass',
    name: 'Stadium Pass & Tours',
    desc: 'Dark teal background with ribbon stamp, stadium vector arcs, and red tournament badge',
    badge: 'STADIUM PASS',
    color: '#055c63',
    defaultBg: '#055c63',
    defaultBadgeIcon: 'ticket'
  },
  {
    id: 'water-parks',
    name: 'Water Parks & Summer',
    desc: 'Vibrant green theme with summer break tag, fun character accents, and discount pill',
    badge: 'WATER PARKS',
    color: '#049408',
    defaultBg: '#049408',
    defaultBadgeIcon: 'compass'
  },
  {
    id: 'city-guide',
    name: 'City Guide Destination',
    desc: 'Rose to amber gradient background with city landmark badge and featured city pill',
    badge: 'CITY GUIDE',
    color: '#db2777',
    defaultBg: '#e11d48',
    defaultBadgeIcon: 'landmark'
  },
  {
    id: 'custom',
    name: 'Custom Theme / Image',
    desc: 'Fully customizable solid color, multi-stop gradient, or custom background photo',
    badge: 'SPECIAL OFFER',
    color: '#1e293b',
    defaultBg: '#1e293b',
    defaultBadgeIcon: 'sparkles'
  }
];

const getValidHexColor = (colorStr: string, fallback: string = '#000000') => {
  if (!colorStr) return fallback;
  let clean = colorStr.trim();
  if (!clean.startsWith('#')) {
    clean = '#' + clean;
  }
  // If it's a valid 7-character hex code
  if (/^#[0-9A-Fa-f]{6}$/.test(clean)) {
    return clean;
  }
  // If it's a valid 4-character shorthand hex code, expand it
  if (/^#[0-9A-Fa-f]{3}$/.test(clean)) {
    const r = clean[1];
    const g = clean[2];
    const b = clean[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return fallback;
};

export default function PromotionalBannerForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEditing = Boolean(id);

  // Workflow mode: 'readymade' (instant graphic upload) or 'builder' (interactive template generator)
  const isReadyMadeParam = searchParams.get('type') === 'readymade';
  const [workflowMode, setWorkflowMode] = useState<'readymade' | 'builder'>(isReadyMadeParam ? 'readymade' : 'readymade');

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [template, setTemplate] = useState<BannerTemplateType>(isReadyMadeParam ? 'readymade-image' : 'readymade-image');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [highlightText, setHighlightText] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [badgeIcon, setBadgeIcon] = useState<'flame' | 'ticket' | 'compass' | 'landmark' | 'globe' | 'sparkles' | 'percent' | 'gift' | 'tag'>('flame');
  const [secondaryBadge, setSecondaryBadge] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [termsText, setTermsText] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('deals');
  const [destinationType, setDestinationType] = useState<'section' | 'destination' | 'activity' | 'custom'>('section');
  const [customBgColor, setCustomBgColor] = useState('#7700e6');
  const [customGradientFrom, setCustomGradientFrom] = useState('#db2777');
  const [customGradientTo, setCustomGradientTo] = useState('#f59e0b');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imageFit, setImageFit] = useState<'contain' | 'cover' | 'fill' | 'scale-down' | 'natural'>('cover');
  const [aspectRatio, setAspectRatio] = useState<'auto' | '16/9' | '16/10' | '4/3' | '21/9' | '3/2' | '1/1'>('16/10');
  const [imageBgColor, setImageBgColor] = useState('#0d0f14');
  const [previewWidthPercent, setPreviewWidthPercent] = useState<number>(100);
  const [order, setOrder] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Load existing banner data if editing
  useEffect(() => {
    if (isEditing && id) {
      const all = getStoredBanners();
      const current = all.find(b => b.id === id);
      if (current) {
        setTemplate(current.template);
        if (current.template === 'readymade-image' || current.bannerType === 'readymade') {
          setWorkflowMode('readymade');
        } else {
          setWorkflowMode('builder');
        }
        setTitle(current.title || '');
        setSubtitle(current.subtitle || '');
        setHighlightText(current.highlightText || '');
        setBadgeText(current.badgeText || '');
        setBadgeIcon(current.badgeIcon || 'flame');
        setSecondaryBadge(current.secondaryBadge || '');
        setPromoCode(current.promoCode || '');
        setCtaText(current.ctaText || '');
        setTermsText(current.termsText || '');
        setDestinationUrl(current.destinationUrl || 'deals');
        setDestinationType(current.destinationType || 'section');
        setCustomBgColor(current.customBgColor || '#7700e6');
        setCustomGradientFrom(current.customGradientFrom || '#db2777');
        setCustomGradientTo(current.customGradientTo || '#f59e0b');
        setCustomImageUrl(current.customImageUrl || '');
        setImageFit(current.imageFit || 'contain');
        setAspectRatio(current.aspectRatio || '16/10');
        setImageBgColor(current.imageBgColor || '#0d0f14');
        setOrder(current.order || 5);
        setIsActive(current.isActive ?? true);
        setStartDate(current.startDate || '');
        setEndDate(current.endDate || '');
      } else {
        navigate('/promotional-banners');
      }
    } else {
      // Default for new banner
      const all = getStoredBanners();
      setOrder(all.length > 0 ? Math.max(...all.map(b => b.order || 0)) + 1 : 5);
      setDestinationUrl('deals');
      setDestinationType('section');
      if (isReadyMadeParam) {
        setWorkflowMode('readymade');
        setTemplate('readymade-image');
      }
    }
  }, [id, isEditing, isReadyMadeParam, navigate]);

  // When changing workflow mode
  const handleWorkflowChange = (mode: 'readymade' | 'builder') => {
    setWorkflowMode(mode);
    if (mode === 'readymade') {
      setTemplate('readymade-image');
    } else {
      if (template === 'readymade-image') {
        setTemplate('play-passes');
        handleTemplateChange('play-passes');
      }
    }
  };

  // When changing template preset, adjust defaults if creating
  const handleTemplateChange = (newTemplate: BannerTemplateType) => {
    setTemplate(newTemplate);
    if (newTemplate === 'readymade-image') {
      setWorkflowMode('readymade');
      return;
    }
    const preset = TEMPLATE_PRESETS.find(p => p.id === newTemplate);
    if (!preset) return;

    if (!isEditing) {
      if (newTemplate === 'play-passes') {
        setTitle('PLAY PASSES');
        setSubtitle('Grab all your');
        setHighlightText('HERE!');
        setBadgeText('PLAY DEAL');
        setBadgeIcon('flame');
        setSecondaryBadge('');
        setPromoCode('TIQSEYPLAY');
        setCtaText('Copy');
        setTermsText('CODE: TIQSEYPLAY');
        setCustomBgColor('#7700e6');
        setDestinationUrl('deals');
        setDestinationType('section');
      } else if (newTemplate === 'stadium-pass') {
        setTitle('Match-Day Tours');
        setSubtitle('World Football Tournament');
        setHighlightText('& Stadium Passes');
        setBadgeText('STADIUM PASS');
        setBadgeIcon('ticket');
        setSecondaryBadge('Guided Tours');
        setPromoCode('');
        setCtaText('Explore Tickets');
        setTermsText('T&Cs apply');
        setCustomBgColor('#055c63');
        setDestinationUrl('tournament');
        setDestinationType('section');
      } else if (newTemplate === 'water-parks') {
        setTitle('Swim, slide & save');
        setSubtitle('SUMMER Break');
        setHighlightText('Extra 15% off');
        setBadgeText('WATER PARKS');
        setBadgeIcon('compass');
        setSecondaryBadge('SUMMER Break');
        setPromoCode('');
        setCtaText('Park Specials');
        setTermsText('T&Cs apply');
        setCustomBgColor('#049408');
        setDestinationUrl('summer');
        setDestinationType('section');
      } else if (newTemplate === 'city-guide') {
        setTitle('KUALA LUMPUR');
        setSubtitle('Discover top picks in');
        setHighlightText('Explore iconic towers & culture');
        setBadgeText('CITY GUIDE');
        setBadgeIcon('landmark');
        setSecondaryBadge('Featured City');
        setPromoCode('');
        setCtaText('Explore Now');
        setTermsText('Best price guaranteed');
        setCustomBgColor('#e11d48');
        setCustomGradientFrom('#db2777');
        setCustomGradientTo('#f59e0b');
        setDestinationUrl('Kuala Lumpur');
        setDestinationType('destination');
      } else if (newTemplate === 'custom') {
        setTitle('EXCLUSIVE PROMOTION');
        setSubtitle('Limited Time');
        setHighlightText('Save up to 30%');
        setBadgeText('SPECIAL DEAL');
        setBadgeIcon('sparkles');
        setSecondaryBadge('VIP Access');
        setCtaText('EXPLORE NOW');
        setTermsText('Terms and conditions apply');
        setCustomBgColor('#1e293b');
        setCustomGradientFrom('#3b82f6');
        setCustomGradientTo('#8b5cf6');
      }
    }
  };

  // Image file uploader handler
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setNotification({ message: 'Please select a valid image file (PNG, JPG, WebP, SVG).', type: 'error' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const rawBase64 = reader.result;

        // Skip compression for SVGs
        if (file.type === 'image/svg+xml') {
          setCustomImageUrl(rawBase64);
          setNotification({ message: 'Banner graphic uploaded successfully!', type: 'success' });
          setTimeout(() => setNotification(null), 3000);
          return;
        }

        // Compress raster images using Canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 625;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width / height > MAX_WIDTH / MAX_HEIGHT) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            } else {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Try high-efficiency WebP with alpha first, otherwise JPEG
            let compressed = '';
            try {
              compressed = canvas.toDataURL('image/webp', 0.82);
              if (!compressed.startsWith('data:image/webp')) {
                compressed = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.75);
              }
            } catch {
              compressed = canvas.toDataURL('image/jpeg', 0.75);
            }
            setCustomImageUrl(compressed);
            setNotification({ message: 'Banner graphic uploaded & optimized successfully!', type: 'success' });
          } else {
            setCustomImageUrl(rawBase64);
            setNotification({ message: 'Banner graphic uploaded successfully!', type: 'success' });
          }
          setTimeout(() => setNotification(null), 3000);
        };
        img.onerror = () => {
          setCustomImageUrl(rawBase64);
          setNotification({ message: 'Banner graphic uploaded successfully!', type: 'success' });
          setTimeout(() => setNotification(null), 3000);
        };
        img.src = rawBase64;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (workflowMode === 'readymade' && !customImageUrl && !isEditing) {
      // If user didn't upload an image yet, provide a friendly notification but allow saving with default sample or notify
      setNotification({ message: 'Please upload or specify a banner image graphic URL.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const payload: Omit<PromotionalBanner, 'id' | 'createdAt' | 'updatedAt'> = {
      template: workflowMode === 'readymade' ? 'readymade-image' : template,
      bannerType: workflowMode === 'readymade' ? 'readymade' : 'builder',
      imageFit: workflowMode === 'readymade' ? imageFit : undefined,
      aspectRatio: workflowMode === 'readymade' ? aspectRatio : undefined,
      imageBgColor: workflowMode === 'readymade' ? imageBgColor : undefined,
      title: title.trim() || (workflowMode === 'readymade' ? 'Ready-Made Banner' : undefined),
      subtitle: workflowMode === 'readymade' ? undefined : (subtitle.trim() || undefined),
      highlightText: workflowMode === 'readymade' ? undefined : (highlightText.trim() || undefined),
      badgeText: workflowMode === 'readymade' ? undefined : (badgeText.trim() || undefined),
      badgeIcon: workflowMode === 'readymade' ? undefined : badgeIcon,
      secondaryBadge: workflowMode === 'readymade' ? undefined : (secondaryBadge.trim() || undefined),
      promoCode: promoCode.trim() || undefined,
      ctaText: ctaText.trim() || undefined,
      termsText: termsText.trim() || undefined,
      destinationUrl: destinationUrl.trim() || 'deals',
      destinationType,
      customBgColor: customBgColor || undefined,
      customGradientFrom: customGradientFrom || undefined,
      customGradientTo: customGradientTo || undefined,
      customImageUrl: customImageUrl || undefined,
      order: Number(order) || 1,
      isActive,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    };

    if (isEditing && id) {
      updateBanner({
        ...payload,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } else {
      const existingBanners = getStoredBanners();
      if (existingBanners.length >= 6) {
        setNotification({ message: 'Maximum limit of 6 banners reached. Please delete an existing banner first.', type: 'error' });
        setTimeout(() => setNotification(null), 5000);
        return;
      }
      addBanner(payload);
    }

    navigate('/promotional-banners');
  };

  const handleDelete = () => {
    if (isEditing && id && window.confirm('Are you sure you want to permanently delete this banner?')) {
      deleteBanner(id);
      navigate('/promotional-banners');
    }
  };

  // Preview object for right column
  const liveBannerObj: PromotionalBanner = {
    id: id || 'preview-banner',
    template: workflowMode === 'readymade' ? 'readymade-image' : template,
    bannerType: workflowMode === 'readymade' ? 'readymade' : 'builder',
    imageFit,
    aspectRatio,
    imageBgColor,
    title: title || (workflowMode === 'readymade' ? 'Ready-Made Banner' : 'PLAY PASSES'),
    subtitle: subtitle || (workflowMode === 'readymade' ? undefined : 'Grab all your'),
    highlightText: highlightText || (workflowMode === 'readymade' ? undefined : 'Access top attractions with exciting offers!'),
    badgeText: badgeText || (workflowMode === 'readymade' ? undefined : 'PLAY & WIN!'),
    badgeIcon,
    secondaryBadge: secondaryBadge || (workflowMode === 'readymade' ? undefined : '50% OFF'),
    promoCode: promoCode || (workflowMode === 'readymade' ? undefined : 'TIQSEYPLAY'),
    ctaText: ctaText || (workflowMode === 'readymade' ? undefined : 'BOOK NOW'),
    termsText: termsText || (workflowMode === 'readymade' ? undefined : 'LIMITED TIME OFFER'),
    destinationUrl: destinationUrl || 'deals',
    destinationType,
    customBgColor,
    customGradientFrom,
    customGradientTo,
    customImageUrl,
    order,
    isActive,
    startDate,
    endDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-white shadow-2xl text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-200 ${
          notification.type === 'error' ? 'bg-red-600' : 'bg-slate-900 dark:bg-white dark:text-slate-900'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-2xs">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEditing ? 'Edit Promotional Banner' : 'Create Promotional Banner'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload ready-made banners or design custom promotional cards with coupon codes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/promotional-banners')}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer hover:shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Banner</span>
          </button>
        </div>
      </div>

      {/* Top Banner Mode Selection Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-1.5 shadow-2xs flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => handleWorkflowChange('readymade')}
          className={`flex-1 py-3 px-5 rounded-xl text-left transition-all cursor-pointer relative flex items-center justify-between gap-4 ${
            workflowMode === 'readymade'
              ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-b-2 border-indigo-600 text-indigo-950 dark:text-white'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100/70 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <ImageIcon className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900 dark:text-white">
                  Upload Ready-Made Banner
                </span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  EASY
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Use a finished banner image
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleWorkflowChange('builder')}
          className={`flex-1 py-3 px-5 rounded-xl text-left transition-all cursor-pointer relative flex items-center justify-between gap-4 ${
            workflowMode === 'builder'
              ? 'bg-purple-50/50 dark:bg-purple-950/30 border-b-2 border-purple-600 text-purple-950 dark:text-white'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100/70 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Sliders className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900 dark:text-white">
                  Template Card Builder
                </span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                  CUSTOM
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Design interactive promo cards
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Main Grid: Form Left, Sticky Live WYSIWYG Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          
          {/* ========================================================================= */}
          {/* WORKFLOW 1: READY-MADE BANNER UPLOADER                                   */}
          {/* ========================================================================= */}
          {workflowMode === 'readymade' && (
            <>
              {/* Section 1: Upload Finished Banner Graphic */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <FileImage className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h2 className="text-sm font-black text-slate-900 dark:text-white">
                        1. Upload Finished Banner Graphic
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Upload your pre-designed banner (Canva, Photoshop, Illustrator, etc.)
                      </p>
                    </div>
                  </div>
                  {customImageUrl && (
                    <button
                      type="button"
                      onClick={() => setCustomImageUrl('')}
                      className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {/* Drag-and-drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3.5 ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[1.01]'
                      : customImageUrl
                      ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/10 dark:bg-emerald-950/10 hover:border-emerald-400'
                      : 'border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/40 dark:bg-slate-800/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {customImageUrl ? (
                    <div className="w-full max-w-md space-y-3">
                      <div 
                        style={{ backgroundColor: imageBgColor }}
                        className={`relative rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-700 mx-auto flex items-center justify-center ${
                          aspectRatio === '16/9' ? 'aspect-[16/9]' :
                          aspectRatio === '4/3' ? 'aspect-[4/3]' :
                          aspectRatio === '21/9' ? 'aspect-[21/9]' :
                          aspectRatio === '3/2' ? 'aspect-[3/2]' :
                          aspectRatio === '1/1' ? 'aspect-square' :
                          aspectRatio === 'auto' ? 'aspect-auto min-h-[160px]' :
                          'aspect-[16/10]'
                        }`}
                      >
                        <img
                          src={customImageUrl}
                          alt="Uploaded Banner Preview"
                          referrerPolicy="no-referrer"
                          className={`w-full h-full ${
                            imageFit === 'cover' ? 'object-cover' :
                            imageFit === 'fill' ? 'object-fill' :
                            imageFit === 'scale-down' ? 'object-scale-down' :
                            imageFit === 'natural' ? 'object-contain h-auto max-h-full' :
                            'object-contain'
                          } object-center`}
                        />
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Click or drop to replace banner graphic</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Drag & drop your banner image here
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          or click to browse
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                          Recommended: 1200 x 750px (16:10) • PNG, JPG, or WebP • Max 2MB
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors mt-1 cursor-pointer"
                      >
                        Choose Image File
                      </button>
                    </>
                  )}
                </div>

                {/* Direct Image URL input */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Or paste direct image URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/banner.png"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    {customImageUrl && (
                      <button
                        type="button"
                        onClick={() => setCustomImageUrl('')}
                        className="px-3 py-2 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/40"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Image Settings & Appearance */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h2 className="text-sm font-black text-slate-900 dark:text-white">
                      2. Image Settings & Appearance
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Fitting Mode */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Fitting Mode (Fit into Window)
                    </label>
                    <select
                      value={imageFit}
                      onChange={(e) => setImageFit(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="cover">Cover (Fill entire card area - Recommended)</option>
                      <option value="contain">Contain (Fit inside frame with background)</option>
                      <option value="scale-down">Scale Down (Fit if larger, maintain quality)</option>
                      <option value="fill">Stretch Fill (Fill entire width and height)</option>
                      <option value="natural">Natural Flow (Keep original image proportions)</option>
                    </select>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Cover automatically fills the entire card container with smooth rounded corners and zero blank borders.
                    </p>
                  </div>

                  {/* Aspect Ratio */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Banner Card Aspect Ratio
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="16/10">16:10 (Standard Tiqsey Promo Card - 1200x750)</option>
                      <option value="16/9">16:9 (Standard Widescreen - 1280x720)</option>
                      <option value="4/3">4:3 (Classic Box - 1024x768)</option>
                      <option value="3/2">3:2 (Photo Ratio - 1200x800)</option>
                      <option value="21/9">21:9 (Cinematic Ultra-Wide - 1920x820)</option>
                      <option value="1/1">1:1 (Square - 800x800)</option>
                      <option value="auto">Auto (Responsive dynamic height)</option>
                    </select>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Card shape in the grid will follow this ratio.
                    </p>
                  </div>

                  {/* Frame Background Color */}
                  <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Frame / Canvas Background
                    </label>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 pr-3 shadow-2xs">
                        <input
                          type="color"
                          value={getValidHexColor(imageBgColor, '#0d0f14')}
                          onChange={(e) => setImageBgColor(e.target.value)}
                          className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                          title="Choose from color picker"
                        />
                        <input
                          type="text"
                          value={imageBgColor}
                          placeholder="#0d0f14"
                          onChange={(e) => {
                            let val = e.target.value;
                            if (val && !val.startsWith('#')) {
                              val = '#' + val;
                            }
                            setImageBgColor(val);
                          }}
                          className="w-24 bg-transparent text-xs font-mono font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
                          maxLength={9}
                        />
                      </div>

                      {/* Quick Color Presets */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { label: 'Dark Charcoal', color: '#0d0f14' },
                          { label: 'Deep Blue', color: '#09152e' },
                          { label: 'Slate Navy', color: '#0f172a' },
                          { label: 'Pure Black', color: '#000000' },
                          { label: 'Clean White', color: '#ffffff' },
                          { label: 'Tiqsey Purple', color: '#7700e6' }
                        ].map((preset) => (
                          <button
                            key={preset.color}
                            type="button"
                            onClick={() => setImageBgColor(preset.color)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              imageBgColor.toLowerCase() === preset.color.toLowerCase()
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 shadow-2xs'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Campaign Name */}
                  <div className="sm:col-span-2 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Campaign / Banner Name <span className="text-slate-400 font-normal">(For Admin Reference)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Summer Sale Banner - July 2026"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* WORKFLOW 2: INTERACTIVE TEMPLATE BUILDER                                  */}
          {/* ========================================================================= */}
          {workflowMode === 'builder' && (
            <>
              {/* Section 1: Template Archetype Selection */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <h2 className="text-sm font-black text-slate-900 dark:text-white">
                      1. Select Design Archetype & Layout
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TEMPLATE_PRESETS.filter(p => p.id !== 'readymade-image').map((preset) => {
                    const isSelected = template === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleTemplateChange(preset.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/40 dark:bg-purple-950/20 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full shrink-0 border border-white shadow-xs" 
                              style={{ backgroundColor: preset.color }}
                            />
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                              {preset.name}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                          {preset.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Banner Copy & Content */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <h2 className="text-sm font-black text-slate-900 dark:text-white">
                      2. Banner Content & Copy
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Main Title */}
                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Main Headline / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PLAY PASSES, Match-Day Tours, KUALA LUMPUR"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pre-Title / Subtitle
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Grab all your, World Football Tournament"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Highlight Text */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Highlight Text / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Access top attractions with exciting offers!"
                      value={highlightText}
                      onChange={(e) => setHighlightText(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Top Badge Label */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Top Badge Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PLAY & WIN!, STADIUM PASS, WATER PARKS"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Secondary Badge */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Secondary Pill Badge (e.g. 50% OFF)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 50% OFF, Guided Tours, VIP Access"
                      value={secondaryBadge}
                      onChange={(e) => setSecondaryBadge(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Promo Code */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Promotional Coupon Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TIQSEYPLAY, SUMMER15"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100 uppercase"
                    />
                  </div>

                  {/* CTA Text */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      CTA Button Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BOOK NOW, Copy, Explore Tickets"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Footnote / Terms */}
                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Terms / Sub-label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LIMITED TIME OFFER, T&CS APPLY"
                      value={termsText}
                      onChange={(e) => setTermsText(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Colors & Background */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <h2 className="text-sm font-black text-slate-900 dark:text-white">
                      3. Background Colors & Custom Assets
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Base Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={getValidHexColor(customBgColor, '#7700e6')}
                        onChange={(e) => setCustomBgColor(e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5"
                      />
                      <input
                        type="text"
                        value={customBgColor}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (val && !val.startsWith('#')) {
                            val = '#' + val;
                          }
                          setCustomBgColor(val);
                        }}
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-100"
                        placeholder="#7700e6"
                        maxLength={9}
                      />
                    </div>
                  </div>

                  {(template === 'city-guide' || template === 'custom') && (
                    <>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Gradient Start
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={getValidHexColor(customGradientFrom, '#db2777')}
                            onChange={(e) => setCustomGradientFrom(e.target.value)}
                            className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5"
                          />
                          <input
                            type="text"
                            value={customGradientFrom}
                            onChange={(e) => {
                              let val = e.target.value;
                              if (val && !val.startsWith('#')) {
                                val = '#' + val;
                              }
                              setCustomGradientFrom(val);
                            }}
                            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-100"
                            placeholder="#db2777"
                            maxLength={9}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Gradient End
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={getValidHexColor(customGradientTo, '#f59e0b')}
                            onChange={(e) => setCustomGradientTo(e.target.value)}
                            className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5"
                          />
                          <input
                            type="text"
                            value={customGradientTo}
                            onChange={(e) => {
                              let val = e.target.value;
                              if (val && !val.startsWith('#')) {
                                val = '#' + val;
                              }
                              setCustomGradientTo(val);
                            }}
                            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-100"
                            placeholder="#f59e0b"
                            maxLength={9}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Section: Click Destination & Action (Section 3 for readymade, Section 4 for builder) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <LinkIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white">
                  {workflowMode === 'readymade' ? '3. Click Destination & Action' : '4. Click Destination & Action'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Type
                </label>
                <select
                  value={destinationType}
                  onChange={(e) => {
                    const dt = e.target.value as any;
                    setDestinationType(dt);
                    if (dt === 'section') setDestinationUrl('deals');
                    else if (dt === 'destination') setDestinationUrl('Amsterdam');
                    else if (dt === 'activity') setDestinationUrl('/attractions');
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option value="section">Homepage Section (Scroll to Section)</option>
                  <option value="destination">City / Destination Guide</option>
                  <option value="activity">Specific Activity / Tour</option>
                  <option value="custom">External URL Link</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Destination Link / Value
                </label>
                <input
                  type="text"
                  placeholder="e.g., deals, promotions, water-parks"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section: Publishing, Scheduling & Priority (Section 4 for readymade, Section 5 for builder) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white">
                  {workflowMode === 'readymade' ? '4. Publishing, Scheduling & Priority' : '5. Publishing, Scheduling & Priority'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
              {/* Active Toggle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300 shadow-2xs'
                      : 'bg-slate-100 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  <span>{isActive ? 'Published & Active' : 'Disabled / Draft'}</span>
                  <div className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                    <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${isActive ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </div>
                </button>
              </div>

              {/* Display Order Sequence */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Display Order Sequence
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Lower number appears first.
                </p>
              </div>

              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Start Date (Optional)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="sm:col-span-3 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="max-w-xs space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Leave empty to run indefinitely.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons at bottom */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/promotional-banners')}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer hover:shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Update & Publish Banner' : 'Save & Publish Banner'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Sticky Live WYSIWYG Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-6 space-y-5">
            
            {/* Live Preview Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Live Preview
                  </h3>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      previewDevice === 'desktop'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      previewDevice === 'tablet'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    title="Tablet Preview"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      previewDevice === 'mobile'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    title="Mobile Card Preview"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Container Width Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-bold">
                  <span>Container Width</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{previewWidthPercent}%</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Min</span>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="5"
                    value={previewWidthPercent}
                    onChange={(e) => setPreviewWidthPercent(Number(e.target.value))}
                    className="flex-1 accent-indigo-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">Full</span>
                </div>

                {/* Banner Render Frame */}
                <div 
                  className={`pt-3 transition-all mx-auto ${
                    previewDevice === 'mobile' ? 'max-w-[300px]' : previewDevice === 'tablet' ? 'max-w-[400px]' : ''
                  }`}
                  style={{
                    width: previewDevice === 'desktop' ? `${previewWidthPercent}%` : undefined
                  }}
                >
                  {/* If ready-made and has image */}
                  {workflowMode === 'readymade' && customImageUrl ? (
                    <div 
                      style={{ backgroundColor: imageBgColor }}
                      className={`w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-center ${
                        aspectRatio === '16/9' ? 'aspect-[16/9]' :
                        aspectRatio === '4/3' ? 'aspect-[4/3]' :
                        aspectRatio === '21/9' ? 'aspect-[21/9]' :
                        aspectRatio === '3/2' ? 'aspect-[3/2]' :
                        aspectRatio === '1/1' ? 'aspect-square' :
                        aspectRatio === 'auto' ? 'aspect-auto min-h-[160px]' :
                        'aspect-[16/10]'
                      }`}
                    >
                      <img 
                        src={customImageUrl} 
                        alt="Preview Banner" 
                        referrerPolicy="no-referrer"
                        className={`w-full h-full ${
                          imageFit === 'cover' ? 'object-cover' :
                          imageFit === 'fill' ? 'object-fill' :
                          imageFit === 'scale-down' ? 'object-scale-down' :
                          imageFit === 'natural' ? 'object-contain h-auto max-h-full' :
                          'object-contain'
                        } object-center`}
                      />
                    </div>
                  ) : workflowMode === 'readymade' && !customImageUrl ? (
                    /* Default illustrative preview sample shown in reference mockup */
                    <div 
                      style={{ backgroundColor: '#7700e6' }}
                      className="w-full aspect-[16/10] rounded-2xl relative overflow-hidden flex flex-col justify-between p-5 cursor-pointer shadow-lg select-none border border-purple-500/30 text-left"
                    >
                      {/* Top Badges */}
                      <div className="z-10 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-purple-950 text-[11px] font-black uppercase tracking-wider shadow-sm">
                          <Flame className="w-3 h-3 text-orange-600 fill-orange-500" />
                          <span>PLAY & WIN!</span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-yellow-400 text-purple-950 text-[11px] font-black uppercase tracking-wider transform rotate-6 shadow-sm">
                          <span>50% OFF</span>
                        </div>
                      </div>

                      {/* Center Titles */}
                      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 my-2">
                        <span className="block text-yellow-300 font-extrabold text-xs italic tracking-tight">
                          Grab all your
                        </span>
                        <h4 className="text-3xl font-[1000] tracking-tighter text-white italic leading-none uppercase drop-shadow-[0_2px_0px_#2e0066] my-1">
                          PLAY PASSES
                        </h4>
                        <p className="text-white/90 text-xs font-semibold mt-1 max-w-[240px]">
                          Access top attractions with exciting offers!
                        </p>
                      </div>

                      {/* Bottom row */}
                      <div className="z-10 flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-white/80">
                          <Ticket className="w-3 h-3 text-yellow-300" />
                          <span>LIMITED TIME OFFER</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-yellow-400 text-purple-950 font-black text-xs rounded-lg shadow-sm">
                            BOOK NOW
                          </span>
                          <span className="text-[11px] font-black text-yellow-300 tracking-wider font-mono">
                            TIQSEYPLAY
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <BannerCard banner={liveBannerObj} mode="preview" />
                  )}
                </div>
              </div>

              {/* Metadata Key-Value List */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Template Type:</span>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1 uppercase">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    {workflowMode === 'readymade' ? 'READY-MADE IMAGE' : template.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Target Destination:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                    {destinationUrl || 'deals'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Status:</span>
                  <span className={`font-bold ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    {isActive ? 'Active on Homepage' : 'Draft / Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Display Order:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {order}
                  </span>
                </div>
              </div>

              {/* Ready-Made Banner Design Tip */}
              <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3.5 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-300">
                  <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Ready-Made Banner Design Tip</span>
                </div>
                <p className="text-[11px] text-indigo-800/90 dark:text-indigo-300/80 leading-relaxed pl-5.5">
                  For best results, use high-quality images with bold text and strong contrast. Recommended size: 1200 x 750px (16:10 aspect ratio).
                </p>
              </div>
            </div>

            {/* Before you publish Checklist Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Before you publish
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className={`w-4 h-4 ${customImageUrl || workflowMode === 'builder' ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className={customImageUrl || workflowMode === 'builder' ? 'font-medium' : 'text-slate-400'}>
                    Banner image uploaded or URL added
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className={`w-4 h-4 ${destinationUrl ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className={destinationUrl ? 'font-medium' : 'text-slate-400'}>
                    Target destination selected
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className={isActive ? 'font-medium' : 'text-slate-400'}>
                    Status is active
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className={`w-4 h-4 ${order >= 1 ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className={order >= 1 ? 'font-medium' : 'text-slate-400'}>
                    Display order set
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
