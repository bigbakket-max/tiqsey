import React from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../contexts/SettingsContext';

import SearchBar from './SearchBar';

interface HeroProps {
  onSelectDestination: (destination: string) => void;
  onSearch: (query: string) => void;
}

const COLLAGE_LEFT = [
  {
    url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=200&q=80",
    style: { top: "5%", left: "5%", width: "70px", height: "70px" },
    className: "rounded-2xl z-20",
    label: "Dubai",
    delay: 0,
    yOffset: -6,
    rotate: -8
  },
  {
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=200&q=80",
    style: { top: "8%", left: "52%", width: "60px", height: "60px" },
    className: "rounded-xl z-10",
    label: "Paris",
    delay: 0.4,
    yOffset: -4,
    rotate: 12
  },
  {
    url: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=200&q=80",
    style: { top: "30%", left: "70%", width: "64px", height: "64px" },
    className: "rounded-xl z-20",
    label: "Iceland",
    delay: 0.5,
    yOffset: 4,
    rotate: -6
  },
  {
    url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=200&q=80",
    style: { top: "60%", left: "8%", width: "68px", height: "68px" },
    className: "rounded-xl z-20",
    label: "Alps",
    delay: 0.1,
    yOffset: 5,
    rotate: 10
  },
  {
    url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=200&q=80",
    style: { top: "42%", left: "35%", width: "80px", height: "80px" },
    className: "rounded-2xl z-30",
    label: "Zurich",
    delay: 0.2,
    yOffset: 6,
    rotate: -4
  },
  {
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=200&q=80",
    style: { top: "70%", left: "55%", width: "64px", height: "64px" },
    className: "rounded-xl z-10",
    label: "Kyoto",
    delay: 0.3,
    yOffset: -5,
    rotate: -12
  }
];

const COLLAGE_RIGHT = [
  {
    url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=200&q=80",
    style: { top: "5%", right: "5%", width: "70px", height: "70px" },
    className: "rounded-2xl z-20",
    label: "New York",
    delay: 0.15,
    yOffset: -6,
    rotate: 6
  },
  {
    url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=200&q=80",
    style: { top: "8%", right: "52%", width: "60px", height: "60px" },
    className: "rounded-xl z-10",
    label: "Agra",
    delay: 0.45,
    yOffset: -5,
    rotate: -10
  },
  {
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=200&q=80",
    style: { top: "30%", right: "70%", width: "64px", height: "64px" },
    className: "rounded-xl z-20",
    label: "Santorini",
    delay: 0.55,
    yOffset: 3,
    rotate: 8
  },
  {
    url: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=200&q=80",
    style: { top: "60%", right: "8%", width: "68px", height: "68px" },
    className: "rounded-xl z-20",
    label: "Holland",
    delay: 0.25,
    yOffset: 4,
    rotate: -8
  },
  {
    url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=200&q=80",
    style: { top: "42%", right: "35%", width: "80px", height: "80px" },
    className: "rounded-2xl z-30",
    label: "Rome",
    delay: 0.3,
    yOffset: 5,
    rotate: 5
  },
  {
    url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=200&q=80",
    style: { top: "70%", right: "55%", width: "64px", height: "64px" },
    className: "rounded-xl z-10",
    label: "Sydney",
    delay: 0.35,
    yOffset: -4,
    rotate: 12
  }
];

const FLOATING_STICKERS: any[] = [];
const UNUSED_STICKERS = [
  {
    key: "paris",
    className: "absolute top-[4%] left-[2%] sm:left-[4%] md:left-[8%] rotate-[-15deg] opacity-[0.8] hover:opacity-100 dark:opacity-[0.7] dark:hover:opacity-95 transition-all duration-300 drop-shadow-[0_6px_10px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]",
    yOffset: -5,
    delay: 0.2,
    svg: (
      <svg viewBox="0 0 100 100" className="w-[84px] h-[84px] md:w-[105px] md:h-[105px]" fill="none">
        <circle cx="50" cy="45" r="32" className="fill-white dark:fill-slate-900" />
        <path d="M-10,30 Q15,25 40,30 T90,30 T140,25" stroke="currentColor" className="text-sky-400/40 dark:text-sky-500/20" strokeWidth="0.75" />
        <path d="M-10,40 Q15,35 40,40 T90,40 T140,35" stroke="currentColor" className="text-sky-400/40 dark:text-sky-500/20" strokeWidth="0.75" />
        <path d="M-10,50 Q15,45 40,50 T90,50 T140,45" stroke="currentColor" className="text-sky-400/40 dark:text-sky-500/20" strokeWidth="0.75" />
        <circle cx="50" cy="45" r="32" stroke="currentColor" className="text-indigo-600 dark:text-indigo-400" strokeWidth="1.5" />
        <circle cx="50" cy="45" r="28" stroke="currentColor" className="text-rose-500 dark:text-rose-400" strokeWidth="0.75" />
        <text x="50" y="37" textAnchor="middle" className="font-sans text-[7.5px] tracking-[2px] font-black fill-indigo-600 dark:fill-indigo-400">PARIS</text>
        <text x="50" y="46" textAnchor="middle" className="font-mono text-[6px] tracking-wide fill-rose-500 dark:fill-rose-400">14.07.1989</text>
        <text x="50" y="55" textAnchor="middle" className="font-sans text-[5px] tracking-[1.5px] font-bold fill-indigo-500 dark:fill-indigo-300">REPUBLIQUE</text>
        <polygon points="50,60 52,63 55,63 53,65 54,68 50,66 46,68 47,65 45,63 48,63" className="fill-rose-500 dark:fill-rose-400" />
      </svg>
    )
  },
  {
    key: "tokyo",
    className: "absolute bottom-[8%] left-[2%] sm:left-[5%] md:left-[11%] lg:left-[16%] rotate-[18deg] opacity-[0.8] hover:opacity-100 dark:opacity-[0.7] dark:hover:opacity-95 transition-all duration-300 drop-shadow-[0_6px_10px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]",
    yOffset: 6,
    delay: 1.4,
    svg: (
      <svg viewBox="0 0 100 100" className="w-[80px] h-[80px] md:w-[100px] md:h-[100px]" fill="none">
        <circle cx="50" cy="50" r="40" className="fill-white dark:fill-slate-900" />
        <circle cx="50" cy="50" r="45" stroke="currentColor" className="text-red-500/30 dark:text-red-400/20" strokeWidth="1.8" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-red-500 dark:text-red-400" strokeWidth="0.75" />
        <path d="M 28 68 L 41 45 L 47 48 L 50 44 L 53 48 L 59 45 L 72 68 Z" fill="currentColor" className="text-rose-500/30 dark:text-rose-400/20" />
        <path d="M 24 68 H 76" stroke="currentColor" className="text-rose-500 dark:text-rose-400" strokeWidth="1.25" strokeLinecap="round" />
        <circle cx="50" cy="34" r="11" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" className="text-red-500 dark:text-red-400" />
        <text x="50" y="21" textAnchor="middle" className="font-mono text-[7px] font-black tracking-widest fill-red-600 dark:fill-red-400">TOKYO</text>
        <text x="50" y="78" textAnchor="middle" className="font-mono text-[6px] tracking-widest fill-slate-500 dark:fill-slate-450">★ DEPARTED ★</text>
      </svg>
    )
  },
  {
    key: "london",
    className: "absolute top-[5%] right-[2%] sm:right-[4%] md:right-[8%] rotate-[12deg] opacity-[0.8] hover:opacity-100 dark:opacity-[0.7] dark:hover:opacity-95 transition-all duration-300 drop-shadow-[0_6px_10px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]",
    yOffset: -6,
    delay: 0.8,
    svg: (
      <svg viewBox="0 0 140 80" className="w-[100px] h-[58px] md:w-[124px] md:h-[72px]" fill="none">
        <rect x="9" y="9" width="122" height="62" rx="31" className="fill-white dark:fill-slate-900" />
        <rect x="5" y="5" width="130" height="70" rx="35" fill="none" stroke="currentColor" className="text-sky-600 dark:text-sky-400" strokeWidth="1.8" strokeDasharray="4 2" />
        <rect x="9" y="9" width="122" height="62" rx="31" fill="none" stroke="currentColor" className="text-rose-500 dark:text-rose-400" strokeWidth="0.75" />
        <text x="70" y="28" textAnchor="middle" className="font-serif text-[9px] tracking-[2.5px] font-extrabold fill-rose-500 dark:fill-rose-400">GREAT BRITAIN</text>
        <line x1="25" y1="36" x2="115" y2="36" stroke="currentColor" className="text-sky-600 dark:text-sky-400" strokeWidth="0.75" />
        <text x="70" y="49" textAnchor="middle" className="font-sans text-[11px] tracking-[4px] font-black fill-sky-700 dark:fill-sky-300">LONDON</text>
        <text x="70" y="60" textAnchor="middle" className="font-mono text-[6px] tracking-wide fill-slate-500 dark:fill-slate-450">POSTAGE GUARANTEED • 1994</text>
      </svg>
    )
  },
  {
    key: "barcode-ticket",
    className: "absolute bottom-[6%] right-[2%] sm:right-[5%] md:right-[11%] lg:right-[15%] rotate-[-10deg] opacity-[0.8] hover:opacity-100 dark:opacity-[0.7] dark:hover:opacity-95 transition-all duration-300 drop-shadow-[0_6px_10px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]",
    yOffset: 5,
    delay: 2.1,
    svg: (
      <svg viewBox="0 0 80 120" className="w-[70px] h-[105px] md:w-[84px] md:h-[126px]" fill="none">
        <rect x="5" y="5" width="70" height="110" rx="6" className="fill-white dark:fill-slate-900" />
        <rect x="5" y="5" width="70" height="110" rx="6" fill="none" stroke="currentColor" className="text-amber-600 dark:text-amber-500" strokeWidth="1.5" />
        <line x1="5" y1="28" x2="75" y2="28" stroke="currentColor" className="text-amber-500/40 dark:text-amber-400/20" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="5" y1="85" x2="75" y2="85" stroke="currentColor" className="text-amber-600 dark:text-amber-500" strokeWidth="1" />
        <path d="M40,11 L43,17 L49,18 L44,22 L46,28 L40,25 L34,28 L36,22 L31,18 L37,17 Z" fill="currentColor" className="text-teal-500/30 dark:text-teal-400/20" />
        <text x="40" y="43" textAnchor="middle" className="font-mono text-[9px] font-black tracking-widest fill-amber-700 dark:fill-amber-400">GATE B4</text>
        <text x="40" y="54" textAnchor="middle" className="font-sans text-[11px] font-black tracking-widest fill-teal-600 dark:fill-teal-400">WNDRLST</text>
        <text x="40" y="65" textAnchor="middle" className="font-mono text-[6.5px] tracking-wider font-bold fill-slate-600 dark:fill-slate-400">CLASS FIRST</text>
        <text x="40" y="75" textAnchor="middle" className="font-serif text-[7.5px] italic fill-teal-700 dark:fill-teal-300">Boarding Approved</text>
        <g className="text-slate-700 dark:text-slate-400" fill="currentColor" opacity="0.8">
          <rect x="15" y="91" width="2" height="15" />
          <rect x="19" y="91" width="3" height="15" />
          <rect x="24" y="91" width="1" height="15" />
          <rect x="27" y="91" width="4" height="15" />
          <rect x="33" y="91" width="1" height="15" />
          <rect x="36" y="91" width="3" height="15" />
          <rect x="41" y="91" width="2" height="15" />
          <rect x="45" y="91" width="1" height="15" />
          <rect x="48" y="91" width="4" height="15" />
          <rect x="54" y="91" width="2" height="15" />
          <rect x="58" y="91" width="3" height="15" />
          <rect x="63" y="91" width="1" height="15" />
        </g>
      </svg>
    )
  },
  {
    key: "nyc-octagonal",
    className: "absolute top-[16%] left-[32%] rotate-[-6deg] hidden xl:block opacity-[0.8] hover:opacity-100 dark:opacity-[0.7] dark:hover:opacity-95 transition-all duration-300 drop-shadow-[0_6px_10px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]",
    yOffset: -4,
    delay: 0.5,
    svg: (
      <svg viewBox="0 0 100 100" className="w-[84px] h-[84px]" fill="none">
        <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" className="fill-white dark:fill-slate-900" />
        <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" stroke="currentColor" className="text-emerald-600 dark:text-emerald-400" strokeWidth="1.5" />
        <polygon points="32,9 68,9 91,32 91,68 68,91 32,91 9,68 9,32" stroke="currentColor" className="text-emerald-500/30 dark:text-emerald-500/10" strokeWidth="0.5" />
        <text x="50" y="32" textAnchor="middle" className="font-sans text-[10px] font-extrabold tracking-[2px] fill-emerald-700 dark:fill-emerald-300">NEW YORK</text>
        <text x="50" y="44" textAnchor="middle" className="font-mono text-[6.5px] fill-slate-500 dark:fill-slate-400">DEPT. OF ENTRY</text>
        <path d="M40,57 L42,49 L46,54 L50,46 L54,54 L58,49 L60,57 Z" fill="currentColor" className="text-orange-500/30 dark:text-orange-400/20" />
        <line x1="22" y1="63" x2="78" y2="63" stroke="currentColor" className="text-emerald-600 dark:text-emerald-500" strokeWidth="0.75" />
        <text x="50" y="74" textAnchor="middle" className="font-serif text-[10px] font-bold italic tracking-wide fill-orange-600 dark:fill-orange-400">J.F. KENNEDY</text>
        <text x="50" y="83" textAnchor="middle" className="font-mono text-[5.5px] tracking-wide fill-emerald-600 dark:fill-emerald-400">★ TERMINAL 4 ★</text>
      </svg>
    )
  },
  {
    key: "hawaii-palm",
    className: "absolute top-[14%] right-[30%] rotate-[14deg] hidden xl:block opacity-[0.8] hover:opacity-100 dark:opacity-[0.7] dark:hover:opacity-95 transition-all duration-300 drop-shadow-[0_6px_10px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]",
    yOffset: 4,
    delay: 1.1,
    svg: (
      <svg viewBox="0 0 100 100" className="w-[80px] h-[80px]" fill="none">
        <circle cx="50" cy="50" r="42" className="fill-white dark:fill-slate-900" />
        <circle cx="50" cy="50" r="42" stroke="currentColor" className="text-teal-600 dark:text-teal-500" strokeWidth="1.5" />
        <path d="M48,78 Q45,55 58,36" stroke="currentColor" className="text-teal-600 dark:text-teal-450" strokeWidth="1.5" fill="none" />
        <path d="M58,36 Q65,31 72,33 M58,36 Q68,41 70,49 M58,36 Q50,29 44,30 M58,36 Q48,39 46,46 M58,36 Q58,26 62,21" stroke="currentColor" className="text-teal-500 dark:text-teal-400" strokeWidth="1.25" fill="none" />
        <path d="M26,65 L74,65 M21,72 L79,72" stroke="currentColor" className="text-teal-600/40 dark:text-teal-500/30" strokeWidth="0.75" fill="none" />
        <text x="50" y="57" textAnchor="middle" className="font-serif text-[9px] font-extrabold tracking-[2px] fill-orange-500 dark:fill-orange-400">ALOHA</text>
        <text x="50" y="81" textAnchor="middle" className="font-mono text-[5.5px] tracking-wide fill-teal-600 dark:fill-teal-300">HAWAII PACIFIC</text>
      </svg>
    )
  },
  {
    key: "passport-approved",
    className: "absolute bottom-[8%] left-[45%] rotate-[-4deg] hidden lg:block xl:left-[43%] opacity-[0.8] hover:opacity-100 dark:opacity-[0.7] dark:hover:opacity-95 transition-all duration-300 drop-shadow-[0_6px_10px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]",
    yOffset: -5,
    delay: 1.7,
    svg: (
      <svg viewBox="0 0 120 60" className="w-[95px] h-[48px]" fill="none">
        <rect x="4" y="4" width="112" height="52" rx="3" className="fill-white dark:fill-slate-900" />
        <rect x="4" y="4" width="112" height="52" stroke="currentColor" className="text-purple-600 dark:text-purple-400" strokeWidth="1.5" rx="3" />
        <rect x="7" y="7" width="106" height="46" stroke="currentColor" className="text-purple-500/30 dark:text-purple-400/20" strokeWidth="0.5" rx="2" />
        <text x="60" y="24" textAnchor="middle" className="font-sans text-[11px] font-black tracking-[3px] fill-purple-700 dark:fill-purple-400">APPROVED</text>
        <text x="60" y="38" textAnchor="middle" className="font-mono text-[7px] tracking-widest fill-rose-500 dark:fill-rose-450">★ SCHENGEN VISA ★</text>
        <text x="60" y="48" textAnchor="middle" className="font-serif italic text-[6px] fill-purple-800 dark:fill-purple-400">Border Control Office</text>
      </svg>
    )
  },
  {
    key: "rome-shield",
    className: "absolute top-[22%] left-[16%] rotate-[-8deg] hidden lg:block opacity-[0.8] hover:opacity-100 dark:opacity-[0.7] dark:hover:opacity-95 transition-all duration-300 drop-shadow-[0_6px_10px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]",
    yOffset: 5,
    delay: 0.9,
    svg: (
      <svg viewBox="0 0 100 100" className="w-[85px] h-[85px]" fill="none">
        <path d="M 50 10 C 72 10, 88 18, 88 42 C 88 68, 68 88, 50 92 C 32 88, 12 68, 12 42 C 12 18, 28 10, 50 10 Z" className="fill-white dark:fill-slate-900" />
        <path d="M 50 10 C 72 10, 88 18, 88 42 C 88 68, 68 88, 50 92 C 32 88, 12 68, 12 42 C 12 18, 28 10, 50 10 Z" stroke="currentColor" className="text-amber-600 dark:text-amber-500" strokeWidth="1.5" />
        <path d="M 50 14 C 68 14, 84 21, 84 42 C 84 64, 66 83, 50 87 C 34 83, 16 64, 16 42 C 16 21, 32 14, 50 14 Z" stroke="currentColor" className="text-rose-600/30 dark:text-rose-500/20" strokeWidth="0.5" />
        <text x="50" y="32" textAnchor="middle" className="font-sans text-[8px] font-black tracking-[1.5px] fill-amber-700 dark:fill-amber-400">ROMA</text>
        <path d="M 28 55 H 72 M 35 44 H 65" stroke="currentColor" className="text-rose-600 dark:text-rose-450" strokeWidth="1" />
        <circle cx="50" cy="50" r="14" className="fill-rose-500/10 dark:fill-rose-400/5 stroke-rose-400 dark:stroke-rose-500" strokeWidth="0.75" />
        <text x="50" y="53" textAnchor="middle" className="font-serif text-[10px] font-extrabold italic fill-rose-600 dark:fill-rose-400">IT</text>
        <text x="50" y="74" textAnchor="middle" className="font-mono text-[5.5px] tracking-widest fill-amber-600 dark:fill-amber-500">COLOSSEUM</text>
        <text x="50" y="81" textAnchor="middle" className="font-sans text-[4.5px] font-bold fill-slate-500">ENTRATA</text>
      </svg>
    )
  },
  {
    key: "sydney-hex",
    className: "absolute bottom-[16%] right-[21%] rotate-[15deg] hidden lg:block opacity-[0.8] hover:opacity-100 dark:opacity-[0.7] dark:hover:opacity-95 transition-all duration-300 drop-shadow-[0_6px_10px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]",
    yOffset: -4,
    delay: 1.3,
    svg: (
      <svg viewBox="0 0 100 100" className="w-[85px] h-[85px]" fill="none">
        <polygon points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5" className="fill-white dark:fill-slate-900" />
        <polygon points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5" stroke="currentColor" className="text-sky-600 dark:text-sky-400" strokeWidth="1.5" />
        <polygon points="50,9 85,29.5 85,70.5 50,91 15,70.5 15,29.5" stroke="currentColor" className="text-amber-500/30 dark:text-amber-400/20" strokeWidth="0.5" />
        <text x="50" y="28" textAnchor="middle" className="font-sans text-[7px] font-black tracking-[2px] fill-sky-700 dark:fill-sky-450">SYDNEY</text>
        <path d="M 35 60 C 35 42, 48 42, 48 60 Z M 48 60 C 48 38, 65 38, 65 60 Z" fill="currentColor" className="text-amber-600/30 dark:text-amber-500/20" />
        <line x1="22" y1="65" x2="78" y2="65" stroke="currentColor" className="text-sky-600 dark:text-sky-500" strokeWidth="1" />
        <text x="50" y="76" textAnchor="middle" className="font-serif italic text-[8.5px] font-extrabold fill-amber-700 dark:fill-amber-400">Australia</text>
        <text x="50" y="85" textAnchor="middle" className="font-mono text-[5px] tracking-wide fill-slate-500">CUSTOMS DEPT</text>
      </svg>
    )
  },
  {
    key: "cairo-pyramid",
    className: "absolute top-[3%] left-[45%] lg:left-[48%] rotate-[-8deg] hidden md:block opacity-[0.8] hover:opacity-100 dark:opacity-[0.7] dark:hover:opacity-95 transition-all duration-300 drop-shadow-[0_6px_10px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]",
    yOffset: 6,
    delay: 0.6,
    svg: (
      <svg viewBox="0 0 120 100" className="w-[95px] h-[79px]" fill="none">
        <polygon points="60,10 110,85 10,85" className="fill-white dark:fill-slate-900" />
        <polygon points="60,10 110,85 10,85" stroke="currentColor" className="text-orange-600 dark:text-orange-500" strokeWidth="1.5" />
        <polygon points="60,15 104,80 16,80" stroke="currentColor" className="text-amber-500/30 dark:text-amber-400/20" strokeWidth="0.5" />
        <path d="M 60 22 L 35 74 M 60 22 L 60 80 M 60 22 L 85 74" stroke="currentColor" className="text-amber-600/30 dark:text-amber-450/20" strokeWidth="0.75" />
        <text x="60" y="52" textAnchor="middle" className="font-serif text-[9px] font-black tracking-[1.5px] fill-orange-700 dark:fill-orange-400">CAIRO</text>
        <text x="60" y="63" textAnchor="middle" className="font-sans text-[7.5px] font-bold fill-amber-600 dark:fill-amber-500">VALID 1992</text>
        <text x="60" y="73" textAnchor="middle" className="font-mono text-[5px] tracking-widest fill-slate-500">★ GIZA IMMIG ★</text>
      </svg>
    )
  },
  {
    key: "rio-tag",
    className: "absolute bottom-[21%] left-[26%] rotate-[12deg] hidden xl:block opacity-[0.8] hover:opacity-100 dark:opacity-[0.7] dark:hover:opacity-95 transition-all duration-300 drop-shadow-[0_6px_10px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]",
    yOffset: -5,
    delay: 1.8,
    svg: (
      <svg viewBox="0 0 110 55" className="w-[100px] h-[50px]" fill="none">
        <rect x="4" y="4" width="102" height="47" rx="10" className="fill-white dark:fill-slate-900" />
        <rect x="4" y="4" width="102" height="47" stroke="currentColor" className="text-emerald-600 dark:text-emerald-500" strokeWidth="1.5" rx="10" />
        <rect x="7" y="7" width="96" height="41" stroke="currentColor" className="text-yellow-500/30 dark:text-yellow-400/20" strokeWidth="0.5" rx="8" />
        <circle cx="22" cy="27.5" r="9" className="fill-yellow-500/20 dark:fill-yellow-450/10 stroke-emerald-600 dark:stroke-emerald-500" strokeWidth="0.75" />
        <text x="22" y="31.5" textAnchor="middle" className="font-sans text-[11px] font-bold fill-emerald-700 dark:fill-emerald-400">BR</text>
        <text x="66" y="24" textAnchor="middle" className="font-sans text-[10px] font-black tracking-[1px] fill-emerald-700 dark:fill-emerald-400">RIO DE J.</text>
        <text x="66" y="34" textAnchor="middle" className="font-mono text-[6px] tracking-widest fill-yellow-600 dark:fill-yellow-500">BRASIL PORT</text>
        <text x="66" y="42" textAnchor="middle" className="font-serif italic text-[5.5px] fill-slate-500">Galeão International</text>
      </svg>
    )
  }
];

export default function Hero({ onSelectDestination, onSearch }: HeroProps) {
  const { t } = useSettings();

  return (
    <div 
      className="relative z-40 p-0 py-8 md:py-10 min-h-[360px] md:min-h-[440px] lg:min-h-[490px] flex flex-col items-center justify-center transition-colors duration-300 rounded-bl-[16px] md:rounded-bl-[24px] overflow-hidden shadow-xs bg-gradient-to-b from-[#e3f2fb] via-[#f4f9fd] to-[#d5eaf8] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
    >
      
      {/* Subtle soft atmospheric background ambient glow */}
      <div className="absolute top-[-20%] left-[20%] w-[400px] h-[400px] bg-sky-200/40 dark:bg-blue-900/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[20%] w-[450px] h-[450px] bg-blue-100/40 dark:bg-indigo-900/15 rounded-full blur-[120px] pointer-events-none" />
      


      {/* Three-Column Responsive Guard Grid */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[220px] md:min-h-[320px] lg:min-h-[380px] relative z-10">
        
        {/* Left Column: Left Collage (strictly fits Columns 1-3) */}
        <div className="hidden lg:block lg:col-span-3 h-[340px] relative pointer-events-none">
          {COLLAGE_LEFT.map((img, i) => {
            const leftValue = img.style.left;
            const cardWidth = parseInt(img.style.width);
            const cardTop = img.style.top;
            return (
              <React.Fragment key={`left-${i}`}>
                {/* Hanging Cord */}
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 0.65, scaleY: 1 }}
                  transition={{ duration: 0.8, delay: img.delay }}
                  style={{
                    left: `calc(${leftValue} + ${cardWidth / 2}px)`,
                    top: "-150px",
                    height: `calc(150px + ${cardTop})`,
                    transformOrigin: "top",
                  }}
                  className="absolute w-[1.5px] bg-gradient-to-b from-[#8b5a2b]/30 via-[#a0522d]/70 to-[#5c3a21] z-0 pointer-events-none"
                />
                
                {/* Knot connector */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: img.delay }}
                  style={{
                    left: `calc(${leftValue} + ${cardWidth / 2 - 4}px)`,
                    top: `calc(${cardTop} - 4px)`,
                  }}
                  className="absolute w-2 h-2 rounded-full bg-[#5c3a21] border border-[#3d2514] z-30 pointer-events-none shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                />

                {/* Card */}
                <motion.div
                  style={{ ...img.style, willChange: 'transform' }}
                  className={`absolute overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white border-2 border-white dark:border-slate-800 dark:bg-slate-900 cursor-pointer pointer-events-auto transition-shadow duration-300 ${img.className}`}
                  initial={{ opacity: 0, y: 15, rotate: img.rotate }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    rotate: img.rotate 
                  }}
                  transition={{ 
                    duration: 0.6,
                    delay: img.delay
                  }}
                  whileHover={{ 
                    scale: 1.12, 
                    rotate: img.rotate * 0.3,
                    zIndex: 50, 
                    boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => onSelectDestination(img.label)}
                >
                  <img 
                    src={img.url} 
                    className="w-full h-full object-cover select-none" 
                    alt={img.label} 
                    referrerPolicy="no-referrer" 
                  />
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Center Column: Title & Search Bar (Guaranteed cols 4-9) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center text-center px-2 relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex flex-col items-center text-center"
          >
            {/* Eyebrow Accent */}
            <span className="text-[11px] sm:text-xs md:text-sm font-extrabold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-400 mb-2 select-none">
              {t('heroEyebrow', 'DISCOVER. DREAM. EXPLORE.')}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px] font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] max-w-[700px] mx-auto mb-2">
              <span className="block font-black text-slate-900 dark:text-white">
                {t('heroTitle1', 'Explore')}
              </span>
              <span className="block font-black text-slate-900 dark:text-white">
                {t('heroTitle2', 'unforgettable')}
              </span>
              <span className="block font-black bg-gradient-to-r from-[#E51937] via-red-500 to-rose-600 bg-clip-text text-transparent">
                {t('heroTitle3', 'experiences')}
              </span>
              <span className="inline-flex items-center justify-center flex-wrap gap-x-2 font-['Caveat',cursive] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[62px] tracking-normal leading-tight mt-0.5">
                <span className="relative inline-block text-amber-500 dark:text-amber-400">
                  {t('heroTitle4', 'around the world')}
                  <svg
                    className="absolute -bottom-2.5 sm:-bottom-3 left-0 w-full h-3 text-amber-500 dark:text-amber-400 pointer-events-none overflow-visible"
                    viewBox="0 0 100 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 8.5C28 2.5 75 1.5 98 6.5C70 4.5 35 6 10 9"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </h1>

            {/* Subtitle Caption */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium max-w-md mx-auto mt-2 leading-relaxed">
              {t('heroSubtitle', 'Handpicked destinations, unique activities and memories that last a lifetime.')}
            </p>
          </motion.div>
        </div>

        {/* Right Column: Right Collage (strictly fits Columns 10-12) */}
        <div className="hidden lg:block lg:col-span-3 h-[340px] relative pointer-events-none">
          {COLLAGE_RIGHT.map((img, i) => {
            const rightValue = img.style.right;
            const cardWidth = parseInt(img.style.width);
            const cardTop = img.style.top;
            return (
              <React.Fragment key={`right-${i}`}>
                {/* Hanging Cord */}
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 0.65, scaleY: 1 }}
                  transition={{ duration: 0.8, delay: img.delay }}
                  style={{
                    right: `calc(${rightValue} + ${cardWidth / 2}px)`,
                    top: "-150px",
                    height: `calc(150px + ${cardTop})`,
                    transformOrigin: "top",
                  }}
                  className="absolute w-[1.5px] bg-gradient-to-b from-[#8b5a2b]/30 via-[#a0522d]/70 to-[#5c3a21] z-0 pointer-events-none"
                />
                
                {/* Knot connector */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: img.delay }}
                  style={{
                    right: `calc(${rightValue} + ${cardWidth / 2 - 4}px)`,
                    top: `calc(${cardTop} - 4px)`,
                  }}
                  className="absolute w-2 h-2 rounded-full bg-[#5c3a21] border border-[#3d2514] z-30 pointer-events-none shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                />

                {/* Card */}
                <motion.div
                  style={{ ...img.style, willChange: 'transform' }}
                  className={`absolute overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white border-2 border-white dark:border-slate-800 dark:bg-slate-900 cursor-pointer pointer-events-auto transition-shadow duration-300 ${img.className}`}
                  initial={{ opacity: 0, y: 15, rotate: img.rotate }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    rotate: img.rotate
                  }}
                  transition={{
                    duration: 0.6,
                    delay: img.delay
                  }}
                  whileHover={{ 
                    scale: 1.12, 
                    rotate: img.rotate * 0.3,
                    zIndex: 50, 
                    boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => onSelectDestination(img.label)}
                >
                  <img 
                    src={img.url} 
                    className="w-full h-full object-cover select-none" 
                    alt={img.label} 
                    referrerPolicy="no-referrer" 
                  />
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>

      </div>

    </div>
  );
}
