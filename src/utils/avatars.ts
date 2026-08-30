// 24 Richly detailed, 3D-shaded, stylized character avatars matching the platform's avatar system
// Written as standalone, optimized high-fidelity SVG data URIs with rich gradients, ambient lighting, and depth.

export interface AvatarItem {
  id: string;
  name: string;
  role?: string;
  url: string;
}

const svgToDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim().replace(/\s+/g, ' '))}`;
};

export const TRAVEL_AVATARS: AvatarItem[] = [
  // ROW 1
  {
    id: "hoodie-boy-glasses",
    name: "Leo (Student & Tech)",
    role: "Tech Enthusiast",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFF1F2"/>
            <stop offset="100%" stop-color="#FFE4E6"/>
          </radialGradient>
          <linearGradient id="hoodieRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EF4444"/>
            <stop offset="100%" stop-color="#B91C1C"/>
          </linearGradient>
          <linearGradient id="faceLeo" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FED7AA"/>
            <stop offset="100%" stop-color="#FDBA74"/>
          </linearGradient>
          <linearGradient id="hairLeo" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#331A15"/>
            <stop offset="100%" stop-color="#1A0D0A"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg1)"/>
        <!-- Shoulders & Red Hoodie -->
        <path d="M20 115 C20 88 100 88 100 115 Z" fill="url(#hoodieRed)"/>
        <!-- Hoodie Strings & Zipper -->
        <path d="M48 85 L48 105" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M72 85 L72 105" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        <polygon points="60,88 52,115 68,115" fill="#475569"/>
        <!-- Inner Hoodie Collar / Neck -->
        <path d="M44 86 C44 76 76 76 76 86 Z" fill="#DC2626"/>
        <rect x="54" y="65" width="12" height="15" fill="#FDBA74" rx="3"/>
        <!-- Head -->
        <ellipse cx="60" cy="54" rx="19" ry="21" fill="url(#faceLeo)"/>
        <!-- Ears -->
        <circle cx="40" cy="54" r="5" fill="#FDBA74"/>
        <circle cx="80" cy="54" r="5" fill="#FDBA74"/>
        <!-- Hair -->
        <path d="M38 48 C36 28 84 28 82 48 C76 34 68 36 60 34 C50 36 44 34 38 48 Z" fill="url(#hairLeo)"/>
        <path d="M40 38 C48 30 72 30 80 38 C75 32 64 34 60 32 C54 34 45 32 40 38 Z" fill="#451A03"/>
        <!-- Glasses -->
        <rect x="43" y="46" width="13" height="10" rx="3" fill="none" stroke="#1E293B" stroke-width="2.5"/>
        <rect x="64" y="46" width="13" height="10" rx="3" fill="none" stroke="#1E293B" stroke-width="2.5"/>
        <line x1="56" y1="50" x2="64" y2="50" stroke="#1E293B" stroke-width="2.5"/>
        <!-- Eyes -->
        <circle cx="49.5" cy="51" r="2.2" fill="#0F172A"/>
        <circle cx="48.5" cy="50" r="0.8" fill="#FFFFFF"/>
        <circle cx="70.5" cy="51" r="2.2" fill="#0F172A"/>
        <circle cx="69.5" cy="50" r="0.8" fill="#FFFFFF"/>
        <!-- Cheeks -->
        <circle cx="46" cy="58" r="2.5" fill="#F43F5E" opacity="0.3"/>
        <circle cx="74" cy="58" r="2.5" fill="#F43F5E" opacity="0.3"/>
        <!-- Smile -->
        <path d="M55 60 Q60 65 65 60" stroke="#1E293B" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "ginger-girl-pink",
    name: "Clara (Traveler)",
    role: "Community Guide",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FDF2F8"/>
            <stop offset="100%" stop-color="#FCE7F3"/>
          </radialGradient>
          <linearGradient id="pinkTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F472B6"/>
            <stop offset="100%" stop-color="#DB2777"/>
          </linearGradient>
          <linearGradient id="gingerHair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#EA580C"/>
            <stop offset="100%" stop-color="#C2410C"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg2)"/>
        <!-- Long Hair Behind -->
        <path d="M35 50 C25 80 40 105 45 110 C50 110 70 110 75 110 C80 105 95 80 85 50 Z" fill="url(#gingerHair)"/>
        <!-- Body / Pink Blouse -->
        <path d="M25 115 C25 90 95 90 95 115 Z" fill="url(#pinkTop)"/>
        <polygon points="60,92 50,115 70,115" fill="#FBCFE8"/>
        <!-- Neck -->
        <rect x="55" y="66" width="10" height="15" fill="#FED7AA" rx="3"/>
        <!-- Head -->
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Front Hair Locks -->
        <path d="M38 48 C36 28 84 28 82 48 C76 34 68 34 60 36 C52 34 44 34 38 48 Z" fill="url(#gingerHair)"/>
        <path d="M36 50 C32 65 38 80 42 85 C44 78 40 65 42 52 Z" fill="url(#gingerHair)"/>
        <path d="M84 50 C88 65 82 80 78 85 C76 78 80 65 78 52 Z" fill="url(#gingerHair)"/>
        <!-- Eyes with Lashes -->
        <circle cx="50" cy="52" r="2.2" fill="#0F172A"/>
        <circle cx="49" cy="51" r="0.8" fill="#FFFFFF"/>
        <path d="M47 48 Q50 46 53 48" stroke="#0F172A" stroke-width="1.2" fill="none"/>
        <circle cx="70" cy="52" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="51" r="0.8" fill="#FFFFFF"/>
        <path d="M67 48 Q70 46 73 48" stroke="#0F172A" stroke-width="1.2" fill="none"/>
        <!-- Blush -->
        <circle cx="46" cy="58" r="3" fill="#F43F5E" opacity="0.35"/>
        <circle cx="74" cy="58" r="3" fill="#F43F5E" opacity="0.35"/>
        <!-- Sweet Smile -->
        <path d="M55 60 Q60 65 65 60" stroke="#9F1239" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "pilot-captain",
    name: "Capt. Liam (Flight Pilot)",
    role: "Aviation Captain",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#EFF6FF"/>
            <stop offset="100%" stop-color="#DBEAFE"/>
          </radialGradient>
          <linearGradient id="navyUniform" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E3A8A"/>
            <stop offset="100%" stop-color="#0F172A"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg3)"/>
        <!-- Pilot Uniform & Shoulders -->
        <path d="M20 115 C20 85 100 85 100 115 Z" fill="url(#navyUniform)"/>
        <!-- Epaulets with Gold Stripes -->
        <rect x="22" y="94" width="16" height="6" rx="2" fill="#0F172A"/>
        <line x1="24" y1="96" x2="36" y2="96" stroke="#FBBF24" stroke-width="1.5"/>
        <line x1="24" y1="98" x2="36" y2="98" stroke="#FBBF24" stroke-width="1.5"/>
        <rect x="82" y="94" width="16" height="6" rx="2" fill="#0F172A"/>
        <line x1="84" y1="96" x2="96" y2="96" stroke="#FBBF24" stroke-width="1.5"/>
        <line x1="84" y1="98" x2="96" y2="98" stroke="#FBBF24" stroke-width="1.5"/>
        <!-- Shirt & Tie -->
        <polygon points="60,82 48,115 72,115" fill="#FFFFFF"/>
        <polygon points="60,85 57,115 63,115" fill="#0F172A"/>
        <!-- Neck -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <!-- Head -->
        <ellipse cx="60" cy="55" rx="17" ry="19" fill="#FED7AA"/>
        <!-- Pilot Cap -->
        <path d="M42 42 C40 28 80 28 78 42 Z" fill="#1E3A8A"/>
        <rect x="40" y="38" width="40" height="7" fill="#0F172A" rx="1"/>
        <ellipse cx="60" cy="44" rx="24" ry="4" fill="#0F172A"/>
        <!-- Gold Pilot Wings Emblem -->
        <circle cx="60" cy="35" r="3.5" fill="#F59E0B"/>
        <path d="M53 35 L67 35" stroke="#F59E0B" stroke-width="1.5"/>
        <!-- Eyes & Smile -->
        <circle cx="52" cy="54" r="2" fill="#0F172A"/>
        <circle cx="68" cy="54" r="2" fill="#0F172A"/>
        <path d="M56 61 Q60 64 64 61" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "hiker-safari-pole",
    name: "Arthur (Backpacker)",
    role: "Trail Explorer",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg4" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FEF3C7"/>
            <stop offset="100%" stop-color="#FDE68A"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg4)"/>
        <!-- Orange/Yellow Expedition Shirt -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#F59E0B"/>
        <!-- Backpack Straps -->
        <rect x="36" y="88" width="7" height="27" fill="#B45309" rx="1"/>
        <rect x="77" y="88" width="7" height="27" fill="#B45309" rx="1"/>
        <!-- Trekking Pole in Hand -->
        <rect x="88" y="55" width="4" height="60" fill="#475569" rx="1"/>
        <circle cx="90" cy="55" r="3.5" fill="#0F172A"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Hair -->
        <path d="M40 45 C38 28 82 28 80 45 Z" fill="#78350F"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="53" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="53" r="2.2" fill="#0F172A"/>
        <path d="M55 60 Q60 65 65 60" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="47" cy="58" r="2.5" fill="#F97316" opacity="0.3"/>
        <circle cx="73" cy="58" r="2.5" fill="#F97316" opacity="0.3"/>
      </svg>
    `)
  },
  {
    id: "beach-vacation-girl",
    name: "Elena (Sunseeker)",
    role: "Beach Lover",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg5" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#E0F2FE"/>
            <stop offset="100%" stop-color="#BAE6FD"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg5)"/>
        <!-- Island & Sea horizon behind -->
        <path d="M10 80 L35 60 L60 80 Z" fill="#0284C7" opacity="0.4"/>
        <path d="M5 85 Q60 75 115 85 L115 115 L5 115 Z" fill="#38BDF8" opacity="0.3"/>
        <!-- Coral Tank Top -->
        <path d="M25 115 C25 90 95 90 95 115 Z" fill="#F43F5E"/>
        <!-- Neck -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Hair -->
        <path d="M38 52 C35 75 42 95 44 100 C50 85 45 65 44 55 Z" fill="#331A15"/>
        <path d="M82 52 C85 75 78 95 76 100 C70 85 75 65 76 55 Z" fill="#331A15"/>
        <path d="M40 45 C38 30 82 30 80 45 Z" fill="#331A15"/>
        <!-- Sunglasses -->
        <rect x="42" y="47" width="14" height="10" rx="3" fill="#0F172A"/>
        <rect x="64" y="47" width="14" height="10" rx="3" fill="#0F172A"/>
        <line x1="56" y1="51" x2="64" y2="51" stroke="#0F172A" stroke-width="2"/>
        <!-- Straw Sunhat -->
        <ellipse cx="60" cy="38" rx="36" ry="7" fill="#FDE047"/>
        <path d="M44 38 C44 24 76 24 76 38 Z" fill="#EAB308"/>
        <path d="M44 36 C52 34 68 34 76 36" stroke="#EF4444" stroke-width="2.5"/>
        <!-- Smile -->
        <path d="M55 62 Q60 66 65 62" stroke="#9F1239" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "safari-ranger",
    name: "Marcus (Safari Guide)",
    role: "Nature Ranger",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg6" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ECFDF5"/>
            <stop offset="100%" stop-color="#D1FAE5"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg6)"/>
        <!-- Green Ranger Jacket -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#15803D"/>
        <polygon points="60,88 52,115 68,115" fill="#CA8A04"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Mustache -->
        <path d="M50 60 Q60 64 70 60 Q65 65 50 60" fill="#451A03"/>
        <!-- Safari Fedora Hat -->
        <path d="M42 36 C42 22 78 22 78 36 Z" fill="#CA8A04"/>
        <ellipse cx="60" cy="36" rx="30" ry="6" fill="#A16207"/>
        <path d="M44 34 C52 32 68 32 76 34" stroke="#1E293B" stroke-width="2.5"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="52" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="52" r="2.2" fill="#0F172A"/>
        <path d="M56 64 Q60 67 64 64" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },

  // ROW 2
  {
    id: "afro-bun-girl",
    name: "Maya (Cultural Guide)",
    role: "Culture Creator",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg7" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FCE7F3"/>
            <stop offset="100%" stop-color="#FBCFE8"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg7)"/>
        <!-- High Afro Bun -->
        <circle cx="60" cy="26" r="16" fill="#171717"/>
        <!-- Pink Sleeveless Top -->
        <path d="M25 115 C25 90 95 90 95 115 Z" fill="#EC4899"/>
        <!-- Neck -->
        <rect x="54" y="66" width="12" height="15" fill="#9A3412" rx="2"/>
        <!-- Head -->
        <ellipse cx="60" cy="55" rx="18" ry="20" fill="#9A3412"/>
        <!-- Front Hairline -->
        <path d="M42 48 C40 36 80 36 78 48 C72 40 68 40 60 40 C52 40 48 40 42 48 Z" fill="#171717"/>
        <!-- Gold Earrings -->
        <circle cx="40" cy="56" r="3.5" fill="none" stroke="#FBBF24" stroke-width="2"/>
        <circle cx="80" cy="56" r="3.5" fill="none" stroke="#FBBF24" stroke-width="2"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="53" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="53" r="2.2" fill="#0F172A"/>
        <path d="M55 62 Q60 67 65 62" stroke="#451A03" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "french-artist-beret",
    name: "Pierre (Art Historian)",
    role: "Gallery Specialist",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg8" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FEF9C3"/>
            <stop offset="100%" stop-color="#FEF08A"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg8)"/>
        <!-- Breton Striped Shirt -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#FFFFFF"/>
        <path d="M23 96 L97 96" stroke="#1E293B" stroke-width="4"/>
        <path d="M21 106 L99 106" stroke="#1E293B" stroke-width="4"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- French Mustache -->
        <path d="M48 60 Q60 65 72 60 Q66 64 60 62 Q54 64 48 60" fill="#1E293B"/>
        <!-- Black Beret -->
        <ellipse cx="60" cy="35" rx="24" ry="8" fill="#1E293B" transform="rotate(-8 60 35)"/>
        <rect x="58" y="24" width="4" height="6" fill="#1E293B" transform="rotate(-8 60 35)"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="52" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="52" r="2.2" fill="#0F172A"/>
      </svg>
    `)
  },
  {
    id: "bearded-glasses-guy",
    name: "Oliver (City Explorer)",
    role: "Urban Nomad",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg9" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#EFF6FF"/>
            <stop offset="100%" stop-color="#DBEAFE"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg9)"/>
        <!-- Royal Blue T-shirt -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#3B82F6"/>
        <!-- Neck -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <!-- Head & Full Beard -->
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <path d="M42 55 C42 75 78 75 78 55 C78 70 70 76 60 76 C50 76 42 70 42 55 Z" fill="#78350F"/>
        <!-- Hair -->
        <path d="M40 45 C38 28 82 28 80 45 Z" fill="#78350F"/>
        <!-- Round Glasses -->
        <circle cx="49" cy="50" r="6" fill="none" stroke="#1E293B" stroke-width="2"/>
        <circle cx="71" cy="50" r="6" fill="none" stroke="#1E293B" stroke-width="2"/>
        <line x1="55" y1="50" x2="65" y2="50" stroke="#1E293B" stroke-width="2"/>
        <!-- Eyes & Smile -->
        <circle cx="49" cy="50" r="2" fill="#0F172A"/>
        <circle cx="71" cy="50" r="2" fill="#0F172A"/>
        <path d="M56 62 Q60 65 64 62" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "cheerful-orange-hair",
    name: "Sophie (Food Tour Lead)",
    role: "Culinary Guide",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg10" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FDF2F8"/>
            <stop offset="100%" stop-color="#FCE7F3"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg10)"/>
        <!-- Long Orange Hair -->
        <path d="M35 48 C25 78 38 105 44 110 C50 110 70 110 76 110 C82 105 95 78 85 48 Z" fill="#EA580C"/>
        <!-- Magenta Blouse -->
        <path d="M25 115 C25 90 95 90 95 115 Z" fill="#DB2777"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Front Bangs -->
        <path d="M38 46 C36 28 84 28 82 46 C76 34 68 34 60 36 C52 34 44 34 38 46 Z" fill="#EA580C"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="53" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="53" r="2.2" fill="#0F172A"/>
        <path d="M55 61 Q60 66 65 61" stroke="#9F1239" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="46" cy="58" r="3" fill="#F43F5E" opacity="0.35"/>
        <circle cx="74" cy="58" r="3" fill="#F43F5E" opacity="0.35"/>
      </svg>
    `)
  },
  {
    id: "blue-hoodie-boy",
    name: "Lucas (Active Explorer)",
    role: "Adventure Seeker",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg11" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#EDE9FE"/>
            <stop offset="100%" stop-color="#DDD6FE"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg11)"/>
        <!-- Royal Blue Hoodie -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#2563EB"/>
        <path d="M44 86 C44 76 76 76 76 86 Z" fill="#1D4ED8"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Curly Dark Hair -->
        <circle cx="44" cy="38" r="7" fill="#1E293B"/>
        <circle cx="54" cy="34" r="8" fill="#1E293B"/>
        <circle cx="66" cy="34" r="8" fill="#1E293B"/>
        <circle cx="76" cy="38" r="7" fill="#1E293B"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="53" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="53" r="2.2" fill="#0F172A"/>
        <path d="M55 61 Q60 66 65 61" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "baseball-cap-guy",
    name: "Kai (Streetwear)",
    role: "Urban Nomad",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg12" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FEF3C7"/>
            <stop offset="100%" stop-color="#FDE68A"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg12)"/>
        <!-- Navy Jacket -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#0F172A"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Baseball Cap -->
        <path d="M40 42 C40 28 80 28 80 42 Z" fill="#1E293B"/>
        <ellipse cx="60" cy="42" rx="24" ry="4" fill="#0F172A"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="53" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="53" r="2.2" fill="#0F172A"/>
        <path d="M55 61 Q60 65 65 61" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },

  // ROW 3
  {
    id: "delivery-courier",
    name: "Sam (Ticket Logistics)",
    role: "Operations Express",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg13" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ECFDF5"/>
            <stop offset="100%" stop-color="#D1FAE5"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg13)"/>
        <!-- Green Courier Polo -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#16A34A"/>
        <!-- Cardboard Box in hands -->
        <rect x="42" y="90" width="36" height="25" rx="3" fill="#D97706"/>
        <line x1="60" y1="90" x2="60" y2="115" stroke="#B45309" stroke-width="2"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Green Cap -->
        <path d="M42 42 C42 30 78 30 78 42 Z" fill="#15803D"/>
        <ellipse cx="60" cy="42" rx="22" ry="3.5" fill="#166534"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="53" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="53" r="2.2" fill="#0F172A"/>
        <path d="M55 61 Q60 66 65 61" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "healthcare-surgeon",
    name: "Dr. Ethan (Safety Officer)",
    role: "Travel Safety",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg14" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#CCFBF1"/>
            <stop offset="100%" stop-color="#99F6E4"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg14)"/>
        <!-- Teal Scrubs -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#0D9488"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Surgical Cap -->
        <path d="M40 45 C40 28 80 28 80 45 Z" fill="#0D9488"/>
        <!-- Medical Mask -->
        <rect x="44" y="56" width="32" height="18" rx="4" fill="#F0FDFA" stroke="#5EEAD4" stroke-width="1.5"/>
        <line x1="40" y1="60" x2="44" y2="60" stroke="#5EEAD4" stroke-width="1.5"/>
        <line x1="76" y1="60" x2="80" y2="60" stroke="#5EEAD4" stroke-width="1.5"/>
        <!-- Eyes -->
        <circle cx="51" cy="50" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="50" r="2.2" fill="#0F172A"/>
      </svg>
    `)
  },
  {
    id: "bakery-barista",
    name: "Chloe (Barista & Cafe)",
    role: "Local Eats Expert",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg15" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#F3E8FF"/>
            <stop offset="100%" stop-color="#E9D5FF"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg15)"/>
        <!-- Pink Apron over Shirt -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#FFFFFF"/>
        <rect x="44" y="88" width="32" height="27" fill="#F43F5E" rx="2"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Twin Buns / Hair -->
        <circle cx="36" cy="46" r="8" fill="#451A03"/>
        <circle cx="84" cy="46" r="8" fill="#451A03"/>
        <path d="M38 46 C36 28 84 28 82 46 Z" fill="#451A03"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="53" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="53" r="2.2" fill="#0F172A"/>
        <path d="M55 61 Q60 66 65 61" stroke="#9F1239" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "coder-developer",
    name: "Devon (Tech Lead)",
    role: "System Engineer",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg16" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#E0F2FE"/>
            <stop offset="100%" stop-color="#BAE6FD"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg16)"/>
        <!-- Desktop Monitor in background -->
        <rect x="75" y="65" width="32" height="24" rx="2" fill="#0F172A"/>
        <rect x="78" y="68" width="26" height="18" rx="1" fill="#1E293B"/>
        <line x1="80" y1="72" x2="92" y2="72" stroke="#22C55E" stroke-width="1.5"/>
        <line x1="80" y1="76" x2="98" y2="76" stroke="#38BDF8" stroke-width="1.5"/>
        <!-- Teal Shirt -->
        <path d="M18 115 C18 88 80 88 80 115 Z" fill="#0D9488"/>
        <!-- Neck & Head -->
        <rect x="46" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="52" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Glasses -->
        <rect x="40" y="47" width="11" height="9" rx="2" fill="none" stroke="#1E293B" stroke-width="2"/>
        <rect x="55" y="47" width="11" height="9" rx="2" fill="none" stroke="#1E293B" stroke-width="2"/>
        <line x1="51" y1="51" x2="55" y2="51" stroke="#1E293B" stroke-width="2"/>
        <!-- Hair -->
        <path d="M34 45 C32 28 72 28 70 45 Z" fill="#451A03"/>
        <!-- Eyes & Smile -->
        <circle cx="45" cy="51" r="1.8" fill="#0F172A"/>
        <circle cx="60" cy="51" r="1.8" fill="#0F172A"/>
        <path d="M48 60 Q52 64 56 60" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "artist-painter-palette",
    name: "Amelie (Art Curator)",
    role: "Museum Artist",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg17" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#EDE9FE"/>
            <stop offset="100%" stop-color="#DDD6FE"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg17)"/>
        <!-- Blue Smock -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#2563EB"/>
        <!-- Palette in hand -->
        <ellipse cx="86" cy="94" rx="16" ry="12" fill="#FDE68A" transform="rotate(-15 86 94)"/>
        <circle cx="78" cy="90" r="2.5" fill="#EF4444"/>
        <circle cx="86" cy="88" r="2.5" fill="#3B82F6"/>
        <circle cx="94" cy="92" r="2.5" fill="#10B981"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Blue Beret -->
        <ellipse cx="60" cy="35" rx="24" ry="8" fill="#1D4ED8" transform="rotate(-10 60 35)"/>
        <!-- Hair -->
        <path d="M38 48 C36 34 84 34 82 48 Z" fill="#B45309"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="53" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="53" r="2.2" fill="#0F172A"/>
        <path d="M55 61 Q60 66 65 61" stroke="#9F1239" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "student-reading-book",
    name: "Noah (Historian)",
    role: "Heritage Scholar",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg18" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFE4E6"/>
            <stop offset="100%" stop-color="#FECDD3"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg18)"/>
        <!-- Pink Shirt -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#FB7185"/>
        <!-- Open Green Book in hands -->
        <path d="M40 92 L60 96 L80 92 L80 115 L60 118 L40 115 Z" fill="#10B981"/>
        <line x1="60" y1="96" x2="60" y2="118" stroke="#047857" stroke-width="2"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Round Glasses -->
        <circle cx="49" cy="50" r="5.5" fill="none" stroke="#991B1B" stroke-width="2"/>
        <circle cx="71" cy="50" r="5.5" fill="none" stroke="#991B1B" stroke-width="2"/>
        <line x1="54.5" y1="50" x2="65.5" y2="50" stroke="#991B1B" stroke-width="2"/>
        <!-- Hair -->
        <path d="M40 45 C38 28 82 28 80 45 Z" fill="#991B1B"/>
        <!-- Eyes & Smile -->
        <circle cx="49" cy="50" r="1.8" fill="#0F172A"/>
        <circle cx="71" cy="50" r="1.8" fill="#0F172A"/>
        <path d="M55 60 Q60 64 65 60" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },

  // ROW 4
  {
    id: "traveler-commuter-bag",
    name: "David (Flight Booking)",
    role: "Transit Specialist",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg19" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#E0F2FE"/>
            <stop offset="100%" stop-color="#BAE6FD"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg19)"/>
        <!-- Blue Puffer Jacket -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#0284C7"/>
        <!-- Briefcase in Hand -->
        <rect x="74" y="90" width="24" height="22" rx="3" fill="#B45309"/>
        <path d="M82 90 L82 86 C82 84 90 84 90 86 L90 90" stroke="#78350F" stroke-width="2" fill="none"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Yellow Cap with Blue Visor -->
        <path d="M42 42 C42 28 78 28 78 42 Z" fill="#FACC15"/>
        <ellipse cx="60" cy="42" rx="22" ry="3.5" fill="#0284C7"/>
        <!-- Glasses -->
        <rect x="44" y="48" width="12" height="9" rx="2" fill="none" stroke="#1E293B" stroke-width="2"/>
        <rect x="64" y="48" width="12" height="9" rx="2" fill="none" stroke="#1E293B" stroke-width="2"/>
        <line x1="56" y1="52" x2="64" y2="52" stroke="#1E293B" stroke-width="2"/>
        <!-- Eyes & Smile -->
        <circle cx="50" cy="52" r="1.8" fill="#0F172A"/>
        <circle cx="70" cy="52" r="1.8" fill="#0F172A"/>
        <path d="M55 61 Q60 65 65 61" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "swimmer-goggles",
    name: "Kyle (Water Sports)",
    role: "Scuba & Watersport",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg20" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFEDD5"/>
            <stop offset="100%" stop-color="#FED7AA"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg20)"/>
        <!-- Blue Athletic Tank Top -->
        <path d="M25 115 C25 90 95 90 95 115 Z" fill="#0284C7"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Blue Swim Cap & Goggles -->
        <path d="M40 46 C40 28 80 28 80 46 Z" fill="#0284C7"/>
        <rect x="43" y="44" width="14" height="10" rx="3" fill="#38BDF8" stroke="#0F172A" stroke-width="2"/>
        <rect x="63" y="44" width="14" height="10" rx="3" fill="#38BDF8" stroke="#0F172A" stroke-width="2"/>
        <line x1="57" y1="49" x2="63" y2="49" stroke="#0F172A" stroke-width="2"/>
        <!-- Smile -->
        <path d="M55 62 Q60 67 65 62" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "green-hoodie-beard",
    name: "Liam (Nordic Explorer)",
    role: "Mountain Guide",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg21" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#D1FAE5"/>
            <stop offset="100%" stop-color="#A7F3D0"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg21)"/>
        <!-- Forest Green Hoodie -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#059669"/>
        <path d="M44 86 C44 76 76 76 76 86 Z" fill="#047857"/>
        <!-- Neck & Head with Full Beard -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <path d="M42 55 C42 76 78 76 78 55 C78 72 70 78 60 78 C50 78 42 72 42 55 Z" fill="#1E293B"/>
        <!-- Hair -->
        <path d="M40 45 C38 28 82 28 80 45 Z" fill="#1E293B"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="51" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="51" r="2.2" fill="#0F172A"/>
        <path d="M56 63 Q60 66 64 63" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "winter-beanie-hiker",
    name: "Jack (Alpine Climber)",
    role: "Expedition Pro",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg22" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFEDD5"/>
            <stop offset="100%" stop-color="#FED7AA"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg22)"/>
        <!-- Orange Winter Puffer Parka -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#EA580C"/>
        <!-- Neck & Head with Beard -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <path d="M42 56 C42 76 78 76 78 56 C78 72 70 78 60 78 C50 78 42 72 42 56 Z" fill="#78350F"/>
        <!-- Red Beanie Hat -->
        <path d="M40 44 C40 24 80 24 80 44 Z" fill="#DC2626"/>
        <rect x="38" y="40" width="44" height="7" rx="2" fill="#B91C1C"/>
        <circle cx="60" cy="22" r="4" fill="#B91C1C"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="52" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="52" r="2.2" fill="#0F172A"/>
        <path d="M56 64 Q60 67 64 64" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "gourmet-chef",
    name: "Chef Antoine (Gastronomy)",
    role: "Michelin Guide",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg23" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#F1F5F9"/>
            <stop offset="100%" stop-color="#E2E8F0"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg23)"/>
        <!-- White Double-Breasted Chef Uniform -->
        <path d="M22 115 C22 88 98 88 98 115 Z" fill="#FFFFFF"/>
        <!-- Black Chef Buttons -->
        <circle cx="54" cy="96" r="1.8" fill="#1E293B"/>
        <circle cx="66" cy="96" r="1.8" fill="#1E293B"/>
        <circle cx="54" cy="106" r="1.8" fill="#1E293B"/>
        <circle cx="66" cy="106" r="1.8" fill="#1E293B"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Tall White Chef Toque Hat -->
        <path d="M44 36 L76 36 L78 22 C78 12 42 12 42 22 Z" fill="#FFFFFF"/>
        <circle cx="48" cy="18" r="7" fill="#FFFFFF"/>
        <circle cx="60" cy="14" r="8" fill="#FFFFFF"/>
        <circle cx="72" cy="18" r="7" fill="#FFFFFF"/>
        <rect x="42" y="32" width="36" height="6" rx="1" fill="#E2E8F0"/>
        <!-- Eyes & Smile -->
        <circle cx="51" cy="52" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="52" r="2.2" fill="#0F172A"/>
        <path d="M55 60 Q60 65 65 60" stroke="#0F172A" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  },
  {
    id: "elegant-headband-woman",
    name: "Grace (VIP Concierge)",
    role: "VIP Specialist",
    url: svgToDataUrl(`
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg24" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#CCFBF1"/>
            <stop offset="100%" stop-color="#99F6E4"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bg24)"/>
        <!-- Long Dark Hair Behind -->
        <path d="M35 50 C25 80 40 105 45 110 C50 110 70 110 75 110 C80 105 95 80 85 50 Z" fill="#1E293B"/>
        <!-- Emerald Green Blouse -->
        <path d="M25 115 C25 90 95 90 95 115 Z" fill="#047857"/>
        <!-- Neck & Head -->
        <rect x="54" y="66" width="12" height="15" fill="#FED7AA" rx="2"/>
        <ellipse cx="60" cy="54" rx="18" ry="20" fill="#FED7AA"/>
        <!-- Orange Headband & Hair -->
        <path d="M38 46 C36 28 84 28 82 46 Z" fill="#1E293B"/>
        <path d="M38 40 C44 32 76 32 82 40" stroke="#EA580C" stroke-width="4" stroke-linecap="round" fill="none"/>
        <!-- Eyes with Lashes -->
        <circle cx="50" cy="52" r="2.2" fill="#0F172A"/>
        <circle cx="49" cy="51" r="0.8" fill="#FFFFFF"/>
        <circle cx="70" cy="52" r="2.2" fill="#0F172A"/>
        <circle cx="69" cy="51" r="0.8" fill="#FFFFFF"/>
        <!-- Blush & Smile -->
        <circle cx="46" cy="58" r="3" fill="#F43F5E" opacity="0.3"/>
        <circle cx="74" cy="58" r="3" fill="#F43F5E" opacity="0.3"/>
        <path d="M55 61 Q60 66 65 61" stroke="#9F1239" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    `)
  }
];
