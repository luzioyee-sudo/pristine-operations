// @ts-nocheck
/**
 * Ribble App Centralized Design Tokens & Visual System
 * 
 * MASTER PALETTE:
 * 1. Primary Background (Off-White): #DBDBE5
 * 2. Secondary Neutral (Soft Gray):  #DBDBE5
 * 3. Primary Accent (Mint Green):    #ACD1FD
 * 4. Secondary Accent (Lavender):    #958CE8
 * 5. Primary Dark (Charcoal):        #21222D
 */

export const RIBBLE_COLORS = {
  // 1. Off-White (Dominant Foundation)
  offWhite: '#DBDBE5',
  
  // 2. Soft Gray (Supporting Neutral)
  softGray: '#DBDBE5',
  softGrayLight: '#DBDBE5',
  softGrayDark: '#ACD1FD',

  // 3. Mint Green (Primary Brand Accent)
  mint: '#ACD1FD',
  mintHover: '#958CE8',
  mintLight: '#DBDBE5',
  mintDark: '#21222D', // text color on mint

  // 4. Lavender (Secondary Brand Accent)
  lavender: '#958CE8',
  lavenderHover: '#ACD1FD',
  lavenderLight: '#DBDBE5',
  lavenderDark: '#21222D', // text color on lavender

  // 5. Charcoal (Primary Dark / Contrast / Text)
  charcoal: '#21222D',
  charcoalHover: '#21222D',
  charcoalLight: '#21222D',
  charcoalMuted: '#545565',

  // Semantic Tokens
  semantic: {
    background: '#DBDBE5',
    surface: '#FFFFFF',
    surfaceSubtle: '#DBDBE5',
    surfaceNeutral: '#DBDBE5',
    
    primaryAccent: '#ACD1FD',
    primaryAccentHover: '#958CE8',
    secondaryAccent: '#958CE8',
    secondaryAccentHover: '#ACD1FD',

    textPrimary: '#21222D',
    textSecondary: '#21222D',
    textMuted: '#545565',
    textOnDark: '#DBDBE5',
    textOnMint: '#21222D',
    textOnLavender: '#21222D',

    border: '#DBDBE5',
    borderSubtle: 'rgba(219, 219, 229, 0.6)',
    borderFocus: '#ACD1FD',

    success: '#ACD1FD',
    active: '#ACD1FD',
    streak: '#ACD1FD',
    category: '#958CE8',
    special: '#958CE8',
    error: '#E06D6D',
    errorLight: '#FCE8E8',
  }
} as const;

/**
 * Standard semantic Tailwind class strings for Ribble UI
 */
export const RIBBLE_CLASSES = {
  // Page canvas foundation
  pageCanvas: 'bg-[#DBDBE5] text-[#21222D] min-h-screen',
  
  // Card surfaces
  card: 'bg-white border border-[#DBDBE5] rounded-3xl shadow-xs transition-all',
  cardNeutral: 'bg-[#DBDBE5] text-[#21222D] rounded-3xl transition-all',
  cardMint: 'bg-[#ACD1FD] text-[#21222D] rounded-3xl transition-all',
  cardLavender: 'bg-[#958CE8] text-[#21222D] rounded-3xl transition-all',
  cardDark: 'bg-[#21222D] text-[#DBDBE5] rounded-3xl transition-all',
  
  // Buttons
  buttonPrimary: 'bg-[#ACD1FD] hover:bg-[#958CE8] active:scale-[0.98] text-[#21222D] font-bold rounded-2xl px-5 py-2.5 transition-all shadow-xs cursor-pointer',
  buttonSecondary: 'bg-[#DBDBE5] hover:bg-[#DBDBE5] active:scale-[0.98] text-[#21222D] font-bold rounded-2xl px-5 py-2.5 transition-all cursor-pointer',
  buttonDark: 'bg-[#21222D] hover:bg-[#21222D] active:scale-[0.98] text-[#DBDBE5] font-bold rounded-2xl px-5 py-2.5 transition-all shadow-xs cursor-pointer',
  buttonLavender: 'bg-[#958CE8] hover:bg-[#ACD1FD] active:scale-[0.98] text-[#21222D] font-bold rounded-2xl px-5 py-2.5 transition-all shadow-xs cursor-pointer',
  buttonGhost: 'text-[#21222D] hover:bg-[#DBDBE5]/50 rounded-2xl font-bold px-4 py-2 transition-all cursor-pointer',

  // Active / Selected badges & items
  activeNav: 'bg-[#ACD1FD] text-[#21222D] font-bold shadow-xs',
  inactiveNav: 'text-[#21222D]/80 hover:text-[#21222D] hover:bg-[#DBDBE5]/50',

  // Accent highlights & badges
  badgeMint: 'bg-[#ACD1FD] text-[#21222D] font-bold rounded-full px-3 py-1 text-xs',
  badgeLavender: 'bg-[#958CE8] text-[#21222D] font-bold rounded-full px-3 py-1 text-xs',
  badgeNeutral: 'bg-[#DBDBE5] text-[#21222D] font-bold rounded-full px-3 py-1 text-xs',
  badgeDark: 'bg-[#21222D] text-[#DBDBE5] font-bold rounded-full px-3 py-1 text-xs',
  
  // Inputs
  input: 'bg-white border border-[#DBDBE5] text-[#21222D] placeholder-[#545565] focus:border-[#ACD1FD] focus:ring-2 focus:ring-[#ACD1FD]/40 rounded-2xl transition-all outline-none',
};
