import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Maximize2, 
  Sparkles, 
  Sliders, 
  Info, 
  Code, 
  Palette,
  Sun,
  Moon,
  Compass,
  Zap
} from 'lucide-react';

export default function GeminiLogoShowcase() {
  const [size, setSize] = useState<number>(240);
  const [glow, setGlow] = useState<number>(30);
  const [rotation, setRotation] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [gradientType, setGradientType] = useState<'original' | 'aurora' | 'sunset' | 'monochrome'>('original');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [showSecondary, setShowSecondary] = useState<boolean>(true);

  // SVG Coordinates for the main and secondary sparkles
  const mainSparklePath = "M 50 5 C 50 28, 28 50, 5 50 C 28 50, 50 72, 50 95 C 50 72, 72 50, 95 50 C 72 50, 50 28, 50 5 Z";
  const secondarySparklePath = "M 78 8 C 78 15, 75 22, 64 22 C 75 22, 78 29, 78 36 C 78 29, 81 22, 92 22 C 81 22, 78 15, 78 8 Z";

  // Gradients definition
  const gradients = {
    original: {
      name: "Original Google Gemini",
      description: "The official multi-colored gradient blending Google Blue, Red, Yellow, Green, and violet.",
      stops: [
        { offset: "0%", color: "#ea4335" },   // Red at top
        { offset: "30%", color: "#a855f7" },  // Purple
        { offset: "55%", color: "#4285f4" },  // Blue
        { offset: "80%", color: "#34a853" },  // Green
        { offset: "100%", color: "#fbbc05" }  // Yellow
      ],
      x1: "0.2",
      y1: "0.1",
      x2: "0.8",
      y2: "0.9",
      glowColor: "rgba(168, 85, 247, 0.45)",
      bg: "bg-radial-gradient"
    },
    aurora: {
      name: "Aurora Indigo",
      description: "A deep cosmic theme featuring modern violet, vibrant indigo, and electric cyan.",
      stops: [
        { offset: "0%", color: "#8b5cf6" },
        { offset: "50%", color: "#4f46e5" },
        { offset: "100%", color: "#06b6d4" }
      ],
      x1: "0.1",
      y1: "0.1",
      x2: "0.9",
      y2: "0.9",
      glowColor: "rgba(79, 70, 229, 0.4)",
      bg: "bg-gradient-to-tr from-indigo-900 to-slate-900"
    },
    sunset: {
      name: "Sunset Flare",
      description: "A warm, high-energy gradient blending intense rose, amber gold, and bright magenta.",
      stops: [
        { offset: "0%", color: "#f43f5e" },
        { offset: "50%", color: "#d946ef" },
        { offset: "100%", color: "#f59e0b" }
      ],
      x1: "0.1",
      y1: "0.1",
      x2: "0.9",
      y2: "0.9",
      glowColor: "rgba(244, 63, 94, 0.4)",
      bg: "bg-gradient-to-br from-[#1e4663] to-amber-900"
    },
    monochrome: {
      name: "Classic Slate Glow",
      description: "Elegant and minimal monochrome silver style suitable for dark layouts and high-end interfaces.",
      stops: [
        { offset: "0%", color: "#f8fafc" },
        { offset: "100%", color: "#64748b" }
      ],
      x1: "0.2",
      y1: "0.2",
      x2: "0.8",
      y2: "0.8",
      glowColor: "rgba(255, 255, 255, 0.25)",
      bg: "bg-slate-950"
    }
  };

  const activeGradient = gradients[gradientType];

  const getSvgCode = () => {
    const stopsCode = activeGradient.stops
      .map(s => `      <stop offset="${s.offset}" stop-color="${s.color}" />`)
      .join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  <defs>
    <linearGradient id="gemini-grad" x1="${activeGradient.x1}" y1="${activeGradient.y1}" x2="${activeGradient.x2}" y2="${activeGradient.y2}">
${stopsCode}
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <g transform="rotate(${rotation} 50 50)" style="transform-origin: center;">
    <!-- Main Sparkle -->
    <path 
      d="${mainSparklePath}" 
      fill="url(#gemini-grad)" 
    />
${showSecondary ? `    <!-- Secondary Sparkle -->
    <path 
      d="${secondarySparklePath}" 
      fill="url(#gemini-grad)" 
      opacity="0.85"
    />` : ''}
  </g>
</svg>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getSvgCode());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadSvg = () => {
    const blob = new Blob([getSvgCode()], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `google-gemini-logo-${gradientType}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full mx-auto space-y-8 font-sans pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-lg p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold border border-purple-100 dark:border-purple-900/50">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Interactive Vector Showcase
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Original Google Gemini Logo
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed">
              Explore the exact mathematical vector path, beautiful multi-color gradient, and iconic organic 
              four-pointed sparkle design that represents Google's premier AI model suite.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold py-2.5 px-4 rounded-md shadow-md transition-all active:scale-95 cursor-pointer border border-transparent dark:border-slate-200"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Copied SVG!' : 'Copy SVG Code'}</span>
            </button>
            <button
              onClick={downloadSvg}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold py-2.5 px-4 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Vector</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: The Logo Canvas Viewer */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-lg overflow-hidden shadow-xl min-h-[500px]">
          {/* Header Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1">GEMINI_LOGO_RENDERER</span>
            </div>
            
            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-850 p-1 rounded-md border border-slate-200/40 dark:border-slate-800/40">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Preview
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'code'
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                SVG Code
              </button>
            </div>
          </div>

          {/* Interactive Stage */}
          <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950/30 relative">
            
            {viewMode === 'preview' ? (
              <div className="flex flex-col items-center justify-center">
                {/* SVG Logo Stage */}
                <motion.div
                  style={{
                    filter: `drop-shadow(0 0 ${glow}px ${activeGradient.glowColor})`
                  }}
                  animate={isRotating ? { rotate: 360 } : { rotate: rotation }}
                  transition={isRotating ? { repeat: Infinity, duration: 15, ease: "linear" } : { type: "spring", stiffness: 60 }}
                  className="flex items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/30 rounded-lg shadow-2xl relative overflow-hidden"
                >
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  <svg 
                    viewBox="0 0 100 100" 
                    style={{ width: `${size}px`, height: `${size}px` }}
                    className="relative z-10 transition-all duration-300"
                  >
                    <defs>
                      <linearGradient id="gemini-grad-showcase" x1={activeGradient.x1} y1={activeGradient.y1} x2={activeGradient.x2} y2={activeGradient.y2}>
                        {activeGradient.stops.map((s, idx) => (
                          <stop key={idx} offset={s.offset} stopColor={s.color} />
                        ))}
                      </linearGradient>
                    </defs>
                    
                    {/* Main Sparkle with elegant scale animation */}
                    <motion.path 
                      d={mainSparklePath} 
                      fill="url(#gemini-grad-showcase)"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    />

                    {/* Secondary Sparkle with delay */}
                    {showSecondary && (
                      <motion.path 
                        d={secondarySparklePath} 
                        fill="url(#gemini-grad-showcase)" 
                        opacity="0.85"
                        animate={{ scale: [1, 1.05, 1], y: [0, -1, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                      />
                    )}
                  </svg>
                </motion.div>
                
                {/* Visual Legend indicator */}
                <div className="mt-6 flex items-center gap-6 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 px-4 py-2 rounded-lg shadow-sm text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Blue (Model)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Purple (Creative)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Red (Core)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Yellow (Warmth)
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full max-h-[420px] overflow-y-auto bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-xs leading-relaxed border border-slate-800 relative shadow-inner">
                <button
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg hover:text-white transition-colors"
                  title="Copy Code"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre>{getSvgCode()}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Hand: Interactive Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Controls Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-lg p-6 shadow-xl space-y-6">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-purple-500" />
              Interactive Parameters
            </h3>

            {/* Sizes Slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">Rendering Size</span>
                <span className="text-purple-600 dark:text-purple-400">{size}px</span>
              </div>
              <input 
                type="range" 
                min="64" 
                max="400" 
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full accent-purple-600 dark:accent-purple-500 cursor-pointer h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Small (64px)</span>
                <span>Large (400px)</span>
              </div>
            </div>

            {/* Glow Intensity Slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">Glow Intensity</span>
                <span className="text-purple-600 dark:text-purple-400">{glow}px</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="80" 
                value={glow}
                onChange={(e) => setGlow(parseInt(e.target.value))}
                className="w-full accent-purple-600 dark:accent-purple-500 cursor-pointer h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>None</span>
                <span>Hyper-Glow (80px)</span>
              </div>
            </div>

            {/* Rotation Control */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">Rotation Angle</span>
                <span className="text-purple-600 dark:text-purple-400">{rotation}°</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  value={rotation}
                  disabled={isRotating}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="flex-1 accent-purple-600 dark:accent-purple-500 cursor-pointer h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none disabled:opacity-50"
                />
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    isRotating 
                      ? 'bg-[#5fa6d9] text-white shadow-md shadow-[#5fa6d9]/20' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-250 dark:hover:bg-slate-700'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
                  <span>Spin</span>
                </button>
              </div>
            </div>

            {/* Toggle Secondary Star */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-800 dark:text-white">Secondary Sparkle</p>
                <p className="text-[10px] text-slate-400">Render the smaller companion star</p>
              </div>
              <button
                onClick={() => setShowSecondary(!showSecondary)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showSecondary ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    showSecondary ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Aesthetic Palette Presets */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-lg p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Palette className="w-4 h-4 text-purple-500" />
              Gradient Style Presets
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(gradients).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setGradientType(key as any)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden ${
                    gradientType === key
                      ? 'border-purple-500 bg-purple-500/5 dark:bg-purple-500/10'
                      : 'border-slate-200/70 dark:border-slate-800/70 hover:border-slate-350 dark:hover:border-slate-700 bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {/* Gradient color bar indicator */}
                    <div className="flex -space-x-1">
                      {item.stops.slice(0, 3).map((s, i) => (
                        <span 
                          key={i} 
                          className="w-3 h-3 rounded-full border border-white dark:border-slate-900" 
                          style={{ backgroundColor: s.color }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[80px]">
                      {item.name.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-normal">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100/60 dark:border-purple-900/40 rounded-lg p-6 space-y-4 shadow-sm">
            <h4 className="font-bold text-purple-800 dark:text-purple-300 text-xs flex items-center gap-1.5">
              <Info className="w-4 h-4 text-purple-500" />
              About Google Gemini Design Code
            </h4>
            <div className="text-[11px] text-purple-950/70 dark:text-purple-300/80 leading-relaxed space-y-2.5">
              <p>
                The Gemini logo features an organic <strong>squircle-based four-pointed star</strong>, designed to represent spark, creation, and precision. It signifies the multi-modal intelligence of Gemini (fusing language, visual, audio, and code capabilities seamlessly).
              </p>
              <p>
                Its core gradient represents the spectrum of human expression and technology: <strong>Blue</strong> for stability and depth, <strong>Red/Pink</strong> for human warmth and creative power, and <strong>Yellow</strong> for optimism and discovery.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
