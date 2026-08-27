// @ts-nocheck
import React from 'react';
import { Star, Sparkles, BookOpen, Crown, Sun, Feather, Compass } from 'lucide-react';
import { DocumentFile } from '../types';
import { CoverPalette, cleanBookTitle, getBookCoverFontSizeClass } from '../utils/coverGenerator';

interface BookCoverProps {
  doc: DocumentFile;
  palette: CoverPalette;
  onToggleFavorite?: (e: React.MouseEvent, doc: DocumentFile) => void;
  className?: string;
  showSpine3D?: boolean;
}

export const BookCover: React.FC<BookCoverProps> = ({
  doc,
  palette,
  onToggleFavorite,
  className = '',
  showSpine3D = true
}) => {
  const cleanTitle = cleanBookTitle(doc.title || doc.name);
  const fontSizeClass = getBookCoverFontSizeClass(cleanTitle);

  return (
    <div className={`relative aspect-[1/1.45] w-full rounded-xl bg-white dark:bg-slate-900 shadow-md border border-black/10 dark:border-slate-800 transition-all duration-300 ${className}`}>
      {/* 3D Page Layers */}
      {showSpine3D && (
        <>
          {/* Right Page Edge (3D Layer) */}
          <div className="absolute top-1 bottom-1 -end-[3.5px] w-[3.5px] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 rounded-e border-e border-slate-300/80 dark:border-slate-700/80 shadow-xs pointer-events-none z-0" />
          
          {/* Bottom Page Layer */}
          <div className="absolute -bottom-[2.5px] start-2 end-1 h-[2.5px] bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 rounded-b pointer-events-none z-0" />
        </>
      )}

      {/* Pattern-based Renderers */}
      {palette.patternType === 'bold-quote' ? (
        /* 1. READ PEOPLE LIKE A BOOK STYLE (Dark Teal & Gold) */
        <div className="w-full h-full rounded-xl bg-[#1A3A4B] p-3 sm:p-3.5 flex flex-col justify-between text-[#FFD700] relative overflow-hidden ring-1 ring-black/10 z-10">
          <div className="absolute top-0 bottom-0 start-0 w-2.5 bg-gradient-to-r from-black/40 via-black/15 to-transparent pointer-events-none" />
          <div className="z-10 flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded bg-black/40 text-white text-[6.5px] font-black uppercase tracking-wider">
              {doc.language}
            </span>
            {onToggleFavorite && (
              <button onClick={(e) => onToggleFavorite(e, doc)} className="p-0.5 cursor-pointer">
                <Star className={`w-3.5 h-3.5 ${doc.favorite ? 'fill-current text-amber-300' : 'text-white/40'}`} />
              </button>
            )}
          </div>
          <div className="z-10 my-auto text-center px-1">
            <span className="text-amber-300/80 text-[8.5px] font-serif italic block mb-0.5">Speed-Read Anyone</span>
            <h4 className="text-xs sm:text-sm font-serif font-black uppercase tracking-tight leading-snug text-[#FFD700] drop-shadow-2xs">
              {cleanTitle}
            </h4>
          </div>
          <div className="z-10 border-t border-amber-400/30 pt-1.5 text-center">
            <span className="text-[7.5px] font-mono font-bold uppercase tracking-widest text-amber-200 block truncate">
              {doc.author || 'Patrick King'}
            </span>
          </div>
        </div>
      ) : palette.patternType === 'geometric-grid' ? (
        /* 2. THE POWER OF YOUR SUBCONSCIOUS MIND STYLE (Cream & Mosaic Grid) */
        <div className="w-full h-full rounded-xl bg-[#FDF8EE] p-3 sm:p-3.5 flex flex-col justify-between text-[#222222] relative overflow-hidden ring-1 ring-black/10 z-10">
          <div className="absolute top-0 bottom-0 start-0 w-2.5 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none" />
          <div className="z-10 flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded bg-amber-900/10 text-amber-900 text-[6.5px] font-black uppercase">
              {doc.language}
            </span>
            {onToggleFavorite && (
              <button onClick={(e) => onToggleFavorite(e, doc)} className="p-0.5 cursor-pointer">
                <Star className={`w-3.5 h-3.5 ${doc.favorite ? 'fill-current text-amber-500' : 'text-stone-300'}`} />
              </button>
            )}
          </div>
          <div className="z-10 text-center my-0.5">
            <h4 className="text-xs sm:text-xs font-serif font-black leading-tight text-[#222222] line-clamp-2">
              {cleanTitle}
            </h4>
          </div>
          {/* Geometric Mosaic Grid Pattern */}
          <div className="z-10 grid grid-cols-4 gap-0.5 p-1 bg-stone-200/50 rounded-md my-0.5">
            <div className="h-3 bg-[#D97706] rounded-2xs" />
            <div className="h-3 bg-[#0D9488] rounded-2xs" />
            <div className="h-3 bg-[#E11D48] rounded-2xs" />
            <div className="h-3 bg-[#4338CA] rounded-2xs" />
            <div className="h-3 bg-[#0284C7] rounded-2xs" />
            <div className="h-3 bg-[#CA8A04] rounded-2xs" />
            <div className="h-3 bg-[#059669] rounded-2xs" />
            <div className="h-3 bg-[#9333EA] rounded-2xs" />
          </div>
          <div className="z-10 border-t border-stone-300/60 pt-1 text-center">
            <span className="text-[7.5px] font-mono font-bold uppercase tracking-widest text-stone-600 block truncate">
              {doc.author || 'Joseph Murphy'}
            </span>
          </div>
        </div>
      ) : palette.patternType === 'framed-art' ? (
        /* 3. THE BODY KEEPS THE SCORE STYLE (Cobalt & White Framed Art) */
        <div className="w-full h-full rounded-xl bg-[#2C62B0] p-3 sm:p-3.5 flex flex-col justify-between text-white relative overflow-hidden ring-1 ring-black/10 z-10">
          <div className="absolute top-0 bottom-0 start-0 w-2.5 bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none" />
          <div className="z-10 flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded bg-white/20 text-white text-[6.5px] font-black uppercase">
              {doc.language}
            </span>
            {onToggleFavorite && (
              <button onClick={(e) => onToggleFavorite(e, doc)} className="p-0.5 cursor-pointer">
                <Star className={`w-3.5 h-3.5 ${doc.favorite ? 'fill-current text-amber-300' : 'text-white/40'}`} />
              </button>
            )}
          </div>
          <div className="z-10 text-center my-0.5">
            <h4 className="text-xs sm:text-xs font-serif font-black uppercase tracking-tight leading-tight text-white line-clamp-2">
              {cleanTitle}
            </h4>
          </div>
          {/* White Framed Artwork Box */}
          <div className="z-10 border-2 border-white bg-sky-950/40 rounded-md p-1.5 my-0.5 text-center flex flex-col items-center justify-center min-h-[40px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 mb-0.5" />
            <span className="text-[6px] uppercase tracking-widest font-mono text-white/90">Brain & Body</span>
          </div>
          <div className="z-10 border-t border-white/20 pt-1 text-center">
            <span className="text-[7.5px] font-mono font-bold uppercase tracking-widest text-white/90 block truncate">
              {doc.author || 'Bessel van der Kolk'}
            </span>
          </div>
        </div>
      ) : palette.patternType === 'classic-serif' ? (
        /* 4. BURGUNDY CRIMSON CLASSIC STYLE (Ornate Gold Frame & Gold Foil) */
        <div className="w-full h-full rounded-xl bg-[#530517] p-2.5 sm:p-3 flex flex-col justify-between text-white relative overflow-hidden ring-1 ring-black/10 z-10">
          <div className="absolute top-0 bottom-0 start-0 w-2.5 bg-gradient-to-r from-black/40 via-black/15 to-transparent pointer-events-none" />
          
          {/* Ornate Inner Double Hairline Frame */}
          <div className="w-full h-full border-2 border-amber-300/40 rounded-lg p-2 flex flex-col justify-between relative">
            <div className="absolute inset-0.5 border border-amber-300/20 rounded pointer-events-none" />

            <div className="z-10 flex items-center justify-between">
              <span className="px-1 py-0.5 rounded bg-black/40 text-amber-200 text-[6px] font-black uppercase">
                {doc.language}
              </span>
              {onToggleFavorite && (
                <button onClick={(e) => onToggleFavorite(e, doc)} className="p-0.5 cursor-pointer">
                  <Star className={`w-3.5 h-3.5 ${doc.favorite ? 'fill-current text-amber-300' : 'text-amber-200/40'}`} />
                </button>
              )}
            </div>

            <div className="z-10 text-center my-auto px-1">
              <Crown className="w-3.5 h-3.5 text-amber-300 mx-auto mb-1 opacity-80" />
              <h4 className="text-xs sm:text-xs font-serif font-black tracking-tight leading-tight text-amber-100 line-clamp-3">
                {cleanTitle}
              </h4>
            </div>

            <div className="z-10 border-t border-amber-300/30 pt-1 text-center">
              <span className="text-[7px] font-serif italic text-amber-200 block truncate">
                {doc.author || 'Classic Edition'}
              </span>
            </div>
          </div>
        </div>
      ) : palette.patternType === 'minimal-modern' ? (
        /* 5. BRIGHT CORAL RED MODERN POSTER STYLE */
        <div className="w-full h-full rounded-xl bg-[#FE495C] p-3 sm:p-3.5 flex flex-col justify-between text-white relative overflow-hidden ring-1 ring-black/10 z-10">
          <div className="absolute top-0 bottom-0 end-0 w-1/3 bg-[#8B0010]/30 pointer-events-none" />
          <div className="z-10 flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded-full bg-white text-[#FE495C] text-[6.5px] font-black uppercase tracking-wider shadow-xs">
              {doc.language}
            </span>
            {onToggleFavorite && (
              <button onClick={(e) => onToggleFavorite(e, doc)} className="p-0.5 cursor-pointer">
                <Star className={`w-3.5 h-3.5 ${doc.favorite ? 'fill-current text-amber-300' : 'text-white/50'}`} />
              </button>
            )}
          </div>

          <div className="z-10 my-auto text-start pe-2">
            <span className="text-[7px] font-mono uppercase tracking-widest text-white/80 block mb-1">
              Bestselling Fiction
            </span>
            <h4 className="text-xs sm:text-sm font-sans font-black tracking-tighter uppercase leading-tight text-white line-clamp-3">
              {cleanTitle}
            </h4>
          </div>

          <div className="z-10 border-t border-white/25 pt-1">
            <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-white/90 block truncate">
              {doc.author || 'Author'}
            </span>
          </div>
        </div>
      ) : palette.patternType === 'arch-modern' ? (
        /* 6. TURQUOISE ARCH MODERN STYLE */
        <div className="w-full h-full rounded-xl bg-[#26DBDC] p-3 sm:p-3.5 flex flex-col justify-between text-[#07192C] relative overflow-hidden ring-1 ring-black/10 z-10">
          <div className="absolute top-0 bottom-0 start-0 w-2.5 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none" />
          <div className="z-10 flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded bg-[#07192C]/15 text-[#07192C] text-[6.5px] font-black uppercase">
              {doc.language}
            </span>
            {onToggleFavorite && (
              <button onClick={(e) => onToggleFavorite(e, doc)} className="p-0.5 cursor-pointer">
                <Star className={`w-3.5 h-3.5 ${doc.favorite ? 'fill-current text-amber-500' : 'text-[#07192C]/40'}`} />
              </button>
            )}
          </div>

          {/* Arch Window Graphic */}
          <div className="z-10 border-2 border-[#07192C] rounded-t-full p-2 my-auto text-center bg-cyan-300/30 flex flex-col items-center justify-center min-h-[55px]">
            <Compass className="w-3.5 h-3.5 text-[#07192C] mb-1" />
            <h4 className="text-[10px] sm:text-[11px] font-sans font-black uppercase tracking-tight text-[#07192C] line-clamp-2">
              {cleanTitle}
            </h4>
          </div>

          <div className="z-10 border-t border-[#07192C]/20 pt-1 text-center">
            <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-[#07192C]/80 block truncate">
              {doc.author || 'Author'}
            </span>
          </div>
        </div>
      ) : palette.patternType === 'luxury-gold' ? (
        /* 7. CHARCOAL GOLD LUXURY CREST STYLE */
        <div className="w-full h-full rounded-xl bg-[#1E1D22] p-3 sm:p-3.5 flex flex-col justify-between text-[#E5C158] relative overflow-hidden ring-1 ring-black/10 z-10">
          <div className="absolute top-0 bottom-0 start-0 w-2.5 bg-gradient-to-r from-white/10 via-white/4 to-transparent pointer-events-none" />
          <div className="z-10 flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded border border-[#E5C158]/40 bg-black/50 text-[#E5C158] text-[6.5px] font-black uppercase">
              {doc.language}
            </span>
            {onToggleFavorite && (
              <button onClick={(e) => onToggleFavorite(e, doc)} className="p-0.5 cursor-pointer">
                <Star className={`w-3.5 h-3.5 ${doc.favorite ? 'fill-current text-[#E5C158]' : 'text-[#E5C158]/30'}`} />
              </button>
            )}
          </div>

          <div className="z-10 text-center my-auto px-1">
            <div className="w-5 h-5 rounded-full border border-[#E5C158] mx-auto mb-1 flex items-center justify-center">
              <Sun className="w-3 h-3 text-[#E5C158]" />
            </div>
            <h4 className="text-xs sm:text-xs font-serif font-black uppercase tracking-wider leading-snug text-[#E5C158] line-clamp-3">
              {cleanTitle}
            </h4>
          </div>

          <div className="z-10 border-t border-[#E5C158]/30 pt-1 text-center">
            <span className="text-[7.5px] font-mono font-bold uppercase tracking-widest text-[#E5C158]/90 block truncate">
              {doc.author || 'Author'}
            </span>
          </div>
        </div>
      ) : palette.patternType === 'bauhaus-circle' ? (
        /* 8. TERRACOTTA BAUHAUS STYLE */
        <div className="w-full h-full rounded-xl bg-[#E28743] p-3 sm:p-3.5 flex flex-col justify-between text-[#2D1B0D] relative overflow-hidden ring-1 ring-black/10 z-10">
          {/* Offset Bauhaus Sun Graphic */}
          <div className="absolute -bottom-6 -end-6 w-20 h-20 rounded-full bg-[#FAF3DD] pointer-events-none" />
          <div className="absolute top-8 -start-4 w-12 h-12 rounded-full bg-[#2D1B0D]/20 pointer-events-none" />

          <div className="z-10 flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded bg-[#2D1B0D] text-[#FAF3DD] text-[6.5px] font-black uppercase">
              {doc.language}
            </span>
            {onToggleFavorite && (
              <button onClick={(e) => onToggleFavorite(e, doc)} className="p-0.5 cursor-pointer">
                <Star className={`w-3.5 h-3.5 ${doc.favorite ? 'fill-current text-[#2D1B0D]' : 'text-[#2D1B0D]/40'}`} />
              </button>
            )}
          </div>

          <div className="z-10 my-auto text-start">
            <h4 className="text-xs sm:text-sm font-sans font-black uppercase tracking-tight leading-tight text-[#2D1B0D] line-clamp-3">
              {cleanTitle}
            </h4>
          </div>

          <div className="z-10 border-t-2 border-[#2D1B0D] pt-1">
            <span className="text-[7.5px] font-mono font-bold uppercase tracking-wider text-[#2D1B0D] block truncate">
              {doc.author || 'Author'}
            </span>
          </div>
        </div>
      ) : palette.patternType === 'botanical-vintage' ? (
        /* 9. EMERALD BOTANICAL VINTAGE STYLE */
        <div className="w-full h-full rounded-xl bg-[#1B4D3E] p-2.5 sm:p-3 flex flex-col justify-between text-[#FAF3DD] relative overflow-hidden ring-1 ring-black/10 z-10">
          <div className="absolute top-0 bottom-0 start-0 w-2.5 bg-gradient-to-r from-black/40 via-black/15 to-transparent pointer-events-none" />
          
          <div className="w-full h-full border border-amber-200/40 rounded-lg p-2 flex flex-col justify-between relative">
            <div className="z-10 flex items-center justify-between">
              <span className="px-1 py-0.5 rounded bg-amber-200/20 text-amber-200 text-[6px] font-black uppercase">
                {doc.language}
              </span>
              {onToggleFavorite && (
                <button onClick={(e) => onToggleFavorite(e, doc)} className="p-0.5 cursor-pointer">
                  <Star className={`w-3.5 h-3.5 ${doc.favorite ? 'fill-current text-amber-300' : 'text-amber-200/40'}`} />
                </button>
              )}
            </div>

            <div className="z-10 text-center my-auto px-1">
              <Feather className="w-3.5 h-3.5 text-amber-300 mx-auto mb-1 opacity-85" />
              <h4 className="text-xs font-serif font-bold tracking-tight leading-snug text-[#FAF3DD] line-clamp-3">
                {cleanTitle}
              </h4>
            </div>

            <div className="z-10 border-t border-amber-200/30 pt-1 text-center">
              <span className="text-[7.5px] font-mono font-bold uppercase tracking-widest text-amber-200 block truncate">
                {doc.author || 'Author'}
              </span>
            </div>
          </div>
        </div>
      ) : palette.patternType === 'diagonal-split' ? (
        /* 11. MINIMALIST DIAGONAL SPLIT STATIONERY STYLE (Image 1 reference) */
        <div
          className="w-full h-full rounded-xl p-3 sm:p-3.5 flex flex-col justify-between relative overflow-hidden ring-1 ring-black/10 z-10"
          style={{ backgroundColor: palette.bgHex }}
        >
          {/* Diagonal cut bottom block */}
          <div
            className="absolute bottom-0 start-0 end-0 h-2/5 pointer-events-none"
            style={{
              backgroundColor: palette.subColorHex || '#638A9F',
              clipPath: 'polygon(0 35%, 100% 0, 100% 100%, 0 100%)'
            }}
          />

          <div className="z-10 flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded bg-black/10 text-slate-800 text-[6.5px] font-bold uppercase">
              {doc.language}
            </span>
            {onToggleFavorite && (
              <button onClick={(e) => onToggleFavorite(e, doc)} className="p-0.5 cursor-pointer">
                <Star className={`w-3.5 h-3.5 ${doc.favorite ? 'fill-current text-amber-500' : 'text-slate-400'}`} />
              </button>
            )}
          </div>

          <div className="z-10 text-center mt-2 mb-auto px-1">
            <h4 className="text-xs sm:text-sm font-serif font-bold lowercase tracking-tight leading-snug text-slate-900 line-clamp-2">
              {cleanTitle}
            </h4>
            <span className="text-[7px] font-mono lowercase tracking-widest text-slate-600 block mt-1">
              a book by {doc.author || 'lingoflow'}
            </span>
          </div>

          <div className="z-10 pt-1 text-center">
            <span className="text-[7px] font-mono uppercase tracking-widest text-white/90 block truncate drop-shadow-xs">
              {doc.author || 'Author'}
            </span>
          </div>
        </div>
      ) : palette.patternType === 'landscape-illustration' ? (
        /* 12. ARTISTIC LANDSCAPE HORIZON ILLUSTRATED STYLE (Image 2 reference - Ahmad Tohari Series) */
        <div
          className="w-full h-full rounded-xl p-3 sm:p-3.5 flex flex-col justify-between relative overflow-hidden ring-1 ring-black/10 z-10"
          style={{ backgroundColor: palette.bgHex }}
        >
          {/* Spine crease shadow */}
          <div className="absolute top-0 bottom-0 start-0 w-2.5 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none" />

          {/* Vector Landscape Hill & Sun Horizon Art */}
          <div className="absolute top-0 start-0 end-0 h-1/2 pointer-events-none overflow-hidden">
            {/* Sun/Moon Disk */}
            <div className="absolute top-3 end-6 w-6 h-6 rounded-full bg-amber-100/90 shadow-2xs" />
            
            {/* Rolling Hills SVG */}
            <svg viewBox="0 0 100 60" className="absolute bottom-0 w-full h-20 text-black/15" preserveAspectRatio="none">
              <path fill="currentColor" opacity="0.4" d="M0 40 Q25 20 50 35 T100 25 L100 60 L0 60 Z" />
              <path fill="currentColor" opacity="0.6" d="M0 30 Q35 50 70 25 T100 40 L100 60 L0 60 Z" />
            </svg>
          </div>

          <div className="z-10 flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded bg-black/20 text-white text-[6.5px] font-bold uppercase">
              {doc.language}
            </span>
            {onToggleFavorite && (
              <button onClick={(e) => onToggleFavorite(e, doc)} className="p-0.5 cursor-pointer">
                <Star className={`w-3.5 h-3.5 ${doc.favorite ? 'fill-current text-amber-300' : 'text-white/60'}`} />
              </button>
            )}
          </div>

          <div className="z-10 my-auto text-start ps-1 pe-2 pt-8">
            <h4 className="text-xs sm:text-xs font-serif font-black uppercase tracking-wider leading-tight text-slate-900 line-clamp-3">
              {cleanTitle}
            </h4>
          </div>

          <div className="z-10 border-t border-slate-900/30 pt-1 text-start ps-1">
            <span className="text-[7.5px] font-sans font-black uppercase tracking-widest text-slate-900 block truncate">
              {doc.author || 'Ahmad Tohari'}
            </span>
          </div>
        </div>
      ) : (
        /* 10. ROYAL AMETHYST CELESTIAL STYLE */
        <div className="w-full h-full rounded-xl bg-[#8E44AD] p-3 sm:p-3.5 flex flex-col justify-between text-white relative overflow-hidden ring-1 ring-black/10 z-10">
          {/* Glowing Arc Line Art */}
          <div className="absolute -top-10 -end-10 w-28 h-28 rounded-full border-2 border-purple-200/30 pointer-events-none" />
          <div className="absolute -top-6 -end-6 w-20 h-20 rounded-full border border-purple-200/20 pointer-events-none" />

          <div className="z-10 flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded bg-white/20 text-white text-[6.5px] font-black uppercase">
              {doc.language}
            </span>
            {onToggleFavorite && (
              <button onClick={(e) => onToggleFavorite(e, doc)} className="p-0.5 cursor-pointer">
                <Star className={`w-3.5 h-3.5 ${doc.favorite ? 'fill-current text-amber-300' : 'text-white/40'}`} />
              </button>
            )}
          </div>

          <div className="z-10 text-center my-auto px-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-200 mx-auto mb-1" />
            <h4 className="text-xs font-serif font-black uppercase tracking-tight leading-tight text-white line-clamp-3">
              {cleanTitle}
            </h4>
          </div>

          <div className="z-10 border-t border-white/20 pt-1 text-center">
            <span className="text-[7.5px] font-mono font-bold uppercase tracking-widest text-purple-100 block truncate">
              {doc.author || 'Author'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
