import { useAdminLoader } from "../contexts/AdminLoaderContext";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Quote, 
  Code, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Link, 
  Image, 
  Video, 
  Table, 
  Palette, 
  Pipette,
  Eraser,
  Globe,
  CheckCircle,
  AlertCircle,
  CalendarClock,
  Maximize2,
  Minimize2,
  HelpCircle,
  Eye,
  Edit3,
  Columns,
  X,
  Check,
  Upload,
  ChevronDown,
  Sparkles,
  Wand2,
  Plus,
  Minus,
  Type,
  Indent,
  Outdent,
  ArrowUpDown,
  Bookmark,
  Send,
  Search,
  Sliders,
  Lightbulb,
  FileText,
  PenTool,
  UploadCloud,
  Tag,
  Calendar
} from 'lucide-react';
import { useBlog } from '../../contexts/BlogContext';
import { motion, AnimatePresence } from 'motion/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapUnderline from '@tiptap/extension-underline';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import { Table as TiptapTable } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { FontSize, Indent as CustomIndent, LineHeight, ParagraphSpacing } from '../../utils/tiptapExtensions';
import { markdownToHtml, htmlToMarkdown } from '../../utils/editorConverter';

// Curated high-quality travel images from Unsplash to offer the user as quick templates
const CURATED_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    title: 'Amalfi Coast Sunset',
    credit: 'Willian West'
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    title: 'Tropical Beach Paradise',
    credit: 'Sean Oulashin'
  },
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    title: 'Mystic Forest Mountain',
    credit: 'v2osc'
  },
  {
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    title: 'Kyoto Temple Autumn',
    credit: 'Sorin Gheorghita'
  },
  {
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    title: 'Paris Eiffel Tower',
    credit: 'Chris Karidis'
  },
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Yosemite Valley Lake',
    credit: 'Ansel Adams'
  },
  {
    url: 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=800&q=80',
    title: 'Hot Air Balloons Cappadocia',
    credit: 'Sonaal Bangera'
  },
  {
    url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
    title: 'Santorini Blue Dome',
    credit: 'Heidi Kaden'
  }
];

// Professional 10x8 color grid matching standard document editors (10 columns: Grayscale, Red, Orange, Yellow, Lime, Teal, Sky, Royal Blue, Purple, Pink)
const COLOR_GRID_ROWS = [
  // Row 1: Grayscale (Black to White)
  ['#000000', '#1A1A1A', '#333333', '#4D4D4D', '#666666', '#808080', '#999999', '#CCCCCC', '#E6E6E6', '#FFFFFF'],
  // Row 2: Primaries & Vivids
  ['#800000', '#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF'],
  // Row 3: Light Pastels / Tints
  ['#FFCCCC', '#FFE5CC', '#FFFFCC', '#E5FFCC', '#CCFFCC', '#CCFFFF', '#CCE5FF', '#CCCCFF', '#E5CCFF', '#FFCCFF'],
  // Row 4: Soft Pastels
  ['#FF9999', '#FFC999', '#FFFF99', '#C9FF99', '#99FF99', '#99FFFF', '#99C9FF', '#9999FF', '#C999FF', '#FF99FF'],
  // Row 5: Medium Shades
  ['#FF6666', '#FFAD66', '#FFFF66', '#ADFF66', '#66FF66', '#66FFFF', '#66ADFF', '#6666FF', '#AD66FF', '#FF66FF'],
  // Row 6: Darker Shades
  ['#CC0000', '#E65C00', '#CCCC00', '#5CE600', '#00CC00', '#00CCCC', '#0066CC', '#0000CC', '#6600CC', '#CC00CC'],
  // Row 7: Deep Shades
  ['#990000', '#B34700', '#999900', '#47B300', '#009900', '#009999', '#004C99', '#000099', '#4C0099', '#990099'],
  // Row 8: Very Deep Shades
  ['#4A0000', '#662200', '#4A4A00', '#226600', '#004A00', '#004A4A', '#002B52', '#00004A', '#220066', '#4A004A']
];

const INSPIRATION_STARTERS = [
  {
    label: "Kyoto Hidden Cafes 🍵",
    prompt: "A comprehensive guide on the 10 best hidden cafes in Kyoto, focusing on traditional matcha, historic architecture, and quiet garden views."
  },
  {
    label: "Solo Packing List 🎒",
    prompt: "The ultimate solo travel packing list: 15 essentials you should never leave behind, complete with space-saving hacks."
  },
  {
    label: "Amalfi Coast Itinerary 🗺️",
    prompt: "A detailed 5-day road trip itinerary through the Amalfi Coast, highlighting scenic stops, local seafood spots, and budget stay tips."
  },
  {
    label: "Smartphone Photo Tips 📸",
    prompt: "7 simple travel photography hacks for beginners: how to capture stunning landscape and street shots using just your smartphone."
  }
];

const getLocalDatetime = (dateValue?: string | Date) => {
  const d = dateValue ? new Date(dateValue) : new Date();
  if (isNaN(d.getTime())) {
    const fallback = new Date();
    return new Date(fallback.getTime() - fallback.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export default function BlogPostForm() {
  const { showLoader, hideLoader } = useAdminLoader();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPostById, addPost, updatePost } = useBlog();
  const isEditing = id && id !== 'new';
  const post = isEditing ? getPostById(id) : null;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const [category, setCategory] = useState('Travel Tips');
  const [authorName, setAuthorName] = useState('Admin');
  const [publishedAt, setPublishedAt] = useState(getLocalDatetime());
  const [status, setStatus] = useState<'Published' | 'Draft' | 'Scheduled'>('Draft');
  const [city, setCity] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [allowComments, setAllowComments] = useState(true);
  const [showInBlogList, setShowInBlogList] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [sendNewsletter, setSendNewsletter] = useState(false);
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPublishDropdownOpen, setIsPublishDropdownOpen] = useState(false);
  const publishDropdownRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [errors, setErrors] = useState<{ title?: boolean, content?: boolean, excerpt?: boolean }>({});

  // Modern editor layout & view states
  const [editorMode, setEditorMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const formatDropdownRef = useRef<HTMLDivElement>(null);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const [isSpacingDropdownOpen, setIsSpacingDropdownOpen] = useState(false);
  const spacingDropdownRef = useRef<HTMLDivElement>(null);
  
  // Featured cover image upload states and ref
  const [isCoverDragging, setIsCoverDragging] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Modal display states
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#E11D48');
  const customColorInputRef = useRef<HTMLInputElement>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // AI Co-Writer states
  const [aiAction, setAiAction] = useState<'generate' | 'improve' | 'continue'>('generate');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState('creative');
  const [aiLength, setAiLength] = useState('medium');
  const [aiGeneratedContent, setAiGeneratedContent] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiResultTab, setAiResultTab] = useState<'source' | 'preview'>('source');

  // Field values for formatting modals
  const [modalLinkUrl, setModalLinkUrl] = useState('');
  const [modalLinkText, setModalLinkText] = useState('');
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [modalImageAlt, setModalImageAlt] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [modalTableRows, setModalTableRows] = useState(3);
  const [modalTableCols, setModalTableCols] = useState(3);
  const [hoverGridRow, setHoverGridRow] = useState(0);
  const [hoverGridCol, setHoverGridCol] = useState(0);

  // Saves cursor selection positions when popups are invoked
  const [savedSelection, setSavedSelection] = useState({ start: 0, end: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapUnderline,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#5fa6d9] hover:underline cursor-pointer',
        },
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full my-4 shadow-sm border border-slate-200 dark:border-slate-800',
        },
      }),
      TiptapTable.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-slate-300 dark:border-slate-700 w-full my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-850 px-3 py-2 font-bold text-slate-800 dark:text-slate-200',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      CustomIndent,
      LineHeight,
      ParagraphSpacing,
    ],
    content: markdownToHtml(content),
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[24rem] p-6 text-slate-800 dark:text-slate-200',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === 'string') {
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src: reader.result, alt: file.name });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
      handleKeyDown: (view, event) => {
        const isMod = event.ctrlKey || event.metaKey;
        const key = event.key.toLowerCase();

        // 1. Save Shortcut (Ctrl+S / ⌘+S)
        if (isMod && key === 's' && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          handleSave();
          return true;
        }

        // 2. Bold (Ctrl+B / ⌘+B)
        if (isMod && key === 'b' && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          editor?.chain().focus().toggleBold().run();
          return true;
        }

        // 3. Italic (Ctrl+I / ⌘+I)
        if (isMod && key === 'i' && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          editor?.chain().focus().toggleItalic().run();
          return true;
        }

        // 4. Underline (Ctrl+U / ⌘+U)
        if (isMod && key === 'u' && !event.shiftKey && !event.altKey) {
          event.preventDefault();
          editor?.chain().focus().toggleUnderline().run();
          return true;
        }

        // 5. Strikethrough (Ctrl+Shift+X or Ctrl+Shift+S)
        if (isMod && event.shiftKey && (key === 'x' || key === 's') && !event.altKey) {
          event.preventDefault();
          editor?.chain().focus().toggleStrike().run();
          return true;
        }

        // 6. Heading Level Shortcuts (Ctrl+Alt+1, 2, 3, 0)
        if (isMod && event.altKey) {
          if (key === '1') {
            event.preventDefault();
            editor?.chain().focus().toggleHeading({ level: 1 }).run();
            return true;
          }
          if (key === '2') {
            event.preventDefault();
            editor?.chain().focus().toggleHeading({ level: 2 }).run();
            return true;
          }
          if (key === '3') {
            event.preventDefault();
            editor?.chain().focus().toggleHeading({ level: 3 }).run();
            return true;
          }
          if (key === '0') {
            event.preventDefault();
            editor?.chain().focus().setParagraph().run();
            return true;
          }
        }

        // 7. Lists, Code Block & Quote (with Shift Key)
        if (isMod && event.shiftKey && !event.altKey) {
          if (key === '8' || key === '*') {
            event.preventDefault();
            editor?.chain().focus().toggleBulletList().run();
            return true;
          }
          if (key === '7' || key === '#') {
            event.preventDefault();
            editor?.chain().focus().toggleOrderedList().run();
            return true;
          }
          if (key === 'b') {
            event.preventDefault();
            editor?.chain().focus().toggleBlockquote().run();
            return true;
          }
        }

        // Code Block (Ctrl+Alt+C)
        if (isMod && event.altKey && key === 'c') {
          event.preventDefault();
          editor?.chain().focus().toggleCode().run();
          return true;
        }

        if (isMod) {
          // Ctrl+K / ⌘+K -> Insert Link
          if (key === 'k') {
            event.preventDefault();
            openModalForFormat('link');
            return true;
          }
          // Ctrl+[ / ⌘+[ -> Decrease Indent
          if (event.key === '[') {
            event.preventDefault();
            editor?.chain().focus().outdent().run();
            return true;
          }
          // Ctrl+] / ⌘+] -> Increase Indent
          if (event.key === ']') {
            event.preventDefault();
            editor?.chain().focus().indent().run();
            return true;
          }
          // Alignments with Ctrl+Shift / ⌘+Shift
          if (event.shiftKey) {
            if (key === 'l') {
              event.preventDefault();
              editor?.chain().focus().setTextAlign('left').run();
              return true;
            }
            if (key === 'e') {
              event.preventDefault();
              editor?.chain().focus().setTextAlign('center').run();
              return true;
            }
            if (key === 'r') {
              event.preventDefault();
              editor?.chain().focus().setTextAlign('right').run();
              return true;
            }
            if (key === 'j') {
              event.preventDefault();
              editor?.chain().focus().setTextAlign('justify').run();
              return true;
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      if (errors.content) setErrors(prev => ({ ...prev, content: false }));
    },
  });

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formatDropdownRef.current && !formatDropdownRef.current.contains(event.target as Node)) {
        setIsFormatDropdownOpen(false);
      }
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
        setIsFontDropdownOpen(false);
      }
      if (spacingDropdownRef.current && !spacingDropdownRef.current.contains(event.target as Node)) {
        setIsSpacingDropdownOpen(false);
      }
      if (publishDropdownRef.current && !publishDropdownRef.current.contains(event.target as Node)) {
        setIsPublishDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug || post.id);
      setIsSlugManuallyEdited(true);
      setExcerpt(post.excerpt);
      const joined = post.content.join('\n\n');
      setContent(joined);
      setImageUrl(post.imageUrl);
      setCategory(post.category);
      setAuthorName(post.author.name);
      setPublishedAt(getLocalDatetime(post.publishedAt));
      setStatus(post.status || 'Published');
      setCity(post.city || '');
      if (post.tags && Array.isArray(post.tags)) {
        setTags(post.tags);
      }
      
      // Load converted content into the visual editor on startup
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent(markdownToHtml(joined));
      }
    }
  }, [post, editor]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isSlugManuallyEdited) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const saveHistory = (currentText: string) => {
    // Tiptap handles undo/redo internally, keeping this as a no-op for backward compatibility
  };

  const handleUndo = () => {
    editor?.chain().focus().undo().run();
  };

  const handleRedo = () => {
    editor?.chain().focus().redo().run();
  };

  const openModalForFormat = (formatType: 'link' | 'image' | 'table' | 'color') => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    setSavedSelection({ start: from, end: to });
    const selectedText = editor.state.selection.empty 
      ? '' 
      : editor.state.selection.content().content.firstChild?.textContent || '';

    if (formatType === 'link') {
      setModalLinkText(selectedText || '');
      setModalLinkUrl('');
      setIsLinkModalOpen(true);
    } else if (formatType === 'image') {
      setModalImageAlt(selectedText || '');
      setModalImageUrl('');
      setUploadFileName('');
      setIsDragging(false);
      setIsImageModalOpen(true);
    } else if (formatType === 'table') {
      setModalTableRows(3);
      setModalTableCols(3);
      setHoverGridRow(0);
      setHoverGridCol(0);
      setIsTableModalOpen(true);
    } else if (formatType === 'color') {
      setIsColorModalOpen(true);
    }
  };

  const handleInsertLink = () => {
    if (!editor) return;
    const url = modalLinkUrl.trim() || 'https://';
    const linkText = modalLinkText.trim() || url;

    if (editor.state.selection.empty) {
      editor.chain().focus().insertContent(`<a href="${url}" class="text-[#5fa6d9] hover:underline cursor-pointer">${linkText}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
    setIsLinkModalOpen(false);
  };

  const handleInsertImage = (selectedUrl?: string) => {
    if (!editor) return;
    const url = (selectedUrl || modalImageUrl).trim() || 'image_url';
    const alt = modalImageAlt.trim() || 'image description';

    editor.chain().focus().setImage({ src: url, alt }).run();
    setIsImageModalOpen(false);
  };

  const handleModalImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      if (!modalImageAlt) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setModalImageAlt(nameWithoutExt);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setModalImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCoverDragging(true);
  };

  const handleCoverDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCoverDragging(false);
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCoverDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadFileName(file.name);
      if (!modalImageAlt) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setModalImageAlt(nameWithoutExt);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setModalImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertTable = (rowsCount: number, colsCount: number) => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: rowsCount, cols: colsCount, withHeaderRow: true }).run();
    setIsTableModalOpen(false);
  };

  const handleInsertColor = (colorValue: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(colorValue).run();
    setIsColorModalOpen(false);
  };

  const openAiModal = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    setSavedSelection({ start: from, end: to });
    const selectedText = editor.state.selection.empty 
      ? '' 
      : editor.state.selection.content().content.firstChild?.textContent || '';
    
    if (selectedText.trim()) {
      setAiAction('improve');
      setAiPrompt(`Polish the text, enhance style, and fix errors:\n"${selectedText.substring(0, 80)}${selectedText.length > 80 ? '...' : ''}"`);
    } else {
      setAiAction('generate');
      setAiPrompt('');
    }
    setAiGeneratedContent('');
    setAiError('');
    setIsAiModalOpen(true);
  };

  const handleAiGenerate = async () => {
    setIsAiLoading(true);
    setAiError('');
    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: aiAction,
          prompt: aiPrompt,
          tone: aiTone,
          length: aiLength,
          currentContent: aiAction === 'generate' ? '' : content,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAiGeneratedContent(data.text || '');
      } else {
        setAiError(data.error || 'Failed to generate content with AI.');
      }
    } catch (err: any) {
      setAiError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleInsertAiContent = (insertType: 'replace-all' | 'replace-selection' | 'append') => {
    if (!editor) return;

    let targetTitle = '';
    let finalAiText = aiGeneratedContent;
    if (insertType === 'replace-all') {
      const match = aiGeneratedContent.match(/^#\s+(.+)$/m);
      if (match) {
        targetTitle = match[1].trim();
        finalAiText = aiGeneratedContent.replace(/^#\s+.+$\n?/m, '').trim();
      }
    }

    const htmlContent = markdownToHtml(finalAiText);

    if (insertType === 'replace-all') {
      editor.commands.setContent(htmlContent);
      if (targetTitle) {
        setTitle(targetTitle);
        if (!isSlugManuallyEdited) {
          setSlug(targetTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
      }
    } else if (insertType === 'replace-selection') {
      editor.chain().focus().insertContent(htmlContent).run();
    } else {
      editor.chain().focus().insertContentAt(editor.state.doc.content.size, htmlContent).run();
    }

    setIsAiModalOpen(false);
  };

  const handleFormat = (format: string) => {
    if (!editor) return;

    if (['link', 'image', 'table', 'color'].includes(format)) {
      openModalForFormat(format as any);
      return;
    }

    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline().run();
        break;
      case 'strikethrough':
        editor.chain().focus().toggleStrike().run();
        break;
      case 'quote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'code':
        editor.chain().focus().toggleCode().run();
        break;
      case 'list':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'ordered-list':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'align-left':
        editor.chain().focus().setTextAlign('left').run();
        break;
      case 'align-center':
        editor.chain().focus().setTextAlign('center').run();
        break;
      case 'align-right':
        editor.chain().focus().setTextAlign('right').run();
        break;
      case 'align-justify':
        editor.chain().focus().setTextAlign('justify').run();
        break;
      case 'clear':
        editor.chain().focus().clearNodes().unsetAllMarks().run();
        break;
      default:
        break;
    }
  };

  const handleSave = async (overrideStatus?: 'Draft' | 'Published' | 'Scheduled') => {
    showLoader();
    await new Promise(resolve => setTimeout(resolve, 500));
    const finalStatus = overrideStatus || status;

    // Form validation
    const newErrors: { title?: boolean; content?: boolean; excerpt?: boolean } = {};
    if (!title.trim()) newErrors.title = true;
    if (!excerpt.trim()) newErrors.excerpt = true;
    if (!content.trim()) newErrors.content = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToastType('error');
      setToastMessage('Error: Please fill out Title, Excerpt, and Content fields.');
      setShowToast(true);
      return;
    }

    // Future date validation for Scheduled posts
    let finalPublishedAt = publishedAt;
    if (finalStatus === 'Scheduled') {
      const scheduledDate = new Date(publishedAt);
      if (isNaN(scheduledDate.getTime()) || scheduledDate.getTime() <= Date.now() + 5000) {
        setToastType('error');
        setToastMessage('Error: Scheduled date and time must be in the future. Please update the Publish Date & Time in the sidebar.');
        setShowToast(true);
        return;
      }
    } else if (finalStatus === 'Published') {
      // If publishing immediately, ensure publishedAt is not in the future
      const pubDate = new Date(publishedAt);
      if (isNaN(pubDate.getTime()) || pubDate.getTime() > Date.now()) {
        finalPublishedAt = getLocalDatetime();
      }
    }

    setErrors({});
    setStatus(finalStatus);

    const postData = {
      title,
      excerpt,
      content: htmlToMarkdown(content).split('\n\n').filter(Boolean),
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      category: category as any,
      author: {
        name: authorName || "Admin",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        role: "Editor"
      },
      publishedAt: finalPublishedAt || getLocalDatetime(),
      readTime: Math.max(1, Math.ceil(htmlToMarkdown(content).length / 1000)) + " min read",
      city,
      tags: tags.length > 0 ? tags : (tagInput ? tagInput.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean) : []),
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      status: finalStatus
    };

    if (isEditing && id) {
      updatePost(id, postData);
    } else {
      addPost(postData);
    }
    
    let msg = `Post saved as Draft!`;
    if (finalStatus === 'Published') msg = 'Post published successfully!';
    if (finalStatus === 'Scheduled') msg = `Post scheduled for ${new Date(finalPublishedAt).toLocaleString()}!`;
    setToastType('success');
    setToastMessage(msg);
    setShowToast(true);
    
    setTimeout(() => {
      navigate('/blog');
    }, 1500);
  };

  const getFormatLabel = () => {
    if (!editor) return 'Normal Text';
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    return 'Normal Text';
  };

  const FONTS = [
    { name: 'Default Font', value: '' },
    // Modern Sans-serif
    { name: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
    { name: 'Inter', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Raleway', value: 'Raleway' },
    { name: 'Space Grotesk', value: 'Space Grotesk' },
    { name: 'Outfit', value: 'Outfit' },
    // Standard Sans-serif (System)
    { name: 'Arial', value: 'Arial' },
    { name: 'Verdana', value: 'Verdana' },
    { name: 'Tahoma', value: 'Tahoma' },
    { name: 'Trebuchet MS', value: 'Trebuchet MS' },
    // Editorial & Classic Serif
    { name: 'Lora', value: 'Lora' },
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Georgia', value: 'Georgia' },
    { name: 'Times New Roman', value: 'Times New Roman' },
    { name: 'Merriweather', value: 'Merriweather' },
    { name: 'Garamond', value: 'Garamond' },
    { name: 'Cinzel', value: 'Cinzel' },
    // Monospace & Code
    { name: 'JetBrains Mono', value: 'JetBrains Mono' },
    { name: 'Fira Code', value: 'Fira Code' },
    { name: 'Courier New', value: 'Courier New' },
    // Display & Impact
    { name: 'Oswald', value: 'Oswald' },
    { name: 'Impact', value: 'Impact' },
    // Elegant & Playful Handwriting/Script
    { name: 'Pacifico', value: 'Pacifico' },
    { name: 'Caveat', value: 'Caveat' },
    { name: 'Great Vibes', value: 'Great Vibes' },
    { name: 'Dancing Script', value: 'Dancing Script' },
    { name: 'Satisfy', value: 'Satisfy' },
    { name: 'Comic Sans MS', value: 'Comic Sans MS' }
  ];

  const LINE_HEIGHTS = [
    { label: 'Single (1.0)', value: '1' },
    { label: '1.15 Spacing', value: '1.15' },
    { label: 'Medium (1.5)', value: '1.5' },
    { label: 'Double (2.0)', value: '2' }
  ];

  const PARAGRAPH_SPACINGS = [
    { label: 'None (0px)', value: '0px' },
    { label: 'Small (8px)', value: '8px' },
    { label: 'Normal (16px)', value: '16px' },
    { label: 'Large (24px)', value: '24px' }
  ];

  const getActiveFont = () => {
    if (!editor) return 'Font Family';
    const currentFont = editor.getAttributes('textStyle').fontFamily;
    if (!currentFont) return 'Default Font';
    const found = FONTS.find(f => f.value.toLowerCase() === currentFont.toLowerCase() || f.name.toLowerCase() === currentFont.toLowerCase());
    return found ? found.name : currentFont;
  };

  const getActiveFontSize = () => {
    if (!editor) return 16;
    const sizeAttr = editor.getAttributes('textStyle').fontSize;
    if (!sizeAttr) return 16;
    const parsed = parseInt(sizeAttr, 10);
    return isNaN(parsed) ? 16 : parsed;
  };

  const handleFontSizeChange = (amount: number) => {
    if (!editor) return;
    const current = getActiveFontSize();
    const next = Math.max(8, Math.min(72, current + amount));
    editor.chain().focus().setFontSize(`${next}px`).run();
  };

  const handleSetFontSizeDirect = (val: number) => {
    if (!editor) return;
    const next = Math.max(8, Math.min(72, val));
    editor.chain().focus().setFontSize(`${next}px`).run();
  };

  const handleLineHeight = (val: string) => {
    if (!editor) return;
    if (val === 'clear') {
      editor.chain().focus().unsetLineHeight().run();
    } else {
      editor.chain().focus().setLineHeight(val).run();
    }
  };

  const handleParagraphSpacing = (val: string) => {
    if (!editor) return;
    if (val === 'clear') {
      editor.chain().focus().unsetParagraphSpacing().run();
    } else {
      editor.chain().focus().setParagraphSpacing(val).run();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            title="Back to Blog"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-xs shrink-0">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Share travel stories, guides, and tips with your audience.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={() => handleSave('Draft')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Bookmark className="w-4 h-4 text-slate-400" />
            Save Draft
          </button>

          <button 
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            Preview
          </button>

          <div ref={publishDropdownRef} className="relative">
            <button 
              type="button"
              onClick={() => setIsPublishDropdownOpen(!isPublishDropdownOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Publish Post</span>
              <ChevronDown className="w-4 h-4 opacity-80" />
            </button>

            {isPublishDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setIsPublishDropdownOpen(false);
                    handleSave('Published');
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-indigo-500" />
                  Publish Now
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPublishDropdownOpen(false);
                    handleSave('Scheduled');
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <CalendarClock className="w-4 h-4 text-indigo-500" />
                  Schedule for Later
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top 2 Cards Grid: Post Details & Featured Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Post Details Card */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>Post Details</span>
            </div>

            {/* Row 1: Status, Publish Date & Time, Author */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 cursor-pointer shadow-2xs"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Author
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Admin"
                  className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 shadow-2xs"
                />
              </div>
            </div>

            {/* Row 2: Category, Related City (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 cursor-pointer shadow-2xs"
                >
                  <option value="Travel Tips">Travel Tips</option>
                  <option value="Destination Guides">Destination Guides</option>
                  <option value="Food & Culture">Food & Culture</option>
                  <option value="Hidden Gems">Hidden Gems</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Related City (Optional)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Paris"
                  className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 shadow-2xs"
                />
                <p className="text-[11px] text-slate-400 mt-1">Start typing to search for a city</p>
              </div>
            </div>

            {/* Row 3: Tags (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tags (Optional)
              </label>
              <div className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 flex flex-wrap items-center gap-1.5 min-h-[42px] shadow-2xs">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/50 text-xs px-2.5 py-0.5 rounded-lg font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                      className="hover:text-violet-900 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const val = tagInput.trim().replace(/^#/, '');
                      if (val && !tags.includes(val)) {
                        setTags([...tags, val]);
                        setTagInput('');
                      }
                    }
                  }}
                  placeholder={tags.length === 0 ? "Add tags and press Enter..." : "Add more tags..."}
                  className="flex-1 min-w-[140px] bg-transparent border-0 focus:outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 py-1"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Examples: adventure, europe, food, culture</p>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Featured Image
            </h3>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleCoverDragOver}
              onDragLeave={handleCoverDragLeave}
              onDrop={handleCoverDrop}
              className={`border-2 border-dashed rounded-2xl overflow-hidden min-h-[170px] flex flex-col items-center justify-center relative transition-all duration-200 ${
                isCoverDragging
                  ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <input
                type="file"
                ref={coverFileInputRef}
                onChange={handleCoverFileChange}
                accept="image/*"
                className="hidden"
              />

              {imageUrl && !imageError ? (
                <div className="relative w-full h-[170px] group">
                  <img
                    src={imageUrl}
                    alt="Featured preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  className="w-full h-full p-5 flex flex-col items-center justify-center text-center cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Upload featured image
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Drag & drop or click to browse
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                    Supports: JPG, PNG, GIF, WebP
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    Recommended size: 1200x675px (16:9)
                  </span>
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Image URL (Optional)
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL..."
                className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 shadow-2xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Add an external image URL if you don't want to upload
              </p>
            </div>
          </div>
        </div>

        {/* Middle Card: Title, Slug, Excerpt, Content */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Title
              </label>
              <span className="text-xs text-slate-400 font-mono font-medium">
                {title.length} / 120
              </span>
            </div>
            <input
              type="text"
              value={title}
              maxLength={120}
              onChange={(e) => {
                handleTitleChange(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: false }));
              }}
              placeholder="Enter an engaging title for your post..."
              className={`w-full bg-white dark:bg-slate-800/80 border rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-colors shadow-2xs ${
                errors.title
                  ? 'border-rose-500 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 font-medium mt-1">Title is required.</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Slug
              </label>
              <span className="text-xs text-slate-400 font-mono font-medium">
                {slug.length} / 160
              </span>
            </div>
            <input
              type="text"
              value={slug}
              maxLength={160}
              onChange={(e) => {
                setSlug(e.target.value);
                setIsSlugManuallyEdited(true);
              }}
              placeholder="post-url-slug"
              className="w-full bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 shadow-2xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">The slug is the URL-friendly version of the title.</p>
          </div>

          {/* Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Excerpt
              </label>
              <span className="text-xs text-slate-400 font-mono font-medium">
                {excerpt.length} / 300
              </span>
            </div>
            <textarea
              value={excerpt}
              maxLength={300}
              rows={3}
              onChange={(e) => {
                setExcerpt(e.target.value);
                if (errors.excerpt) setErrors((prev) => ({ ...prev, excerpt: false }));
              }}
              placeholder="Write a short summary of your post. This will appear in blog lists and previews..."
              className={`w-full bg-white dark:bg-slate-800/80 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-colors shadow-2xs resize-y ${
                errors.excerpt
                  ? 'border-rose-500 ring-1 ring-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
              }`}
            />
            {errors.excerpt && (
              <p className="text-xs text-rose-500 font-medium mt-1">Excerpt is required.</p>
            )}
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Content
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-full text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Co-Writer</span>
                </button>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold border border-amber-200/60 dark:border-amber-900/40">
                  <span className="text-[11px]">⚡</span>
                  <span>WYSIWYG Live Editor</span>
                </div>
              </div>
            </div>

            <div className={`transition-all duration-300 ${
              isFullscreen 
                ? 'fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col p-4 md:p-6 overflow-hidden' 
                : `border rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-colors shadow-2xs ${
                    errors.content 
                      ? 'border-rose-500 ring-1 ring-rose-500' 
                      : 'border-slate-200 dark:border-slate-700 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500'
                  }`
            }`}>
                {/* Editor Toolbar with Format Actions and Mode controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  {/* Left: formatting tools organized into segmented groups */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Typography Group (Format, Font Family, Font Size) */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/40 dark:bg-slate-800/20 p-1 rounded-md border border-slate-200/50 dark:border-slate-800/30">
                      {/* Format Dropdown */}
                      <div ref={formatDropdownRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none text-slate-700 dark:text-slate-300 py-1 px-2.5 rounded-md cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
                        >
                          <span>{getFormatLabel()}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                        
                        {isFormatDropdownOpen && (
                          <div className="absolute left-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                            <button
                              type="button"
                              onClick={() => {
                                handleFormat('clear');
                                setIsFormatDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-normal text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              Normal Text
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleFormat('h1');
                                setIsFormatDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2.5 text-xl font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800"
                            >
                              Heading 1
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleFormat('h2');
                                setIsFormatDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-lg font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800"
                            >
                              Heading 2
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleFormat('h3');
                                setIsFormatDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-1.5 text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800"
                            >
                              Heading 3
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Font Family Dropdown */}
                      <div ref={fontDropdownRef} className="relative">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIsFontDropdownOpen(!isFontDropdownOpen);
                          }}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none text-slate-700 dark:text-slate-300 py-1 px-2.5 rounded-md cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex items-center gap-1.5"
                        >
                          <Type className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[80px]">{getActiveFont()}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                        
                        {isFontDropdownOpen && (
                          <div className="absolute left-0 mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200 max-h-60 overflow-y-auto">
                            {FONTS.map((font) => (
                              <button
                                key={font.name}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  if (font.value) {
                                    editor?.chain().focus().setFontFamily(font.value).run();
                                  } else {
                                    editor?.chain().focus().unsetFontFamily().run();
                                  }
                                  setIsFontDropdownOpen(false);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                style={{ fontFamily: font.value || 'inherit' }}
                              >
                                {font.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Font Size Counter */}
                      <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-0.5 px-1 gap-1 shadow-sm">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleFontSizeChange(-1);
                          }}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Decrease Font Size"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        
                        <input
                          type="number"
                          value={getActiveFontSize()}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) handleSetFontSizeDirect(val);
                          }}
                          className="w-8 text-center text-xs font-bold text-slate-700 dark:text-slate-300 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="8"
                          max="72"
                        />

                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleFontSizeChange(1);
                          }}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Increase Font Size"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Text Formatting Group (Bold, Italic, Underline, Strike) */}
                    <div className="flex items-center gap-0.5 bg-slate-100/40 dark:bg-slate-800/20 p-1 rounded-md border border-slate-200/50 dark:border-slate-800/30">
                      <ToolbarButton icon={<Bold className="w-4 h-4" />} onClick={() => handleFormat('bold')} isActive={editor?.isActive('bold')} title="Bold (Ctrl+B)" />
                      <ToolbarButton icon={<Italic className="w-4 h-4" />} onClick={() => handleFormat('italic')} isActive={editor?.isActive('italic')} title="Italic (Ctrl+I)" />
                      <ToolbarButton icon={<Underline className="w-4 h-4" />} onClick={() => handleFormat('underline')} isActive={editor?.isActive('underline')} title="Underline (Ctrl+U)" />
                      <ToolbarButton icon={<Strikethrough className="w-4 h-4" />} onClick={() => handleFormat('strikethrough')} isActive={editor?.isActive('strike')} title="Strikethrough (Ctrl+Shift+X)" />
                    </div>

                    {/* Structure Group (Quote, Code, Bullet List, Numbered List) */}
                    <div className="flex items-center gap-0.5 bg-slate-100/40 dark:bg-slate-800/20 p-1 rounded-md border border-slate-200/50 dark:border-slate-800/30">
                      <ToolbarButton icon={<Quote className="w-4 h-4" />} onClick={() => handleFormat('quote')} isActive={editor?.isActive('blockquote')} title="Blockquote (Ctrl+Shift+B)" />
                      <ToolbarButton icon={<Code className="w-4 h-4" />} onClick={() => handleFormat('code')} isActive={editor?.isActive('code')} title="Code Block (Ctrl+Alt+C)" />
                      <ToolbarButton icon={<List className="w-4 h-4" />} onClick={() => handleFormat('list')} isActive={editor?.isActive('bulletList')} title="Bullet List (Ctrl+Shift+8)" />
                      <ToolbarButton icon={<ListOrdered className="w-4 h-4" />} onClick={() => handleFormat('ordered-list')} isActive={editor?.isActive('orderedList')} title="Numbered List (Ctrl+Shift+7)" />
                    </div>

                    {/* Alignment Group */}
                    <div className="flex items-center gap-0.5 bg-slate-100/40 dark:bg-slate-800/20 p-1 rounded-md border border-slate-200/50 dark:border-slate-800/30">
                      <ToolbarButton icon={<AlignLeft className="w-4 h-4" />} onClick={() => handleFormat('align-left')} isActive={editor?.isActive({ textAlign: 'left' })} title="Align Left (Ctrl+Shift+L)" />
                      <ToolbarButton icon={<AlignCenter className="w-4 h-4" />} onClick={() => handleFormat('align-center')} isActive={editor?.isActive({ textAlign: 'center' })} title="Align Center (Ctrl+Shift+E)" />
                      <ToolbarButton icon={<AlignRight className="w-4 h-4" />} onClick={() => handleFormat('align-right')} isActive={editor?.isActive({ textAlign: 'right' })} title="Align Right (Ctrl+Shift+R)" />
                      <ToolbarButton icon={<AlignJustify className="w-4 h-4" />} onClick={() => handleFormat('align-justify')} isActive={editor?.isActive({ textAlign: 'justify' })} title="Align Justify (Ctrl+Shift+J)" />
                    </div>

                    {/* Indentation & Spacing Group */}
                    <div className="flex items-center gap-0.5 bg-slate-100/40 dark:bg-slate-800/20 p-1 rounded-md border border-slate-200/50 dark:border-slate-800/30">
                      <ToolbarButton icon={<Outdent className="w-4 h-4" />} onClick={() => editor?.chain().focus().outdent().run()} title="Decrease Indent (Ctrl+[)" />
                      <ToolbarButton icon={<Indent className="w-4 h-4" />} onClick={() => editor?.chain().focus().indent().run()} title="Increase Indent (Ctrl+])" />
                      
                      {/* Spacing Dropdown */}
                      <div ref={spacingDropdownRef} className="relative">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIsSpacingDropdownOpen(!isSpacingDropdownOpen);
                          }}
                          className={`p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-0.5 ${isSpacingDropdownOpen ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                          title="Line & Paragraph Spacing"
                        >
                          <ArrowUpDown className="w-4 h-4" />
                          <ChevronDown className="w-2.5 h-2.5 opacity-50" />
                        </button>

                        {isSpacingDropdownOpen && (
                          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                            {/* Line Spacing Section */}
                            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Line Spacing</div>
                            {LINE_HEIGHTS.map((lh) => (
                              <button
                                key={lh.value}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleLineHeight(lh.value);
                                  setIsSpacingDropdownOpen(false);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                              >
                                <span>{lh.label}</span>
                                {editor?.isActive({ lineHeight: lh.value }) && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#5fa6d9]" />
                                )}
                              </button>
                            ))}
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleLineHeight('clear');
                                setIsSpacingDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-1 text-xs text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800/50 pb-2 mb-1"
                            >
                              Reset Line Spacing
                            </button>

                            {/* Paragraph Spacing Section */}
                            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paragraph Spacing</div>
                            {PARAGRAPH_SPACINGS.map((ps) => (
                              <button
                                key={ps.value}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleParagraphSpacing(ps.value);
                                  setIsSpacingDropdownOpen(false);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                              >
                                <span>{ps.label}</span>
                                {editor?.isActive({ paragraphSpacing: ps.value }) && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#5fa6d9]" />
                                )}
                              </button>
                            ))}
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleParagraphSpacing('clear');
                                setIsSpacingDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-1 text-xs text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              Reset Paragraph Spacing
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Insert & Misc Group (Link, Image, Table, Color, Clear Format) */}
                    <div className="flex items-center gap-0.5 bg-slate-100/40 dark:bg-slate-800/20 p-1 rounded-md border border-slate-200/50 dark:border-slate-800/30">
                      <ToolbarButton icon={<Link className="w-4 h-4" />} onClick={() => handleFormat('link')} isActive={editor?.isActive('link')} title="Insert Link (Ctrl+K)" />
                      <ToolbarButton icon={<Image className="w-4 h-4" />} onClick={() => handleFormat('image')} title="Insert Image" />
                      <ToolbarButton icon={<Table className="w-4 h-4" />} onClick={() => handleFormat('table')} isActive={editor?.isActive('table')} title="Insert Table" />
                      <ToolbarButton icon={<Palette className="w-4 h-4" />} onClick={() => handleFormat('color')} title="Text Color" />
                      <ToolbarButton icon={<Eraser className="w-4 h-4" />} onClick={() => handleFormat('clear')} title="Clear Formatting" />
                    </div>
                  </div>

                  {/* Center/Right: View Toggle & Extras */}
                  <div className="flex items-center gap-3">
                    {/* Visual Editor Label */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-bold border border-amber-200/50 dark:border-amber-900/40">
                      <Wand2 className="w-3.5 h-3.5 animate-bounce" />
                      <span>WYSIWYG Live Editor</span>
                    </div>

                    {/* Extras */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowCheatsheet(!showCheatsheet)}
                        className={`p-1.5 rounded transition-all cursor-pointer ${
                          showCheatsheet 
                            ? 'bg-[#f0f7fc] dark:bg-[#102738]/40 text-[#5fa6d9] dark:text-[#5fa6d9] border border-[#bce1f5] dark:border-[#1e4663]' 
                            : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                        title="Editor Shortcuts Guide"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1.5 rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer"
                        title={isFullscreen ? 'Exit Distraction-Free Zen Mode' : 'Distraction-Free Zen Mode'}
                      >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Editor Content Area */}
                <div className={`flex flex-1 overflow-hidden relative ${isFullscreen ? 'h-full' : 'min-h-[24rem]'}`}>
                  <style>{`
                    .ProseMirror {
                      outline: none;
                      min-height: 24rem;
                    }
                    .ProseMirror p {
                      margin-bottom: 1rem;
                    }
                    .ProseMirror ul {
                      list-style-type: disc !important;
                      padding-left: 1.5rem !important;
                      margin-bottom: 1rem;
                    }
                    .ProseMirror ol {
                      list-style-type: decimal !important;
                      padding-left: 1.5rem !important;
                      margin-bottom: 1rem;
                    }
                    .ProseMirror blockquote {
                      border-left: 4px solid #f43f5e !important;
                      padding-left: 1rem !important;
                      font-style: italic;
                      color: #64748b;
                      margin-bottom: 1rem;
                    }
                    .ProseMirror table {
                      border-collapse: collapse;
                      width: 100%;
                      margin: 1.5rem 0;
                    }
                    .ProseMirror table td, .ProseMirror table th {
                      border: 1px solid #cbd5e1;
                      padding: 0.5rem;
                      text-align: left;
                    }
                    .ProseMirror table th {
                      background-color: #f1f5f9;
                      font-weight: bold;
                    }
                    .dark .ProseMirror table td, .dark .ProseMirror table th {
                      border-color: #334155;
                    }
                    .dark .ProseMirror table th {
                      background-color: #1e293b;
                    }
                    .ProseMirror img {
                      max-width: 100%;
                      border-radius: 0.75rem;
                      margin: 1.5rem 0;
                    }
                  `}</style>
                  <div className={`flex flex-col flex-1 h-full min-h-[24rem] overflow-y-auto bg-transparent border-none focus:outline-none ${isFullscreen ? 'flex-1' : 'max-h-[32rem]'}`}>
                    <EditorContent editor={editor} className="outline-none" />
                  </div>

                  {/* Collapsible Shortcuts Sidebar */}
                  {showCheatsheet && (
                    <div className="w-80 h-full border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto p-5 space-y-4 absolute right-0 top-0 bottom-0 z-10 shadow-lg lg:relative lg:shadow-none animate-in slide-in-from-right duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-sm">
                          <HelpCircle className="w-4 h-4 text-[#5fa6d9]" />
                          Editor Shortcuts
                        </h4>
                        <button 
                          type="button" 
                          onClick={() => setShowCheatsheet(false)}
                          className="p-1 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Standard Shortcuts</p>
                          <code className="block p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded font-mono border border-slate-100 dark:border-slate-800 space-y-1">
                            <div><strong>Ctrl+S / ⌘+S</strong> &rarr; Save Draft/Post</div>
                            <div><strong>Ctrl+B / ⌘+B</strong> &rarr; Bold</div>
                            <div><strong>Ctrl+I / ⌘+I</strong> &rarr; Italic</div>
                            <div><strong>Ctrl+U / ⌘+U</strong> &rarr; Underline</div>
                            <div><strong>Ctrl+Shift+X</strong> &rarr; Strikethrough</div>
                            <div><strong>Ctrl+K / ⌘+K</strong> &rarr; Insert Link</div>
                          </code>
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Paragraphs & Structure</p>
                          <code className="block p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded font-mono border border-slate-100 dark:border-slate-800 space-y-1">
                            <div><strong>Ctrl+Alt+1</strong> &rarr; Heading 1</div>
                            <div><strong>Ctrl+Alt+2</strong> &rarr; Heading 2</div>
                            <div><strong>Ctrl+Alt+3</strong> &rarr; Heading 3</div>
                            <div><strong>Ctrl+Alt+0</strong> &rarr; Normal Text</div>
                            <div><strong>Ctrl+Shift+7</strong> &rarr; Numbered List</div>
                            <div><strong>Ctrl+Shift+8</strong> &rarr; Bullet List</div>
                            <div><strong>Ctrl+Shift+B</strong> &rarr; Blockquote</div>
                            <div><strong>Ctrl+Alt+C</strong> &rarr; Code Block</div>
                            <div><strong>Enter</strong> &rarr; New Paragraph</div>
                            <div><strong>Shift+Enter</strong> &rarr; Line Break</div>
                          </code>
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Alignment & Indents</p>
                          <code className="block p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded font-mono border border-slate-100 dark:border-slate-800 space-y-1">
                            <div><strong>Ctrl+Shift+L</strong> &rarr; Align Left</div>
                            <div><strong>Ctrl+Shift+E</strong> &rarr; Align Center</div>
                            <div><strong>Ctrl+Shift+R</strong> &rarr; Align Right</div>
                            <div><strong>Ctrl+Shift+J</strong> &rarr; Align Justify</div>
                            <div><strong>Ctrl+[ / ⌘+[</strong> &rarr; Decrease Indent</div>
                            <div><strong>Ctrl+] / ⌘+]</strong> &rarr; Increase Indent</div>
                          </code>
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Direct Editing Tip</p>
                          <p className="leading-relaxed">This is a true WYSIWYG editor. Format changes apply immediately to the text you see. You can also copy/paste rich text directly from Google Docs or MS Word, and drag & drop images straight onto the writing canvas.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Editor Status Bar / Metrics */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 font-medium">
                  {/* Left: Auto-save status / Zen Exit */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>Draft saved locally</span>
                    </div>

                    {isFullscreen && (
                      <button
                        type="button"
                        onClick={() => setIsFullscreen(false)}
                        className="text-[#5fa6d9] hover:text-[#4b95cc] dark:text-[#5fa6d9] font-bold ml-1 flex items-center gap-1 bg-[#f0f7fc] dark:bg-[#102738]/30 px-2 py-0.5 rounded border border-[#e0f0fa] dark:border-[#1e4663]/40 cursor-pointer"
                      >
                        Exit Zen Mode
                      </button>
                    )}
                  </div>

                  {/* Right: Word, Char count, Read time */}
                  <div className="flex items-center gap-4">
                    <span><strong>{editor ? editor.getText().trim() === '' ? 0 : editor.getText().trim().split(/\s+/).length : 0}</strong> words</span>
                    <span><strong>{editor ? editor.getText().length : 0}</strong> characters</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <strong>{Math.max(1, Math.ceil((editor ? editor.getText().trim() === '' ? 0 : editor.getText().trim().split(/\s+/).length : 0) / 200))}</strong> min read
                    </span>
                  </div>
                </div>
              </div>
              {errors.content && (
                <p className="text-xs text-rose-500 font-medium mt-1">Content is required.</p>
              )}
            </div>
          </div>

          {/* Bottom 2 Cards Grid: SEO Settings & Post Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SEO Settings Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                <Search className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>SEO Settings (Optional)</span>
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Meta Title
                  </label>
                  <span className="text-xs text-slate-400 font-mono font-medium">
                    {metaTitle.length} / 60
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  maxLength={60}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Defaults to post title if left blank"
                  className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 shadow-2xs"
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Meta Description
                  </label>
                  <span className="text-xs text-slate-400 font-mono font-medium">
                    {metaDescription.length} / 160
                  </span>
                </div>
                <textarea
                  value={metaDescription}
                  maxLength={160}
                  rows={2}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Defaults to post excerpt if left blank"
                  className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 shadow-2xs resize-y"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Keywords
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="travel, europe, budget, guide"
                  className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 shadow-2xs"
                />
                <p className="text-[11px] text-slate-400 mt-1">Separate keywords with commas</p>
              </div>
            </div>

            {/* Post Settings Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                <Sliders className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>Post Settings</span>
              </div>

              <div className="space-y-3.5">
                {/* Allow Comments */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                  <div>
                    <span className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Allow Comments
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      Enable readers to leave comments on this post
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={allowComments}
                      onChange={(e) => setAllowComments(e.target.checked)}
                      className="sr-only"
                    />
                    <div 
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                        allowComments ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out ${
                          allowComments ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </label>

                {/* Show in Blog List */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                  <div>
                    <span className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Show in Blog List
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      Display this post on the main blog directory
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={showInBlogList}
                      onChange={(e) => setShowInBlogList(e.target.checked)}
                      className="sr-only"
                    />
                    <div 
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                        showInBlogList ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out ${
                          showInBlogList ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </label>

                {/* Featured Post */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                  <div>
                    <span className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Featured Post
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      Highlight this post at the top of the blog page
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="sr-only"
                    />
                    <div 
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                        isFeatured ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out ${
                          isFeatured ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </label>

                {/* Send Newsletter */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group">
                  <div>
                    <span className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Send Newsletter
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      Notify subscribers via email when published
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={sendNewsletter}
                      onChange={(e) => setSendNewsletter(e.target.checked)}
                      className="sr-only"
                    />
                    <div 
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                        sendNewsletter ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <div 
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out ${
                          sendNewsletter ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Bottom Info Banner */}
          {showInfoBanner && (
            <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-purple-50 dark:from-violet-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 border border-violet-200/70 dark:border-violet-800/40 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Save your progress
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Drafts are auto-saved locally every 30 seconds. Click "Save Draft" to persist your changes to the database.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoBanner(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 text-white px-6 py-4 rounded-md shadow-xl ${
              toastType === 'error' 
                ? 'bg-[#5fa6d9] shadow-[#1e4663]/20' 
                : 'bg-emerald-600 shadow-emerald-900/20'
            }`}
          >
            {toastType === 'error' ? (
              <AlertCircle className="w-5 h-5 text-[#e0f0fa] animate-bounce" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-100" />
            )}
            <span className="font-semibold">{toastMessage}</span>
          </motion.div>
        )}

        {/* Modern Link Modal */}
        {isLinkModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Link className="w-5 h-5 text-[#5fa6d9]" />
                  Insert URL Link
                </h3>
                <button 
                  type="button" 
                  onClick={() => setIsLinkModalOpen(false)}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Link Text</label>
                  <input 
                    type="text" 
                    value={modalLinkText}
                    onChange={(e) => setModalLinkText(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] focus:ring-1 focus:ring-[#5fa6d9] text-slate-900 dark:text-white"
                    placeholder="e.g. Visit Beautiful Amalfi Coast"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">URL Address</label>
                  <input 
                    type="text" 
                    value={modalLinkUrl}
                    onChange={(e) => setModalLinkUrl(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] focus:ring-1 focus:ring-[#5fa6d9] text-slate-900 dark:text-white"
                    placeholder="https://example.com"
                    autoFocus
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleInsertLink}
                  className="px-5 py-2 text-sm font-semibold bg-[#5fa6d9] hover:bg-[#4b95cc] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Insert Link
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modern Image Modal */}
        {isImageModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden my-8"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Image className="w-5 h-5 text-[#5fa6d9]" />
                  Insert Travel Image
                </h3>
                <button 
                  type="button" 
                  onClick={() => setIsImageModalOpen(false)}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Upload Image Section */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Upload your Image</p>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-md p-8 text-center flex flex-col items-center justify-center transition-all ${
                      isDragging 
                        ? 'border-[#5fa6d9] bg-[#5fa6d9]/5' 
                        : modalImageUrl 
                          ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {modalImageUrl ? (
                      <div className="space-y-4 w-full max-w-sm">
                        <div className="relative h-40 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                          <img src={modalImageUrl} alt="Upload Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setModalImageUrl('');
                              setUploadFileName('');
                            }}
                            className="absolute top-2 right-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full p-1.5 transition-colors"
                            title="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {uploadFileName && (
                          <p className="text-xs text-slate-500 font-medium truncate">
                            File: {uploadFileName}
                          </p>
                        )}
                      </div>
                    ) : (
                      <label className="cursor-pointer group flex flex-col items-center">
                        <div className="p-4 bg-[#f0f7fc] dark:bg-[#102738]/20 rounded-full text-[#5fa6d9] group-hover:scale-110 transition-transform mb-4">
                          <Upload className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Drag and drop your image here, or <span className="text-[#5fa6d9] dark:text-[#5fa6d9] hover:underline">browse</span>
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Supports PNG, JPG, JPEG, GIF or WEBP (Max 5MB)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleModalImageFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase">Or Custom Image URL</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Image URL Address</label>
                    <input 
                      type="text" 
                      value={modalImageUrl}
                      onChange={(e) => {
                        setModalImageUrl(e.target.value);
                        if (uploadFileName) setUploadFileName('');
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] focus:ring-1 focus:ring-[#5fa6d9] text-slate-900 dark:text-white"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alt Text / Description</label>
                    <input 
                      type="text" 
                      value={modalImageAlt}
                      onChange={(e) => setModalImageAlt(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5fa6d9] focus:ring-1 focus:ring-[#5fa6d9] text-slate-900 dark:text-white"
                      placeholder="e.g. Sun-drenched cliffs of Amalfi Coast"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={() => handleInsertImage()}
                  className="px-5 py-2 text-sm font-semibold bg-[#5fa6d9] hover:bg-[#4b95cc] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Insert Image
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modern Table Modal */}
        {isTableModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Table className="w-5 h-5 text-[#5fa6d9]" />
                  Insert Table Grid
                </h3>
                <button 
                  type="button" 
                  onClick={() => setIsTableModalOpen(false)}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6 flex flex-col items-center">
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold mb-3">
                    Drag or Click grid to select size: 
                    <span className="text-[#5fa6d9] font-bold ml-1.5">
                      {hoverGridRow || modalTableRows} x {hoverGridCol || modalTableCols}
                    </span>
                  </p>
                  
                  {/* Grid Selector */}
                  <div className="grid grid-cols-5 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-md border border-slate-100 dark:border-slate-800">
                    {Array.from({ length: 5 }).map((_, rIdx) => (
                      <div key={rIdx} className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, cIdx) => {
                          const r = rIdx + 1;
                          const c = cIdx + 1;
                          const isHovered = r <= hoverGridRow && c <= hoverGridCol;
                          const isSelected = !hoverGridRow && r <= modalTableRows && c <= modalTableCols;
                          return (
                            <button
                              key={cIdx}
                              type="button"
                              onMouseEnter={() => {
                                setHoverGridRow(r);
                                setHoverGridCol(c);
                              }}
                              onMouseLeave={() => {
                                setHoverGridRow(0);
                                setHoverGridCol(0);
                              }}
                              onClick={() => {
                                setModalTableRows(r);
                                setModalTableCols(c);
                                handleInsertTable(r, c);
                              }}
                              className={`w-10 h-10 rounded-md border transition-all ${
                                isHovered || isSelected
                                  ? 'bg-[#5fa6d9]/20 border-[#5fa6d9] scale-[1.05] shadow-sm shadow-[#5fa6d9]/10'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Rows</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10"
                      value={modalTableRows}
                      onChange={(e) => setModalTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Columns</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10"
                      value={modalTableCols}
                      onChange={(e) => setModalTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsTableModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={() => handleInsertTable(modalTableRows, modalTableCols)}
                  className="px-5 py-2 text-sm font-semibold bg-[#5fa6d9] hover:bg-[#4b95cc] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Insert Table
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modern Color Palette Modal */}
        {isColorModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#5fa6d9]" />
                  Text Highlight Color
                </h3>
                <button 
                  type="button" 
                  onClick={() => setIsColorModalOpen(false)}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Palette Colors</p>
                  <div className="grid grid-cols-10 gap-2">
                    {COLOR_GRID_ROWS.flat().map((color, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInsertColor(color)}
                        className="w-7 h-7 rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-sm cursor-pointer hover:scale-115 active:scale-90 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5fa6d9]"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-150 dark:border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Custom Color</p>
                  
                  <div className="flex items-center gap-3">
                    {/* Native color picker trigger */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => customColorInputRef.current?.click()}
                        className="w-10 h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer group shadow-sm"
                        title="Choose Color"
                      >
                        <div 
                          className="w-6 h-6 rounded-lg shadow-inner transition-transform group-hover:scale-110" 
                          style={{ backgroundColor: customColor }} 
                        />
                      </button>
                      <input
                        type="color"
                        ref={customColorInputRef}
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="absolute inset-0 opacity-0 w-0 h-0 pointer-events-none"
                      />
                    </div>

                    {/* Eyedropper API (if supported) */}
                    {typeof window !== 'undefined' && 'EyeDropper' in window && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            // @ts-ignore
                            const eyeDropper = new window.EyeDropper();
                            const result = await eyeDropper.open();
                            setCustomColor(result.sRGBHex);
                          } catch (err) {
                            console.log('Eyedropper cancelled or failed', err);
                          }
                        }}
                        className="w-10 h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer text-slate-500 dark:text-slate-400 shadow-sm"
                        title="Eye Dropper"
                      >
                        <Pipette className="w-5 h-5" />
                      </button>
                    )}

                    {/* Text Hex Code Input */}
                    <div className="flex-1 flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">#</span>
                        <input
                          type="text"
                          value={customColor.startsWith('#') ? customColor.substring(1) : customColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 6) {
                              setCustomColor('#' + val);
                            }
                          }}
                          placeholder="E11D48"
                          maxLength={6}
                          className="w-full pl-6 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-mono font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#5fa6d9] focus:ring-1 focus:ring-[#5fa6d9] transition-colors uppercase"
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleInsertColor(customColor)}
                        className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsColorModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modern AI Co-Writer Modal */}
        {isAiModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm md:text-base">
                    <GeminiIcon className="w-5 h-5 shrink-0 animate-pulse" />
                    AI Co-Writer Assistant
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#5fa6d9]/10 text-[#5fa6d9] dark:text-[#5fa6d9] font-bold px-2 py-0.5 rounded-full">
                      Gemini 3.5 Flash
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                      Ready to write
                    </span>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsAiModalOpen(false)}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Content (Split screen) */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                
                {/* Left Side: Parameters Form */}
                <div className="w-full md:w-1/2 p-6 border-r border-slate-100 dark:border-slate-800 overflow-y-auto space-y-5">
                  
                  {/* Action Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Step 1: Choose Action
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: 'generate',
                          title: 'Generate Post',
                          desc: 'Create a brand new post from a brief description',
                          icon: GeminiIcon
                        },
                        {
                          id: 'improve',
                          title: 'Polish Draft',
                          desc: 'Fix grammar, polish flow, and enhance vocabulary',
                          icon: Wand2
                        },
                        {
                          id: 'continue',
                          title: 'Continue writing',
                          desc: 'Read the draft and write the next logical section',
                          icon: ChevronDown
                        }
                      ].map((act) => {
                        const Icon = act.icon;
                        const isSelected = aiAction === act.id;
                        return (
                          <button
                            key={act.id}
                            type="button"
                            onClick={() => {
                              setAiAction(act.id as any);
                              if (act.id === 'generate') {
                                setAiPrompt('');
                              } else if (act.id === 'improve') {
                                const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
                                const sel = textarea ? content.substring(textarea.selectionStart, textarea.selectionEnd) : '';
                                setAiPrompt(sel ? `Refine and improve:\n"${sel.substring(0, 80)}${sel.length > 80 ? '...' : ''}"` : 'Improve grammar, tone, and polish general flow.');
                              } else {
                                setAiPrompt('Write the next logical section detailing key takeaways.');
                              }
                            }}
                            className={`p-3 text-left rounded-md border-2 transition-all flex flex-col justify-between h-24 cursor-pointer ${
                              isSelected
                                ? 'border-[#5fa6d9] bg-[#f0f7fc]/40 dark:bg-[#102738]/10 text-slate-800 dark:text-slate-100 shadow-md ring-2 ring-[#5fa6d9]/20'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-bold text-xs">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#5fa6d9]' : 'text-slate-400'}`} />
                              <span>{act.title}</span>
                            </div>
                            <span className="text-[10px] leading-snug text-slate-400 dark:text-slate-500 font-medium">
                              {act.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Prompt Textarea */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>{aiAction === 'generate' ? 'Step 2: Describe your topic' : 'Step 2: Provide Instructions'}</span>
                      {aiAction === 'generate' && (
                        <span className="text-[10px] text-[#5fa6d9] font-bold uppercase animate-pulse">
                          ✨ Tap an idea to start
                        </span>
                      )}
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={aiAction === 'generate' ? 3 : 4}
                      className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#5fa6d9] focus:ring-1 focus:ring-[#5fa6d9] text-slate-900 dark:text-white font-sans placeholder:text-slate-400 shadow-inner"
                      placeholder={
                        aiAction === 'generate'
                          ? "Describe what you want to write about. e.g., A review of the best authentic ramen bars in Tokyo with local tips."
                          : "How should the AI modify this text? e.g., Make it read more adventurous, elaborate with rich sensory details, and fix errors."
                      }
                    />

                    {/* Quick Starters */}
                    {aiAction === 'generate' && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block">Topic Inspiration:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {INSPIRATION_STARTERS.map((starter, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => {
                                setAiPrompt(starter.prompt);
                              }}
                              className="text-[10.5px] font-semibold text-[#5fa6d9] dark:text-[#5fa6d9] bg-[#f0f7fc]/80 dark:bg-[#102738]/20 hover:bg-[#e0f0fa] dark:hover:bg-[#102738]/40 border border-[#e0f0fa] dark:border-[#1e4663]/30 px-3 py-1 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm"
                            >
                              {starter.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Styling Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Tone Selector */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Step {aiAction === 'generate' ? '3' : '3'}: Tone of Voice
                      </label>
                      <select
                        value={aiTone}
                        onChange={(e) => setAiTone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-md px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#5fa6d9] focus:ring-1 focus:ring-[#5fa6d9] text-slate-900 dark:text-white cursor-pointer"
                      >
                        <option value="creative">Creative & Descriptive 🎨</option>
                        <option value="professional">Professional & Informative 💼</option>
                        <option value="casual">Friendly & Conversational 😊</option>
                        <option value="adventurous">Exciting & Adventurous ⛰️</option>
                        <option value="journalistic">Analytical & Direct 📰</option>
                      </select>
                    </div>

                    {/* Length Option (only for generation) */}
                    {aiAction === 'generate' && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Step 4: Target Length
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { key: 'short', label: 'Short', desc: '~300 words' },
                            { key: 'medium', label: 'Medium', desc: '~700 words' },
                            { key: 'long', label: 'Long', desc: '~1200 words' },
                          ].map((len) => (
                            <button
                              key={len.key}
                              type="button"
                              onClick={() => setAiLength(len.key)}
                              className={`py-1.5 rounded-md border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                                aiLength === len.key
                                  ? 'bg-[#f0f7fc] dark:bg-[#102738]/20 border-[#5fa6d9] text-[#5fa6d9] dark:text-[#5fa6d9] shadow-sm ring-1 ring-[#5fa6d9]/10'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                              }`}
                            >
                              <span className="text-[11px] font-bold">{len.label}</span>
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">{len.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Generate Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isAiLoading || !aiPrompt.trim()}
                      onClick={handleAiGenerate}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-[#5fa6d9] to-amber-500 hover:from-[#4b95cc] hover:to-amber-600 text-white font-bold rounded-md shadow-lg hover:shadow-[#5fa6d9]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      {isAiLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>AI is drafting your article...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4.5 h-4.5 animate-pulse" />
                          <span>Generate with AI Co-Writer</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Error display */}
                  {aiError && (
                    <div className="p-4 bg-[#f0f7fc] dark:bg-[#102738]/20 border border-[#bce1f5] dark:border-[#1e4663]/30 text-[#5fa6d9] dark:text-[#5fa6d9] rounded-md flex items-start gap-3 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <div className="font-semibold">{aiError}</div>
                    </div>
                  )}

                </div>

                {/* Right Side: AI Output Preview */}
                <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-950/50 flex flex-col h-full overflow-hidden">
                  
                  {/* Result Header with view controls */}
                  <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center flex-shrink-0">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Writer Outcome</span>
                    {aiGeneratedContent && (
                      <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/55 dark:border-slate-700/50">
                          <button
                            type="button"
                            onClick={() => setAiResultTab('source')}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                              aiResultTab === 'source'
                                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            Edit Text
                          </button>
                          <button
                            type="button"
                            onClick={() => setAiResultTab('preview')}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                              aiResultTab === 'preview'
                                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            Rich Preview
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-400 font-bold font-mono">
                          {aiGeneratedContent.split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Result body */}
                  <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-slate-50/50 dark:bg-slate-950/20">
                    {isAiLoading ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-400 dark:text-slate-500">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-purple-500/10 border-t-purple-600 rounded-full animate-spin"></div>
                          <GeminiIcon className="w-7 h-7 absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <p className="font-bold animate-pulse text-purple-600 dark:text-purple-400">Gemini is weaving its magic...</p>
                        <p className="text-xs text-slate-400 text-center max-w-xs">Structuring layout headers, tables, bullet items, and fine-tuning typography.</p>
                      </div>
                    ) : aiGeneratedContent ? (
                      <div className="h-full">
                        {aiResultTab === 'source' ? (
                          <textarea
                            value={aiGeneratedContent}
                            onChange={(e) => setAiGeneratedContent(e.target.value)}
                            className="w-full h-full bg-transparent border-0 focus:ring-0 focus:outline-none font-mono text-sm resize-none text-slate-800 dark:text-slate-200"
                            placeholder="Your AI post content goes here..."
                          />
                        ) : (
                          <div 
                            className="prose dark:prose-invert prose-blue max-w-none text-slate-700 dark:text-slate-300 pr-2"
                            dangerouslySetInnerHTML={{ __html: aiGeneratedContent }}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400 dark:text-slate-500">
                        <GeminiIcon className="w-12 h-12 animate-pulse" />
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Your AI Copywriter Is Ready</h4>
                        <p className="text-xs max-w-xs leading-relaxed">
                          Choose an action, enter your prompt or select an idea, then click <strong className="text-[#5fa6d9]">Generate</strong>. You can fully edit or preview the generated post here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-150 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancel
                </button>
                
                {aiGeneratedContent && (
                  <div className="flex flex-wrap items-center gap-2">
                    {aiAction === 'generate' ? (
                      <>
                        <div className="flex flex-col items-end mr-2 hidden lg:flex">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Insert Option:</span>
                          <span className="text-[9px] text-slate-500 font-medium">Replaces existing title & draft</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleInsertAiContent('replace-all')}
                          className="px-4 py-2.5 text-xs font-bold bg-[#5fa6d9] hover:bg-[#4b95cc] text-white rounded-md transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          Replace Entire Draft & Title
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleInsertAiContent('append')}
                          className="px-4 py-2.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-100 rounded-md border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                        >
                          Append to Current Draft
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-end mr-2 hidden lg:flex">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Insert Option:</span>
                          <span className="text-[9px] text-slate-500 font-medium">Overwrites your selection</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleInsertAiContent('replace-selection')}
                          className="px-4 py-2.5 text-xs font-bold bg-[#5fa6d9] hover:bg-[#4b95cc] text-white rounded-md transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          Replace Selection / Highlight
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleInsertAiContent('append')}
                          className="px-4 py-2.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-100 rounded-md border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                        >
                          Append to Current Draft
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
        {/* Preview Modal */}
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Post Preview</h3>
                    <p className="text-[11px] text-slate-400">Live preview of how readers will see this post</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {/* Category & City */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 rounded-full text-xs font-bold border border-violet-200/60 dark:border-violet-800/40">
                    {category}
                  </span>
                  {city && (
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold">
                      📍 {city}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    By {authorName || 'Admin'} • {publishedAt ? new Date(publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Draft'}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {title || 'Untitled Post'}
                </h1>

                {/* Excerpt */}
                {excerpt && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-sm text-slate-600 dark:text-slate-300 italic">
                    {excerpt}
                  </div>
                )}

                {/* Cover Image */}
                {imageUrl && (
                  <div className="rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800">
                    <img
                      src={imageUrl}
                      alt={title || 'Featured'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Content Body */}
                <div 
                  className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200"
                  dangerouslySetInnerHTML={{ __html: editor ? editor.getHTML() : '' }}
                />

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-slate-400 font-semibold mr-1">Tags:</span>
                    {tags.map((t, i) => (
                      <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToolbarButton({ icon, onClick, title, label, isActive }: { icon: React.ReactNode, onClick?: () => void, title?: string, label?: string, isActive?: boolean }) {
  return (
    <button 
      type="button" 
      title={title || label}
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent editor from losing focus
        onClick?.();
      }}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer border ${
        isActive 
          ? 'bg-[#5fa6d9] text-white shadow-md shadow-[#5fa6d9]/20 border-[#5fa6d9]' 
          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:bg-slate-750 hover:text-slate-900 dark:hover:text-white transition-colors'
      }`}
    >
      {icon}
      {label && <span className="text-[11px] font-bold">{label}</span>}
    </button>
  );
}

function GeminiIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gemini-icon-grad" x1="0.15" y1="0.15" x2="0.85" y2="0.85">
          <stop offset="0%" stopColor="#ea4335" />
          <stop offset="30%" stopColor="#a855f7" />
          <stop offset="55%" stopColor="#4285f4" />
          <stop offset="80%" stopColor="#34a853" />
          <stop offset="100%" stopColor="#fbbc05" />
        </linearGradient>
      </defs>
      <path 
        d="M 50 5 C 50 28, 28 50, 5 50 C 28 50, 50 72, 50 95 C 50 72, 72 50, 95 50 C 72 50, 50 28, 50 5 Z" 
        fill="url(#gemini-icon-grad)" 
      />
      <path 
        d="M 78 8 C 78 15, 75 22, 64 22 C 75 22, 78 29, 78 36 C 78 29, 81 22, 92 22 C 81 22, 78 15, 78 8 Z" 
        fill="url(#gemini-icon-grad)" 
        opacity="0.85"
      />
    </svg>
  );
}
