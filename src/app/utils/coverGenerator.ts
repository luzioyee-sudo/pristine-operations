// @ts-nocheck
export interface CoverPalette {
  id: string;
  name: string;
  hex: string;
  gradient: string; // Tailwind gradient classes
  spineGradient: string; // gradient overlay for the left spine
  spineHighlight: string; // border or highlight color next to spine
  accentColor: string; // text/borders color overlay
  textColor: string; // text color for title
  patternType: 'bold-quote' | 'geometric-grid' | 'framed-art' | 'classic-serif' | 'minimal-modern' | 'arch-modern' | 'luxury-gold' | 'bauhaus-circle' | 'botanical-vintage' | 'celestial-arc' | 'diagonal-split' | 'landscape-illustration' | 'dark-linen-whimsy' | 'periodic-mosaic' | 'deep-oceanic-vortex' | 'abstract-block-meditation' | 'half-mosaic-poetry';
  bgHex: string;
  titleHex: string;
  subColorHex?: string; // secondary color for diagonal split or landscape accents
}

export const BRAND_COVER_PALETTES: CoverPalette[] = [
  {
    id: 'color-1856B7',
    name: 'Read People Dark Teal',
    hex: '#1A3A4B',
    gradient: 'from-[#1A3A4B] via-[#234A5F] to-[#122A37]',
    spineGradient: 'from-black/40 via-black/15 to-transparent',
    spineHighlight: 'bg-yellow-300/30',
    accentColor: 'text-[#FFD700]',
    textColor: 'text-[#FFD700]',
    patternType: 'bold-quote',
    bgHex: '#1A3A4B',
    titleHex: '#FFD700'
  },
  {
    id: 'color-F5ADCD',
    name: 'Subconscious Cream & Grid',
    hex: '#FDF8EE',
    gradient: 'from-[#FDF8EE] via-[#FAF1E0] to-[#F3E5CD]',
    spineGradient: 'from-black/15 via-black/5 to-transparent',
    spineHighlight: 'bg-amber-800/10',
    accentColor: 'text-amber-900',
    textColor: 'text-[#222222]',
    patternType: 'geometric-grid',
    bgHex: '#FDF8EE',
    titleHex: '#222222'
  },
  {
    id: 'color-E6DFD3',
    name: 'Cream & Slate Diagonal Split',
    hex: '#E6DFD3',
    gradient: 'from-[#E6DFD3] to-[#638A9F]',
    spineGradient: 'from-black/20 via-black/5 to-transparent',
    spineHighlight: 'bg-stone-400/30',
    accentColor: 'text-[#2B3A42]',
    textColor: 'text-[#1E293B]',
    patternType: 'diagonal-split',
    bgHex: '#E6DFD3',
    subColorHex: '#638A9F',
    titleHex: '#1E293B'
  },
  {
    id: 'color-[#9EBC67]',
    name: 'Meadow Horizon Illustrated',
    hex: '#9EBC67',
    gradient: 'from-[#9EBC67] to-[#7B9E43]',
    spineGradient: 'from-black/25 via-black/10 to-transparent',
    spineHighlight: 'bg-white/20',
    accentColor: 'text-[#223311]',
    textColor: 'text-[#1E2D12]',
    patternType: 'landscape-illustration',
    bgHex: '#9EBC67',
    subColorHex: '#4E6E28',
    titleHex: '#1E2D12'
  },
  {
    id: 'color-F3C623',
    name: 'Yellow & Peach Diagonal Split',
    hex: '#F3C623',
    gradient: 'from-[#F3C623] to-[#F2A183]',
    spineGradient: 'from-black/20 via-black/5 to-transparent',
    spineHighlight: 'bg-white/30',
    accentColor: 'text-[#2B2B2B]',
    textColor: 'text-[#222222]',
    patternType: 'diagonal-split',
    bgHex: '#F3C623',
    subColorHex: '#F2A183',
    titleHex: '#222222'
  },
  {
    id: 'color-E5B770',
    name: 'Sunset Desert Horizon',
    hex: '#E5B770',
    gradient: 'from-[#E5B770] to-[#C89243]',
    spineGradient: 'from-black/25 via-black/8 to-transparent',
    spineHighlight: 'bg-amber-100/30',
    accentColor: 'text-[#3D250F]',
    textColor: 'text-[#2D1B0A]',
    patternType: 'landscape-illustration',
    bgHex: '#E5B770',
    subColorHex: '#B26F21',
    titleHex: '#2D1B0A'
  },
  {
    id: 'color-530517',
    name: 'Burgundy Crimson Classic',
    hex: '#530517',
    gradient: 'from-[#530517] via-[#66081D] to-[#3E030F]',
    spineGradient: 'from-black/35 via-black/15 to-transparent',
    spineHighlight: 'bg-amber-300/30',
    accentColor: 'text-amber-200',
    textColor: 'text-white',
    patternType: 'classic-serif',
    bgHex: '#530517',
    titleHex: '#FFFFFF'
  },
  {
    id: 'color-1E1D22',
    name: 'Dark Charcoal Gold Luxury',
    hex: '#1E1D22',
    gradient: 'from-[#1E1D22] via-[#2A2930] to-[#121215]',
    spineGradient: 'from-white/10 via-white/4 to-transparent',
    spineHighlight: 'bg-white/20',
    accentColor: 'text-[#E5C158]',
    textColor: 'text-[#E5C158]',
    patternType: 'luxury-gold',
    bgHex: '#1E1D22',
    titleHex: '#E5C158'
  },
  {
    id: 'color-E28743',
    name: 'Terracotta Bauhaus',
    hex: '#E28743',
    gradient: 'from-[#E28743] via-[#EC9450] to-[#C96F2C]',
    spineGradient: 'from-black/25 via-black/10 to-transparent',
    spineHighlight: 'bg-white/25',
    accentColor: 'text-[#2D1B0D]',
    textColor: 'text-[#2D1B0D]',
    patternType: 'bauhaus-circle',
    bgHex: '#E28743',
    titleHex: '#2D1B0D'
  }
];

// Helper to hash a title string or palette ID to a specific CoverPalette
export const getCoverPaletteByTitle = (title: string): CoverPalette => {
  if (!title) return BRAND_COVER_PALETTES[0];
  const lower = title.toLowerCase();

  // If title is actually a palette ID match
  const foundById = BRAND_COVER_PALETTES.find(p => p.id === title);
  if (foundById) return foundById;

  if (lower.includes('read people')) return BRAND_COVER_PALETTES[0];
  if (lower.includes('subconscious')) return BRAND_COVER_PALETTES[1];

  let hash = 0;
  const cleanTitle = title.trim();
  for (let i = 0; i < cleanTitle.length; i++) {
    hash = cleanTitle.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BRAND_COVER_PALETTES.length;
  return BRAND_COVER_PALETTES[index];
};

// Helper to strip file extension from file name/title
export const cleanBookTitle = (title: string): string => {
  if (!title) return '';
  return title
    .replace(/\.[a-zA-Z0-9]+$/i, '') // strip extension e.g. .pdf, .txt, .epub
    .replace(/[-_]/g, ' ') // replace hyphens and underscores with spaces
    .replace(/\s+/g, ' ') // replace multiple spaces with single space
    .trim();
};

// Helper to check if a palette is light or dark for appropriate contrast
export const isLightPalette = (paletteId?: string): boolean => {
  if (!paletteId) return false;
  return ['color-F5ADCD', 'color-E6DFD3', 'color-F3C623', 'color-E5B770', 'color-[#9EBC67]'].includes(paletteId);
};

// Determine appropriate font-size class or inline style based on clean title length
export const getBookCoverFontSizeClass = (cleanTitle: string): string => {
  const length = cleanTitle.length;
  if (length <= 14) {
    return 'text-[13px] sm:text-[14px] font-serif font-black text-left leading-[1.15]';
  } else if (length <= 25) {
    return 'text-[11px] sm:text-[12px] font-serif font-black text-left leading-[1.18]';
  } else if (length <= 40) {
    return 'text-[9.5px] sm:text-[10px] font-serif font-bold text-left leading-[1.2]';
  } else {
    return 'text-[8.5px] sm:text-[9px] font-serif font-bold text-left leading-[1.2]';
  }
};
