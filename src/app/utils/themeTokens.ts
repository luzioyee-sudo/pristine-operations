// @ts-nocheck
/**
 * Ribble App Centralized Design Tokens & Visual System
 * 
 * MASTER PALETTE:
 * 1. Primary Background (Off-White): #EFF1EE
 * 2. Secondary Neutral (Soft Gray):  #D0D2CF
 * 3. Primary Accent (Mint Green):    #A4F5A6
 * 4. Secondary Accent (Lavender):    #B2A1FF
 * 5. Primary Dark (Charcoal):        #222222
 */

export const RIBBLE_COLORS = {
  // 1. Off-White (Dominant Foundation)
  offWhite: '#EFF1EE',
  
  // 2. Soft Gray (Supporting Neutral)
  softGray: '#D0D2CF',
  softGrayLight: '#DFE1DE',
  softGrayDark: '#B8BAB6',

  // 3. Mint Green (Primary Brand Accent)
  mint: '#A4F5A6',
  mintHover: '#92E894',
  mintLight: '#D4FBD5',
  mintDark: '#222222', // text color on mint

  // 4. Lavender (Secondary Brand Accent)
  lavender: '#B2A1FF',
  lavenderHover: '#A08EFF',
  lavenderLight: '#E3DCFF',
  lavenderDark: '#222222', // text color on lavender

  // 5. Charcoal (Primary Dark / Contrast / Text)
  charcoal: '#222222',
  charcoalHover: '#333333',
  charcoalLight: '#444444',
  charcoalMuted: '#666666',

  // Semantic Tokens
  semantic: {
    background: '#EFF1EE',
    surface: '#FFFFFF',
    surfaceSubtle: '#EFF1EE',
    surfaceNeutral: '#D0D2CF',
    
    primaryAccent: '#A4F5A6',
    primaryAccentHover: '#92E894',
    secondaryAccent: '#B2A1FF',
    secondaryAccentHover: '#A08EFF',

    textPrimary: '#222222',
    textSecondary: '#555555',
    textMuted: '#777777',
    textOnDark: '#EFF1EE',
    textOnMint: '#222222',
    textOnLavender: '#222222',

    border: '#D0D2CF',
    borderSubtle: 'rgba(208, 210, 207, 0.6)',
    borderFocus: '#A4F5A6',

    success: '#A4F5A6',
    active: '#A4F5A6',
    streak: '#A4F5A6',
    category: '#B2A1FF',
    special: '#B2A1FF',
    error: '#E06D6D',
    errorLight: '#FCE8E8',
  }
} as const;

/**
 * Standard semantic Tailwind class strings for Ribble UI
 */
export const RIBBLE_CLASSES = {
  // Page canvas foundation
  pageCanvas: 'bg-[#EFF1EE] text-[#222222] min-h-screen',
  
  // Card surfaces
  card: 'bg-white border border-[#D0D2CF] rounded-3xl shadow-xs transition-all',
  cardNeutral: 'bg-[#D0D2CF] text-[#222222] rounded-3xl transition-all',
  cardMint: 'bg-[#A4F5A6] text-[#222222] rounded-3xl transition-all',
  cardLavender: 'bg-[#B2A1FF] text-[#222222] rounded-3xl transition-all',
  cardDark: 'bg-[#222222] text-[#EFF1EE] rounded-3xl transition-all',
  
  // Buttons
  buttonPrimary: 'bg-[#A4F5A6] hover:bg-[#92E894] active:scale-[0.98] text-[#222222] font-bold rounded-2xl px-5 py-2.5 transition-all shadow-xs cursor-pointer',
  buttonSecondary: 'bg-[#D0D2CF] hover:bg-[#C2C4C0] active:scale-[0.98] text-[#222222] font-bold rounded-2xl px-5 py-2.5 transition-all cursor-pointer',
  buttonDark: 'bg-[#222222] hover:bg-[#333333] active:scale-[0.98] text-[#EFF1EE] font-bold rounded-2xl px-5 py-2.5 transition-all shadow-xs cursor-pointer',
  buttonLavender: 'bg-[#B2A1FF] hover:bg-[#A08EFF] active:scale-[0.98] text-[#222222] font-bold rounded-2xl px-5 py-2.5 transition-all shadow-xs cursor-pointer',
  buttonGhost: 'text-[#222222] hover:bg-[#D0D2CF]/50 rounded-2xl font-bold px-4 py-2 transition-all cursor-pointer',

  // Active / Selected badges & items
  activeNav: 'bg-[#A4F5A6] text-[#222222] font-bold shadow-xs',
  inactiveNav: 'text-[#222222]/80 hover:text-[#222222] hover:bg-[#D0D2CF]/50',

  // Accent highlights & badges
  badgeMint: 'bg-[#A4F5A6] text-[#222222] font-bold rounded-full px-3 py-1 text-xs',
  badgeLavender: 'bg-[#B2A1FF] text-[#222222] font-bold rounded-full px-3 py-1 text-xs',
  badgeNeutral: 'bg-[#D0D2CF] text-[#222222] font-bold rounded-full px-3 py-1 text-xs',
  badgeDark: 'bg-[#222222] text-[#EFF1EE] font-bold rounded-full px-3 py-1 text-xs',
  
  // Inputs
  input: 'bg-white border border-[#D0D2CF] text-[#222222] placeholder-[#888888] focus:border-[#A4F5A6] focus:ring-2 focus:ring-[#A4F5A6]/40 rounded-2xl transition-all outline-none',
};
