// @ts-nocheck
import React, { useState } from 'react';
import { getTranslation } from '../utils/i18n';
import {
  Type,
  Highlighter,
  Pen,
  StickyNote,
  Eraser,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  SlidersHorizontal,
  Palette,
  LayoutGrid,
  X,
  Globe,
  Check
} from 'lucide-react';
import { ReaderSettings } from '../types';

export const LANGUAGES_LIST = [
  { code: 'French', label: 'French', native: 'Français' },
  { code: 'Arabic', label: 'Arabic', native: 'العربية' },
  { code: 'English', label: 'English', native: 'English' },
  { code: 'Spanish', label: 'Spanish', native: 'Español' },
  { code: 'German', label: 'German', native: 'Deutsch' },
  { code: 'Italian', label: 'Italian', native: 'Italiano' },
  { code: 'Portuguese', label: 'Portuguese', native: 'Português' },
  { code: 'Russian', label: 'Russian', native: 'Русский' },
  { code: 'Chinese', label: 'Chinese', native: '中文' },
  { code: 'Japanese', label: 'Japanese', native: '日本語' },
  { code: 'Korean', label: 'Korean', native: '한국어' },
  { code: 'Turkish', label: 'Turkish', native: 'Türkçe' },
];

export const HIGHLIGHT_COLORS = [
  { name: 'Yellow Highlight', value: '#FFEB83', bg: 'bg-[#FFEB83]', border: 'border-yellow-400' },
  { name: 'Mint Green', value: '#A4F5A6', bg: 'bg-[#A4F5A6]', border: 'border-[#A4F5A6]' },
  { name: 'Lavender', value: '#B2A1FF', bg: 'bg-[#B2A1FF]', border: 'border-[#B2A1FF]' },
  { name: 'Soft Gray', value: '#D0D2CF', bg: 'bg-[#D0D2CF]', border: 'border-[#D0D2CF]' },
  { name: 'Charcoal', value: '#222222', bg: 'bg-[#222222]', border: 'border-[#222222]' },
  { name: 'Terracotta Coral', value: '#D67D6D', bg: 'bg-[#D67D6D]', border: 'border-[#D67D6D]' },
];

interface AnnotationToolbarProps {
  activeTool: 'select' | 'highlight' | 'pen' | 'note' | 'eraser';
  setActiveTool: (tool: 'select' | 'highlight' | 'pen' | 'note' | 'eraser') => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  onAnalyzePageAI?: () => void;
  isAnalyzing?: boolean;
  activePdfSidebar?: 'outline' | 'thumbnails' | 'annotations' | null;
  onTogglePdfSidebar?: (sidebar: 'outline' | 'thumbnails' | 'annotations') => void;
}

export const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({
  activeTool,
  setActiveTool,
  selectedColor,
  setSelectedColor,
  currentPage,
  totalPages,
  onPageChange,
  settings,
  onUpdateSettings,
  activePdfSidebar = null,
  onTogglePdfSidebar,
}) => {
  const [showPenOptions, setShowPenOptions] = useState<boolean>(false);
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);
  const t = getTranslation(settings.interfaceLanguage || settings.targetLanguage);

  return (
    <div id="annotation-toolbar" className="sticky top-0 md:top-[43px] z-30 w-full flex flex-wrap items-center justify-between gap-1.5 px-3 py-1.5 md:p-2 rounded-none md:rounded-2xl bg-[#EFF1EE]/95 dark:bg-[#1E221B]/95 backdrop-blur-md border-b md:border border-[#D0D2CF] dark:border-stone-800 shadow-xs transition-all">
      
      {/* Left Group: Tools Selection & Palette */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap shrink-0">
        
        {/* Select / Word Click Mode */}
        <button
          id="tool-select-word"
          onClick={() => {
            setActiveTool('select');
            setShowPenOptions(false);
          }}
          className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'select'
              ? 'bg-[#A4F5A6] text-[#222222] shadow-xs'
              : 'text-[#222222] dark:text-[#EFF1EE] hover:bg-[#D0D2CF]/50 dark:hover:bg-stone-800'
          }`}
          title={t.clickAnyWord || "Click word for instant translation"}
        >
          <Type className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-bold">{t.toolTranslate}</span>
        </button>

        {/* Highlighter Tool */}
        <button
          id="tool-highlighter"
          onClick={() => {
            setActiveTool('highlight');
            setShowPenOptions(false);
          }}
          className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'highlight'
              ? 'bg-[#A4F5A6] text-[#222222] shadow-xs'
              : 'text-[#222222] dark:text-[#EFF1EE] hover:bg-[#D0D2CF]/50 dark:hover:bg-stone-800'
          }`}
          title={t.toolHighlight}
        >
          <Highlighter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-bold">{t.toolHighlight}</span>
        </button>

        {/* Freehand Pen / Drawing Tool with Config Popover */}
        <div className="relative">
          <button
            id="tool-pen-drawing"
            onClick={() => {
              if (activeTool !== 'pen') {
                setActiveTool('pen');
                setShowPenOptions(true);
              } else {
                setShowPenOptions(!showPenOptions);
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'pen'
                ? 'bg-[#A4F5A6] text-[#222222] shadow-xs ring-2 ring-[#A4F5A6]/40'
                : 'text-[#222222] dark:text-[#EFF1EE] hover:bg-[#D0D2CF]/50 dark:hover:bg-stone-800'
            }`}
            title={t.toolDraw}
          >
            <Pen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-bold">{t.toolDraw}</span>
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/20 inline-block shadow-xs"
              style={{ backgroundColor: selectedColor }}
            />
            <SlidersHorizontal className="w-3 h-3 opacity-80 hover:opacity-100" />
          </button>

          {/* Pen Customization Popover Menu */}
          {showPenOptions && activeTool === 'pen' && (
            <div className="absolute top-full start-0 mt-2 w-72 sm:w-80 p-3 sm:p-4 rounded-2xl bg-white dark:bg-stone-900 border border-[#D0D2CF] dark:border-stone-800 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
              
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#D0D2CF] dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Pen className="w-4 h-4 text-[#222222] dark:text-[#A4F5A6]" />
                  <h4 className="text-xs font-bold text-[#222222] dark:text-stone-100">
                    {t.drawingToolOptions}
                  </h4>
                </div>
                <button
                  onClick={() => setShowPenOptions(false)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tool Type Selector */}
              <div className="mb-3">
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1.5">
                  {t.strokeStyle}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'pen', label: t.toolDraw, icon: Pen, width: 3, opacity: 1.0 },
                    { id: 'highlighter', label: t.toolHighlight, icon: Highlighter, width: 20, opacity: 0.4 },
                    { id: 'marker', label: 'Marker', icon: Pen, width: 10, opacity: 0.85 },
                    { id: 'pencil', label: 'Pencil', icon: Pen, width: 1.5, opacity: 0.65 },
                  ].map((type) => {
                    const isSelected = (settings.penType || 'pen') === type.id;
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => {
                          onUpdateSettings({
                            penType: type.id as any,
                            strokeWidth: type.width,
                            strokeOpacity: type.opacity,
                          });
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#222222] text-[#EFF1EE] shadow-xs font-bold'
                            : 'bg-[#EFF1EE] dark:bg-stone-800 text-[#222222] dark:text-[#EFF1EE] hover:bg-[#D0D2CF]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 mb-1" />
                        <span className="text-[10px]">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stroke Size */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                    {t.strokeSize}
                  </label>
                  <span className="text-xs font-bold text-[#222222] dark:text-[#A4F5A6]">
                    {settings.strokeWidth || 3}px
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={settings.strokeWidth || 3}
                  onChange={(e) => onUpdateSettings({ strokeWidth: Number(e.target.value) })}
                  className="w-full accent-[#222222] dark:accent-[#A4F5A6] cursor-pointer h-1.5 rounded-lg bg-stone-200 dark:bg-stone-700"
                />
              </div>

              {/* Opacity */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                    {t.opacity}
                  </label>
                  <span className="text-xs font-bold text-[#222222] dark:text-[#A4F5A6]">
                    {Math.round((settings.strokeOpacity ?? 1.0) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.strokeOpacity ?? 1.0}
                  onChange={(e) => onUpdateSettings({ strokeOpacity: Number(e.target.value) })}
                  className="w-full accent-[#222222] dark:accent-[#A4F5A6] cursor-pointer h-1.5 rounded-lg bg-stone-200 dark:bg-stone-700"
                />
              </div>

            </div>
          )}
        </div>

        {/* Sticky Note Tool */}
        <button
          id="tool-sticky-note"
          onClick={() => {
            setActiveTool('note');
            setShowPenOptions(false);
          }}
          className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'note'
              ? 'bg-[#B2A1FF] text-[#222222] shadow-xs font-bold'
              : 'text-[#222222] dark:text-[#EFF1EE] hover:bg-[#D0D2CF]/50 dark:hover:bg-stone-800'
          }`}
          title={t.toolNote}
        >
          <StickyNote className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-bold">{t.toolNote}</span>
        </button>

        {/* Eraser Tool */}
        <button
          id="tool-eraser"
          onClick={() => {
            setActiveTool('eraser');
            setShowPenOptions(false);
          }}
          className={`p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'eraser'
              ? 'bg-[#222222] text-[#EFF1EE] shadow-xs'
              : 'text-[#222222] dark:text-[#EFF1EE] hover:bg-[#D0D2CF]/50 dark:hover:bg-stone-800'
          }`}
          title={t.toolEraser}
        >
          <Eraser className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-[#D0D2CF] dark:bg-stone-800 mx-0.5 hidden sm:block" />

        {/* Quick Color Swatches */}
        <div className="flex items-center gap-1">
          {HIGHLIGHT_COLORS.map((c, idx) => (
            <button
              key={c.value}
              onClick={() => {
                setSelectedColor(c.value);
                onUpdateSettings({ strokeColor: c.value });
              }}
              title={c.name}
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform cursor-pointer ${c.bg} ${
                idx >= 3 ? 'hidden sm:block' : ''
              } ${
                selectedColor === c.value
                  ? 'ring-2 ring-[#222222] ring-offset-1 scale-110 shadow-xs'
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
            />
          ))}
          <label
            className="relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-dashed border-[#D0D2CF] cursor-pointer hover:bg-[#D0D2CF]/40 transition-colors"
            title="Custom color picker"
          >
            <Palette className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#222222]" />
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value);
                onUpdateSettings({ strokeColor: e.target.value });
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>

      </div>

      {/* Reader Controls: Sidebar Toggles, Font size, Page Selector */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap shrink-0">
        
        {/* PDF Reader Sidebars Group: Thumbnails */}
        {onTogglePdfSidebar && (
          <div className="hidden md:flex items-center gap-0.5 bg-[#EFF1EE] dark:bg-stone-800 rounded-xl p-0.5 border border-[#D0D2CF] dark:border-stone-700">
            <button
              id="btn-sidebar-thumbnails"
              onClick={() => onTogglePdfSidebar('thumbnails')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                activePdfSidebar === 'thumbnails'
                  ? 'bg-[#222222] text-[#EFF1EE] shadow-xs font-bold'
                  : 'text-[#222222] dark:text-[#EFF1EE] hover:bg-[#D0D2CF]/60 dark:hover:bg-stone-700'
              }`}
              title={t.thumbnails}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-bold">{t.thumbnails}</span>
            </button>
          </div>
        )}

        {/* Translation Target Language Selector */}
        {(() => {
          const currentTranslateLang = settings.translationLanguage || (settings.interfaceLanguage && settings.interfaceLanguage !== settings.targetLanguage ? settings.interfaceLanguage : 'French');
          const matchedLang = LANGUAGES_LIST.find(l => l.code.toLowerCase() === currentTranslateLang.toLowerCase()) || { code: currentTranslateLang, label: currentTranslateLang, native: currentTranslateLang };

          return (
            <div className="relative">
              <button
                id="btn-translation-lang"
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#EFF1EE] dark:bg-stone-800 rounded-xl border border-[#D0D2CF] dark:border-stone-700 text-[#222222] dark:text-[#EFF1EE] hover:bg-[#A4F5A6]/40 transition-all text-xs font-bold cursor-pointer"
                title={`Translate reader words to: ${matchedLang.label} (${matchedLang.native})`}
              >
                <Globe className="w-3.5 h-3.5 text-[#222222] dark:text-[#A4F5A6]" />
                <span className="hidden sm:inline text-[11px] font-bold">
                  {matchedLang.native}
                </span>
                <span className="sm:hidden text-[11px] font-bold">
                  {matchedLang.native.slice(0, 3)}
                </span>
              </button>
              
              {showLangDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowLangDropdown(false)} 
                  />
                  <div className="absolute end-0 bottom-full sm:bottom-auto sm:top-full mt-2 w-48 max-h-72 overflow-y-auto p-1.5 rounded-2xl bg-white dark:bg-stone-900 border border-[#D0D2CF] dark:border-stone-800 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 custom-scrollbar">
                    <span className="block text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest px-2.5 py-1 mb-1">
                      Translate reader text to:
                    </span>
                    {LANGUAGES_LIST.map((lang) => {
                      const isSelected = currentTranslateLang.toLowerCase() === lang.code.toLowerCase();
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            onUpdateSettings({ translationLanguage: lang.code });
                            setShowLangDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-start transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#A4F5A6] text-[#222222] font-bold'
                              : 'text-stone-700 dark:text-[#EFF1EE] hover:bg-[#EFF1EE] dark:hover:bg-stone-800'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold">{lang.native}</span>
                            <span className="text-[10px] text-stone-500 font-normal">{lang.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#222222]" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* Zoom / Font size control */}
        {(() => {
          const phoneZoomPercent = Math.round(((settings.fontSize - 18) / 2) * 10);
          const phoneZoomText = `${phoneZoomPercent > 0 ? '+' : ''}${phoneZoomPercent}%`;

          return (
            <div id="toolbar-zoom-control" className="flex items-center gap-0.5 sm:gap-1 bg-[#EFF1EE] dark:bg-stone-800 rounded-xl p-0.5 border border-[#D0D2CF] dark:border-stone-700">
              <button
                onClick={() => onUpdateSettings({ fontSize: Math.max(12, settings.fontSize - 2) })}
                className="p-1 text-[#222222] dark:text-[#EFF1EE] hover:text-black cursor-pointer"
                title="Decrease text size / zoom"
              >
                <ZoomOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#222222] dark:text-[#EFF1EE] min-w-[22px] sm:w-5 text-center">
                <span className="sm:hidden">{phoneZoomText}</span>
                <span className="hidden sm:inline">{settings.fontSize}</span>
              </span>
              <button
                onClick={() => onUpdateSettings({ fontSize: Math.min(32, settings.fontSize + 2) })}
                className="p-1 text-[#222222] dark:text-[#EFF1EE] hover:text-black cursor-pointer"
                title="Increase text size / zoom"
              >
                <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          );
        })()}

        {/* Page Selector */}
        {totalPages > 0 && (
          <div className="flex items-center gap-0.5 sm:gap-1 bg-[#EFF1EE] dark:bg-stone-800 rounded-xl p-0.5 border border-[#D0D2CF] dark:border-stone-700">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1 text-[#222222] dark:text-[#EFF1EE] disabled:opacity-30 hover:text-black cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 rtl:rotate-180" />
            </button>
            <span className="text-[10px] sm:text-[11px] font-bold px-1 text-[#222222] dark:text-stone-200">
              {currentPage}/{totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1 text-[#222222] dark:text-[#EFF1EE] disabled:opacity-30 hover:text-black cursor-pointer"
            >
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 rtl:rotate-180" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
