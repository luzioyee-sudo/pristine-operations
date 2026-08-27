// @ts-nocheck
// Intelligent Multilingual Text-to-Speech & Pronunciation Engine

export interface PronunciationAnalysis {
  detectedLanguage: string;
  bcp47Code: string;
  ipa: string;
  phoneticRespelling: string;
  pronunciationTip?: string;
}

// Memory cache for API pronunciation lookups
const pronunciationCache = new Map<string, PronunciationAnalysis>();

/**
 * Intelligent Language Detector using Unicode Script Ranges, Character Diacritics, and Keyword Heuristics
 */
export const detectLanguageFromText = (
  text: string = '', 
  langHint: string = ''
): { bcp47: string; languageName: string } => {
  const cleanText = text.trim();
  const lowerText = cleanText.toLowerCase();
  const lowerHint = (langHint || '').toLowerCase().trim();

  // 1. Script-based Unicode detection (highest precision for non-Latin scripts)
  if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(cleanText)) {
    return { bcp47: 'ar-SA', languageName: 'Arabic' };
  }
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(cleanText) || (/[\u4E00-\u9FAF]/.test(cleanText) && /[\u3040-\u309F\u30A0-\u30FF]/.test(cleanText))) {
    return { bcp47: 'ja-JP', languageName: 'Japanese' };
  }
  if (/[\u4E00-\u9FFF]/.test(cleanText)) {
    return { bcp47: 'zh-CN', languageName: 'Chinese' };
  }
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(cleanText)) {
    return { bcp47: 'ko-KR', languageName: 'Korean' };
  }
  if (/[\u0400-\u04FF]/.test(cleanText)) {
    return { bcp47: 'ru-RU', languageName: 'Russian' };
  }
  if (/[\u0370-\u03FF]/.test(cleanText)) {
    return { bcp47: 'el-GR', languageName: 'Greek' };
  }
  if (/[\u0590-\u05FF]/.test(cleanText)) {
    return { bcp47: 'he-IL', languageName: 'Hebrew' };
  }
  if (/[\u0900-\u097F]/.test(cleanText)) {
    return { bcp47: 'hi-IN', languageName: 'Hindi' };
  }
  if (/[\u0E00-\u0E7F]/.test(cleanText)) {
    return { bcp47: 'th-TH', languageName: 'Thai' };
  }
  if (/[\u0102\u0103\u0110\u0111\u0128\u0129\u0168\u0169\u01A0\u01A1\u01AF\u01B0\u1EA0-\u1EF9]/.test(cleanText)) {
    return { bcp47: 'vi-VN', languageName: 'Vietnamese' };
  }

  // 2. Diacritics & Unique Vocabulary Heuristics
  // French
  if (
    /[àâçéèêëîïôœùûüÿ]/.test(lowerText) ||
    /\b(bonjour|monsieur|madame|merci|voilà|rendez-vous|vis-à-vis|au revoir|s'il vous plaît|enchanté|château|souvenir|français|toujours|avec|pour|être|avoir)\b/i.test(lowerText)
  ) {
    return { bcp47: 'fr-FR', languageName: 'French' };
  }

  // Spanish
  if (
    /[ñáéíóúü¡¿]/.test(lowerText) ||
    /\b(hola|gracias|buenos|días|noches|por favor|señor|señora|amigo|hasta luego|corazón|fiesta|español|cómo|estás|mucho|gusto)\b/i.test(lowerText)
  ) {
    return { bcp47: 'es-ES', languageName: 'Spanish' };
  }

  // German
  if (
    /[äöüß]/.test(lowerText) ||
    /\b(guten|danke|bitte|entschuldigung|auf wiedersehen|willkommen|wunderbar|deutschland|deutsch|nicht|ist|und|der|die|das)\b/i.test(lowerText)
  ) {
    return { bcp47: 'de-DE', languageName: 'German' };
  }

  // Italian
  if (
    /\b(ciao|grazie|prego|buongiorno|arrivederci|bellissimo|capuccino|piazza|per favore|italiano|molto|anche|questo)\b/i.test(lowerText)
  ) {
    return { bcp47: 'it-IT', languageName: 'Italian' };
  }

  // Portuguese
  if (
    /[ãõçáê]/.test(lowerText) ||
    /\b(obrigado|obrigada|bom dia|boa tarde|você|futebol|português|saudade|tudo|bem)\b/i.test(lowerText)
  ) {
    return { bcp47: 'pt-BR', languageName: 'Portuguese' };
  }

  // 3. Fallback to explicit hint if hint is valid
  if (lowerHint && lowerHint !== 'auto' && lowerHint !== 'unknown' && lowerHint !== 'all' && !lowerHint.includes('auto')) {
    if (lowerHint.includes('french') || lowerHint.includes('fr')) return { bcp47: 'fr-FR', languageName: 'French' };
    if (lowerHint.includes('spanish') || lowerHint.includes('es')) return { bcp47: 'es-ES', languageName: 'Spanish' };
    if (lowerHint.includes('german') || lowerHint.includes('de')) return { bcp47: 'de-DE', languageName: 'German' };
    if (lowerHint.includes('arabic') || lowerHint.includes('ar')) return { bcp47: 'ar-SA', languageName: 'Arabic' };
    if (lowerHint.includes('italian') || lowerHint.includes('it')) return { bcp47: 'it-IT', languageName: 'Italian' };
    if (lowerHint.includes('portuguese') || lowerHint.includes('pt')) return { bcp47: 'pt-BR', languageName: 'Portuguese' };
    if (lowerHint.includes('russian') || lowerHint.includes('ru')) return { bcp47: 'ru-RU', languageName: 'Russian' };
    if (lowerHint.includes('japanese') || lowerHint.includes('ja')) return { bcp47: 'ja-JP', languageName: 'Japanese' };
    if (lowerHint.includes('korean') || lowerHint.includes('ko')) return { bcp47: 'ko-KR', languageName: 'Korean' };
    if (lowerHint.includes('chinese') || lowerHint.includes('zh')) return { bcp47: 'zh-CN', languageName: 'Chinese' };
    if (lowerHint.includes('english') || lowerHint.includes('en')) return { bcp47: 'en-US', languageName: 'English' };
  }

  // 4. Delegate to Gemini's native auto-detection if hint is auto or unknown, or if we just don't know
  if (!lowerHint || lowerHint === 'auto' || lowerHint === 'unknown' || lowerHint === 'all' || lowerHint.includes('auto')) {
    return { bcp47: 'en-US', languageName: 'Auto' };
  }

  // Default to English
  return { bcp47: 'en-US', languageName: 'English' };
};

/**
 * Gets standard BCP-47 language code given a hint or text
 */
export const getVoiceLangCode = (langHint: string = '', text: string = ''): string => {
  return detectLanguageFromText(text, langHint).bcp47;
};

/**
 * Finds the highest quality, native voice for the given language code
 */
export const selectBestVoice = (
  voices: SpeechSynthesisVoice[], 
  targetLangCode: string
): SpeechSynthesisVoice | null => {
  if (!voices || voices.length === 0) return null;

  const targetPrefix = targetLangCode.split('-')[0].toLowerCase();

  // Filter voices matching language prefix
  const matchingVoices = voices.filter(v => v.lang.toLowerCase().startsWith(targetPrefix));
  if (matchingVoices.length === 0) return null;

  // Score each voice to pick the highest quality natural/premium voice
  let bestVoice = matchingVoices[0];
  let highestScore = -1;

  for (const voice of matchingVoices) {
    let score = 0;
    const vLang = voice.lang.toLowerCase();
    const vName = voice.name.toLowerCase();

    // Exact BCP-47 match preference
    if (vLang === targetLangCode.toLowerCase()) {
      score += 20;
    }

    // High quality / Natural / Premium voice indicators
    if (
      vName.includes('google') ||
      vName.includes('natural') ||
      vName.includes('premium') ||
      vName.includes('enhanced') ||
      vName.includes('siri') ||
      vName.includes('online') ||
      vName.includes('neural')
    ) {
      score += 30;
    }

    // Renowned native voice names
    if (
      vName.includes('amelie') ||
      vName.includes('thomas') ||
      vName.includes('jorge') ||
      vName.includes('monica') ||
      vName.includes('maged') ||
      vName.includes('kyoko') ||
      vName.includes('yuri') ||
      vName.includes('samantha') ||
      vName.includes('daniel') ||
      vName.includes('zhiwei')
    ) {
      score += 15;
    }

    // Local vs remote service
    if (voice.localService) {
      score += 5;
    }

    if (score > highestScore) {
      highestScore = score;
      bestVoice = voice;
    }
  }

  return bestVoice;
};

// Current active Web Audio Source Node to handle stopping/pausing audio
let activePcmSourceNode: AudioBufferSourceNode | null = null;
let activeAudioContext: AudioContext | null = null;

/**
 * Stops any active audio playback (both Gemini Web Audio PCM and native Web Speech)
 */
export const stopActiveSpeech = () => {
  if (activePcmSourceNode) {
    try {
      activePcmSourceNode.stop();
      activePcmSourceNode.disconnect();
    } catch (_) {}
    activePcmSourceNode = null;
  }
  if (activeAudioContext && activeAudioContext.state !== 'closed') {
    try {
      activeAudioContext.close();
    } catch (_) {}
    activeAudioContext = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Plays 16-bit PCM little-endian audio (24kHz standard for Gemini TTS)
 */
export const playPcmAudio = (
  base64Data: string,
  sampleRate: number = 24000,
  onStart?: () => void,
  onEnd?: () => void
): boolean => {
  try {
    stopActiveSpeech();

    const binary = atob(base64Data);
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new DataView(buffer);
    for (let i = 0; i < len; i++) {
      view.setUint8(i, binary.charCodeAt(i));
    }

    // Convert Int16 PCM samples to Float32 [-1.0, 1.0]
    const pcm16 = new Int16Array(buffer);
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return false;

    const audioCtx = new AudioCtxClass({ sampleRate });
    activeAudioContext = audioCtx;

    const audioBuffer = audioCtx.createBuffer(1, pcm16.length, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    for (let i = 0; i < pcm16.length; i++) {
      channelData[i] = pcm16[i] / 32768.0;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    activePcmSourceNode = source;

    source.onended = () => {
      activePcmSourceNode = null;
      if (audioCtx.state !== 'closed') {
        audioCtx.close();
      }
      if (onEnd) onEnd();
    };

    if (onStart) onStart();
    source.start(0);
    return true;
  } catch (err) {
    console.error('Error playing Gemini PCM audio:', err);
    if (onEnd) onEnd();
    return false;
  }
};

import { getPronunciation } from './pronunciationService';

/**
 * Calls server API to fetch Gemini TTS Audio base64 using centralized shared caching
 */
export const fetchGeminiTTS = async (
  text: string,
  voice: 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir' = 'Zephyr',
  language: string = 'English',
  promptStyle?: 'normal' | 'slow' | 'cheerful' | 'native'
): Promise<{ audio: string; mimeType: string; voice: string; cached?: boolean } | null> => {
  try {
    const data = await getPronunciation({
      text,
      language,
      voice,
      promptStyle,
    });

    if (data && data.audio) {
      return {
        audio: data.audio,
        mimeType: data.mimeType || 'audio/pcm;rate=24000',
        voice: data.voice,
        cached: data.cached,
      };
    }
  } catch (err) {
    console.warn('Gemini TTS network call failed, falling back to Web Speech:', err);
  }
  return null;
};

export interface PlayTTSOptions {
  voice?: 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';
  speed?: number;
  promptStyle?: 'normal' | 'slow' | 'cheerful' | 'native';
  preferEngine?: 'gemini' | 'native';
  rate?: number;
  pitch?: number;
}

/**
 * Intelligent Speech Synthesis Player with Gemini AI Voice as primary engine and Web Speech API as fallback
 */
export const playTTS = async (
  text: string, 
  langHint: string = '', 
  onStart?: () => void, 
  onEnd?: () => void,
  options?: PlayTTSOptions
) => {
  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  stopActiveSpeech();

  const detected = detectLanguageFromText(text, langHint);
  const langName = detected.languageName;
  const geminiVoice = options?.voice || 'Zephyr';
  const engine = options?.preferEngine || 'gemini';

  // 1. Try Gemini TTS if preferred engine is 'gemini'
  if (engine === 'gemini') {
    const ttsData = await fetchGeminiTTS(text, geminiVoice, langName, options?.promptStyle);
    if (ttsData && ttsData.audio) {
      const played = playPcmAudio(ttsData.audio, 24000, onStart, onEnd);
      if (played) return;
    }
  }

  // 2. Fallback to Web Speech API
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  const langCode = detected.bcp47;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;

  utterance.rate = options?.rate ?? options?.speed ?? (text.length > 50 ? 0.92 : 0.88);
  utterance.pitch = options?.pitch ?? 1.0;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  const speakWithVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const bestVoice = selectBestVoice(voices, langCode);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
    }
    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0 && 'onvoiceschanged' in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      speakWithVoices();
      window.speechSynthesis.onvoiceschanged = null;
    };
    setTimeout(() => {
      speakWithVoices();
    }, 150);
  } else {
    speakWithVoices();
  }
};

/**
 * Fetches accurate AI linguistic analysis and phonetic IPA for a given word
 */
export const fetchPronunciationGuide = async (
  text: string, 
  langHint: string = ''
): Promise<PronunciationAnalysis> => {
  const cacheKey = `${text.toLowerCase().trim()}_${langHint.toLowerCase().trim()}`;
  if (pronunciationCache.has(cacheKey)) {
    return pronunciationCache.get(cacheKey)!;
  }

  try {
    const res = await fetch('/api/detect-pronunciation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, hint: langHint })
    });

    if (res.ok) {
      const textResponse = await res.text();
      let data: PronunciationAnalysis;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        console.error("Invalid JSON from detect-pronunciation API. Output snippet:", textResponse.substring(0, 100));
        throw new Error("Received non-JSON response from server");
      }
      pronunciationCache.set(cacheKey, data);
      return data;
    }
  } catch (err) {
    console.warn('Failed to fetch AI pronunciation guide:', err);
  }

  // Fallback if network or API fails
  const detected = detectLanguageFromText(text, langHint);
  const fallback: PronunciationAnalysis = {
    detectedLanguage: detected.languageName,
    bcp47Code: detected.bcp47,
    ipa: `/${text.toLowerCase()}/`,
    phoneticRespelling: text,
    pronunciationTip: 'Standard clear natural pronunciation.'
  };
  pronunciationCache.set(cacheKey, fallback);
  return fallback;
};
