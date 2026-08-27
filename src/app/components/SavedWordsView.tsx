// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { VocabularyItem, Deck, ReaderSettings } from '../types';
import { getTranslation } from '../utils/i18n';
import { Search, Volume2, Plus, Edit, Trash2, BookMarked, GraduationCap, Layers } from 'lucide-react';
import { getCardBucket } from '../utils/srs';
import { playTTS } from '../utils/tts';

interface SavedWordsViewProps {
  vocabulary: VocabularyItem[];
  decks: Deck[];
  onAddWordClick: () => void;
  onEditCardClick: (card: VocabularyItem) => void;
  onDeleteCard: (id: string) => void;
  settings?: ReaderSettings;
  onSubViewChange?: (subView: 'study' | 'decks' | 'saved-words' | 'browse') => void;
}

export const SavedWordsView: React.FC<SavedWordsViewProps> = ({
  vocabulary,
  decks,
  onAddWordClick,
  onEditCardClick,
  onDeleteCard,
  settings,
  onSubViewChange,
}) => {
  const t = getTranslation(settings?.interfaceLanguage || settings?.targetLanguage);
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'learning' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isAr = settings?.interfaceLanguage === 'Arabic';
  const isFr = settings?.interfaceLanguage === 'French';
  const isEs = settings?.interfaceLanguage === 'Spanish';
  const isDe = settings?.interfaceLanguage === 'German';

  const titleText = isAr ? 'قائمة القاموس' : isFr ? 'Liste du dictionnaire' : isEs ? 'Lista del Diccionario' : isDe ? 'Wörterbuchliste' : 'Saved Words';
  const descriptionText = isAr 
    ? `تصفح وإدارة جميع الكلمات المحفوظة البالغ عددها ${vocabulary.length} في جميع المجموعات.`
    : isFr 
    ? `Parcourez et gérez l'ensemble des ${vocabulary.length} mots enregistrés dans tous les paquets.`
    : isEs 
    ? `Explora y gestiona las ${vocabulary.length} palabras guardadas en todos los mazos.`
    : isDe 
    ? `Durchsuchen und verwalten Sie alle ${vocabulary.length} gespeicherten Wörter in allen Decks.`
    : `Browse and manage all ${vocabulary.length} saved words across all decks.`;
    
  const searchPlaceholder = isAr ? 'البحث عن الكلمات المحفوظة...' : isFr ? 'Rechercher des mots enregistrés...' : isEs ? 'Buscar palabras guardadas...' : isDe ? 'Gespeicherte Wörter suchen...' : 'Search saved words...';
  const statusLabel = isAr ? 'الحالة' : isFr ? 'Statut' : isEs ? 'Estado' : isDe ? 'Status' : 'Status';
  const deckLabel = isAr ? 'المجموعة' : isFr ? 'Paquet' : isEs ? 'Mazo' : isDe ? 'Deck' : 'Deck';
  const actionsLabel = isAr ? 'الإجراءات' : isFr ? 'Actions' : isEs ? 'Acciones' : isDe ? 'Aktionen' : 'Actions';
  const noWordsLabel = isAr ? 'لم يتم العثور على كلمات مفردات تطابق هذا المرشح.' : isFr ? 'Aucun mot de vocabulaire trouvé correspondant à ce filtre.' : isEs ? 'No se encontraron palabras de vocabulario que coincidan con este filtro.' : isDe ? 'Keine Vokabeln gefunden, die diesem Filter entsprechen.' : 'No vocabulary words found matching this filter.';
  const addFirstWordLabel = isAr ? 'أضف كلمتك الأولى' : isFr ? 'Ajoutez votre premier mot' : isEs ? 'Agrega tu primera palabra' : isDe ? 'Fügen Sie Ihr erstes Wort hinzu' : 'Add your first word';
  
  const mainDictionaryLabel = isAr ? 'القاموس الرئيسي' : isFr ? 'Dictionnaire Principal' : isEs ? 'Diccionario Principal' : isDe ? 'Hauptwörterbuch' : 'Main Dictionary';
  const unknownDeckLabel = isAr ? 'مجموعة غير معروفة' : isFr ? 'Paquet Inconnu' : isEs ? 'Mazo Desconocido' : isDe ? 'Unbekanntes Deck' : 'Unknown Deck';
  const filterAllLabel = isAr ? 'جميع الكلمات' : isFr ? 'Tous les mots' : isEs ? 'Todas las palabras' : isDe ? 'Alle Wörter' : 'All Words';

  const filteredCards = useMemo(() => {
    let result = vocabulary;

    if (activeFilter === 'new') {
      result = result.filter(v => getCardBucket(v) === 'New');
    } else if (activeFilter === 'learning') {
      result = result.filter(v => getCardBucket(v) === 'Learning');
    } else if (activeFilter === 'mastered') {
      result = result.filter(v => getCardBucket(v) === 'Mastered');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        v => v.word.toLowerCase().includes(q) || v.translation.toLowerCase().includes(q) || v.definition?.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
      // Sort by recently added/reviewed
      const dateA = a.srs?.lastReviewedAt || 0;
      const dateB = b.srs?.lastReviewedAt || 0;
      return dateB - dateA;
    });
  }, [vocabulary, activeFilter, searchQuery]);

  const handleSpeech = (text: string, cardLanguage?: string, deckId?: string) => {
    let langHint = cardLanguage;
    if (!langHint && deckId) {
      const deck = decks.find(d => d.id === deckId);
      if (deck) langHint = deck.language;
    }
    playTTS(text, langHint);
  };

  const getDeckName = (deckId?: string) => {
    if (!deckId) return mainDictionaryLabel;
    const deck = decks.find(d => d.id === deckId);
    return deck ? deck.name : unknownDeckLabel;
  };

  return (
    <div className="w-full space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#222222] dark:text-[#EFF1EE]">
            {titleText}
          </h1>
          <p className="text-sm font-medium text-[#666666] dark:text-[#D0D2CF] mt-1">
            {descriptionText}
          </p>
        </div>
        <button
          onClick={onAddWordClick}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#A4F5A6] hover:bg-[#8ee590] rounded-2xl text-xs font-bold text-[#222222] transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>{t.addBookmark?.replace('+', '') || 'Add New Word'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 p-3 rounded-2xl shadow-xs">
        <div className="flex items-center bg-[#EFF1EE] dark:bg-stone-900 p-1 rounded-xl w-fit border border-[#D0D2CF]/40">
          {(['all', 'new', 'learning', 'mastered'] as const).map(tab => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#A4F5A6] text-[#222222] shadow-xs'
                    : 'text-[#666666] hover:text-[#222222] dark:text-stone-400'
                }`}
              >
                {tab === 'all' ? filterAllLabel : tab === 'new' ? (t.filterNew || 'New') : tab === 'learning' ? (t.filterLearning || 'Learning') : (t.filterMastered || 'Mastered')}
              </button>
            );
          })}
        </div>
        
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full p-2 ps-9 bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-stone-750 rounded-xl text-xs font-semibold text-[#222222] dark:text-white focus:outline-none focus:border-[#222222]"
          />
          <Search className="w-4 h-4 text-[#666666] absolute start-3.5 top-3.5" />
        </div>
      </div>

      {/* Dictionary List */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#D0D2CF] dark:border-white/10 rounded-3xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#EFF1EE]/60 dark:bg-stone-900/50 text-[#666666] dark:text-stone-400 uppercase tracking-wider font-extrabold border-b border-[#D0D2CF] dark:border-white/10">
              <tr>
                <th className="px-6 py-4">{t.selectedWord || "Word / Term"}</th>
                <th className="px-6 py-4">{t.translationLabel || "Translation"}</th>
                <th className="px-6 py-4 hidden sm:table-cell">{statusLabel}</th>
                <th className="px-6 py-4 hidden md:table-cell">{deckLabel}</th>
                <th className="px-6 py-4 text-end">{actionsLabel}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D0D2CF]/60 dark:divide-white/10">
              {filteredCards.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <BookMarked className="w-10 h-10 text-stone-300" />
                      <p className="text-[#666666] font-medium">{noWordsLabel}</p>
                      <button
                        onClick={onAddWordClick}
                        className="text-[#222222] font-extrabold underline hover:text-[#000000] cursor-pointer"
                      >
                        {addFirstWordLabel}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCards.map((card) => {
                  const bucket = getCardBucket(card);
                  const isNew = bucket === 'New';
                  const isLearning = bucket === 'Learning';
                  
                  return (
                    <tr key={card.id} className="hover:bg-[#EFF1EE] dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleSpeech(card.word, card.language, card.deckId)}
                            className="p-1.5 rounded-lg bg-[#EFF1EE] dark:bg-stone-800 text-[#222222] dark:text-white hover:bg-[#A4F5A6] transition-colors shrink-0 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#222222] dark:text-white font-serif">{card.word}</span>
                              {card.partOfSpeech && (
                                <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#666666] bg-[#EFF1EE] dark:bg-stone-800 px-1.5 py-0.5 rounded">
                                  {card.partOfSpeech}
                                </span>
                              )}
                            </div>
                            {card.phonetic && <span className="text-[#666666] font-mono mt-0.5 block">{card.phonetic}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#222222] dark:text-stone-300">{card.translation}</span>
                        {card.definition && <span className="text-[#666666] block mt-0.5 truncate max-w-[200px]" title={card.definition}>{card.definition}</span>}
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                          isNew ? 'bg-stone-100 text-[#222222] border border-[#D0D2CF]' :
                          isLearning ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          'bg-[#A4F5A6] text-[#222222]'
                        }`}>
                          {isNew ? (t.filterNew || 'New') : isLearning ? (t.filterLearning || 'Learning') : (t.filterMastered || 'Mastered')}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-[#666666] font-medium">
                        {getDeckName(card.deckId)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditCardClick(card)}
                            className="p-2 text-[#666666] hover:text-[#222222] hover:bg-[#EFF1EE] dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                            title="Edit Word"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this word from your dictionary?')) {
                                onDeleteCard(card.id);
                              }
                            }}
                            className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors cursor-pointer"
                            title="Delete Word"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
