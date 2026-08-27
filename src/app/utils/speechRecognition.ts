// @ts-nocheck
import { detectLanguageFromText } from './tts';

export const startPronunciationPractice = (
  targetWord: string,
  langHint: string,
  onResult: (isMatch: boolean, transcript: string) => void,
  onError: (error: string) => void,
  onEnd: () => void
) => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onError("Speech recognition is not supported in this browser. Try using Chrome or Edge.");
    return null;
  }

  const recognition = new SpeechRecognition();
  
  // Intelligent auto-detection for exact target language recognition code
  const detected = detectLanguageFromText(targetWord, langHint);
  recognition.lang = detected.bcp47;

  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript.trim().toLowerCase();
    
    // Clean matching ignoring punctuation and diacritics casing
    const cleanTarget = targetWord.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    const cleanTranscript = transcript.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    
    const isMatch = cleanTranscript.includes(cleanTarget) || cleanTarget.includes(cleanTranscript);
    
    onResult(isMatch, transcript);
  };

  recognition.onerror = (event: any) => {
    onError(event.error === 'not-allowed' ? 'Microphone access denied.' : `Microphone error: ${event.error}`);
  };

  recognition.onend = () => {
    onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    onError("Failed to start speech recognition.");
    return null;
  }
};
