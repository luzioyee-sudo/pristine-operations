// @ts-nocheck
export interface VoiceSpec {
  language: string;
  accent: string;
  voice: 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';
}

export const VOICE_CONFIG = {
  version: 'v1',
  provider: 'gemini',
  provider_model: 'gemini-3.1-flash-tts-preview',
  defaultVoice: 'Zephyr' as const,
  languages: {
    english: { language: 'English', accent: 'US', voice: 'Zephyr' },
    'english-us': { language: 'English', accent: 'US', voice: 'Zephyr' },
    'english-uk': { language: 'English', accent: 'UK', voice: 'Puck' },
    spanish: { language: 'Spanish', accent: 'ES', voice: 'Fenrir' },
    french: { language: 'French', accent: 'FR', voice: 'Kore' },
    german: { language: 'German', accent: 'DE', voice: 'Charon' },
    japanese: { language: 'Japanese', accent: 'JP', voice: 'Kore' },
    arabic: { language: 'Arabic', accent: 'AR', voice: 'Zephyr' },
    italian: { language: 'Italian', accent: 'IT', voice: 'Zephyr' },
    portuguese: { language: 'Portuguese', accent: 'PT', voice: 'Fenrir' },
    korean: { language: 'Korean', accent: 'KR', voice: 'Kore' },
    chinese: { language: 'Chinese', accent: 'CN', voice: 'Zephyr' },
  } as Record<string, VoiceSpec>,
};

/**
 * Resolves the voice specification for a given language and requested accent/voice override
 */
export function resolveVoiceSpec(
  language?: string,
  accent?: string,
  voiceOverride?: string
): VoiceSpec {
  const cleanLang = (language || 'English').toLowerCase().trim();
  const key = cleanLang.replace(/[^a-z0-9-]/g, '');
  
  const baseSpec = VOICE_CONFIG.languages[key] || {
    language: language || 'English',
    accent: accent || 'US',
    voice: 'Zephyr',
  };

  const validVoices = ['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'];
  const finalVoice = (voiceOverride && validVoices.includes(voiceOverride))
    ? (voiceOverride as 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir')
    : baseSpec.voice;

  return {
    language: baseSpec.language,
    accent: accent || baseSpec.accent,
    voice: finalVoice,
  };
}
