import React, { useRef, useEffect, useState } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Quote,
  Code,
  List, 
  ListOrdered, 
  Indent,
  Outdent,
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Link as LinkIcon, 
  Image as ImageIcon, 
  Table as TableIcon,
  Type, 
  Palette,
  Eraser, 
  Eye, 
  Code2,
  ChevronDown,
  X,
  Plus,
  Minus,
  ArrowUpDown,
  Maximize2,
  Minimize2,
  HelpCircle,
  Check,
  Sparkles,
  RotateCcw,
  RotateCw,
  FileText,
  AlertCircle,
  Info,
  CheckCircle2,
  ExternalLink,
  Copy,
  PenTool,
  Layers,
  Divide,
  Trash2
} from "lucide-react";
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
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';

export interface PackageTemplate {
  id: string;
  title: string;
  description: string;
  badge: string;
  html: string;
}

export const PACKAGE_TEMPLATES: PackageTemplate[] = [
  {
    id: "full-package",
    title: "Complete Tour & Activity Package",
    description: "Highlights, inclusions, exclusions, venue rules, and age policies.",
    badge: "Recommended",
    html: `<h3>🌟 Package Highlights</h3>
<ul>
  <li>Priority entrance tickets with designated fast-track access</li>
  <li>Multilingual smart audio guide included (EN, FR, ES, DE, IT)</li>
  <li>Access to permanent collections, temporary exhibitions, and rooftop terrace</li>
</ul>

<h3>✅ What's Included</h3>
<ul>
  <li>Full general admission ticket</li>
  <li>Fast-track security line privileges</li>
  <li>Complimentary digital city map & interactive exhibition guide</li>
</ul>

<h3>❌ What's Excluded</h3>
<ul>
  <li>Food, snacks, and personal beverage purchases</li>
  <li>Hotel pickup and drop-off ground transfers</li>
  <li>Gratuities (optional)</li>
</ul>

<div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
  <p style="margin: 0; color: #1e40af; font-size: 13px;"><strong>ℹ️ Know Before You Go:</strong> Please bring a valid government-issued photo ID matching the booking voucher. Arrive at least 15 minutes before your scheduled entry time slot.</p>
</div>

<h3>👶 Age & Accessibility Policy</h3>
<p>Adult tickets apply to visitors aged 18 and above. Youth aged 4–17 require a discounted youth ticket and must be accompanied by an adult. Infants aged 0–3 enter free with a reserved infant pass.</p>`
  },
  {
    id: "inclusions-exclusions",
    title: "Inclusions & Exclusions Breakdown",
    description: "Bulleted lists showing what is covered and not covered.",
    badge: "Essential",
    html: `<h3>✅ What's Included</h3>
<ul>
  <li>Guaranteed admission entry ticket for your selected timeslot</li>
  <li>Professional licensed local guide or audio headset</li>
  <li>Skip-the-ticket-line fast pass</li>
</ul>

<h3>❌ What's Excluded</h3>
<ul>
  <li>Hotel pick-up and drop-off</li>
  <li>Food, snacks, and drinks</li>
  <li>Gratuities / Tips for guide</li>
</ul>`
  },
  {
    id: "important-notice",
    title: "Important Venue Notice / Advisory",
    description: "Highlighted callout box for security requirements and baggage rules.",
    badge: "Callout",
    html: `<div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
  <p style="margin: 0; color: #92400e; font-size: 13px;"><strong>⚠️ Important Venue Requirements:</strong> Bags and backpacks exceeding 40x30x20cm are strictly prohibited inside the venue and must be deposited in the cloakroom prior to entry. Flash photography and tripods are not permitted.</p>
</div>`
  },
  {
    id: "age-policy",
    title: "Age & Eligibility Policy",
    description: "Clear breakdown of adult, youth, child, and infant policies.",
    badge: "Policy",
    html: `<h3>👶 Age Policy & Requirements</h3>
<ul>
  <li><strong>Adults (18+):</strong> Standard ticket required.</li>
  <li><strong>Youth & Students (4–17):</strong> Reduced youth ticket with valid photo ID.</li>
  <li><strong>Infants (0–3):</strong> Free admission with complimentary infant booking.</li>
  <li>All visitors under 16 years of age must be accompanied by an adult aged 18 or older.</li>
</ul>`
  },
  {
    id: "meeting-schedule",
    title: "Meeting Point & Check-in Logistics",
    description: "Arrival instructions, meeting place coordinates, and late arrival rules.",
    badge: "Logistics",
    html: `<h3>⏰ Meeting Point & Check-in Logistics</h3>
<ul>
  <li><strong>Meeting Point:</strong> Main Concourse beside the Tiqsey Information Desk.</li>
  <li><strong>Arrival Time:</strong> Please arrive strictly 15 minutes before your reserved slot.</li>
  <li><strong>Late Policy:</strong> Due to scheduled entry regulations, late arrivals cannot be accommodated and are non-refundable.</li>
</ul>`
  },
  {
    id: "cancellation-guarantee",
    title: "Free Cancellation Guarantee",
    description: "Highlight customer peace-of-mind with a 24-hour refund badge.",
    badge: "Confidence",
    html: `<div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
  <p style="margin: 0; color: #065f46; font-size: 13px;"><strong>🛡️ Free Cancellation Available:</strong> Cancel up to 24 hours in advance of your selected date for a 100% full refund with instant processing.</p>
</div>`
  }
];

interface WysiwygEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  helperText?: string;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = "Start typing package details, policies, and exclusions...",
  helperText
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"editor" | "preview" | "html">("editor");
  const [isFocused, setIsFocused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Popover / Dropdown States
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showLineHeightDropdown, setShowLineHeightDropdown] = useState(false);
  const [showTextColorDropdown, setShowTextColorDropdown] = useState(false);
  const [showBgColorDropdown, setShowBgColorDropdown] = useState(false);
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
  const [showCalloutDropdown, setShowCalloutDropdown] = useState(false);

  // Modals
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Form Inputs
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const blockTypes = [
    { name: "Normal Text", label: "Normal Text", tag: "paragraph", size: "14px", desc: "Standard body copy" },
    { name: "Heading 1", label: "Heading 1", tag: "h1", size: "24px", desc: "Main section header" },
    { name: "Heading 2", label: "Heading 2", tag: "h2", size: "20px", desc: "Subsection title" },
    { name: "Heading 3", label: "Heading 3", tag: "h3", size: "16px", desc: "Feature / topic heading" },
    { name: "Blockquote", label: "Blockquote", tag: "blockquote", size: "14px", desc: "Quote / highlighted statement" },
    { name: "Code Block", label: "Code Block", tag: "codeBlock", size: "13px", desc: "Monospaced technical block" },
  ];

  const fonts = [
    { name: "Default Sans", css: "" },
    { name: "Editorial Serif", css: "Georgia, Cambria, 'Times New Roman', Times, serif" },
    { name: "Technical Mono", css: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" },
    { name: "Modern System", css: "ui-sans-serif, system-ui, -apple-system, sans-serif" },
  ];

  const lineHeights = [
    { label: "1.2 Compact", value: "1.2" },
    { label: "1.5 Standard", value: "1.5" },
    { label: "1.7 Relaxed", value: "1.7" },
    { label: "2.0 Double", value: "2.0" },
  ];

  const textColors = [
    { name: "Dark Slate", value: "#1e293b" },
    { name: "Muted Gray", value: "#64748b" },
    { name: "Sky Blue", value: "#0284c7" },
    { name: "Royal Indigo", value: "#4f46e5" },
    { name: "Emerald Green", value: "#059669" },
    { name: "Amber Orange", value: "#d97706" },
    { name: "Rose Red", value: "#e11d48" },
    { name: "Purple", value: "#9333ea" },
  ];

  const bgColors = [
    { name: "None", value: "transparent" },
    { name: "Yellow Aura", value: "#fef08a" },
    { name: "Green Mint", value: "#bbf7d0" },
    { name: "Sky Mist", value: "#bae6fd" },
    { name: "Rose Blush", value: "#fecdd3" },
    { name: "Peach Glow", value: "#fed7aa" },
    { name: "Lavender", value: "#e9d5ff" },
    { name: "Slate Mist", value: "#f1f5f9" },
  ];

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapUnderline,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#5fa6d9] hover:underline font-semibold cursor-pointer',
        },
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full my-4 shadow-sm border border-slate-200 dark:border-slate-800',
        },
      }),
      TiptapTable.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-slate-300 dark:border-slate-700 w-full my-4 text-xs',
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
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    editorProps: {
      attributes: {
        class: 'w-full bg-white dark:bg-slate-950 px-5 py-4 text-sm font-normal text-slate-700 dark:text-slate-200 focus:outline-none min-h-[220px] max-h-[600px] overflow-y-auto prose prose-slate dark:prose-invert max-w-none leading-relaxed select-text',
        style: 'min-height: 220px;',
      },
    },
  });

  // Sync content from parent to Tiptap editor
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  // Clean format helper
  const clearFormatting = () => {
    if (!editor) return;
    editor.chain().focus().clearNodes().unsetAllMarks().unsetFontFamily().unsetFontSize().unsetLineHeight().unsetParagraphSpacing().run();
  };

  // Close all popovers when clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".wysiwyg-popover-container")) {
        setShowBlockDropdown(false);
        setShowFontDropdown(false);
        setShowLineHeightDropdown(false);
        setShowTextColorDropdown(false);
        setShowBgColorDropdown(false);
        setShowTemplatesDropdown(false);
        setShowCalloutDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Escape key exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        setShowBlockDropdown(false);
        setShowFontDropdown(false);
        setShowLineHeightDropdown(false);
        setShowTextColorDropdown(false);
        setShowBgColorDropdown(false);
        setShowTemplatesDropdown(false);
        setShowCalloutDropdown(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Active Block Label
  const getFormatLabel = () => {
    if (!editor) return 'Normal Text';
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    if (editor.isActive('blockquote')) return 'Blockquote';
    if (editor.isActive('codeBlock')) return 'Code Block';
    return 'Normal Text';
  };

  // Active Font Label
  const getActiveFontLabel = () => {
    if (!editor) return 'Default Sans';
    const currentFont = editor.getAttributes('textStyle').fontFamily;
    if (!currentFont) return 'Default Sans';
    const found = fonts.find(f => f.css === currentFont);
    return found ? found.name : currentFont;
  };

  // Active Font Size
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
    const next = Math.max(10, Math.min(64, current + amount));
    editor.chain().focus().setFontSize(`${next}px`).run();
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || !linkUrl) return;

    if (linkText) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-[#5fa6d9] underline font-semibold hover:text-[#3884b6]">${linkText}</a>`;
      editor.chain().focus().insertContent(linkHtml).run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }

    setLinkUrl("");
    setLinkText("");
    setShowLinkModal(false);
  };

  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || !imageUrl) return;

    const imgHtml = `<img src="${imageUrl}" alt="${imageAlt || "Asset Image"}" class="max-w-full rounded-lg border border-slate-200 dark:border-slate-800 my-4 shadow-sm inline-block" />`;
    editor.chain().focus().insertContent(imgHtml).run();

    setImageUrl("");
    setImageAlt("");
    setShowImageModal(false);
  };

  const handleInsertTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    let tableHtml = `<table class="min-w-full border-collapse border border-slate-300 dark:border-slate-700 my-4 text-xs"><tbody>`;
    for (let r = 0; r < tableRows; r++) {
      tableHtml += `<tr>`;
      for (let c = 0; c < tableCols; c++) {
        tableHtml += `<td class="border border-slate-300 dark:border-slate-700 p-2 font-medium bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-w-[60px]">${r === 0 ? `Header ${c + 1}` : `Row ${r} Col ${c + 1}`}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table><p>&nbsp;</p>`;

    editor.chain().focus().insertContent(tableHtml).run();
    setShowTableModal(false);
  };

  const handleInsertCallout = (type: "info" | "warning" | "success") => {
    if (!editor) return;
    let calloutHtml = "";
    if (type === "info") {
      calloutHtml = `<div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 16px 0;"><p style="margin: 0; color: #1e40af; font-size: 13px;"><strong>ℹ️ Information Notice:</strong> Enter important details, arrival notes, or voucher requirements here.</p></div><p></p>`;
    } else if (type === "warning") {
      calloutHtml = `<div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 16px 0;"><p style="margin: 0; color: #92400e; font-size: 13px;"><strong>⚠️ Important Requirement:</strong> Enter baggage limitations, dress codes, or security check instructions here.</p></div><p></p>`;
    } else if (type === "success") {
      calloutHtml = `<div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 16px 0;"><p style="margin: 0; color: #065f46; font-size: 13px;"><strong>🛡️ Free Cancellation Guarantee:</strong> Cancel up to 24 hours before your visit for a full 100% refund.</p></div><p></p>`;
    }
    editor.chain().focus().insertContent(calloutHtml).run();
    setShowCalloutDropdown(false);
  };

  const handleApplyTemplate = (tpl: PackageTemplate, mode: "replace" | "append") => {
    if (!editor) return;
    if (mode === "replace") {
      editor.commands.setContent(tpl.html);
      onChange(tpl.html);
    } else {
      editor.chain().focus().insertContent(`<p></p>` + tpl.html).run();
    }
    setShowTemplatesDropdown(false);
  };

  const handleCopyHtml = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const wordCount = editor ? (editor.getText().trim() === '' ? 0 : editor.getText().trim().split(/\s+/).length) : 0;
  const characterCount = editor ? editor.getText().length : 0;
  const minRead = Math.max(1, Math.ceil(wordCount / 200));

  const isEditorEmpty = !value || value.trim() === "" || value === "<p></p>";

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-[9999] bg-white dark:bg-slate-950 flex flex-col p-6 animate-in fade-in duration-200"
    : `w-full rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-950 overflow-hidden shadow-xs ${
        isFocused 
          ? "border-[#5fa6d9] ring-2 ring-[#5fa6d9]/15" 
          : "border-slate-200/90 dark:border-slate-800"
      }`;

  return (
    <div ref={containerRef} className="w-full space-y-2.5 relative wysiwyg-popover-container font-sans">
      {/* TOP HEADER / BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#5fa6d9]/10 dark:bg-[#5fa6d9]/20 flex items-center justify-center text-[#5fa6d9]">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {label}
            </label>
            {helperText && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                {helperText}
              </p>
            )}
          </div>
        </div>
        
        {/* Right Header Actions: Mode Switcher & Quick Templates */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Quick Templates Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowTemplatesDropdown(!showTemplatesDropdown);
                setShowBlockDropdown(false);
                setShowFontDropdown(false);
                setShowCalloutDropdown(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 transition-colors cursor-pointer shadow-2xs"
              title="Insert pre-structured package sections & templates"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Quick Templates</span>
              <ChevronDown className="w-3 h-3 text-amber-600/70" />
            </button>

            {showTemplatesDropdown && (
              <div className="absolute right-0 mt-1.5 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-[999] overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Package Presets
                  </span>
                  <span className="text-[10px] text-slate-400">1-click insert</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {PACKAGE_TEMPLATES.map((tpl) => (
                    <div key={tpl.id} className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {tpl.title}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                          {tpl.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                        {tpl.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApplyTemplate(tpl, "append")}
                          className="flex-1 py-1 px-2 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center cursor-pointer"
                        >
                          + Append to End
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyTemplate(tpl, "replace")}
                          className="flex-1 py-1 px-2 text-[10px] font-bold rounded bg-[#5fa6d9]/15 text-[#5fa6d9] hover:bg-[#5fa6d9]/25 transition-colors text-center cursor-pointer"
                        >
                          Replace All
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("editor")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === "editor"
                  ? "bg-white dark:bg-slate-850 text-[#5fa6d9] shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <PenTool className="w-3 h-3" />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === "preview"
                  ? "bg-white dark:bg-slate-850 text-[#5fa6d9] shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Customer Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("html")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === "html"
                  ? "bg-white dark:bg-slate-850 text-[#5fa6d9] shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>HTML</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className={containerClasses}>
        
        {/* Fullscreen Mode Top Bar */}
        {isFullscreen && (
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800 mb-3 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                Full-Focus Mode: {label}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              title="Exit Fullscreen (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* UNIFIED STREAMLINED TOOLBAR (Only shown in editor mode) */}
        {viewMode === "editor" && (
          <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/70 dark:border-slate-800/80 select-none">
            
            {/* UNDO / REDO GROUP */}
            <div className="flex items-center">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Undo (Ctrl+Z)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Redo (Ctrl+Y)"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-750 mx-0.5 shrink-0" />

            {/* BLOCK FORMAT DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowBlockDropdown(!showBlockDropdown);
                  setShowFontDropdown(false);
                  setShowLineHeightDropdown(false);
                  setShowCalloutDropdown(false);
                }}
                className="flex items-center justify-between gap-2 px-2.5 py-1.5 min-w-[125px] bg-white dark:bg-slate-850 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg shadow-2xs transition-all cursor-pointer"
                title="Block Paragraph / Heading Type"
              >
                <span className="truncate">{getFormatLabel()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showBlockDropdown && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-[999] overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
                  {blockTypes.map((type) => (
                    <button
                      key={type.name}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        if (!editor) return;
                        if (type.tag === "paragraph") {
                          editor.chain().focus().setParagraph().run();
                        } else if (type.tag === "h1") {
                          editor.chain().focus().toggleHeading({ level: 1 }).run();
                        } else if (type.tag === "h2") {
                          editor.chain().focus().toggleHeading({ level: 2 }).run();
                        } else if (type.tag === "h3") {
                          editor.chain().focus().toggleHeading({ level: 3 }).run();
                        } else if (type.tag === "blockquote") {
                          editor.chain().focus().toggleBlockquote().run();
                        } else if (type.tag === "codeBlock") {
                          editor.chain().focus().toggleCodeBlock().run();
                        }
                        setShowBlockDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between cursor-pointer border-b border-slate-100 dark:border-slate-800/60 last:border-0 ${
                        getFormatLabel() === type.label ? "bg-slate-50 dark:bg-slate-800/60 text-[#5fa6d9]" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{type.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{type.desc}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-mono">
                          {type.size}
                        </span>
                        {getFormatLabel() === type.label && <Check className="w-3.5 h-3.5 text-[#5fa6d9]" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FONT FAMILY DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowFontDropdown(!showFontDropdown);
                  setShowBlockDropdown(false);
                  setShowLineHeightDropdown(false);
                  setShowCalloutDropdown(false);
                }}
                className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 min-w-[125px] bg-white dark:bg-slate-850 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg shadow-2xs transition-all cursor-pointer"
                title="Font Family"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Type className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{getActiveFontLabel()}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showFontDropdown && (
                <div className="absolute left-0 mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-[999] overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
                  {fonts.map((f) => (
                    <button
                      key={f.name}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        if (!editor) return;
                        if (f.css === "") {
                          editor.chain().focus().unsetFontFamily().run();
                        } else {
                          editor.chain().focus().setFontFamily(f.css).run();
                        }
                        setShowFontDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer ${
                        getActiveFontLabel() === f.name ? "bg-slate-50 dark:bg-slate-800 text-[#5fa6d9] font-bold" : "text-slate-700 dark:text-slate-300"
                      }`}
                      style={{ fontFamily: f.css }}
                    >
                      <span>{f.name}</span>
                      {getActiveFontLabel() === f.name && <Check className="w-3 h-3 text-[#5fa6d9]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FONT SIZE STEPPER */}
            <div className="flex items-center bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 rounded-lg shadow-2xs overflow-hidden h-[32px]">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleFontSizeChange(-1)}
                className="px-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 h-full flex items-center justify-center transition-colors cursor-pointer border-r border-slate-200/70 dark:border-slate-750"
                title="Decrease Font Size"
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="px-2 text-xs font-bold text-slate-700 dark:text-slate-200 select-none min-w-[32px] text-center">
                {getActiveFontSize()}
              </div>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleFontSizeChange(1)}
                className="px-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 h-full flex items-center justify-center transition-colors cursor-pointer border-l border-slate-200/70 dark:border-slate-750"
                title="Increase Font Size"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-750 mx-0.5 shrink-0" />

            {/* INLINE FORMATTING (B, I, U, S, Code) */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  editor?.isActive('bold') 
                    ? 'bg-[#5fa6d9]/15 text-[#5fa6d9] font-bold ring-1 ring-[#5fa6d9]/30' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  editor?.isActive('italic') 
                    ? 'bg-[#5fa6d9]/15 text-[#5fa6d9] font-bold ring-1 ring-[#5fa6d9]/30' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  editor?.isActive('underline') 
                    ? 'bg-[#5fa6d9]/15 text-[#5fa6d9] font-bold ring-1 ring-[#5fa6d9]/30' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  editor?.isActive('strike') 
                    ? 'bg-[#5fa6d9]/15 text-[#5fa6d9] font-bold ring-1 ring-[#5fa6d9]/30' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title="Strikethrough"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleCode().run()}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  editor?.isActive('code') 
                    ? 'bg-[#5fa6d9]/15 text-[#5fa6d9] font-bold ring-1 ring-[#5fa6d9]/30' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title="Inline Code"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-750 mx-0.5 shrink-0" />

            {/* TEXT COLOR & HIGHLIGHT PICKERS */}
            <div className="flex items-center gap-0.5">
              {/* Text Color */}
              <div className="relative">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setShowTextColorDropdown(!showTextColorDropdown);
                    setShowBgColorDropdown(false);
                    setShowBlockDropdown(false);
                    setShowFontDropdown(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Text Foreground Color"
                >
                  <Palette className="w-3.5 h-3.5 text-indigo-500" />
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {showTextColorDropdown && (
                  <div className="absolute left-0 mt-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-[999] grid grid-cols-4 gap-1.5 animate-in fade-in slide-in-from-top-1">
                    {textColors.map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          editor?.chain().focus().setColor(col.value).run();
                          setShowTextColorDropdown(false);
                        }}
                        className="w-6 h-6 rounded-md border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-transform shadow-xs cursor-pointer"
                        style={{ backgroundColor: col.value }}
                        title={col.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Background Highlight */}
              <div className="relative">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setShowBgColorDropdown(!showBgColorDropdown);
                    setShowTextColorDropdown(false);
                    setShowBlockDropdown(false);
                    setShowFontDropdown(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Text Background Highlight"
                >
                  <span className="w-3.5 h-3.5 rounded bg-amber-300 border border-amber-400 block" />
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {showBgColorDropdown && (
                  <div className="absolute left-0 mt-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-[999] grid grid-cols-4 gap-1.5 animate-in fade-in slide-in-from-top-1">
                    {bgColors.map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          if (!editor) return;
                          if (col.value === "transparent") {
                            editor.chain().focus().unsetHighlight().run();
                          } else {
                            editor.chain().focus().toggleHighlight({ color: col.value }).run();
                          }
                          setShowBgColorDropdown(false);
                        }}
                        className="w-6 h-6 rounded-md border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-transform shadow-xs flex items-center justify-center cursor-pointer"
                        style={{ backgroundColor: col.value === "transparent" ? "white" : col.value }}
                        title={col.name}
                      >
                        {col.value === "transparent" && <X className="w-3 h-3 text-rose-500 font-bold" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-750 mx-0.5 shrink-0" />

            {/* ALIGNMENTS */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  editor?.isActive({ textAlign: 'left' }) 
                    ? 'bg-[#5fa6d9]/15 text-[#5fa6d9] font-bold ring-1 ring-[#5fa6d9]/30' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  editor?.isActive({ textAlign: 'center' }) 
                    ? 'bg-[#5fa6d9]/15 text-[#5fa6d9] font-bold ring-1 ring-[#5fa6d9]/30' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  editor?.isActive({ textAlign: 'right' }) 
                    ? 'bg-[#5fa6d9]/15 text-[#5fa6d9] font-bold ring-1 ring-[#5fa6d9]/30' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  editor?.isActive({ textAlign: 'justify' }) 
                    ? 'bg-[#5fa6d9]/15 text-[#5fa6d9] font-bold ring-1 ring-[#5fa6d9]/30' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title="Align Justify"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-750 mx-0.5 shrink-0" />

            {/* LISTS & INDENTS */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  editor?.isActive('bulletList') 
                    ? 'bg-[#5fa6d9]/15 text-[#5fa6d9] font-bold ring-1 ring-[#5fa6d9]/30' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  editor?.isActive('orderedList') 
                    ? 'bg-[#5fa6d9]/15 text-[#5fa6d9] font-bold ring-1 ring-[#5fa6d9]/30' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
                title="Numbered List"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().outdent().run()}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Decrease Indent"
              >
                <Outdent className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().indent().run()}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Increase Indent"
              >
                <Indent className="w-3.5 h-3.5" />
              </button>

              {/* Line Height Spacing */}
              <div className="relative">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setShowLineHeightDropdown(!showLineHeightDropdown);
                    setShowBlockDropdown(false);
                    setShowFontDropdown(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center gap-0.5 transition-colors cursor-pointer"
                  title="Line Spacing (Line Height)"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {showLineHeightDropdown && (
                  <div className="absolute right-0 mt-1.5 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-[999] overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
                    {lineHeights.map((lh) => {
                      const currentLineHeightValue = editor?.getAttributes('textStyle').lineHeight || "1.5";
                      const isActive = currentLineHeightValue === lh.value;
                      return (
                        <button
                          key={lh.value}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            if (!editor) return;
                            editor.chain().focus().setLineHeight(lh.value).run();
                            setShowLineHeightDropdown(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer ${
                            isActive ? "bg-slate-50 dark:bg-slate-800 text-[#5fa6d9] font-bold" : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span>{lh.label}</span>
                          {isActive && <Check className="w-3 h-3 text-[#5fa6d9]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-750 mx-0.5 shrink-0" />

            {/* INSERTS: LINK, IMAGE, TABLE, CALLOUT, HR, QUOTE */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  const selectedText = editor ? editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to) : "";
                  setLinkText(selectedText);
                  setShowLinkModal(true);
                }}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#5fa6d9] hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Insert Link"
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#5fa6d9]" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowImageModal(true)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Insert Image"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowTableModal(true)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Insert Table"
              >
                <TableIcon className="w-3.5 h-3.5 text-amber-500" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Insert Divider Line"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              
              {/* Callout Box Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setShowCalloutDropdown(!showCalloutDropdown);
                    setShowBlockDropdown(false);
                    setShowFontDropdown(false);
                    setShowTemplatesDropdown(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-sky-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center gap-0.5 transition-colors cursor-pointer"
                  title="Insert Highlighted Policy / Notice Callout Box"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {showCalloutDropdown && (
                  <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-[999] overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400">
                      Insert Policy Box
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInsertCallout("info")}
                      className="w-full text-left px-3.5 py-2 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-2 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-500" />
                      <span>Blue Info / Know Before</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertCallout("warning")}
                      className="w-full text-left px-3.5 py-2 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 cursor-pointer"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Amber Warning / Restriction</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertCallout("success")}
                      className="w-full text-left px-3.5 py-2 text-xs text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Green Cancellation Guarantee</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-750 mx-0.5 shrink-0" />

            {/* CLEAR FORMATTING */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={clearFormatting}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Clear All Formatting Styles"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>

          </div>
        )}

        {/* MODAL / POPOVER FORMS (LINK, IMAGE, TABLE, HELP) */}
        {showLinkModal && (
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 text-xs">
            <form onSubmit={handleInsertLink} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-[10px] text-[#5fa6d9]">Insert Hyperlink</span>
                <button type="button" onClick={() => setShowLinkModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="url"
                  placeholder="Target URL (https://...)"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-[#5fa6d9] text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="Display text (optional)"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-[#5fa6d9] text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowLinkModal(false)} className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-3.5 py-1 rounded-lg bg-[#5fa6d9] text-white text-[11px] font-bold hover:bg-[#3884b6] cursor-pointer">
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        )}

        {showImageModal && (
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 text-xs">
            <form onSubmit={handleInsertImage} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-600">Insert Image Asset</span>
                <button type="button" onClick={() => setShowImageModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="url"
                  placeholder="Image URL (https://...)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-[#5fa6d9] text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="Alt description (e.g. Venue floor map)"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-[#5fa6d9] text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowImageModal(false)} className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-3.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 cursor-pointer">
                  Insert Image
                </button>
              </div>
            </form>
          </div>
        )}

        {showTableModal && (
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 text-xs">
            <form onSubmit={handleInsertTable} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-[10px] text-amber-600">Insert Data Table</span>
                <button type="button" onClick={() => setShowTableModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Rows</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={tableRows}
                    onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none text-xs font-semibold"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Columns</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={tableCols}
                    onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowTableModal(false)} className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-[11px] font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-3.5 py-1 rounded-lg bg-amber-600 text-white text-[11px] font-bold hover:bg-amber-700 cursor-pointer">
                  Insert Table
                </button>
              </div>
            </form>
          </div>
        )}

        {/* KEYBOARD SHORTCUTS HELP MODAL */}
        {showHelpModal && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800 mb-3">
              <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <HelpCircle className="w-4 h-4 text-[#5fa6d9]" />
                Editor Shortcuts & Tips
              </span>
              <button type="button" onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-2xs text-[10px] mr-1.5">Ctrl+B</kbd> Bold</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-2xs text-[10px] mr-1.5">Ctrl+I</kbd> Italic</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-2xs text-[10px] mr-1.5">Ctrl+U</kbd> Underline</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-2xs text-[10px] mr-1.5">Ctrl+Z</kbd> Undo</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-2xs text-[10px] mr-1.5">Ctrl+Y</kbd> Redo</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-2xs text-[10px] mr-1.5">Tab</kbd> Indent List</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-2xs text-[10px] mr-1.5">Shift+Tab</kbd> Outdent List</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-2xs text-[10px] mr-1.5">Shift+Enter</kbd> Soft Line Break</div>
            </div>
          </div>
        )}

        {/* CONTENT AREA: 3 VIEW MODES */}
        <div className={`flex-1 relative ${isFullscreen ? "min-h-[400px] overflow-y-auto" : ""}`}>
          
          {/* 1. VISUAL EDITOR */}
          {viewMode === "editor" && (
            <div className="relative">
              <EditorContent editor={editor} />
              
              {/* Subtle empty state helper banner */}
              {isEditorEmpty && (
                <div className="absolute inset-x-4 top-16 pointer-events-none flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 text-center">
                  <Sparkles className="w-5 h-5 text-amber-500 mb-1.5" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Provide package highlights, inclusions, exclusions, and rules
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-md mt-0.5 mb-3">
                    Start typing directly above or choose a pre-formatted template below:
                  </p>
                  <div className="flex items-center gap-2 pointer-events-auto flex-wrap justify-center">
                    <button
                      type="button"
                      onClick={() => handleApplyTemplate(PACKAGE_TEMPLATES[0], "replace")}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#5fa6d9] text-white hover:bg-[#3884b6] transition-colors cursor-pointer shadow-xs"
                    >
                      + Full Package Template
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyTemplate(PACKAGE_TEMPLATES[1], "replace")}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer shadow-2xs"
                    >
                      + Inclusions & Exclusions
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyTemplate(PACKAGE_TEMPLATES[3], "replace")}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer shadow-2xs"
                    >
                      + Age Policy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. LIVE CUSTOMER EXPERIENCE PREVIEW */}
          {viewMode === "preview" && (
            <div className="p-6 bg-slate-50/70 dark:bg-slate-900/40 min-h-[260px] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#5fa6d9]" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Live Customer Ticket Modal Preview
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#5fa6d9]/10 text-[#5fa6d9] border border-[#5fa6d9]/20">
                  Guest View
                </span>
              </div>

              <div className="bg-white dark:bg-slate-950 rounded-xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
                <h5 className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-900">
                  Package Details & Information
                </h5>

                {value && value.trim() !== "" ? (
                  <div 
                    className="text-[13px] text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: value }}
                  />
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs italic">
                    No content added yet. Switch back to Editor to write package details.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>This simulation matches the guest-facing ticket modal styling in Tiqsey checkout.</span>
                <button
                  type="button"
                  onClick={() => setViewMode("editor")}
                  className="font-bold text-[#5fa6d9] hover:underline cursor-pointer"
                >
                  Return to Visual Editor →
                </button>
              </div>
            </div>
          )}

          {/* 3. HTML CODE EDITOR */}
          {viewMode === "html" && (
            <div className="flex flex-col min-h-[260px]">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 font-mono">
                  <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Raw HTML Source Markup</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-[#5fa6d9] cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedHtml ? "Copied!" : "Copy HTML"}</span>
                </button>
              </div>
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={10}
                className="w-full flex-1 bg-slate-950 text-emerald-400 p-4 font-mono text-xs leading-relaxed focus:outline-none resize-y min-h-[220px]"
                placeholder="<!-- Paste or write custom HTML markup here -->"
              />
            </div>
          )}

        </div>

        {/* BOTTOM REFINED STATUS BAR */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-200/70 dark:border-slate-800/80 select-none text-[11px]">
          
          {/* Left: Mode badge and live counters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-500 dark:text-slate-400">
              <span className={`w-2 h-2 rounded-full ${viewMode === 'editor' ? 'bg-emerald-500' : viewMode === 'preview' ? 'bg-sky-500' : 'bg-indigo-500'}`} />
              <span className="capitalize">{viewMode === 'editor' ? 'Visual Editor' : viewMode === 'preview' ? 'Customer Preview' : 'HTML Mode'}</span>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-slate-400 dark:text-slate-500 border-l border-slate-200 dark:border-slate-800 pl-3">
              <span><strong>{wordCount}</strong> words</span>
              <span>•</span>
              <span><strong>{characterCount}</strong> chars</span>
              <span>•</span>
              <span><strong>{minRead}</strong> min read</span>
            </div>
          </div>

          {/* Right: Shortcuts Guide & Fullscreen Toggle */}
          <div className="flex items-center gap-1.5">
            {/* Clear all with confirm */}
            {value && value.trim() !== "" && (
              <button
                type="button"
                onClick={() => {
                  if (showClearConfirm) {
                    onChange("");
                    if (editor) editor.commands.setContent("");
                    setShowClearConfirm(false);
                  } else {
                    setShowClearConfirm(true);
                    setTimeout(() => setShowClearConfirm(false), 3000);
                  }
                }}
                className={`text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer mr-1 ${
                  showClearConfirm 
                    ? "bg-rose-500 text-white" 
                    : "text-slate-400 hover:text-rose-500"
                }`}
                title="Clear all text from editor"
              >
                {showClearConfirm ? "Confirm Clear?" : "Clear"}
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowHelpModal(!showHelpModal)}
              className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
              title="Keyboard Shortcuts"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider">Shortcuts</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen Focus Mode"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export interface TabConfig {
  key: string;
  label: string;
  value: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

interface TabbedWysiwygEditorProps {
  tabs: TabConfig[];
  onChange: (key: string, val: string) => void;
  title?: string;
}

export const TabbedWysiwygEditor: React.FC<TabbedWysiwygEditorProps> = ({
  tabs,
  onChange,
  title = "Variant Details & Policies"
}) => {
  const [activeTabKey, setActiveTabKey] = useState(tabs[0]?.key || "");

  // Ensure active tab is valid if tabs change
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.key === activeTabKey)) {
      setActiveTabKey(tabs[0].key);
    }
  }, [tabs, activeTabKey]);

  const activeTab = tabs.find(t => t.key === activeTabKey) || tabs[0];

  if (!activeTab) return null;

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pb-2 border-b border-slate-200/70 dark:border-slate-800/80">
        <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#5fa6d9]" />
          <span>{title}</span>
        </h3>
        
        {/* Tab selection buttons */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTabKey;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTabKey(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive 
                    ? "bg-white dark:bg-slate-900 text-[#5fa6d9] shadow-xs border border-slate-200/80 dark:border-slate-800" 
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-xl">
        <WysiwygEditor
          label={activeTab.label}
          value={activeTab.value}
          onChange={(val) => onChange(activeTab.key, val)}
          placeholder={activeTab.placeholder}
        />
      </div>
    </div>
  );
};
