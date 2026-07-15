// 24 Beautiful, high-quality, professional Travel Character Avatars
// Written as self-contained data URIs representing modern flat-color vectors with rich gradients.

export interface AvatarItem {
  id: string;
  name: string;
  url: string;
}

const svgToDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

export const TRAVEL_AVATARS: AvatarItem[] = [
  {
    id: "hiker-mountains",
    name: "Alex R. (Backpacker)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E0F2FE" />
            <stop offset="100%" stop-color="#BAE6FD" />
          </linearGradient>
          <linearGradient id="mountains" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#38BDF8" />
            <stop offset="100%" stop-color="#0284C7" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg1)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Mountains Backdrop -->
        <path d="M10 75 L35 40 L60 75 Z" fill="url(#mountains)" opacity="0.4" />
        <path d="M30 75 L55 30 L85 75 Z" fill="url(#mountains)" opacity="0.6" />
        <polygon points="55,30 50,38 60,38" fill="#FFFFFF" />
        <polygon points="35,40 31,47 39,47" fill="#FFFFFF" />
        
        <!-- Character Body & Backpack straps -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#155E75" />
        <rect x="35" y="62" width="30" height="20" rx="3" fill="#EF4444" /> <!-- Red Sleeping bag on backpack -->
        <rect x="32" y="70" width="6" height="15" fill="#D97706" /> <!-- Straps -->
        <rect x="62" y="70" width="6" height="15" fill="#D97706" />
        
        <!-- Head & Neck -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="44" r="14" fill="#FDBA74" />
        
        <!-- Hair & Beard -->
        <path d="M36 44 C36 30 64 30 64 44 C64 48 60 56 50 56 C40 56 36 48 36 44 Z" fill="#78350F" />
        <path d="M38 42 C38 32 62 32 62 42 Z" fill="#451A03" /> <!-- Hair top -->
        
        <!-- Face Inner Cutout -->
        <path d="M40 44 C40 38 60 38 60 44 C60 48 57 52 50 52 C43 52 40 48 40 44 Z" fill="#FDBA74" />
        
        <!-- Eyes with sparkles -->
        <circle cx="45" cy="42" r="2" fill="#1E293B" />
        <circle cx="44.5" cy="41.5" r="0.6" fill="#FFFFFF" />
        <circle cx="55" cy="42" r="2" fill="#1E293B" />
        <circle cx="54.5" cy="41.5" r="0.6" fill="#FFFFFF" />
        
        <!-- Cute Smile -->
        <path d="M47 47 Q50 50 53 47" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
        
        <!-- Cheeks -->
        <circle cx="42" cy="45" r="1.5" fill="#EF4444" opacity="0.3" />
        <circle cx="58" cy="45" r="1.5" fill="#EF4444" opacity="0.3" />
        
        <!-- Cap/Hat -->
        <path d="M34 32 C38 28 62 28 66 32 Z" fill="#1E293B" />
        <ellipse cx="50" cy="32" rx="18" ry="2" fill="#0F172A" />
      </svg>
    `)
  },
  {
    id: "photographer-city",
    name: "Emma S. (Photographer)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FCE7F3" />
            <stop offset="100%" stop-color="#FBCFE8" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg2)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- City skyline backdrop -->
        <rect x="20" y="45" width="12" height="30" fill="#DB2777" opacity="0.1" />
        <rect x="36" y="35" width="16" height="40" fill="#DB2777" opacity="0.15" />
        <rect x="60" y="40" width="14" height="35" fill="#DB2777" opacity="0.1" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#EC4899" />
        
        <!-- Camera Strap -->
        <path d="M38 78 C38 64 62 64 62 78" stroke="#1E293B" stroke-width="2" fill="none" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FDBA74" />
        <circle cx="50" cy="42" r="14" fill="#FDBA74" />
        
        <!-- Hair -->
        <path d="M34 40 C34 26 66 26 66 40 C66 54 62 60 62 64 L58 64 C58 56 62 52 62 44 C62 34 38 34 38 44 C38 52 42 56 42 64 L38 64 C38 60 34 54 34 40 Z" fill="#B45309" />
        
        <!-- Face Details -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="44.5" cy="40.5" r="0.6" fill="#FFFFFF" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <circle cx="54.5" cy="40.5" r="0.6" fill="#FFFFFF" />
        <path d="M48 46 Q50 49 52 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
        
        <!-- Camera hanging in front -->
        <rect x="40" y="62" width="20" height="13" rx="2" fill="#334155" />
        <circle cx="50" cy="68.5" r="4.5" fill="#0EA5E9" stroke="#FFFFFF" stroke-width="1.5" />
        <rect x="42" y="59" width="4" height="3" fill="#1E293B" rx="0.5" />
        <circle cx="56" cy="64" r="1" fill="#EF4444" />
      </svg>
    `)
  },
  {
    id: "pilot-uniform",
    name: "Capt. Liam (Pilot)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EFF6FF" />
            <stop offset="100%" stop-color="#DBEAFE" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg3)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Pilot Suit -->
        <path d="M18 82 C18 64 82 64 82 82 Z" fill="#1E3A8A" />
        <!-- White shirt triangle cutout -->
        <polygon points="50,82 40,64 60,64" fill="#FFFFFF" />
        <!-- Gold tie -->
        <polygon points="50,66 48,82 52,82" fill="#EAB308" />
        <!-- Gold wings pin on chest -->
        <path d="M28 72 L36 72 L32 74 Z" fill="#EAB308" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="43" r="13" fill="#FED7AA" />
        
        <!-- Hair & Pilot Cap -->
        <path d="M37 40 C37 32 63 32 63 40 Z" fill="#1E293B" />
        <rect x="36" y="24" width="28" height="9" fill="#1E3A8A" rx="1.5" />
        <ellipse cx="50" cy="30" rx="15" ry="2" fill="#0F172A" /> <!-- Visor -->
        <!-- Gold badge on cap -->
        <polygon points="50,23 46,27 54,27" fill="#EAB308" />
        <circle cx="50" cy="27" r="1.5" fill="#EAB308" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <path d="M47 46 Q50 49 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "traveler-passport",
    name: "Oliver W. (Jetsetter)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F0FDF4" />
            <stop offset="100%" stop-color="#DCFCE7" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg4)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Cloud backdrop -->
        <circle cx="25" cy="45" r="12" fill="#FFFFFF" opacity="0.6" />
        <circle cx="35" cy="48" r="10" fill="#FFFFFF" opacity="0.6" />
        
        <!-- Suitcase behind -->
        <rect x="68" y="48" width="16" height="30" rx="3" fill="#F97316" />
        <rect x="73" y="38" width="6" height="10" fill="none" stroke="#F97316" stroke-width="2" />
        
        <!-- Character Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#2563EB" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FDBA74" />
        <circle cx="50" cy="43" r="13" fill="#FDBA74" />
        
        <!-- Hair -->
        <path d="M37 40 C37 28 63 28 63 40 Z" fill="#78350F" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <path d="M47 46 Q50 49 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
        
        <!-- Passport in hand -->
        <rect x="18" y="58" width="14" height="20" rx="1.5" fill="#991B1B" transform="rotate(-15 18 58)" />
        <rect x="21" y="61" width="8" height="12" fill="none" stroke="#EAB308" stroke-width="1" transform="rotate(-15 18 58)" />
        <circle cx="25" cy="67" r="1.5" fill="#EAB308" />
      </svg>
    `)
  },
  {
    id: "sombrero-beach",
    name: "Mateo L. (Suntanner)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg5" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#38BDF8" />
            <stop offset="70%" stop-color="#7DD3FC" />
            <stop offset="100%" stop-color="#FEF08A" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg5)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Beach sand & waves -->
        <path d="M5 75 Q25 70 50 75 Q75 80 95 75 L95 98 L5 98 Z" fill="#FEF08A" />
        
        <!-- Character Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#F1F5F9" />
        <path d="M30 68 L50 58 L70 68 Z" fill="#EF4444" opacity="0.8" /> <!-- Poncho detail -->
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="43" r="13" fill="#FED7AA" />
        
        <!-- Mustache & Beard -->
        <path d="M38 43 C38 52 42 55 50 55 C58 55 62 52 62 43 Z" fill="#1E293B" opacity="0.95" />
        <path d="M42 45 Q50 49 58 45" stroke="#0F172A" stroke-width="3" stroke-linecap="round" fill="none" />
        
        <!-- Sunglasses -->
        <rect x="38" y="38" width="11" height="5" rx="1.5" fill="#0F172A" />
        <rect x="51" y="38" width="11" height="5" rx="1.5" fill="#0F172A" />
        <line x1="49" y1="40" x2="51" y2="40" stroke="#0F172A" stroke-width="1.5" />
        
        <!-- Sombrero hat -->
        <path d="M32 30 C32 15 68 15 68 30 Z" fill="#EAB308" />
        <!-- Red band -->
        <path d="M33 27 C40 25 60 25 67 27 L67 30 C60 28 40 28 33 30 Z" fill="#EF4444" />
        <!-- Hat brim -->
        <ellipse cx="50" cy="30" rx="26" ry="4" fill="#CA8A04" />
      </svg>
    `)
  },
  {
    id: "explorer-binoculars",
    name: "Arthur K. (Explorer)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ECFDF5" />
            <stop offset="100%" stop-color="#A7F3D0" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg6)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Forest backdrop -->
        <path d="M12 78 L28 48 L44 78 Z" fill="#047857" opacity="0.3" />
        <path d="M55 78 L72 40 L88 78 Z" fill="#065F46" opacity="0.4" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#B45309" />
        <rect x="42" y="68" width="16" height="15" fill="#D97706" />
        
        <!-- Binoculars around neck -->
        <rect x="41" y="60" width="7" height="11" rx="1" fill="#1E293B" />
        <rect x="52" y="60" width="7" height="11" rx="1" fill="#1E293B" />
        <line x1="43" y1="62" x2="57" y2="62" stroke="#475569" stroke-width="2" />
        <path d="M38 65 C38 52 62 52 62 65" stroke="#0F172A" stroke-width="1.5" fill="none" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FDBA74" />
        <circle cx="50" cy="43" r="13" fill="#FDBA74" />
        
        <!-- Explorer Pith Hat -->
        <path d="M36 33 C36 20 64 20 64 33 Z" fill="#D97706" />
        <ellipse cx="50" cy="33" rx="18" ry="3" fill="#B45309" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <path d="M47 46 Q50 49 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "paris-lover",
    name: "Chloe M. (Romanticist)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg7" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FCD34D" />
            <stop offset="50%" stop-color="#F472B6" />
            <stop offset="100%" stop-color="#E11D48" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg7)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Eiffel Tower Silhouette -->
        <path d="M38 78 L47 38 L53 38 L62 78 Z" fill="#FFFFFF" opacity="0.25" />
        <line x1="40" y1="70" x2="60" y2="70" stroke="#FFFFFF" stroke-width="2" opacity="0.3" />
        <line x1="44" y1="55" x2="56" y2="55" stroke="#FFFFFF" stroke-width="2" opacity="0.3" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#F472B6" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="43" r="13" fill="#FED7AA" />
        
        <!-- Hair & Red Beret -->
        <path d="M35 44 C35 28 65 28 65 44 C65 58 35 58 35 44 Z" fill="#451A03" />
        <ellipse cx="50" cy="30" rx="14" ry="4" fill="#BE123C" transform="rotate(-10 50 30)" />
        <rect x="47" y="24" width="3" height="4" fill="#BE123C" transform="rotate(-10 50 30)" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="42" r="2" fill="#1E293B" />
        <circle cx="55" cy="42" r="2" fill="#1E293B" />
        <path d="M47 47 Q50 50 53 47" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "hiker-compass",
    name: "Lucas T. (Navigator)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg8" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FEF9C3" />
            <stop offset="100%" stop-color="#FEF08A" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg8)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#047857" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="43" r="13" fill="#FED7AA" />
        
        <!-- Hair -->
        <path d="M36 38 C36 26 64 26 64 38 Z" fill="#78350F" />
        
        <!-- Compass in hand -->
        <circle cx="74" cy="64" r="11" fill="#475569" stroke="#FFFFFF" stroke-width="1.5" />
        <circle cx="74" cy="64" r="9" fill="#FFFFFF" />
        <polygon points="74,58 77,64 74,66 71,64" fill="#EF4444" />
        <polygon points="74,70 77,64 74,66 71,64" fill="#3B82F6" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="42" r="2" fill="#1E293B" />
        <circle cx="55" cy="42" r="2" fill="#1E293B" />
        <path d="M47 47 Q50 50 53 47" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "bearded-traveler",
    name: "Ben D. (Backpacker)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg9" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFEDD5" />
            <stop offset="100%" stop-color="#FFD8A8" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg9)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#9A3412" />
        <rect x="34" y="65" width="32" height="20" rx="2" fill="#4F46E5" /> <!-- Backpack strap block -->
        
        <!-- Head & Neck -->
        <rect x="46" y="52" width="8" height="10" fill="#FDBA74" />
        <circle cx="50" cy="43" r="14" fill="#FDBA74" />
        
        <!-- Hair & Full Beard -->
        <path d="M35 42 C35 28 65 28 65 42 C65 58 35 58 35 42 Z" fill="#451A03" />
        <path d="M40 43 C40 38 60 38 60 43 C60 48 57 52 50 52 C43 52 40 48 40 43 Z" fill="#FDBA74" />
        
        <!-- Explorer Hat -->
        <path d="M37 32 C37 20 63 20 63 32 Z" fill="#CA8A04" />
        <ellipse cx="50" cy="32" rx="17" ry="2.5" fill="#A16207" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <path d="M47 46 Q50 48 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "boat-surfer",
    name: "Isabella G. (Sailor)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg10" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#E0F2FE" />
            <stop offset="100%" stop-color="#38BDF8" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg10)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Sea and Sail -->
        <polygon points="50,68 75,25 50,25" fill="#FFFFFF" opacity="0.8" />
        <path d="M5 70 Q25 65 50 70 Q75 75 95 70 L95 98 L5 98 Z" fill="#0284C7" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#EC4899" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="44" r="13" fill="#FED7AA" />
        
        <!-- Long Wavy Hair -->
        <path d="M35 44 C35 28 65 28 65 44 C65 58 62 65 62 65 L58 65 C58 52 61 46 61 42 C61 32 39 32 39 42 C39 46 42 52 42 65 L38 65 C38 65 35 58 35 44 Z" fill="#B45309" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="42" r="2" fill="#1E293B" />
        <circle cx="55" cy="42" r="2" fill="#1E293B" />
        <path d="M47 47 Q50 50 53 47" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "globe-notebook",
    name: "Noah H. (Researcher)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg11" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EDE9FE" />
            <stop offset="100%" stop-color="#DDD6FE" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg11)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Globe Backdrop -->
        <circle cx="75" cy="45" r="14" fill="#3B82F6" opacity="0.3" />
        <path d="M68 45 A7 7 0 0 1 82 45" stroke="#FFFFFF" stroke-width="1" fill="none" opacity="0.5" />
        <line x1="75" y1="31" x2="75" y2="59" stroke="#FFFFFF" stroke-width="1" opacity="0.5" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#6366F1" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FDBA74" />
        <circle cx="50" cy="43" r="13" fill="#FDBA74" />
        
        <!-- Hair & Glasses -->
        <path d="M37 38 C37 26 63 26 63 38 Z" fill="#1E293B" />
        <!-- Cute glasses -->
        <circle cx="44" cy="41" r="4" fill="none" stroke="#1E293B" stroke-width="1.5" />
        <circle cx="56" cy="41" r="4" fill="none" stroke="#1E293B" stroke-width="1.5" />
        <line x1="48" y1="41" x2="52" y2="41" stroke="#1E293B" stroke-width="1.5" />
        
        <!-- Eyes & Face -->
        <circle cx="44" cy="41" r="1.5" fill="#1E293B" />
        <circle cx="56" cy="41" r="1.5" fill="#1E293B" />
        <path d="M47 47 Q50 50 53 47" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "temple-explorer",
    name: "Siriwat P. (Historian)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg12" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FEF3C7" />
            <stop offset="100%" stop-color="#FDE68A" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg12)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Pagoda Silhouette -->
        <polygon points="12,78 22,50 32,78" fill="#D97706" opacity="0.25" />
        <polygon points="26,78 40,40 54,78" fill="#B45309" opacity="0.3" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#EAB308" />
        
        <!-- Camera on neck -->
        <rect x="42" y="66" width="16" height="11" rx="1.5" fill="#334155" />
        <circle cx="50" cy="71.5" r="3.5" fill="#0F172A" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="43" r="13" fill="#FED7AA" />
        
        <!-- Hair -->
        <path d="M37 38 C37 26 63 26 63 38 Z" fill="#1E293B" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <path d="M47 46 Q50 49 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "camper-van",
    name: "Mia J. (Roadtripper)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg13" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ECFCCB" />
            <stop offset="100%" stop-color="#D9F99D" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg13)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- RV window silhouette -->
        <rect x="25" y="55" width="50" height="30" rx="4" fill="#F59E0B" />
        <rect x="58" y="60" width="12" height="12" rx="1.5" fill="#38BDF8" />
        
        <!-- Character Body -->
        <path d="M15 82 C15 65 45 65 45 82 Z" fill="#4ADE80" />
        
        <!-- Neck & Head -->
        <rect x="28" y="55" width="6" height="10" fill="#FED7AA" />
        <circle cx="31" cy="46" r="11" fill="#FED7AA" />
        
        <!-- Cap and Hair -->
        <path d="M22 43 Q31 33 40 43 Z" fill="#E11D48" />
        <path d="M22 44 C22 36 40 36 40 44 Z" fill="#78350F" />
        
        <!-- Eyes & Smile -->
        <circle cx="28" cy="44" r="1.5" fill="#1E293B" />
        <circle cx="34" cy="44" r="1.5" fill="#1E293B" />
        <path d="M29 48 Q31 50 33 48" stroke="#1E293B" stroke-width="1.2" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "waterfall-hiker",
    name: "Finn O. (Nature-Lover)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg14" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#CCFBF1" />
            <stop offset="100%" stop-color="#2DD4BF" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg14)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Waterfall streams -->
        <rect x="42" y="20" width="16" height="58" fill="#38BDF8" opacity="0.6" />
        <path d="M42 70 Q45 74 50 70 Q55 66 58 70 L58 78 L42 78 Z" fill="#0284C7" opacity="0.8" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#16A34A" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="43" r="13" fill="#FED7AA" />
        
        <!-- Explorer Hat -->
        <path d="M37 32 C37 20 63 20 63 32 Z" fill="#CA8A04" />
        <ellipse cx="50" cy="32" rx="16" ry="2.5" fill="#A16207" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <path d="M47 46 Q50 49 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "airport-bags",
    name: "Lily P. (Voyager)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg15" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F3E8FF" />
            <stop offset="100%" stop-color="#E9D5FF" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg15)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Suitcases -->
        <rect x="16" y="56" width="16" height="26" rx="3" fill="#EA580C" />
        <rect x="21" y="48" width="6" height="8" fill="none" stroke="#EA580C" stroke-width="2" />
        
        <rect x="68" y="52" width="18" height="30" rx="3" fill="#EC4899" />
        <rect x="74" y="44" width="6" height="8" fill="none" stroke="#EC4899" stroke-width="2" />
        
        <!-- Body -->
        <path d="M24 82 C24 68 76 68 76 82 Z" fill="#8B5CF6" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FDBA74" />
        <circle cx="50" cy="43" r="13" fill="#FDBA74" />
        
        <!-- Hair -->
        <path d="M36 38 C36 24 64 24 64 38 Z" fill="#451A03" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <path d="M47 46 Q50 49 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "train-passenger",
    name: "Leo V. (Rail-Pass)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg16" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F1F5F9" />
            <stop offset="100%" stop-color="#E2E8F0" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg16)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Train structure background -->
        <rect x="10" y="35" width="80" height="40" rx="6" fill="#334155" />
        <rect x="15" y="40" width="30" height="25" rx="2" fill="#38BDF8" opacity="0.8" />
        <rect x="55" y="40" width="30" height="25" rx="2" fill="#38BDF8" opacity="0.8" />
        <line x1="10" y1="68" x2="90" y2="68" stroke="#EF4444" stroke-width="3" />
        
        <!-- Character Body -->
        <path d="M22 82 C22 68 48 68 48 82 Z" fill="#F97316" />
        
        <!-- Neck & Head -->
        <rect x="31" y="55" width="6" height="10" fill="#FED7AA" />
        <circle cx="34" cy="46" r="11" fill="#FED7AA" />
        
        <!-- Hair -->
        <path d="M25 44 C25 34 43 34 43 44 Z" fill="#78350F" />
        
        <!-- Eyes & Smile -->
        <circle cx="31" cy="44" r="1.5" fill="#1E293B" />
        <circle cx="37" cy="44" r="1.5" fill="#1E293B" />
        <path d="M32 48 Q34 50 36 48" stroke="#1E293B" stroke-width="1.2" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "ocean-surfer",
    name: "Kai N. (Surfer)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg17" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#60A5FA" />
            <stop offset="100%" stop-color="#1D4ED8" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg17)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Large Wave -->
        <path d="M5 80 Q25 65 50 80 Q75 95 95 80 L95 98 L5 98 Z" fill="#0284C7" />
        <!-- Surfboard next to guy -->
        <rect x="68" y="25" width="12" height="55" rx="6" fill="#F59E0B" transform="rotate(15 68 25)" />
        <line x1="72" y1="28" x2="82" y2="72" stroke="#10B981" stroke-width="3" />
        
        <!-- Body -->
        <path d="M15 82 C15 68 70 68 70 82 Z" fill="#EA580C" />
        
        <!-- Neck & Head -->
        <rect x="42" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="46" cy="43" r="13" fill="#FED7AA" />
        
        <!-- Blonde Beach Hair -->
        <path d="M34 38 C34 26 58 26 58 38 Z" fill="#D97706" />
        
        <!-- Eyes & Face -->
        <circle cx="42" cy="41" r="2" fill="#1E293B" />
        <circle cx="50" cy="41" r="2" fill="#1E293B" />
        <path d="M43 46 Q46 48 49 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "map-reader",
    name: "Zoe B. (Sightseer)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg18" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE4E6" />
            <stop offset="100%" stop-color="#FECDD3" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg18)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#0D9488" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="43" r="13" fill="#FED7AA" />
        
        <!-- Hair & Headband -->
        <path d="M36 38 C36 24 64 24 64 38 Z" fill="#78350F" />
        <path d="M36 32 C40 30 60 30 64 32" stroke="#EF4444" stroke-width="3.5" fill="none" />
        
        <!-- Map held in hands -->
        <rect x="30" y="58" width="40" height="22" rx="2" fill="#A7F3D0" stroke="#047857" stroke-width="1.5" transform="rotate(-5 50 69)" />
        <path d="M36 60 L44 70 L54 62" stroke="#EF4444" stroke-width="2" fill="none" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <path d="M47 46 Q50 48 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "globe-suitcases",
    name: "Mason G. (Globetrotter)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg19" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E0F2FE" />
            <stop offset="100%" stop-color="#BAE6FD" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg19)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- World Globe -->
        <circle cx="50" cy="74" r="24" fill="#0284C7" opacity="0.9" />
        <path d="M26 74 A24 24 0 0 1 74 74" stroke="#E0F2FE" stroke-width="1.5" fill="none" opacity="0.6" />
        <path d="M50 50 A24 24 0 0 1 50 98" stroke="#E0F2FE" stroke-width="1.5" fill="none" opacity="0.6" />
        
        <!-- Rolling suitcase next to globe -->
        <rect x="16" y="62" width="20" height="28" rx="4" fill="#EA580C" />
        <rect x="22" y="54" width="8" height="8" stroke="#EA580C" stroke-width="2.5" fill="none" />
      </svg>
    `)
  },
  {
    id: "tropical-beach",
    name: "Sofia K. (Resorter)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg20" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFEDD5" />
            <stop offset="70%" stop-color="#FED7AA" />
            <stop offset="100%" stop-color="#38BDF8" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg20)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Palm leaf vector -->
        <path d="M12 25 Q35 15 50 35 M12 25 Q20 38 32 38" stroke="#15803D" stroke-width="3" stroke-linecap="round" fill="none" />
        
        <!-- Body -->
        <path d="M24 82 C24 68 76 68 76 82 Z" fill="#EC4899" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="43" r="13" fill="#FED7AA" />
        
        <!-- Sunglasses resting on head -->
        <path d="M36 38 C36 24 64 24 64 38 Z" fill="#451A03" />
        <rect x="41" y="30" width="8" height="4" rx="1" fill="#1E293B" />
        <rect x="51" y="30" width="8" height="4" rx="1" fill="#1E293B" />
        <line x1="49" y1="32" x2="51" y2="32" stroke="#1E293B" stroke-width="1" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <path d="M47 46 Q50 48 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "mountain-trekker",
    name: "Aaron J. (Alpinist)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg21" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#D1FAE5" />
            <stop offset="100%" stop-color="#A7F3D0" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg21)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Mountain Peak -->
        <polygon points="15,75 50,25 85,75" fill="#059669" />
        <polygon points="40,39 50,25 60,39" fill="#FFFFFF" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#EF4444" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="43" r="13" fill="#FED7AA" />
        
        <!-- Hair -->
        <path d="M37 38 C37 26 63 26 63 38 Z" fill="#78350F" />
        
        <!-- Eyes & Smile -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <path d="M47 46 Q50 49 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "giza-pyramids",
    name: "Youssef M. (Egyptologist)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg22" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FEF3C7" />
            <stop offset="100%" stop-color="#F59E0B" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg22)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Great Pyramids Backdrop -->
        <polygon points="10,78 36,44 62,78" fill="#D97706" />
        <polygon points="46,78 68,48 90,78" fill="#B45309" />
        <circle cx="78" cy="28" r="8" fill="#EF4444" opacity="0.8" /> <!-- Hot Sun -->
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#1E293B" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FDBA74" />
        <circle cx="50" cy="44" r="13" fill="#FDBA74" />
        
        <!-- Sunglasses & Hair -->
        <path d="M38 38 C38 27 62 27 62 38 Z" fill="#78350F" />
        <rect x="40" y="38" width="8" height="4" rx="1.5" fill="#0F172A" />
        <rect x="52" y="38" width="8" height="4" rx="1.5" fill="#0F172A" />
        <line x1="48" y1="40" x2="52" y2="40" stroke="#0F172A" stroke-width="1" />
        
        <!-- Smile -->
        <path d="M47 46 Q50 48 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "historic-columns",
    name: "Elena G. (Sightseer)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg23" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F8FAFC" />
            <stop offset="100%" stop-color="#E2E8F0" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg23)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Columns Silhouette Backdrop -->
        <rect x="22" y="30" width="8" height="48" fill="#94A3B8" opacity="0.4" />
        <rect x="18" y="26" width="16" height="5" fill="#64748B" opacity="0.4" />
        <rect x="70" y="30" width="8" height="48" fill="#94A3B8" opacity="0.4" />
        <rect x="66" y="26" width="16" height="5" fill="#64748B" opacity="0.4" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#4F46E5" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="43" r="13" fill="#FED7AA" />
        
        <!-- Hair -->
        <path d="M36 38 C36 24 64 24 64 38 Z" fill="#78350F" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <path d="M47 46 Q50 49 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  },
  {
    id: "lagoon-tanktop",
    name: "Isla B. (Islander)",
    url: svgToDataUrl(`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg24" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#CCFBF1" />
            <stop offset="100%" stop-color="#14B8A6" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#bg24)" stroke="#FFFFFF" stroke-width="2" />
        
        <!-- Lagoon Waves -->
        <path d="M5 75 Q25 70 50 75 Q75 80 95 75 L95 98 L5 98 Z" fill="#0F766E" />
        
        <!-- Body -->
        <path d="M22 82 C22 68 78 68 78 82 Z" fill="#0EA5E9" />
        
        <!-- Neck & Head -->
        <rect x="46" y="52" width="8" height="10" fill="#FED7AA" />
        <circle cx="50" cy="43" r="13" fill="#FED7AA" />
        
        <!-- Long Wavy Hair with Flower -->
        <path d="M35 40 C35 24 65 24 65 40 C65 54 62 64 62 64 L58 64 C58 52 61 46 61 42 C61 32 39 32 39 42 C39 46 42 52 42 64 L38 64 L35 40 Z" fill="#78350F" />
        <circle cx="62" cy="34" r="3.5" fill="#EF4444" /> <!-- Hibiscus Flower -->
        <circle cx="64" cy="36" r="1.5" fill="#FEF08A" />
        
        <!-- Eyes & Face -->
        <circle cx="45" cy="41" r="2" fill="#1E293B" />
        <circle cx="55" cy="41" r="2" fill="#1E293B" />
        <path d="M47 46 Q50 49 53 46" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    `)
  }
];
