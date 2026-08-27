// @ts-nocheck
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { DocumentFile } from '../types';
import { SAMPLE_DOCUMENTS } from '../utils/sampleDocs';
import { getCoverPaletteByTitle, cleanBookTitle, getBookCoverFontSizeClass, isLightPalette } from '../utils/coverGenerator';
import { BookLogo } from './BookLogo';
import { getTranslation } from '../utils/i18n';
import { activityTracker } from '../utils/activityTracker';
import {
  Upload,
  FileText,
  X,
  BookOpen,
  Check,
  Sparkles,
  Layers
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { savePdfBinary } from '../utils/pdfStorage';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface UploadModalProps {
  onClose: () => void;
  onSelectDocument: (doc: DocumentFile) => void;
  interfaceLanguage?: string;
  userId?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  onClose,
  onSelectDocument,
  interfaceLanguage,
  userId,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'file' | 'paste'>('file');
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [pastedLanguage, setPastedLanguage] = useState('Auto');

  // Pending file state for naming the book on upload
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [customFileTitle, setCustomFileTitle] = useState('');
  const [customFileLanguage, setCustomFileLanguage] = useState('Auto');

  const t = getTranslation(interfaceLanguage);

  const localT = {
    English: {
      fileTab: "Upload File",
      pasteTab: "Paste Text",
      titlePlaceholder: "Enter document title...",
      textPlaceholder: "Type or paste your foreign language text here...",
      tipText: "Tip: Use triple blank lines (triple Enter) to separate text into different pages, or paste directly for a single page.",
      createBtn: "Create Reader Book",
      titleLabel: "Document Title",
      textLabel: "Text Content",
      langLabel: "Content Language",
      nameYourBook: "Name your Book",
      chooseNameDesc: "Customize the book title to create a beautiful, personalized book cover.",
      bookTitleLabel: "Book Title",
      contentLangLabel: "Book Language",
      generateBookBtn: "Generate Book & Cover",
      backBtn: "Back"
    },
    French: {
      fileTab: "Téléverser un fichier",
      pasteTab: "Coller du texte",
      titlePlaceholder: "Entrez le titre du document...",
      textPlaceholder: "Saisissez ou collez votre texte en langue étrangère ici...",
      tipText: "Astuce : Utilisez trois sauts de ligne (triple Entrée) pour diviser le texte en pages, ou collez directement pour une seule page.",
      createBtn: "Créer le livre de lecture",
      titleLabel: "Titre du document",
      textLabel: "Contenu du texte",
      langLabel: "Langue du contenu",
      nameYourBook: "Nommez votre livre",
      chooseNameDesc: "Personnalisez le titre du livre pour créer une magnifique couverture personnalisée.",
      bookTitleLabel: "Titre du livre",
      contentLangLabel: "Langue du livre",
      generateBookBtn: "Générer le livre et la couverture",
      backBtn: "Retour"
    },
    Arabic: {
      fileTab: "رفع ملف",
      pasteTab: "لصق نص",
      titlePlaceholder: "أدخل عنوان المستند...",
      textPlaceholder: "اكتب أو الصق نص اللغة الأجنبية هنا...",
      tipText: "نصيحة: استخدم ثلاثة أسطر فارغة (الضغط على Enter ثلاث مرات) لفصل النص إلى صفحات، أو الصقه مباشرة لصفحة واحدة.",
      createBtn: "إنشاء كتاب للقراءة",
      titleLabel: "عنوان المستند",
      textLabel: "محتوى النص",
      langLabel: "لغة المحتوى",
      nameYourBook: "تسمية كتابك",
      chooseNameDesc: "قم بتخصيص عنوان الكتاب لإنشاء غلاف كتاب جميل ومخصص.",
      bookTitleLabel: "عنوان الكتاب",
      contentLangLabel: "لغة الكتاب",
      generateBookBtn: "إنشاء الكتاب والغلاف",
      backBtn: "رجوع"
    },
    Spanish: {
      fileTab: "Subir archivo",
      pasteTab: "Pegar texto",
      titlePlaceholder: "Ingrese el título del documento...",
      textPlaceholder: "Escriba o pegue su texto en idioma extranjero aquí...",
      tipText: "Consejo: Use tres líneas en blanco (triple Intro) para separar el texto en páginas, o pegue directamente para una sola página.",
      createBtn: "Crear libro de lectura",
      titleLabel: "Título del documento",
      textLabel: "Contenido del texto",
      langLabel: "Idioma del contenido",
      nameYourBook: "Nombra tu libro",
      chooseNameDesc: "Personaliza el título del libro para crear una portada hermosa y personalizada.",
      bookTitleLabel: "Título del libro",
      contentLangLabel: "Idioma del libro",
      generateBookBtn: "Generar libro y portada",
      backBtn: "Atrás"
    },
    German: {
      fileTab: "Datei hochladen",
      pasteTab: "Text einfügen",
      titlePlaceholder: "Geben Sie den Dokumenttitel ein...",
      textPlaceholder: "Schreiben oder fügen Sie Ihren fremdsprachigen Text hier ein...",
      tipText: "Tipp: Verwenden Sie dreifache Leerzeilen (dreimal Eingabe), um Text in verschiedene Seiten aufzuteilen, oder fügen Sie ihn direkt für eine einzige Seite ein.",
      createBtn: "Lesebuch erstellen",
      titleLabel: "Dokumenttitel",
      textLabel: "Textinhalt",
      langLabel: "Inhaltssprache",
      nameYourBook: "Benennen Sie Ihr Buch",
      chooseNameDesc: "Passen Sie den Buchtitel an, um ein schönes, personalisiertes Buchcover zu erstellen.",
      bookTitleLabel: "Buchtitel",
      contentLangLabel: "Buchsprache",
      generateBookBtn: "Buch & Cover generieren",
      backBtn: "Zurück"
    }
  };

  const currentLang = (interfaceLanguage as keyof typeof localT) || 'English';
  const local = localT[currentLang] || localT.English;

  const handleCreateFromText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    const finalTitle = pastedTitle.trim() || 'My Pasted Text';
    const pages = pastedText.split(/\n\s*\n\s*\n/);
    let formattedContent = '';
    pages.forEach((p, idx) => {
      formattedContent += `[Page ${idx + 1}]\n${p}\n\n`;
    });

    const palette = getCoverPaletteByTitle(finalTitle);
    const newDoc: DocumentFile = {
      id: `text-paste-${Date.now()}`,
      userId: userId || undefined,
      isSample: false,
      name: finalTitle,
      size: new Blob([pastedText]).size,
      uploadedAt: Date.now(),
      lastReadAt: Date.now(),
      currentPage: 1,
      totalPages: pages.length || 1,
      language: pastedLanguage,
      fileType: 'text',
      contentData: formattedContent,
      title: finalTitle,
      coverColor: palette.id,
    };

    onSelectDocument(newDoc);
    onClose();
  };

  const processFile = async (file: File, customTitle?: string, customLanguage?: string) => {
    setIsProcessing(true);

    const finalTitle = customTitle?.trim() || file.name.replace(/\.(pdf|txt)$/i, '');
    const finalLanguage = customLanguage || 'Auto';

    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const originalBuffer = await file.arrayBuffer();

        // Convert original buffer to base64 Data URI for fast reliable rendering
        let pdfDataUri = '';
        try {
          const bytes = new Uint8Array(originalBuffer);
          let binary = '';
          const len = bytes.byteLength;
          const chunkSize = 0x8000;
          for (let i = 0; i < len; i += chunkSize) {
            binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
          }
          pdfDataUri = `data:application/pdf;base64,${btoa(binary)}`;
        } catch (b64Err) {
          console.warn('Could not create base64 string for PDF, relying on IndexedDB:', b64Err);
        }

        // Clone separate buffers for PDF.js worker and IndexedDB to prevent detached ArrayBuffer errors
        const pdfjsBuffer = originalBuffer.slice(0);
        const idbBuffer = originalBuffer.slice(0);

        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfjsBuffer) });
        const pdf = await loadingTask.promise;

        let fullText = '';
        const totalPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');

          fullText += `[Page ${pageNum}]\n${pageText}\n\n`;
        }

        const docId = `pdf-${Date.now()}`;
        // Store full original binary into IndexedDB safely
        await savePdfBinary(docId, idbBuffer);

        const palette = getCoverPaletteByTitle(finalTitle);
        const newDoc: DocumentFile = {
          id: docId,
          userId: userId || undefined,
          isSample: false,
          name: finalTitle,
          size: file.size,
          uploadedAt: Date.now(),
          lastReadAt: Date.now(),
          currentPage: 1,
          totalPages: totalPages || 1,
          language: finalLanguage,
          fileType: 'pdf',
          contentData: fullText,
          pdfDataUri: undefined, // Saved into IndexedDB binary store to avoid local storage quota limits
          hasOriginalPdf: true,
          title: finalTitle,
          coverColor: palette.id,
        };

        activityTracker.logDocUploaded(finalTitle, Math.round((file.size || 1024) / 1024) + ' KB');
        onSelectDocument(newDoc);
        onClose();
      } else {
        // Plain text file parsing
        const text = await file.text();
        const pages = text.split(/\n\s*\n\s*\n/);
        let formattedContent = '';
        pages.forEach((p, idx) => {
          formattedContent += `[Page ${idx + 1}]\n${p}\n\n`;
        });

        const palette = getCoverPaletteByTitle(finalTitle);
        const newDoc: DocumentFile = {
          id: `txt-${Date.now()}`,
          userId: userId || undefined,
          isSample: false,
          name: finalTitle,
          size: file.size,
          uploadedAt: Date.now(),
          lastReadAt: Date.now(),
          currentPage: 1,
          totalPages: pages.length || 1,
          language: finalLanguage,
          fileType: 'text',
          contentData: formattedContent,
          title: finalTitle,
          coverColor: palette.id,
        };

        activityTracker.logDocUploaded(finalTitle, Math.round((file.size || 1024) / 1024) + ' KB');
        onSelectDocument(newDoc);
        onClose();
      }
    } catch (e) {
      console.error('File parsing error:', e);
      alert('Failed to parse PDF/text file. Try selecting a sample document or plain text file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelection = (file: File) => {
    setPendingFile(file);
    setCustomFileTitle(cleanBookTitle(file.name));
    setCustomFileLanguage('Auto');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      id="upload-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`relative w-full ${pendingFile && !isProcessing ? 'max-w-2xl' : 'max-w-xl'} bg-white dark:bg-[#1D201A] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D0D2CF] dark:border-stone-800 space-y-6 max-h-[90vh] overflow-y-auto transition-all duration-300`}
      >
        
        {isProcessing ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#222222] dark:bg-[#A4F5A6] flex items-center justify-center text-white dark:text-[#222222] animate-spin">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-sm font-bold text-[#222222] dark:text-stone-300">
              {t.uploading || "Parsing document & generating cover..."}
            </p>
            <p className="text-xs text-stone-500">
              This may take a moment for larger documents.
            </p>
          </div>
        ) : pendingFile ? (
          /* Naming and Cover Customization View */
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D0D2CF] dark:border-stone-800">
              <div>
                <h2 className="text-xl font-bold font-serif-classic text-[#222222] dark:text-white">
                  {local.nameYourBook}
                </h2>
                <p className="text-xs text-stone-500">
                  {local.chooseNameDesc}
                </p>
              </div>
              <button
                onClick={() => setPendingFile(null)}
                className="p-2 rounded-full text-stone-400 hover:bg-[#EFF1EE] dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              {/* Dynamic Live Cover Preview */}
              <div className="md:col-span-2 flex flex-col items-center justify-center p-4 bg-[#EFF1EE] dark:bg-stone-850 rounded-2xl border border-[#D0D2CF] dark:border-stone-800 min-h-[220px]">
                {(() => {
                  const palette = getCoverPaletteByTitle(customFileTitle);
                  const isBookAr = customFileLanguage === 'Arabic';
                  const fontSizeClass = getBookCoverFontSizeClass(customFileTitle);
                  const isLight = isLightPalette(palette.id);
                  return (
                    <motion.div
                      className="relative w-32 h-44 select-none group"
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Modern Clean Paper Page Edge (Right 3D Layer) */}
                      <div className="absolute top-1 bottom-1 -end-[3px] w-[3px] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 rounded-e border-e border-slate-300 dark:border-slate-700 shadow-xs pointer-events-none" />
                      
                      {/* Modern Clean Bottom Page Layer */}
                      <div className="absolute -bottom-[2px] start-2 end-1 h-[2px] bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 rounded-b pointer-events-none" />

                      {/* Cover Surface */}
                      <div className={`w-full h-full rounded-2xl bg-gradient-to-b ${palette.gradient} border border-black/10 dark:border-white/10 ${palette.textColor} overflow-hidden flex flex-col justify-between p-3 shadow-lg relative ring-1 ring-black/10`}>
                        {/* Subtle Left Spine Overlay */}
                        <div className={`absolute top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/25 via-black/8 to-transparent ${isBookAr ? 'end-0 rounded-e-2xl' : 'start-0 rounded-s-2xl'}`} />

                        {/* Hairline Framed Box */}
                        <div className={`relative z-10 border ${isLight ? 'border-black/25 bg-black/5' : 'border-white/25 bg-white/5'} rounded-xl p-2.5 flex flex-col justify-between flex-1 mb-2 backdrop-blur-[1px]`}>
                          <div className="flex items-start justify-between">
                            <span className="text-[#FF3D00] text-lg font-serif font-black leading-none select-none">
                              “
                            </span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[6px] font-black uppercase tracking-wider ${isLight ? 'bg-black/15 text-black' : 'bg-black/40 text-white'} border border-white/10`}>
                              {customFileLanguage}
                            </span>
                          </div>

                          <div className="mt-2 mb-auto">
                            <h4 className={`${fontSizeClass} ${isBookAr ? 'font-arabic-serif text-end rtl' : 'font-serif font-black text-start'} tracking-tight leading-tight ${palette.textColor} line-clamp-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] w-full`}>
                              {customFileTitle || 'Untitled Book'}
                            </h4>
                          </div>

                          <div className={`pt-1 mt-1 border-t ${isLight ? 'border-black/15' : 'border-white/15'}`}>
                            <span className="text-[7px] font-mono font-bold uppercase tracking-[0.16em] block truncate opacity-85 text-start">
                              Reader Edition
                            </span>
                          </div>
                        </div>

                        {/* Bottom Emblem */}
                        <div className="z-10 flex items-center justify-between px-0.5 pt-0.5">
                          <div className="flex items-center gap-1 opacity-80">
                            <BookLogo className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[6.5px] font-bold uppercase tracking-widest opacity-85">
                              Ribble
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
                <span className="text-[10px] font-semibold text-stone-500 mt-3 font-mono">
                  Cover Art Palette Preview
                </span>
              </div>

              {/* Form Controls */}
              <div className="md:col-span-3 space-y-4">
                {/* Book Title Input */}
                <div className="space-y-1.5 text-start rtl:text-end">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    {local.bookTitleLabel}
                  </label>
                  <input
                    type="text"
                    value={customFileTitle}
                    onChange={(e) => setCustomFileTitle(e.target.value)}
                    placeholder={local.titlePlaceholder}
                    required
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#D0D2CF] dark:border-stone-800 bg-[#EFF1EE]/60 dark:bg-stone-800/50 text-xs text-[#222222] dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#222222] focus:border-[#222222]"
                  />
                </div>

                {/* Book Content Language Select */}
                <div className="space-y-1.5 text-start rtl:text-end">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    {local.contentLangLabel}
                  </label>
                  <select
                    value={customFileLanguage}
                    onChange={(e) => setCustomFileLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#D0D2CF] dark:border-stone-800 bg-[#EFF1EE]/60 dark:bg-stone-800/50 text-xs text-[#222222] dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#222222] focus:border-[#222222] cursor-pointer"
                  >
                    <option value="Auto">Auto (Detect)</option>
                    <option value="English">English</option>
                    <option value="French">French (Français)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                  </select>
                </div>

                {/* File Information display */}
                <div className="p-3 bg-[#EFF1EE] dark:bg-stone-850 rounded-xl border border-[#D0D2CF]/60 dark:border-stone-800 flex items-center justify-between text-[10px] font-medium text-stone-600 dark:text-stone-400">
                  <span className="truncate max-w-[180px]">File: {pendingFile.name}</span>
                  <span>Size: {(pendingFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPendingFile(null)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 text-xs font-bold cursor-pointer transition-all text-center"
                  >
                    {local.backBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => processFile(pendingFile, customFileTitle, customFileLanguage)}
                    disabled={!customFileTitle.trim()}
                    className="flex-2 py-3 px-4 rounded-2xl bg-[#222222] dark:bg-[#A4F5A6] hover:opacity-90 disabled:opacity-40 text-white dark:text-[#222222] text-xs font-bold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{local.generateBookBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Normal Tab Content */
          <>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D0D2CF] dark:border-stone-800">
              <div>
                <h2 className="text-xl font-bold font-serif-classic text-[#222222] dark:text-white">
                  {t.uploadTitle}
                </h2>
                <p className="text-xs text-stone-500">
                  {t.supportsPdfText}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-stone-400 hover:bg-[#EFF1EE] dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modern Segmented Tab Controls */}
            <div className="flex bg-[#EFF1EE] dark:bg-stone-850 p-1.5 rounded-2xl border border-[#D0D2CF] dark:border-stone-800">
              <button
                onClick={() => setActiveTab('file')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'file'
                    ? 'bg-white dark:bg-stone-800 text-[#222222] dark:text-[#A4F5A6] shadow-xs'
                    : 'text-stone-500 hover:text-[#222222] dark:hover:text-stone-300'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{local.fileTab}</span>
              </button>
              <button
                onClick={() => setActiveTab('paste')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'paste'
                    ? 'bg-white dark:bg-stone-800 text-[#222222] dark:text-[#A4F5A6] shadow-xs'
                    : 'text-stone-500 hover:text-[#222222] dark:hover:text-stone-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{local.pasteTab}</span>
              </button>
            </div>

            {activeTab === 'paste' ? (
              <form onSubmit={handleCreateFromText} className="space-y-4">
                {/* Title field */}
                <div className="space-y-1.5 text-start rtl:text-end">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    {local.titleLabel}
                  </label>
                  <input
                    type="text"
                    value={pastedTitle}
                    onChange={(e) => setPastedTitle(e.target.value)}
                    placeholder={local.titlePlaceholder}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#D0D2CF] dark:border-stone-800 bg-[#EFF1EE]/60 dark:bg-stone-800/50 text-xs text-[#222222] dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#222222] focus:border-[#222222]"
                  />
                </div>

                {/* Language dropdown */}
                <div className="space-y-1.5 text-start rtl:text-end">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    {local.langLabel}
                  </label>
                  <select
                    value={pastedLanguage}
                    onChange={(e) => setPastedLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#D0D2CF] dark:border-stone-800 bg-[#EFF1EE]/60 dark:bg-stone-800/50 text-xs text-[#222222] dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#222222] focus:border-[#222222] cursor-pointer"
                  >
                    <option value="Auto">Auto (Detect)</option>
                    <option value="English">English</option>
                    <option value="French">French (Français)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                  </select>
                </div>

                {/* Text content textarea */}
                <div className="space-y-1.5 text-start rtl:text-end">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    {local.textLabel}
                  </label>
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder={local.textPlaceholder}
                    rows={6}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-[#D0D2CF] dark:border-stone-800 bg-[#EFF1EE]/60 dark:bg-stone-800/50 text-xs text-[#222222] dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#222222] focus:border-[#222222] resize-y min-h-[150px]"
                  />
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-normal">
                    {local.tipText}
                  </p>
                </div>

                {/* Create Button */}
                <button
                  type="submit"
                  disabled={!pastedText.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#222222] dark:bg-[#A4F5A6] hover:opacity-90 disabled:opacity-40 text-white dark:text-[#222222] text-xs font-bold shadow-xs cursor-pointer transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{local.createBtn}</span>
                </button>
              </form>
            ) : (
              /* PDF File Dropzone */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragOverCapture={(e) => e.preventDefault()}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-3xl border-2 border-dashed text-center space-y-3 cursor-pointer transition-all ${
                  dragActive
                    ? 'border-[#222222] dark:border-[#A4F5A6] bg-[#EFF1EE] dark:bg-stone-800'
                    : 'border-[#D0D2CF] dark:border-stone-700 bg-[#EFF1EE]/60 dark:bg-stone-800/50 hover:bg-[#EFF1EE]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelection(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#222222] dark:bg-[#A4F5A6] flex items-center justify-center text-white dark:text-[#222222] shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#222222] dark:text-stone-200">
                    {isProcessing ? t.uploading : t.dragDropText}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {t.selectFile}
                  </p>
                </div>
              </div>
            )}

            {/* Sample Books Library */}
            <div className="space-y-3 pt-3 border-t border-[#D0D2CF] dark:border-stone-800">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Or Choose a Sample Bilingual Reader Book:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_DOCUMENTS.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      onSelectDocument(doc);
                      onClose();
                    }}
                    className="p-4 rounded-2xl bg-[#EFF1EE] dark:bg-stone-800/80 border border-[#D0D2CF] dark:border-stone-700 hover:border-[#222222] dark:hover:border-[#A4F5A6] hover:shadow-xs cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#D0D2CF] dark:bg-stone-700 text-[#222222] dark:text-stone-300">
                        {doc.language}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">
                        {doc.totalPages} Pages
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold font-serif-classic text-[#222222] dark:text-white group-hover:text-[#222222] dark:group-hover:text-[#A4F5A6] transition-colors">
                        {doc.name}
                      </h4>
                      {doc.author && (
                        <p className="text-xs text-stone-500 italic">
                          by {doc.author}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};
