// @ts-nocheck
import React, { useMemo } from 'react';
import { Folder, Deck, VocabularyItem } from '../types';
import { FolderPlus, Plus, BookOpen, Layers, Trash2, ArrowRight, BookMarked, Sparkles, Check, GraduationCap, Search } from 'lucide-react';
import { getCardBucket } from '../utils/srs';
import { getTranslation } from '../utils/i18n';
import { ReaderSettings } from '../types';

interface DecksViewProps {
  folders: Folder[];
  decks: Deck[];
  vocabulary: VocabularyItem[];
  onNewFolderClick: () => void;
  onNewDeckClick: () => void;
  onDeleteDeck: (deckId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onOpenDeck: (deckId: string) => void;
  onStudyDeck: (deckId: string | null) => void;
  selectedFilterId: string | null;
  setSelectedFilterId: (id: string | null) => void;
  settings?: ReaderSettings;
  onSubViewChange?: (subView: 'study' | 'decks' | 'saved-words' | 'browse') => void;
}

export const DecksView: React.FC<DecksViewProps> = ({
  folders,
  decks,
  vocabulary,
  onNewFolderClick,
  onNewDeckClick,
  onDeleteDeck,
  onDeleteFolder,
  onOpenDeck,
  onStudyDeck,
  selectedFilterId,
  setSelectedFilterId,
  settings,
  onSubViewChange,
}) => {
  const t = getTranslation(settings?.interfaceLanguage || settings?.targetLanguage);

  const isAr = settings?.interfaceLanguage === 'Arabic';
  const isFr = settings?.interfaceLanguage === 'French';
  const isEs = settings?.interfaceLanguage === 'Spanish';
  const isDe = settings?.interfaceLanguage === 'German';

  // Localized Labels
  const titleText = isAr ? 'المجموعات والبطاقات' : isFr ? 'Paquets & Cartes' : isEs ? 'Mazos y Tarjetas' : isDe ? 'Decks & Karten' : 'Decks & Cards';
  const activeFilterLabel = isAr ? 'مرشح المجموعة النشط:' : isFr ? 'Filtre de Paquet Actif :' : isEs ? 'Filtro de Mazo Activo:' : isDe ? 'Aktiver Deck-Filter:' : 'Active Deck Filter:';
  const allWordsMainDeckLabel = isAr ? 'جميع الكلمات (الرئيسية)' : isFr ? 'TOUS LES MOTS (PRINCIPAL)' : isEs ? 'TODAS LAS PALABRAS (PRINCIPAL)' : isDe ? 'ALLE WÖRTER (HAUPT-DECK)' : 'ALL WORDS (MAIN DECK)';
  const heroDescription = isAr 
    ? 'يقوم بتجميع كافة الكلمات تلقائيًا من كل مجلد ومجموعة موضوعات للمراجعة الشاملة وتتبع الإتقان.' 
    : isFr 
    ? 'Regroupe automatiquement tous les mots de chaque dossier et paquet pour une révision complète et un suivi de la maîtrise.' 
    : isEs 
    ? 'Consolida automáticamente todas las palabras de cada carpeta y mazo para un repaso completo y seguimiento del dominio.' 
    : isDe 
    ? 'Konsolidiert automatisch alle Wörter aus jedem Ordner und Themen-Deck für eine umfassende Überprüfung und Beherrschungs-Nachverfolgung.' 
    : 'Automatically consolidates all words from every folder and topic deck for comprehensive review and mastery tracking.';
  const universalSyncBadge = isAr ? 'مزامنة عامة' : isFr ? 'Sync Universelle' : isEs ? 'Sincronización Universal' : isDe ? 'Universelle Synchronisation' : 'Universal Sync';
  const topicFoldersTitle = isAr ? 'مجلدات المواضيع والمجموعات المخصصة' : isFr ? 'Dossiers de Thèmes & Paquets Personnalisés' : isEs ? 'Carpetas de Temas y Mazos Personalizados' : isDe ? 'Themen-Ordner & Benutzerdefinierte Decks' : 'Topic Folders & Custom Decks';
  const customDecksNoFolderTitle = isAr 
    ? 'المجموعات المخصصة (بدون مجلد)' 
    : isFr 
    ? 'Paquets Personnalisés (Sans Dossier)' 
    : isEs 
    ? 'Mazos Personalizados (Sin Carpeta)' 
    : isDe 
    ? 'Benutzerdefinierte Decks (Kein Ordner)' 
    : 'Custom Decks (No Folder)';
  const openFileLabel = isAr ? 'فتح الملف' : isFr ? 'Ouvrir le fichier' : isEs ? 'Abrir archivo' : isDe ? 'Datei öffnen' : 'Open File';

  // Selected Deck stats (for stats block)
  const selectedDeckStats = useMemo(() => {
    const cards = selectedFilterId && selectedFilterId !== 'all'
      ? vocabulary.filter(v => v.deckId === selectedFilterId)
      : vocabulary;
    
    const countNew = cards.filter(v => getCardBucket(v) === 'New').length;
    const countLearning = cards.filter(v => getCardBucket(v) === 'Learning').length;
    const countMastered = cards.filter(v => getCardBucket(v) === 'Mastered').length;

    return {
      total: cards.length,
      newCards: countNew,
      learning: countLearning,
      mastered: countMastered
    };
  }, [vocabulary, selectedFilterId]);

  const selectedDeckName = useMemo(() => {
    if (!selectedFilterId || selectedFilterId === 'all') {
      return isAr ? 'جميع الكلمات (الرئيسية)' : isFr ? 'Tous les mots (Principal)' : isEs ? 'Todas las palabras (Principal)' : isDe ? 'Alle Wörter (Haupt-Deck)' : 'All Words (Main Deck)';
    }
    return decks.find(d => d.id === selectedFilterId)?.name || (isAr ? 'مجموعة مخصصة' : isFr ? 'Deck personnalisé' : isEs ? 'Mazo personalizado' : isDe ? 'Benutzerdefiniertes Deck' : 'Custom Deck');
  }, [selectedFilterId, decks, isAr, isFr, isEs, isDe]);

  return (
    <div className="w-full space-y-8 py-4">
      
      {/* Title & Folder/Deck Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-black font-serif text-[#222222] dark:text-[#EFF1EE]">
          {titleText}
        </h1>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNewFolderClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1D201A] border border-[#D0D2CF] dark:border-stone-800 rounded-xl text-xs font-bold text-[#222222] dark:text-stone-300 hover:bg-[#EFF1EE] transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4.5 h-4.5 text-[#222222] dark:text-stone-300" />
            <span>{t.newFolder || "New Folder"}</span>
          </button>
          <button
            onClick={onNewDeckClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#A4F5A6] hover:bg-[#92E894] rounded-xl text-xs font-bold text-[#222222] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>{t.newDeck || "New Deck"}</span>
          </button>
        </div>
      </div>

      {/* Active Deck Filter Row */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-stone-500 py-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#666666] me-1">
          {activeFilterLabel}
        </span>
        
        {/* All Words main filter pill */}
        <button
          onClick={() => setSelectedFilterId('all')}
          className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border transition-all cursor-pointer ${
            !selectedFilterId || selectedFilterId === 'all'
              ? 'bg-[#A4F5A6] text-[#222222] border-[#222222] shadow-xs'
              : 'bg-white dark:bg-[#1D201A] text-[#555555] dark:text-stone-400 border-[#D0D2CF] dark:border-stone-800 hover:border-[#222222]'
          }`}
        >
          {allWordsMainDeckLabel} {vocabulary.length}
        </button>

        {/* Dynamic Deck Pills */}
        {decks.map(deck => {
          const cardsCount = vocabulary.filter(v => v.deckId === deck.id).length;
          const isActive = selectedFilterId === deck.id;
          return (
            <button
              key={deck.id}
              onClick={() => setSelectedFilterId(deck.id)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#A4F5A6] text-[#222222] border-[#222222] shadow-xs'
                  : 'bg-white dark:bg-[#1D201A] text-[#555555] dark:text-stone-400 border-[#D0D2CF] dark:border-stone-800 hover:border-[#222222]'
              }`}
            >
              {deck.name} {cardsCount}
            </button>
          );
        })}
      </div>

      {/* Selected Deck Details Hero Card */}
      <div className="bg-white dark:bg-[#1D201A] border border-[#D0D2CF] dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#A4F5A6]/30 dark:bg-[#A4F5A6]/20 flex items-center justify-center text-[#222222] dark:text-[#A4F5A6] shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-[#222222] dark:text-[#EFF1EE] leading-tight">
                  {selectedDeckName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase bg-[#EFF1EE] dark:bg-stone-800 text-[#222222] dark:text-stone-300 border border-[#D0D2CF] dark:border-stone-700">
                  {universalSyncBadge}
                </span>
              </div>
              <p className="text-xs text-[#666666] dark:text-stone-400 max-w-xl leading-relaxed">
                {heroDescription}
              </p>
            </div>
          </div>

          <button
            onClick={() => onStudyDeck(selectedFilterId)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#A4F5A6] hover:bg-[#92E894] text-[#222222] text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
          >
            <BookMarked className="w-4 h-4" />
            <span>{t.studyAllWords || "Study All Words"} ({selectedDeckStats.total})</span>
          </button>
        </div>

        {/* 3 Statistic Blocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#D0D2CF]/60 dark:border-stone-800 pt-6">
          <div className="p-4 bg-[#EFF1EE] dark:bg-stone-900 rounded-2xl border border-[#D0D2CF] dark:border-stone-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-stone-800 flex items-center justify-center text-[#222222] dark:text-stone-300 shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-lg font-black text-[#222222] dark:text-[#EFF1EE] leading-tight">{selectedDeckStats.newCards}</span>
              <span className="block text-[10px] font-bold text-[#666666] uppercase">{t.newWords || "New Words"}</span>
              <span className="block text-[9px] text-stone-400">{t.newWordsDesc || "Ready for first encounter"}</span>
            </div>
          </div>

          <div className="p-4 bg-[#EFF1EE] dark:bg-stone-900 rounded-2xl border border-[#D0D2CF] dark:border-stone-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B2A1FF]/30 dark:bg-stone-800 flex items-center justify-center text-[#222222] dark:text-[#B2A1FF] shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-lg font-black text-[#222222] dark:text-[#EFF1EE] leading-tight">{selectedDeckStats.learning}</span>
              <span className="block text-[10px] font-bold text-[#666666] uppercase">{t.learningWords || "Learning Words"}</span>
              <span className="block text-[9px] text-stone-400">{t.learningWordsDesc || "In active SRS review"}</span>
            </div>
          </div>

          <div className="p-4 bg-[#EFF1EE] dark:bg-stone-900 rounded-2xl border border-[#D0D2CF] dark:border-stone-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#A4F5A6]/40 dark:bg-stone-800 flex items-center justify-center text-[#222222] dark:text-[#A4F5A6] shadow-2xs">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-lg font-black text-[#222222] dark:text-[#EFF1EE] leading-tight">{selectedDeckStats.mastered}</span>
              <span className="block text-[10px] font-bold text-[#666666] uppercase">{t.masteredWords || "Mastered Words"}</span>
              <span className="block text-[9px] text-stone-400">{t.masteredWordsDesc || "Long-term memory"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Topic Folders */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-serif text-[#222222] dark:text-[#EFF1EE]">
          {topicFoldersTitle}
        </h3>

        <div className="space-y-2.5">
          {folders.map(folder => (
            <div
              key={folder.id}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1D201A] border border-[#D0D2CF] dark:border-stone-800 rounded-2xl hover:bg-[#EFF1EE] dark:hover:bg-stone-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: folder.color || '#B2A1FF' }} />
                <span className="text-xs font-black text-[#222222] dark:text-[#EFF1EE] font-serif">{folder.name}</span>
                <span className="text-[10px] text-stone-400">({folder.deckIds.length} decks)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete folder "${folder.name}"?`)) {
                      onDeleteFolder(folder.id);
                    }
                  }}
                  className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-[#D0D2CF]/40 dark:hover:bg-stone-800 transition-colors"
                  title="Delete Folder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ArrowRight className="w-4 h-4 text-stone-400 me-1" />
              </div>
            </div>
          ))}

          {folders.length === 0 && (
            <p className="text-xs text-stone-400 italic">{t.noFolders || "No custom folders created yet."}</p>
          )}
        </div>
      </div>

      {/* Section: Custom Decks (No Folder) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-serif text-[#222222] dark:text-[#EFF1EE]">
          {customDecksNoFolderTitle} ({decks.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decks.map(deck => {
            const cards = vocabulary.filter(v => v.deckId === deck.id);
            const countNew = cards.filter(v => getCardBucket(v) === 'New').length;
            const countLearning = cards.filter(v => getCardBucket(v) === 'Learning').length;
            const countMastered = cards.filter(v => getCardBucket(v) === 'Mastered').length;

            return (
              <div
                key={deck.id}
                className="bg-white dark:bg-[#1D201A] border border-[#D0D2CF] dark:border-stone-800 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-extrabold tracking-wider uppercase bg-[#EFF1EE] dark:bg-stone-800 text-[#222222] dark:text-stone-400 border border-[#D0D2CF] dark:border-stone-700">
                      {deck.language}
                    </span>
                    <span className="text-[10px] text-stone-400 font-bold uppercase">{cards.length} cards</span>
                  </div>

                  <h4 className="text-base font-bold font-serif text-[#222222] dark:text-[#EFF1EE] mb-4">
                    {deck.name}
                  </h4>
                </div>

                <div className="border-t border-[#D0D2CF]/50 dark:border-stone-800 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-[10px] text-[#666666] font-mono">
                    <span title={t.newWords || "New"}>🆕 {countNew}</span>
                    <span title="Learning">🔥 {countLearning}</span>
                    <span title="Mastered">🎓 {countMastered}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete deck "${deck.name}"?`)) {
                          onDeleteDeck(deck.id);
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-red-500 rounded-xl hover:bg-[#EFF1EE] dark:hover:bg-stone-800 transition-colors cursor-pointer"
                      title="Delete Deck"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenDeck(deck.id)}
                      className="px-3.5 py-1.5 bg-[#EFF1EE] hover:bg-[#A4F5A6] text-[#222222] border border-[#D0D2CF] hover:border-[#222222] text-[10px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>{openFileLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {decks.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-[#D0D2CF] dark:border-stone-800 rounded-2xl bg-white dark:bg-[#1D201A]">
              <p className="text-xs text-stone-400 font-medium">{t.noDecks || "No custom decks found."}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
