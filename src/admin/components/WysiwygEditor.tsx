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
  Sparkles
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

interface WysiwygEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = "Start typing and format here..."
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Popover / State Toggles
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showLineHeightDropdown, setShowLineHeightDropdown] = useState(false);
  const [showTextColorDropdown, setShowTextColorDropdown] = useState(false);
  const [showBgColorDropdown, setShowBgColorDropdown] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Form Inputs for Popovers
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const blockTypes = [
    { name: "Normal Text", label: "Normal Text", tag: "paragraph", size: "14px", className: "text-sm font-normal text-slate-800 dark:text-slate-100" },
    { name: "Heading 1", label: "Heading 1", tag: "h1", size: "28px", className: "text-lg font-bold text-slate-900 dark:text-white" },
    { name: "Heading 2", label: "Heading 2", tag: "h2", size: "22px", className: "text-base font-bold text-slate-900 dark:text-white" },
    { name: "Heading 3", label: "Heading 3", tag: "h3", size: "18px", className: "text-sm font-semibold text-slate-900 dark:text-white" },
    { name: "Blockquote", label: "Blockquote", tag: "blockquote", size: "14px", className: "text-xs italic border-l-2 border-slate-300 dark:border-slate-700 pl-2 text-slate-500 dark:text-slate-400" },
    { name: "Code Block", label: "Code Block", tag: "codeBlock", size: "12px", className: "text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300" },
  ];

  const fonts = [
    { name: "Default Font", css: "" },
    { name: "Sans-serif", css: "ui-sans-serif, system-ui, sans-serif" },
    { name: "Serif", css: "Georgia, Cambria, 'Times New Roman', Times, serif" },
    { name: "Monospace", css: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" },
  ];

  const lineHeights = [
    { label: "1.0 Single", value: "1" },
    { label: "1.2 Compact", value: "1.2" },
    { label: "1.5 Default", value: "1.5" },
    { label: "2.0 Double", value: "2" },
    { label: "2.5 Loose", value: "2.5" },
  ];

  const textColors = [
    { name: "Charcoal", value: "#334155" },
    { name: "Rose Red", value: "#ef4444" },
    { name: "Amber Orange", value: "#f97316" },
    { name: "Emerald Green", value: "#10b981" },
    { name: "Royal Blue", value: "#3b82f6" },
    { name: "Indigo Purple", value: "#6366f1" },
    { name: "Premium Gold", value: "#d97706" },
    { name: "Snow White", value: "#ffffff" },
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
        class: 'w-full bg-white dark:bg-slate-950 px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none min-h-[160px] max-h-[500px] overflow-y-auto prose dark:prose-invert',
        style: 'min-height: 160px;',
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
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Escape key exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
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
    if (!editor) return 'Default Font';
    const currentFont = editor.getAttributes('textStyle').fontFamily;
    if (!currentFont) return 'Default Font';
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
    const next = Math.max(8, Math.min(72, current + amount));
    editor.chain().focus().setFontSize(`${next}px`).run();
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || !linkUrl) return;

    if (linkText) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-[#5fa6d9] underline font-bold hover:text-[#3884b6]">${linkText}</a>`;
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

  const wordCount = editor ? (editor.getText().trim() === '' ? 0 : editor.getText().trim().split(/\s+/).length) : 0;
  const characterCount = editor ? editor.getText().length : 0;
  const minRead = Math.max(1, Math.ceil(wordCount / 200));

  const wysiwygClass = isFullscreen
    ? "fixed inset-0 z-[9999] bg-white dark:bg-slate-950 flex flex-col p-6 animate-in fade-in duration-200"
    : `w-full rounded-xl border transition-all duration-200 bg-white dark:bg-slate-950 overflow-hidden ${
        isFocused 
          ? "border-[#5fa6d9] ring-2 ring-[#5fa6d9]/10" 
          : "border-slate-200 dark:border-slate-800"
      }`;

  return (
    <div ref={containerRef} className="w-full space-y-2 relative wysiwyg-popover-container">
      {!isFullscreen && (
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {label}
          </label>
          
          <button
            type="button"
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-[#5fa6d9] uppercase tracking-wider bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md transition-colors cursor-pointer select-none animate-none"
          >
            {isHtmlMode ? (
              <>
                <Eye className="w-3 h-3" />
                <span>Live Editor</span>
              </>
            ) : (
              <>
                <Code2 className="w-3 h-3" />
                <span>HTML Mode</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className={wysiwygClass}>
        
        {/* Fullscreen Mode Header */}
        {isFullscreen && (
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-900 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                Distraction-Free Editor: {label}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-500 cursor-pointer"
              title="Exit Fullscreen (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* HIGH FIDELITY TOOLBAR (Only shown in wysiwyg mode) */}
        {!isHtmlMode && (
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-150 dark:border-slate-900 select-none">
            
            {/* BLOCK FORMAT DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowBlockDropdown(!showBlockDropdown);
                  setShowFontDropdown(false);
                  setShowLineHeightDropdown(false);
                }}
                className="flex items-center justify-between gap-2 px-3 py-1.5 min-w-[120px] bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg shadow-sm transition-all cursor-pointer"
                title="Text Formatting Blocks"
              >
                <span className="truncate">{getFormatLabel()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

               {showBlockDropdown && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-[999] overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
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
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between cursor-pointer border-b border-slate-100/50 dark:border-slate-800/50 last:border-0 ${
                        getFormatLabel() === type.label ? "bg-slate-50/80 dark:bg-slate-800/40" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                        <span className={`${type.className} truncate`}>{type.name}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">Default font size: {type.size}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded">
                          {type.size}
                        </span>
                        {getFormatLabel() === type.label && <Check className="w-3.5 h-3.5 text-[#5fa6d9]" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FONT STYLE DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowFontDropdown(!showFontDropdown);
                  setShowBlockDropdown(false);
                  setShowLineHeightDropdown(false);
                }}
                className="flex items-center justify-between gap-2 px-3 py-1.5 min-w-[135px] bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg shadow-sm transition-all cursor-pointer"
                title="Font Family"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Type className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{getActiveFontLabel()}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showFontDropdown && (
                <div className="absolute left-0 mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-[999] overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
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
                      className={`w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center justify-between cursor-pointer ${
                        getActiveFontLabel() === f.name ? "bg-slate-50 dark:bg-slate-800 text-[#5fa6d9]" : ""
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

            {/* FONT SIZE CONTROLLER */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden h-[34px]">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleFontSizeChange(-1)}
                className="px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 h-full flex items-center justify-center transition-colors border-r border-slate-150 dark:border-slate-850 cursor-pointer"
                title="Decrease Font Size"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="px-3 text-xs font-bold text-slate-700 dark:text-slate-200 select-none min-w-[34px] text-center">
                {getActiveFontSize()}
              </div>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleFontSizeChange(1)}
                className="px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 h-full flex items-center justify-center transition-colors border-l border-slate-150 dark:border-slate-850 cursor-pointer"
                title="Increase Font Size"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* GROUP 1: INLINE STYLE FORMATTING CARD (B, I, U, S) */}
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden h-[34px]">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer ${editor?.isActive('bold') ? 'bg-slate-100 dark:bg-slate-800 text-[#5fa6d9]' : ''}`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer ${editor?.isActive('italic') ? 'bg-slate-100 dark:bg-slate-800 text-[#5fa6d9]' : ''}`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={`px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer ${editor?.isActive('underline') ? 'bg-slate-100 dark:bg-slate-800 text-[#5fa6d9]' : ''}`}
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={`px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer ${editor?.isActive('strike') ? 'bg-slate-100 dark:bg-slate-800 text-[#5fa6d9]' : ''}`}
                title="Strikethrough"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* GROUP 2: BLOCKS AND LISTS CARD (Quote, Code, Bullet, Numbered) */}
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden h-[34px]">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={`px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer ${editor?.isActive('blockquote') ? 'bg-slate-100 dark:bg-slate-800 text-[#5fa6d9]' : ''}`}
                title="Blockquote"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleCode().run()}
                className={`px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer ${editor?.isActive('code') ? 'bg-slate-100 dark:bg-slate-800 text-[#5fa6d9]' : ''}`}
                title="Code Inline (Ctrl+Alt+C)"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer ${editor?.isActive('bulletList') ? 'bg-slate-100 dark:bg-slate-800 text-[#5fa6d9]' : ''}`}
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer ${editor?.isActive('orderedList') ? 'bg-slate-100 dark:bg-slate-800 text-[#5fa6d9]' : ''}`}
                title="Numbered List"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* GROUP 3: ALIGNMENTS CARD */}
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden h-[34px]">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                className={`px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer ${editor?.isActive({ textAlign: 'left' }) ? 'bg-slate-100 dark:bg-slate-800 text-[#5fa6d9]' : ''}`}
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                className={`px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer ${editor?.isActive({ textAlign: 'center' }) ? 'bg-slate-100 dark:bg-slate-800 text-[#5fa6d9]' : ''}`}
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                className={`px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer ${editor?.isActive({ textAlign: 'right' }) ? 'bg-slate-100 dark:bg-slate-800 text-[#5fa6d9]' : ''}`}
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                className={`px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer ${editor?.isActive({ textAlign: 'justify' }) ? 'bg-slate-100 dark:bg-slate-800 text-[#5fa6d9]' : ''}`}
                title="Align Justify"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* GROUP 4: INDENTATION AND SPACING CARD */}
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden h-[34px]">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().outdent().run()}
                className="px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer"
                title="Decrease Indent"
              >
                <Outdent className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().indent().run()}
                className="px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer"
                title="Increase Indent"
              >
                <Indent className="w-3.5 h-3.5" />
              </button>
              
              {/* LINE HEIGHT SPACING DROPDOWN */}
              <div className="relative h-full flex items-center justify-center">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setShowLineHeightDropdown(!showLineHeightDropdown);
                    setShowBlockDropdown(false);
                    setShowFontDropdown(false);
                  }}
                  className="px-3 h-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Line Spacing (Line Height)"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {showLineHeightDropdown && (
                  <div className="absolute right-0 mt-36 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-[999] overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
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
                          className={`w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center justify-between cursor-pointer ${
                            isActive ? "bg-slate-50 dark:bg-slate-800 text-[#5fa6d9]" : ""
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

            {/* MEDIA INSERTION GROUP */}
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden h-[34px]">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  const selectedText = editor ? editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to) : "";
                  setLinkText(selectedText);
                  setShowLinkModal(true);
                }}
                className="px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#5fa6d9] hover:text-[#3884b6] border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer"
                title="Insert Link"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowImageModal(true)}
                className="px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-emerald-500 border-r border-slate-150 dark:border-slate-850 flex items-center justify-center transition-colors cursor-pointer"
                title="Insert Image"
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowTableModal(true)}
                className="px-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-amber-500 flex items-center justify-center transition-colors cursor-pointer"
                title="Insert Data Table"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* COLORS & STYLE PICKERS GROUP */}
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden h-[34px]">
              
              {/* Foreground Text Color */}
              <div className="relative h-full flex items-center justify-center">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setShowTextColorDropdown(!showTextColorDropdown);
                    setShowBgColorDropdown(false);
                  }}
                  className="px-3 h-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-r border-slate-150 dark:border-slate-850 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Foreground Text Color"
                >
                  <Palette className="w-3.5 h-3.5 text-indigo-500" />
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {showTextColorDropdown && (
                  <div className="absolute left-0 mt-36 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-[999] grid grid-cols-4 gap-1.5 animate-in fade-in slide-in-from-top-1">
                    {textColors.map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          editor?.chain().focus().setColor(col.value).run();
                          setShowTextColorDropdown(false);
                        }}
                        className="w-6 h-6 rounded-md border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-transform shadow-sm cursor-pointer"
                        style={{ backgroundColor: col.value }}
                        title={col.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Highlighter Background Color */}
              <div className="relative h-full flex items-center justify-center">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setShowBgColorDropdown(!showBgColorDropdown);
                    setShowTextColorDropdown(false);
                  }}
                  className="px-3 h-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Highlight Background Color"
                >
                  <span className="w-3.5 h-3.5 rounded bg-yellow-300 border border-yellow-400 block" />
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {showBgColorDropdown && (
                  <div className="absolute left-0 mt-36 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-[999] grid grid-cols-4 gap-1.5 animate-in fade-in slide-in-from-top-1">
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
                        className="w-6 h-6 rounded-md border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-transform shadow-sm flex items-center justify-center cursor-pointer"
                        style={{ backgroundColor: col.value === "transparent" ? "white" : col.value }}
                        title={col.name}
                      >
                        {col.value === "transparent" && <X className="w-3.5 h-3.5 text-rose-500 font-bold" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset format / Eraser button */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={clearFormatting}
                className="px-3 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
                title="Clear All Formatting Styles"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* Modal Popups for WYSIWYG Actions */}
        {showLinkModal && (
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-880 animate-in fade-in slide-in-from-top-1 duration-200 text-xs text-slate-700 dark:text-slate-300">
            <form onSubmit={handleInsertLink} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wide text-[9px] text-[#5fa6d9]">Insert Link URL</span>
                <button type="button" onClick={() => setShowLinkModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="url"
                  placeholder="Link URL (https://...)"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#5fa6d9]"
                  required
                />
                <input
                  type="text"
                  placeholder="Display Text (optional)"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#5fa6d9]"
                />
              </div>
              <div className="flex justify-end gap-1.5">
                <button type="button" onClick={() => setShowLinkModal(false)} className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1 rounded bg-[#5fa6d9] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#3884b6] cursor-pointer">
                  Insert
                </button>
              </div>
            </form>
          </div>
        )}

        {showImageModal && (
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-880 animate-in fade-in slide-in-from-top-1 duration-200 text-xs text-slate-700 dark:text-slate-300">
            <form onSubmit={handleInsertImage} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wide text-[9px] text-emerald-500">Insert Image Asset</span>
                <button type="button" onClick={() => setShowImageModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="url"
                  placeholder="Image URL (https://...)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#5fa6d9]"
                  required
                />
                <input
                  type="text"
                  placeholder="Alt Description (e.g. Map, Ticket)"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#5fa6d9]"
                />
              </div>
              <div className="flex justify-end gap-1.5">
                <button type="button" onClick={() => setShowImageModal(false)} className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1 rounded bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 cursor-pointer">
                  Insert Image
                </button>
              </div>
            </form>
          </div>
        )}

        {showTableModal && (
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-880 animate-in fade-in slide-in-from-top-1 duration-200 text-xs text-slate-700 dark:text-slate-300">
            <form onSubmit={handleInsertTable} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wide text-[9px] text-amber-500">Insert Data Table</span>
                <button type="button" onClick={() => setShowTableModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Rows</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={tableRows}
                    onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 focus:outline-none"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Columns</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={tableCols}
                    onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-1.5 pt-1">
                <button type="button" onClick={() => setShowTableModal(false)} className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1 rounded bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-amber-600 cursor-pointer">
                  Insert Table
                </button>
              </div>
            </form>
          </div>
        )}

        {/* HELP SHORTCUTS MODAL overlay inside editor */}
        {showHelpModal && (
          <div className="p-4 bg-amber-50/95 dark:bg-slate-900 border-b border-amber-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-slate-800 mb-2">
              <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-800 dark:text-amber-400">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Keyboard Shortcuts & Guide
              </span>
              <button type="button" onClick={() => setShowHelpModal(false)} className="text-amber-700 dark:text-slate-400 hover:scale-110 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-semibold">
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-sm text-[10px] mr-1">Ctrl + B</kbd> Bold</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-sm text-[10px] mr-1">Ctrl + I</kbd> Italic</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-sm text-[10px] mr-1">Ctrl + U</kbd> Underline</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-sm text-[10px] mr-1">Tab</kbd> Indent List</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-sm text-[10px] mr-1">Shift+Tab</kbd> Outdent List</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-sm text-[10px] mr-1">Enter</kbd> New Paragraph</div>
              <div><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded shadow-sm text-[10px] mr-1">Shift+Enter</kbd> Line Break</div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className={`flex-1 relative ${isFullscreen ? "min-h-[300px] overflow-y-auto" : ""}`}>
          {isHtmlMode ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={6}
              className="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 text-xs font-mono text-slate-850 dark:text-slate-100 focus:outline-none resize-none min-h-[160px]"
              placeholder="Edit Raw HTML code here..."
            />
          ) : (
            <EditorContent editor={editor} />
          )}
        </div>

        {/* BOTTOM DECORATIVE STATUS BAR */}
        {!isHtmlMode && (
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-150 dark:border-slate-850 select-none">
            <div className="flex items-center gap-2">
              {/* ✨ WYSIWYG Live Editor Amber Pill */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-900 text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                <span>✨</span>
                <span>WYSIWYG Live Editor</span>
              </div>
              
              {/* Help Circle Trigger */}
              <button
                type="button"
                onClick={() => setShowHelpModal(!showHelpModal)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Keyboard Shortcuts & Guide"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Word count and metrics */}
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
              <span><strong>{wordCount}</strong> words</span>
              <span><strong>{characterCount}</strong> characters</span>
              <span><strong>{minRead}</strong> min read</span>
            </div>

            {/* Fullscreen Expand Trigger */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Immersive Fullscreen Mode"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        )}

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
    <div className="bg-slate-50/50 dark:bg-slate-900/10 rounded-xl p-3 border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-900">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {title}
        </h3>
        
        {/* Tab selection buttons */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTabKey;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTabKey(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive 
                    ? "bg-white dark:bg-slate-900 text-[#5fa6d9] shadow-sm border border-slate-200 dark:border-slate-800" 
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

      <div className="bg-white dark:bg-slate-950 rounded-lg">
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
