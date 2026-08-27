// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, BookOpen, Volume2, Upload, FileText, Check } from 'lucide-react';
import { Deck, VocabularyItem } from '../types';
import { playTTS } from '../utils/tts';
import { getTranslation } from '../utils/i18n';

interface CreateFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  decks: Deck[];
  onSave: (card: Partial<VocabularyItem>) => void;
  editCard?: VocabularyItem | null;
  settings?: any;
}

export const CreateFlashcardModal: React.FC<CreateFlashcardModalProps> = ({
  isOpen,
  onClose,
  decks,
  onSave,
  editCard,
  settings,
}) => {
  const t = getTranslation(settings?.interfaceLanguage);
  const [activeTab, setActiveTab] = useState<'basic' | 'context' | 'upload'>('basic');
  
  // Basic Info Form State
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');
  const [partOfSpeech, setPartOfSpeech] = useState<string>('Noun');
  const [targetWord, setTargetWord] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [phonetic, setPhonetic] = useState<string>('');
  
  // Context & Memory Form State
  const [memoryHook, setMemoryHook] = useState<string>('');
  const [contextSentence, setContextSentence] = useState<string>('');
  const [definition, setDefinition] = useState<string>('');
  
  // Auto-fill state
  const [isAutoFilling, setIsAutoFilling] = useState<boolean>(false);
  const [autoFillError, setAutoFillError] = useState<string | null>(null);

  // Load edit values if editing
  useEffect(() => {
    if (editCard) {
      setSelectedDeckId(editCard.deckId || (decks[0]?.id || ''));
      setPartOfSpeech(editCard.partOfSpeech || 'Noun');
      setTargetWord(editCard.word || '');
      setTranslation(editCard.translation || '');
      setPhonetic(editCard.phonetic || '');
      setMemoryHook(editCard.grammarNote || '');
      setContextSentence(editCard.contextSentence || '');
      setDefinition(editCard.definition || '');
    } else {
      setSelectedDeckId(decks[0]?.id || '');
      setPartOfSpeech('Noun');
      setTargetWord('');
      setTranslation('');
      setPhonetic('');
      setMemoryHook('');
      setContextSentence('');
      setDefinition('');
    }
  }, [editCard, decks, isOpen]);

  if (!isOpen) return null;

  const handleAutoFill = async () => {
    if (!targetWord.trim()) {
      setAutoFillError('Please enter a target word or phrase to auto-fill.');
      return;
    }
    
    setIsAutoFilling(true);
    setAutoFillError(null);

    try {
      const selectedDeck = decks.find(d => d.id === selectedDeckId);
      const sourceLang = selectedDeck?.language || 'Auto';

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: targetWord,
          contextSentence: contextSentence,
          sourceLanguage: sourceLang,
          targetLanguage: 'English',
        }),
      });

      if (!response.ok) throw new Error('Failed to auto-fill details.');
      const text = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON from translate API. Output snippet:", text.substring(0, 100));
        throw new Error("Received non-JSON response from server");
      }

      if (data) {
        if (data.translation) setTranslation(data.translation);
        if (data.phonetic) setPhonetic(data.phonetic);
        if (data.partOfSpeech) {
          const capitalized = data.partOfSpeech.charAt(0).toUpperCase() + data.partOfSpeech.slice(1).toLowerCase();
          setPartOfSpeech(capitalized);
        }
        if (data.definition) setDefinition(data.definition);
        if (data.grammarNote) setMemoryHook(data.grammarNote);
        if (data.examples && data.examples.length > 0) {
          setContextSentence(data.examples[0].source);
        }
      }
    } catch (err: any) {
      console.error(err);
      setAutoFillError('AI Service temporarily busy. Filled fallback pronunciation.');
      setPhonetic(`/ ${targetWord.trim().toLowerCase()} /`);
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleTestPronunciation = () => {
    if (!targetWord.trim()) return;
    const selectedDeck = decks.find(d => d.id === selectedDeckId);
    playTTS(targetWord, selectedDeck?.language);
  };

  const handleSave = () => {
    if (!targetWord.trim() || !translation.trim()) {
      setAutoFillError('Target Word and Translation are required.');
      return;
    }

    const selectedDeck = decks.find(d => d.id === selectedDeckId);

    onSave({
      id: editCard?.id,
      word: targetWord.trim(),
      translation: translation.trim(),
      phonetic: phonetic.trim(),
      partOfSpeech: partOfSpeech,
      grammarNote: memoryHook.trim(),
      contextSentence: contextSentence.trim(),
      definition: definition.trim(),
      deckId: selectedDeckId,
      language: settings?.targetLanguage || selectedDeck?.language || 'French',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-white dark:bg-[#1D201A] rounded-[28px] shadow-2xl border border-[#D0D2CF] dark:border-stone-800 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#D0D2CF] dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EFF1EE] dark:bg-stone-800 flex items-center justify-center text-[#222222] dark:text-[#A4F5A6]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-white leading-tight">
                {editCard ? (t.editDeck || 'Edit Flashcard') : (t.createFlashcardModalTitle || 'Create Flashcard')}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {t.createFlashcardModalDesc || 'Design a detailed study card or use AI to auto-fill details'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#D0D2CF] dark:border-stone-800 px-6">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider relative transition-colors ${
              activeTab === 'basic' ? 'text-[#222222] dark:text-[#A4F5A6]' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            {t.tabBasicInfo || 'Basic Info'}
            {activeTab === 'basic' && (
              <motion.div
                layoutId="modal-active-tab-indicator"
                className="absolute bottom-0 start-4 end-4 h-0.5 bg-[#222222] dark:bg-[#A4F5A6]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('context')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider relative transition-colors ${
              activeTab === 'context' ? 'text-[#222222] dark:text-[#A4F5A6]' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            {t.tabContextMemory || 'Context & Memory'}
            {activeTab === 'context' && (
              <motion.div
                layoutId="modal-active-tab-indicator"
                className="absolute bottom-0 start-4 end-4 h-0.5 bg-[#222222] dark:bg-[#A4F5A6]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider relative transition-colors ${
              activeTab === 'upload' ? 'text-[#222222] dark:text-[#A4F5A6]' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            {t.tabUploadFile || 'Upload File'}
            {activeTab === 'upload' && (
              <motion.div
                layoutId="modal-active-tab-indicator"
                className="absolute bottom-0 start-4 end-4 h-0.5 bg-[#222222] dark:bg-[#A4F5A6]"
              />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'basic' && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {autoFillError && (
                  <div className="p-3 bg-[#EFF1EE] text-[#222222] dark:text-stone-200 rounded-xl text-xs font-medium border border-[#D0D2CF]">
                    {autoFillError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">
                      {t.selectDeck || 'Select Deck'}
                    </label>
                    <select
                      value={selectedDeckId}
                      onChange={(e) => setSelectedDeckId(e.target.value)}
                      className="w-full p-2.5 bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#222222]"
                    >
                      {decks.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.language})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">
                      {t.partOfSpeech || 'Part of Speech'}
                    </label>
                    <select
                      value={partOfSpeech}
                      onChange={(e) => setPartOfSpeech(e.target.value)}
                      className="w-full p-2.5 bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#222222]"
                    >
                      {['Noun', 'Verb', 'Adjective', 'Adverb', 'Phrase', 'Preposition', 'Pronoun', 'Conjunction', 'Interjection'].map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">
                    {t.targetWordPrompt || 'Target Word / Phrase (Back of Card)'} *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={targetWord}
                      onChange={(e) => setTargetWord(e.target.value)}
                      placeholder="e.g. Je suis en train d'apprendre"
                      className="flex-1 p-2.5 bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#222222]"
                    />
                    <button
                      onClick={handleAutoFill}
                      disabled={isAutoFilling}
                      className="px-4 bg-[#222222] dark:bg-[#A4F5A6] hover:opacity-90 disabled:bg-stone-300 text-white dark:text-[#222222] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {isAutoFilling ? (
                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{t.autoFill || 'Auto-Fill'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">
                    {t.translation || 'Translation (Front of Card)'} *
                  </label>
                  <input
                    type="text"
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    placeholder="e.g. I am currently learning"
                    className="w-full p-2.5 bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#222222]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">
                      {t.phoneticGuide || 'Phonetic Guide / IPA'}
                    </label>
                    <input
                      type="text"
                      value={phonetic}
                      onChange={(e) => setPhonetic(e.target.value)}
                      placeholder="e.g. /ʒə sɥi ɑ̃ tʁɛ̃/"
                      className="w-full p-2.5 bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#222222]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">
                      {t.pronunciationAudio || 'Pronunciation Audio'}
                    </label>
                    <button
                      onClick={handleTestPronunciation}
                      disabled={!targetWord.trim()}
                      className="w-full flex items-center justify-center gap-2 p-2.5 bg-white dark:bg-stone-900 border border-[#D0D2CF] dark:border-stone-700 hover:bg-[#EFF1EE] dark:hover:bg-stone-800 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-[#222222] dark:text-[#A4F5A6]" />
                      <span>{t.testPronunciation || 'Test Pronunciation'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'context' && (
              <motion.div
                key="context"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">
                    {t.memoryHook || 'Memory Hook / Mnemonics'}
                  </label>
                  <textarea
                    rows={2}
                    value={memoryHook}
                    onChange={(e) => setMemoryHook(e.target.value)}
                    placeholder="e.g. 'en train' is like a learning train!"
                    className="w-full p-2.5 bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-stone-700 rounded-xl text-xs font-medium text-stone-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#222222] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">
                    {t.contextSentence || 'Context Sentence'}
                  </label>
                  <textarea
                    rows={2}
                    value={contextSentence}
                    onChange={(e) => setContextSentence(e.target.value)}
                    placeholder="e.g. Désolé, je suis en train d'apprendre le français."
                    className="w-full p-2.5 bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-stone-700 rounded-xl text-xs font-medium text-stone-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#222222] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">
                    {t.definitionExplanation || 'Definition / Explanation'}
                  </label>
                  <textarea
                    rows={3}
                    value={definition}
                    onChange={(e) => setDefinition(e.target.value)}
                    placeholder="A beginner-friendly grammar or vocabulary definition."
                    className="w-full p-2.5 bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-stone-700 rounded-xl text-xs font-medium text-stone-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#222222] resize-none"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="border-2 border-dashed border-[#D0D2CF] dark:border-stone-700 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-3 bg-[#EFF1EE] dark:bg-stone-900 hover:bg-[#EFF1EE]/80 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#EFF1EE] dark:bg-stone-800 flex items-center justify-center text-[#222222] dark:text-[#A4F5A6]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800 dark:text-white">
                      {t.dragDropCSV || 'Drag & drop vocabulary spreadsheet / CSV here'}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-1">
                      {t.dragDropCSVDesc || 'Supports CSV, Excel or plain text list of translation cards'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#EFF1EE] dark:bg-stone-800 border border-[#D0D2CF] dark:border-stone-700 rounded-xl flex items-center gap-3">
                  <FileText className="w-5 h-5 text-stone-400" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-stone-700 dark:text-stone-300">French Vocabulary List.txt</p>
                    <p className="text-[10px] text-stone-400">12 words detected • click to import</p>
                  </div>
                  <button
                    onClick={() => {
                      setTargetWord("Je suis en train d'apprendre");
                      setTranslation("I am currently learning");
                      setPhonetic("/ʒə sɥi ɑ̃ tʁɛ̃/");
                      setPartOfSpeech("Phrase");
                      setActiveTab('basic');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-[10px] font-bold text-stone-700 dark:text-stone-300 transition-colors"
                  >
                    {t.loadSample || 'Load Sample'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#D0D2CF] dark:border-stone-800">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            * {t.requiredFields || 'Required fields'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              {t.cancel || 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#222222] dark:bg-[#A4F5A6] text-white dark:text-[#222222] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {t.saveFlashcard || 'Save Flashcard'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
