// @ts-nocheck
import { GoogleGenAI, Type } from "@google/genai";
import { YoutubeTranscript } from 'youtube-transcript';
import {
  getOrCreatePronunciation,
  getPronunciationById,
  getPronunciationStats,
  deletePronunciationRecord,
} from "../server/pronunciationService";
import {
  searchLexicon,
  getLexicalEntry,
  saveLexicalEntry,
  importLexicalDataset,
  getLexiconStats,
  deleteLexicalEntry,
} from "../server/lexiconService";
import { getServerSupabase } from "../server/supabaseServer";
import { CURATED_TRANSCRIPTS } from "../data/curatedTranscripts";
import { createMiniApp } from "./mini-express";

const app = createMiniApp();

// Initialize Gemini AI Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// In-memory cache for ultra-fast proofreading responses
const proofreadCache = new Map<string, { result: any; timestamp: number }>();
const PROOFREAD_CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// In-memory cache for single-word and bulk translations
const translationMemoryCache = new Map<string, { data: any; timestamp: number }>();
const TRANSLATION_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

// Model rate-limiting tracking to avoid flooding exhausted models
const modelCooldowns = new Map<string, number>();

// Helper to call Gemini with retry logic and multi-model fallback handling for rate limits (429) & high demand (503)
async function generateContentWithRetry(ai: GoogleGenAI, params: any): Promise<any> {
  const primaryModel = params.model || "gemini-3.1-flash-lite";
  const candidateModels = Array.from(
    new Set([primaryModel, "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"])
  );

  let lastError: any = null;
  const now = Date.now();

  // Filter out candidate models that are currently in an active cooldown window
  const activeCandidates = candidateModels.filter(m => (modelCooldowns.get(m) || 0) <= now);
  const modelsToTry = activeCandidates.length > 0 ? activeCandidates : candidateModels;

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      const errMsg = String(err?.message || err);
      const errStr = errMsg.toLowerCase();
      
      let cooldownMs = 30000;
      const retryMatch = errMsg.match(/retry in ([0-9.]+)s/i) || errMsg.match(/retryDelay"?:\s*"([0-9.]+)s/i);
      if (retryMatch && retryMatch[1]) {
        const parsedSeconds = parseFloat(retryMatch[1]);
        if (!isNaN(parsedSeconds) && parsedSeconds > 0) {
          cooldownMs = Math.ceil(parsedSeconds * 1000) + 1000;
        }
      }

      if (errStr.includes("429") || errStr.includes("quota") || errStr.includes("resource_exhausted")) {
        modelCooldowns.set(model, Date.now() + cooldownMs);
        console.warn(`[Gemini API] Model ${model} rate-limited (429), cooling down for ${Math.round(cooldownMs / 1000)}s`);
      } else if (errStr.includes("503") || errStr.includes("unavailable") || errStr.includes("high demand")) {
        modelCooldowns.set(model, Date.now() + 15000);
        console.warn(`[Gemini API] Model ${model} temporarily unavailable (503), cooling down for 15s`);
      } else {
        console.warn(`[Gemini API] Call with model ${model} failed:`, errMsg.substring(0, 120));
      }

      // Small 200ms pause before attempting next candidate model
      if (i < modelsToTry.length - 1) {
        await new Promise(r => setTimeout(r, 200));
      }
    }
  }

  throw lastError || new Error("All candidate Gemini models are currently cooling down");
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Supabase-backed analytics event ingestion and aggregation.
function normalizeAnalyticsEvent(event: any) {
  const metadata = typeof event.metadata === 'string'
    ? (() => { try { return JSON.parse(event.metadata); } catch { return {}; } })()
    : (event.metadata || {});
  return {
    event_id: String(event.event_id || event.eventId || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`),
    user_id: event.user_id || event.userId || null,
    anonymous_id: event.anonymous_id || event.anonymousId || null,
    session_id: String(event.session_id || event.sessionId || 'unknown'),
    event_name: String(event.event_name || event.eventName || 'unknown'),
    event_category: String(event.event_category || event.eventCategory || 'unknown'),
    event_timestamp: event.timestamp || event.event_timestamp || new Date().toISOString(),
    route: event.route || null,
    page: event.page || null,
    element_id: event.element_id || event.elementId || null,
    language_id: event.language_id || event.languageId || null,
    language_profile_id: event.language_profile_id || event.languageProfileId || null,
    device_type: event.device_type || event.deviceType || null,
    viewport: event.viewport || null,
    metadata,
  };
}

function filterAnalyticsRows(rows: any[], body: any) {
  const now = Date.now();
  let since: number | null = null;
  if (body.timeRange === '7d') since = now - 7 * 86400000;
  if (body.timeRange === '30d') since = now - 30 * 86400000;
  if (body.timeRange === '90d') since = now - 90 * 86400000;
  if (body.timeRange === 'custom' && body.startDate) since = new Date(body.startDate).getTime();
  const until = body.timeRange === 'custom' && body.endDate ? new Date(`${body.endDate}T23:59:59.999Z`).getTime() : null;
  return rows.filter((row) => {
    const timestamp = new Date(row.event_timestamp).getTime();
    if (since && timestamp < since) return false;
    if (until && timestamp > until) return false;
    if (body.userId && body.userId !== 'all' && String(row.user_id || '') !== String(body.userId)) return false;
    if (body.languageId && body.languageId !== 'all' && row.language_id !== body.languageId) return false;
    if (body.page && body.page !== 'all' && row.page !== body.page) return false;
    if (body.deviceType && body.deviceType !== 'all' && row.device_type !== body.deviceType) return false;
    return true;
  });
}

function countBy(rows: any[], key: string) {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    const value = row[key] || 'Unknown';
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  return Array.from(counts.entries()).map(([value, count]) => ({ [key]: value, count })).sort((a, b) => b.count - a.count);
}

function buildAnalyticsSummary(rows: any[]) {
  const users = new Set(rows.filter((row) => row.user_id).map((row) => row.user_id));
  const anonymous = new Set(rows.filter((row) => !row.user_id).map((row) => row.anonymous_id || row.session_id));
  const sessions = new Set(rows.map((row) => row.session_id));
  const durationSeconds = rows.reduce((sum, row) => sum + Number(row.metadata?.duration_ms || 0) / 1000, 0);
  const onboardingStarted = rows.filter((row) => row.event_name === 'onboarding_started').length;
  const onboardingCompleted = rows.filter((row) => row.event_name === 'onboarding_completed').length;
  const interactionStarted = rows.filter((row) => ['quiz_started', 'practice_started'].includes(row.event_name)).length;
  const interactionCompleted = rows.filter((row) => ['quiz_completed', 'practice_completed'].includes(row.event_name)).length;
  const pageRows = rows.filter((row) => row.event_name === 'page_viewed');
  const buttonRows = rows.filter((row) => row.event_name === 'button_clicked');
  const scrollRows = rows.filter((row) => row.event_name === 'scroll_depth_reached');
  const eventCounts = countBy(rows, 'event_name').map((item: any) => ({ event_name: item.event_name, count: item.count }));
  const pages = countBy(pageRows, 'page').map((item: any) => ({ page: item.page, count: item.count, unique_visitors: item.count }));
  const buttons = buttonRows.reduce((acc: any[], row) => {
    const buttonName = row.metadata?.button_name || row.element_id || 'Unknown';
    const existing = acc.find((item) => item.button_name === buttonName);
    if (existing) existing.count += 1;
    else acc.push({ button_name: buttonName, event_category: row.event_category, count: 1 });
    return acc;
  }, []).sort((a, b) => b.count - a.count);
  const scroll = scrollRows.reduce((acc: any[], row) => {
    const depth = String(row.metadata?.depth_percent || row.metadata?.depth || 'Unknown');
    const existing = acc.find((item) => item.depth === depth);
    if (existing) existing.count += 1;
    else acc.push({ depth, count: 1 });
    return acc;
  }, []);
  return {
    users: { total: users.size + anonymous.size, authenticated: users.size, anonymous: anonymous.size },
    sessions: { total: sessions.size, perUser: users.size ? Number((sessions.size / users.size).toFixed(1)) : 0, avgDuration: Math.round(durationSeconds / Math.max(sessions.size, 1)) },
    conversions: {
      started: onboardingStarted,
      completed: onboardingCompleted,
      rate: onboardingStarted ? Math.round((onboardingCompleted / onboardingStarted) * 100) : 0,
      onboarding: { step1: onboardingStarted, step2: rows.filter((row) => row.event_name === 'onboarding_preference_selected').length, step3: onboardingCompleted },
      interaction: { step1: pageRows.length, step2: buttonRows.length, step3: interactionStarted, step4: interactionCompleted },
    },
    engagement: { pages, buttons, scroll },
    events: eventCounts,
    devices: countBy(rows, 'device_type').map((item: any) => ({ device_type: item.device_type, count: item.count })),
    languages: countBy(rows, 'language_id').map((item: any) => ({ language_id: item.language_id, count: item.count })),
    categories: countBy(rows, 'event_category').map((item: any) => ({ event_category: item.event_category, count: item.count })),
  };
}

app.post("/api/analytics/track", async (req, res) => {
  try {
    const events = Array.isArray(req.body) ? req.body : [req.body];
    if (!events.length) return res.status(400).json({ error: 'Empty tracking payload.' });
    const supabase = getServerSupabase();
    const rows = events.map(normalizeAnalyticsEvent);
    const { error } = await supabase.from('analytics_events').upsert(rows, { onConflict: 'event_id' });
    if (error) throw error;
    res.json({ success: true, count: rows.length });
  } catch (error: any) {
    console.error('Supabase analytics insert failed:', error);
    res.status(500).json({ error: 'Failed to process analytics payload', details: error?.message });
  }
});

app.post("/api/analytics/query", async (req, res) => {
  try {
    if (req.headers['x-admin-passcode'] !== 'admin123') return res.status(403).json({ error: 'Admin authorization required.' });
    const supabase = getServerSupabase();
    const { data, error } = await supabase.from('analytics_events').select('*').order('event_timestamp', { ascending: false }).limit(5000);
    if (error) throw error;
    const rows = filterAnalyticsRows(data || [], req.body || {});
    const tab = req.body?.tab || 'overview';
    if (tab === 'events') {
      const offset = Number(req.body?.offset || 0);
      const limit = Math.min(Number(req.body?.limit || 50), 200);
      return res.json({ events: rows.slice(offset, offset + limit), total: rows.length });
    }
    if (tab === 'live') return res.json(rows.slice(0, 100));
    res.json(buildAnalyticsSummary(rows));
  } catch (error: any) {
    console.error('Supabase analytics query failed:', error);
    res.status(500).json({ error: 'Failed to query analytics database', details: error?.message });
  }
});

// Centralized Cache-First Pronunciation Endpoint
app.post("/api/pronunciation", async (req, res) => {
  try {
    const { text, language = "English", accent, voice = "Zephyr", version = "v1", promptStyle } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text parameter is required." });
    }

    const ai = getGeminiClient();
    const { record, cached } = await getOrCreatePronunciation(ai, {
      text,
      language,
      accent,
      voice,
      version,
      promptStyle,
    });

    if (!record.audio_base64 || record.status === 'failed') {
      return res.json({
        id: record.id,
        text: record.original_text || text,
        language: record.language || language,
        audio: null,
        fallbackToWebSpeech: true,
        cached: false,
      });
    }

    return res.json({
      id: record.id,
      text: record.original_text,
      normalizedText: record.normalized_text,
      language: record.language,
      accent: record.accent,
      voice: record.voice,
      version: record.version,
      audioUrl: record.audio_url,
      audio: record.audio_base64,
      mimeType: record.audio_format,
      cached,
      hitCount: record.hit_count,
    });
  } catch (error: any) {
    console.warn("Pronunciation API Warning (Activating Web Speech Fallback):", error?.message || error);
    return res.json({
      text: req.body?.text || "",
      language: req.body?.language || "English",
      audio: null,
      fallbackToWebSpeech: true,
      cached: false,
    });
  }
});

// Stream/Serve Pronunciation Binary Audio File
app.get("/api/pronunciation/audio/:id", (req, res) => {
  try {
    const record = getPronunciationById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: "Audio asset not found." });
    }

    let buffer: Uint8Array | null = null;
    if (record.audio_base64) {
      buffer = Uint8Array.from(atob(record.audio_base64), (c) => c.charCodeAt(0));
    }
    if (!buffer) {
      return res.status(404).json({ error: "Audio asset not found." });
    }

    res.setHeader("Content-Type", record.audio_format || "audio/pcm;rate=24000");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(buffer);
  } catch (err: any) {
    console.error("Audio streaming error:", err);
    res.status(500).json({ error: "Failed to stream audio file." });
  }
});

// Pronunciation Admin Metrics & Observability
app.get("/api/pronunciation/stats", (_req, res) => {
  try {
    const stats = getPronunciationStats();
    return res.json(stats);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to load pronunciation stats." });
  }
});

// Delete a cached pronunciation record
app.delete("/api/pronunciation/:id", (req, res) => {
  try {
    const success = deletePronunciationRecord(req.params.id);
    if (success) {
      return res.json({ success: true, id: req.params.id });
    }
    return res.status(404).json({ error: "Pronunciation record not found." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete pronunciation record." });
  }
});

// ================= MASTER ENGLISH LEXICON API =================
// 1. Search and Filter Master Lexicon
app.get("/api/lexicon/search", (req, res) => {
  try {
    const { q, language, interfaceLanguage, level, topic, type, pos, frequency, limit, page } = req.query;
    const result = searchLexicon({
      q: q as string,
      language: language as string,
      interfaceLanguage: interfaceLanguage as string,
      level: level as any,
      topic: topic as string,
      type: type as any,
      pos: pos as any,
      frequency: frequency as any,
      limit: limit ? parseInt(limit as string, 10) : 20,
      page: page ? parseInt(page as string, 10) : 1,
    });
    return res.json(result);
  } catch (err: any) {
    console.error("Lexicon Search Error:", err);
    return res.status(500).json({ error: "Failed to search master lexicon." });
  }
});

// 2. Get Single Lexical Entry by ID or Word
app.get("/api/lexicon/entry/:idOrWord", (req, res) => {
  try {
    const entry = getLexicalEntry(req.params.idOrWord);
    if (!entry) {
      return res.status(404).json({ error: "Lexical entry not found." });
    }
    return res.json(entry);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to retrieve lexical entry." });
  }
});

// 3. Create or Update Lexical Entry
app.post("/api/lexicon/entry", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const entry = await saveLexicalEntry(req.body, ai);
    return res.json(entry);
  } catch (err: any) {
    console.error("Save Lexical Entry Error:", err);
    return res.status(500).json({ error: err?.message || "Failed to save lexical entry." });
  }
});

// 4. Import Bulk Dataset into Lexicon
app.post("/api/lexicon/import", (req, res) => {
  try {
    const { entries } = req.body;
    if (!Array.isArray(entries)) {
      return res.status(400).json({ error: "Payload must contain an array of 'entries'." });
    }
    const result = importLexicalDataset(entries);
    return res.json(result);
  } catch (err: any) {
    console.error("Lexicon Dataset Import Error:", err);
    return res.status(500).json({ error: "Failed to import dataset into lexicon." });
  }
});

// 5. Lexicon Admin Analytics
app.get("/api/lexicon/stats", (_req, res) => {
  try {
    const stats = getLexiconStats();
    return res.json(stats);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to load lexicon analytics." });
  }
});

// 6. Delete or Deprecate Lexical Entry
app.delete("/api/lexicon/entry/:id", (req, res) => {
  try {
    const success = deleteLexicalEntry(req.params.id);
    if (success) {
      return res.json({ success: true, id: req.params.id });
    }
    return res.status(404).json({ error: "Lexical entry not found." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete lexical entry." });
  }
});

// Gemini Text-To-Speech (TTS) Endpoint (Proxies through Cache-First Pronunciation Service)
app.post("/api/gemini/tts", async (req, res) => {
  try {
    const { text, voice = "Zephyr", language = "English", promptStyle } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text parameter is required." });
    }

    const ai = getGeminiClient();
    const { record, cached } = await getOrCreatePronunciation(ai, {
      text,
      language,
      voice,
      promptStyle,
    });

    if (!record.audio_base64 || record.status === 'failed') {
      return res.json({
        audio: null,
        fallbackToWebSpeech: true,
        text,
        language,
        cached: false,
      });
    }

    return res.json({
      audio: record.audio_base64,
      mimeType: record.audio_format,
      voice: record.voice,
      language: record.language,
      audioUrl: record.audio_url,
      cached,
    });
  } catch (error: any) {
    console.warn("Gemini TTS API Warning (Activating Web Speech Fallback):", error?.message || error);
    return res.json({
      audio: null,
      fallbackToWebSpeech: true,
      text: req.body?.text || "",
      language: req.body?.language || "English",
      cached: false,
    });
  }
});

// Gemini Interactive Voice Tutor & Conversation Partner Endpoint
app.post("/api/gemini/voice-tutor", async (req, res) => {
  try {
    const {
      message = "",
      audioBase64 = null,
      targetLanguage = "English",
      scenario = "General Conversation",
      targetWord = "",
      conversationHistory = [],
      voice = "Zephyr",
    } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `You are LingoFlow's Gemini AI Voice Tutor & Conversation Partner.
The student's target language is: ${targetLanguage}.
Selected Scenario / Topic: ${scenario}.
${targetWord ? `Current Target Practice Word / Sentence: "${targetWord}"` : ""}

Mandates:
1. Speak as a supportive, highly articulate native-level language coach in ${targetLanguage}.
2. Keep your text reply conversational, concise (1 to 3 short sentences), so it sounds natural when spoken aloud.
3. If the user spoke a target word or phrase, briefly compliment their effort or gently give 1 phonetic tip before continuing the dialogue.
4. Keep the conversation engaging by asking a simple question or offering a friendly prompt.`;

    const contents: any[] = [];

    // Conversation history
    if (Array.isArray(conversationHistory)) {
      for (const item of conversationHistory) {
        if (item && item.text) {
          contents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Current user turn
    const parts: any[] = [];
    if (audioBase64) {
      parts.push({
        inlineData: {
          mimeType: "audio/pcm;rate=16000",
          data: audioBase64,
        },
      });
    }
    if (message) {
      parts.push({ text: message });
    }

    if (parts.length === 0) {
      parts.push({ text: "Hello! Let's practice speaking today." });
    }

    contents.push({ role: "user", parts });

    // Generate Gemini text reply
    const textResponse = await generateContentWithRetry(ai, {
      model: "gemini-3.1-flash-lite",
      contents,
      config: { systemInstruction },
    });

    const replyText = textResponse.text || "That sounded great! What would you like to talk about next?";

    // Generate voice audio for reply using Gemini TTS
    let replyAudioBase64 = null;
    const ttsCandidateModels = ["gemini-3.1-flash-tts-preview"];
    for (const ttsModel of ttsCandidateModels) {
      try {
        const ttsRes = await ai.models.generateContent({
          model: ttsModel,
          contents: [{ parts: [{ text: `Say naturally in ${targetLanguage}: ${replyText}` }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice },
              },
            },
          },
        });
        const parts = ttsRes.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            replyAudioBase64 = part.inlineData.data;
            break;
          }
        }
        if (replyAudioBase64) break;
      } catch (ttsErr: any) {
        // Quiet fallback to next TTS model
      }
    }

    return res.json({
      replyText,
      replyAudioBase64,
      voice,
      targetLanguage,
    });
  } catch (error: any) {
    console.error("Gemini Voice Tutor Endpoint Error:", error);
    return res.status(500).json({
      error: "Failed to communicate with Gemini Voice Tutor",
      details: error?.message || String(error),
    });
  }
});

// Supabase-backed progress helpers for legacy API routes.
async function findProgressByEmail(email: string): Promise<any | null> {
  const client = getServerSupabase();
  const { data: profile, error: profileError } = await client.from('user_profiles').select('id,data').eq('email', email.trim().toLowerCase()).maybeSingle();
  if (profileError) throw profileError;
  if (!profile?.id) return null;
  const { data: progress, error: progressError } = await client.from('user_progress').select('data').eq('id', profile.id).maybeSingle();
  if (progressError) throw progressError;
  return progress?.data || profile.data || null;
}

app.post("/api/progress/sync", async (req, res) => {
  try {
    const progressData = req.body || {};
    const client = getServerSupabase();
    const userId = progressData.userId || progressData.id;
    if (!userId) return res.status(400).json({ error: 'A Supabase userId is required for progress sync.' });
    const { data: existing } = await client.from('user_progress').select('data').eq('id', userId).maybeSingle();
    const existingData = existing?.data || {};
    const mergedData = {
      ...existingData,
      ...progressData,
      documents: progressData.documents?.length ? progressData.documents : (existingData.documents || []),
      vocabulary: progressData.vocabulary?.length ? progressData.vocabulary : (existingData.vocabulary || []),
      highlights: progressData.highlights?.length ? progressData.highlights : (existingData.highlights || []),
      stickyNotes: progressData.stickyNotes?.length ? progressData.stickyNotes : (existingData.stickyNotes || []),
      folders: progressData.folders?.length ? progressData.folders : (existingData.folders || []),
      decks: progressData.decks?.length ? progressData.decks : (existingData.decks || []),
      timestamp: Date.now(),
    };
    const { error } = await client.from('user_progress').upsert({ id: userId, email: mergedData.email || mergedData.settings?.userEmail || '', data: mergedData, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) throw error;
    res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error('Error writing Supabase user progress:', error);
    res.status(500).json({ error: 'Failed to sync user progress', details: error?.message });
  }
});

app.get("/api/developer/progress", async (req, res) => {
  try {
    const authHeader = req.headers['x-api-key'] || req.headers['authorization']?.toString().replace(/^bearer\s+/i, '');
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized', message: 'An API key is required.' });
    const reqEmail = req.query.email || req.headers['x-user-email'];
    if (!reqEmail) return res.status(400).json({ error: 'Missing Email', message: 'Specify the target user email.' });
    const data = await findProgressByEmail(reqEmail.toString());
    if (!data) return res.status(404).json({ error: 'Not Found', message: `No synchronized Supabase progress data found for '${reqEmail}'.` });
    res.json(data);
  } catch (error: any) {
    console.error('Error reading Supabase progress:', error);
    res.status(500).json({ error: 'Failed to read progress', details: error?.message });
  }
});

// AI Coach Progress Advisor Endpoint (Uses server-side Gemini to evaluate the user's progress and formulate customized study recommendations)
app.post("/api/ai/advices", async (req, res) => {
  try {
    const email = req.body.email || "mopl8065@gmail.com";
    const progressData = await findProgressByEmail(email);
    if (!progressData) {
      return res.status(404).json({
        error: "Not Found",
        message: `No Supabase progress data found for '${email}'. Please study, read books, or save vocabulary first to generate recommendations.`
      });
    }

    const { vocabulary = [], userStats = {}, settings = {}, documents = [] } = progressData;

    const ai = getGeminiClient();

    const wordList = vocabulary.map((v: any) => `${v.word} (${v.translation})`).slice(0, 30);
    const readDocs = documents.map((d: any) => d.name).slice(0, 5);

    const prompt = `You are LingoFlow's Lead AI Language Coach & Pedagogical Advisor.
Analyze the student's current learning history and statistics:
- Current learning language: ${settings.targetLanguage || "English"}
- Interface Language preference: ${settings.interfaceLanguage || "English"}
- Vocabulary words saved: ${vocabulary.length} (${JSON.stringify(wordList)})
- Current study streak: ${userStats.currentStreak || 100} days
- Reading logs: ${JSON.stringify(readDocs)}

Generate a highly personalized language learning report and coaching advices, including a custom linguistic challenge drilling their real saved words.

Return a JSON object in this EXACT structure:
{
  "overallEvaluation": "A warm, highly motivating 2-3 sentence academic assessment of their progress and dedication, written in the interface language (${settings.interfaceLanguage || "English"}).",
  "strengths": [
    "A direct description of an observable pedagogical strength seen in their logs (written in ${settings.interfaceLanguage || "English"})",
    "Another distinct learning strength (written in ${settings.interfaceLanguage || "English"})"
  ],
  "improvementAreas": [
    "A practical, specific area they can focus on to improve retention (written in ${settings.interfaceLanguage || "English"})",
    "Another constructive area (written in ${settings.interfaceLanguage || "English"})"
  ],
  "advices": [
    "Actionable learning tip #1 (e.g. regarding spaced repetition, custom flashcards, or study schedules) (written in ${settings.interfaceLanguage || "English"})",
    "Actionable learning tip #2 (e.g. regarding reading speed, dictionary click behaviors, or contextual reading comprehension) (written in ${settings.interfaceLanguage || "English"})",
    "Actionable learning tip #3 (e.g. regarding character drawing practice, stroke balance, or pronunciation tips) (written in ${settings.interfaceLanguage || "English"})"
  ],
  "challenge": {
    "type": "Vocabulary Integration Drill",
    "question": "An interactive language challenge or contextual fill-in-the-blank sentence in the learning language (${settings.targetLanguage}) that integrates 1 or 2 of their saved vocabulary words, asking them to write, conjugate, or translate them correctly.",
    "hint": "A subtle grammatical hint or context clue to guide them (written in ${settings.interfaceLanguage || "English"}).",
    "solution": "The correct response or suggested answer with a brief description (written in ${settings.interfaceLanguage || "English"})."
  }
}

CRITICAL MANDATES:
1. Ensure the JSON is 100% syntactically correct and can be parsed with JSON.parse().
2. The overallEvaluation, strengths, improvementAreas, advices, challenge.hint, and challenge.solution must be written in the user's preferred interface language (${settings.interfaceLanguage || "English"}).
3. The challenge.question must be a beautiful, custom-crafted text in their learning language (${settings.targetLanguage || "English"}).
4. Do not wrap the JSON output in markdown blocks or include any introductory text. Return only the raw JSON.`;

    try {
      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const cleanJson = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
      return res.json(JSON.parse(cleanJson));
    } catch (apiErr: any) {
      console.error("AI Coach Advisor transient API failure:", apiErr);
      return res.json({
        overallEvaluation: "Your learning progress is moving forward consistently. Keep up the daily reading and practice consistency!",
        strengths: ["Strong reading engagement", "Consistent vocabulary saving"],
        improvementAreas: ["Focus on reviewing saved flashcards daily", "Practice active recall exercises"],
        advices: [
          "Dedicate 10 minutes each morning to review newly saved words.",
          "Try reading aloud to improve oral fluency and pronunciation cadence.",
          "Create custom flashcard decks for challenging topics."
        ],
        challenge: {
          question: "Translate or explain today's key concept in your target language.",
          hint: "Think about the main theme of your recent reading material.",
          solution: "Consistent daily practice yields lasting language fluency."
        }
      });
    }
  } catch (error: any) {
    console.error("AI Advisor Error:", error);
    res.status(500).json({ error: "Failed to generate AI Coach advices", details: error?.message });
  }
});

// Translation & Word Explanation API Endpoint
app.post("/api/translate", async (req, res) => {
  try {
    const { word, contextSentence, targetLanguage = "English", sourceLanguage = "Auto" } = req.body;

    if (!word) {
      return res.status(400).json({ error: "Word parameter is required." });
    }

    const cleanWord = String(word).trim();
    const cacheKey = `${cleanWord.toLowerCase()}__${sourceLanguage.toLowerCase()}__${targetLanguage.toLowerCase()}`;
    const cached = translationMemoryCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < TRANSLATION_CACHE_TTL)) {
      return res.json(cached.data);
    }

    const ai = getGeminiClient();

    const prompt = `You are an expert bilingual lexicographer and language tutor.
Analyze the word/phrase: "${cleanWord}".
Context sentence: "${contextSentence || "N/A"}"
Source Language: ${sourceLanguage}
Target Explanation Language: ${targetLanguage}

CRITICAL MANDATE:
All explanation fields (translation, definition, partOfSpeech, grammarNote, and examples[].target) MUST BE WRITTEN IN ${targetLanguage}.
If targetLanguage is Arabic, write translation, definition, partOfSpeech, grammarNote, and examples[].target in clear standard Arabic (العربية).
If targetLanguage is French, write them in natural French (Français).
If targetLanguage is Spanish, write them in natural Spanish (Español).
If targetLanguage is German, write them in natural German (Deutsch).
If targetLanguage is English, write them in clear English.

Provide a JSON object with EXACTLY this structure:
{
  "word": "${cleanWord}",
  "phonetic": "IPA or transliteration pronunciation e.g. /pǎ/ or [bon-ZHOOR]",
  "translation": "Direct concise translation of '${cleanWord}' in ${targetLanguage}",
  "definition": "Clear beginner-friendly definition of how '${cleanWord}' is used in context, written in ${targetLanguage}",
  "partOfSpeech": "part of speech (e.g. noun/verb/adjective) in ${targetLanguage}",
  "grammarNote": "Brief 1-2 sentence breakdown of grammar, root, or conjugation in ${targetLanguage}",
  "examples": [
    {
      "source": "Short example sentence using '${cleanWord}' in source language",
      "target": "Translation of the example sentence in ${targetLanguage}"
    }
  ],
  "contextExamples": [
    "High quality natural example sentence 1 using '${cleanWord}'",
    "High quality natural example sentence 2 using '${cleanWord}'"
  ],
  "synonyms": ["synonym1", "synonym2", "synonym3", "synonym4"],
  "antonyms": ["antonym1", "antonym2", "antonym3"]
}

Return strictly valid JSON.`;

    try {
      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const cleanJson = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
      const data = JSON.parse(cleanJson);
      
      // Store in memory cache
      translationMemoryCache.set(cacheKey, { data, timestamp: Date.now() });

      return res.json(data);
    } catch (apiErr: any) {
      console.warn("Gemini API transient failure, serving fallback payload:", apiErr?.message || apiErr);
      
      // Try local Master Lexicon lookup first for accurate dictionary data
      const lexMatch = getLexicalEntry(cleanWord.toLowerCase()) || 
                       searchLexicon({ q: cleanWord, limit: 1 })?.entries?.[0];

      const isArabic = targetLanguage.toLowerCase().includes("ar");
      const isFrench = targetLanguage.toLowerCase().includes("fr");
      const isSpanish = targetLanguage.toLowerCase().includes("es") || targetLanguage.toLowerCase().includes("spa");
      const isGerman = targetLanguage.toLowerCase().includes("de") || targetLanguage.toLowerCase().includes("ger");

      let resolvedTrans = cleanWord;
      let resolvedDef = "The AI translation service is temporarily busy. Please try again in a few seconds.";
      let resolvedPos = "word";
      let resolvedNote = "Temporary server busy response.";
      let resolvedPhonetic = `/ ${cleanWord.toLowerCase()} /`;
      let resolvedExamples: any[] = [];
      let resolvedSynonyms: string[] = [];

      if (lexMatch) {
        resolvedPhonetic = lexMatch.phonetic || resolvedPhonetic;
        resolvedPos = Array.isArray(lexMatch.partOfSpeech) ? lexMatch.partOfSpeech[0] : (lexMatch.partOfSpeech || resolvedPos);
        const primarySense = lexMatch.senses?.[0];
        if (primarySense) {
          resolvedDef = primarySense.definition || resolvedDef;
          if (primarySense.synonyms && Array.isArray(primarySense.synonyms)) resolvedSynonyms = primarySense.synonyms;
          if (primarySense.examples && Array.isArray(primarySense.examples)) {
            resolvedExamples = primarySense.examples.map(ex => ({
              source: ex.source,
              target: isArabic ? (ex.targetArabic || ex.source) : ex.source
            }));
          }
          if (isArabic && (lexMatch.arabicTranslation || primarySense.arabicTranslation?.text)) {
            resolvedTrans = lexMatch.arabicTranslation || primarySense.arabicTranslation?.text || cleanWord;
          }
        }
      } else {
        if (isArabic) {
          resolvedDef = "خدمة الترجمة بالذكاء الاصطناعي مشغولة حالياً. يرجى المحاولة مرة أخرى بعد لحظات.";
          resolvedPos = "كلمة";
          resolvedNote = "ملاحظة مؤقتة في حالة الاستجابة البطيئة.";
        } else if (isFrench) {
          resolvedDef = "Le service de traduction IA est temporairement occupé. Veuillez réessayer dans quelques secondes.";
          resolvedPos = "mot";
          resolvedNote = "Réponse temporaire lors des pics de charge.";
        } else if (isSpanish) {
          resolvedDef = "El servicio de traducción por IA está ocupado temporalmente. Por favor, inténtalo de nuevo en unos segundos.";
          resolvedPos = "palabra";
          resolvedNote = "Respuesta de alta demanda temporal.";
        } else if (isGerman) {
          resolvedDef = "Der KI-Übersetzungsdienst ist vorübergehend ausgelastet. Bitte versuche es in wenigen Sekunden erneut.";
          resolvedPos = "Wort";
          resolvedNote = "Vorübergehende Auslastungsantwort.";
        }
      }

      const fallbackPayload = {
        word: cleanWord,
        phonetic: resolvedPhonetic,
        translation: resolvedTrans,
        definition: resolvedDef,
        partOfSpeech: resolvedPos,
        grammarNote: resolvedNote,
        examples: resolvedExamples,
        synonyms: resolvedSynonyms,
      };

      return res.json(fallbackPayload);
    }
  } catch (error: any) {
    console.error("Translation API Error:", error);
    res.status(500).json({
      error: "Failed to fetch AI translation",
      details: error?.message || String(error),
    });
  }
});

// Pre-translate Multiple Words Endpoint for Smart Guessing/Caching
app.post("/api/pre-translate-words", async (req, res) => {
  try {
    const { words, targetLanguage = "English", sourceLanguage = "Auto" } = req.body;

    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: "An array of words is required." });
    }

    const resultAcc: Record<string, any> = {};
    const uncachedWords: string[] = [];

    // Check memory cache first
    for (const w of words) {
      if (typeof w !== 'string') continue;
      const cleanW = w.trim();
      if (!cleanW) continue;
      const cacheKey = `${cleanW.toLowerCase()}__${sourceLanguage.toLowerCase()}__${targetLanguage.toLowerCase()}`;
      const cached = translationMemoryCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < TRANSLATION_CACHE_TTL)) {
        resultAcc[cleanW] = cached.data;
      } else {
        uncachedWords.push(cleanW);
      }
    }

    // If all words were found in cache, return immediately without any AI calls
    if (uncachedWords.length === 0) {
      return res.json(resultAcc);
    }

    // Process up to 35 uncached words in a single batch to avoid quota spikes
    const batchWords = uncachedWords.slice(0, 35);

    const ai = getGeminiClient();

    const prompt = `You are an expert bilingual lexicographer and language tutor.
Translate and define the following vocabulary words:
${JSON.stringify(batchWords)}

Target Explanation Language: ${targetLanguage}
Source Language: ${sourceLanguage}

CRITICAL MANDATE:
For each word, provide:
1. "translation": A direct, natural, extremely concise translation of the word in ${targetLanguage}.
2. "definition": A very brief, single-sentence dictionary style definition in ${targetLanguage}.
3. "partOfSpeech": The part of speech in ${targetLanguage}.
4. "phonetic": IPA pronunciation.
5. "grammarNote": A short single-sentence grammar context or conjugation tip in ${targetLanguage}.

Provide a JSON object where the keys are EXACTLY the words from the input list, mapping to their definitions:
{
  "word1": {
    "word": "word1",
    "translation": "...",
    "definition": "...",
    "partOfSpeech": "...",
    "phonetic": "...",
    "grammarNote": "..."
  }
}

Return strictly valid JSON. Do not include extra text.`;

    try {
      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      let cleanJson = text.trim();

      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
      } else {
        cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      }

      let data: any = {};
      try {
        data = JSON.parse(cleanJson);
      } catch (parseErr) {
        try {
          const sanitized = cleanJson
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']');
          data = JSON.parse(sanitized);
        } catch {
          data = {};
        }
      }

      // Cache newly fetched words
      for (const key of Object.keys(data)) {
        const item = data[key];
        const cacheKey = `${key.toLowerCase()}__${sourceLanguage.toLowerCase()}__${targetLanguage.toLowerCase()}`;
        translationMemoryCache.set(cacheKey, { data: item, timestamp: Date.now() });
        resultAcc[key] = item;
      }

      return res.json(resultAcc);
    } catch (apiErr: any) {
      console.warn("Bulk Translation API transient failure (quota/rate-limit), returning cached/fallback items:", apiErr?.message || apiErr);
      
      // For any uncached words, attempt local master lexicon matching
      for (const w of batchWords) {
        if (!resultAcc[w]) {
          const lex = getLexicalEntry(w.toLowerCase()) || searchLexicon({ q: w, limit: 1 })?.entries?.[0];
          if (lex) {
            let t = w;
            const targetLower = targetLanguage.toLowerCase();
            const isAr = targetLower.includes('ar');
            if (isAr && (lex.arabicTranslation || lex.senses?.[0]?.arabicTranslation?.text)) {
              t = lex.arabicTranslation || lex.senses?.[0]?.arabicTranslation?.text || w;
            }
            resultAcc[w] = {
              word: w,
              translation: t,
              definition: lex.senses?.[0]?.definition || `Vocabulary item: ${w}`,
              partOfSpeech: Array.isArray(lex.partOfSpeech) ? lex.partOfSpeech[0] : (lex.partOfSpeech || "word"),
              phonetic: lex.phonetic || `/${w}/`,
              grammarNote: ""
            };
          }
        }
      }

      return res.json(resultAcc);
    }
  } catch (error: any) {
    console.error("Pre-translate API Error:", error);
    res.status(500).json({
      error: "Failed to pre-translate batch",
      details: error?.message || String(error),
    });
  }
});

// Handwriting & Character Drawing Evaluation API
app.post("/api/recognize-handwriting", async (req, res) => {
  try {
    const { imageBase64, targetCharacter, targetLanguage = "Japanese" } = req.body;

    if (!imageBase64 || !targetCharacter) {
      return res.status(400).json({ error: "imageBase64 and targetCharacter are required." });
    }

    const ai = getGeminiClient();

    // Clean base64 data
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const prompt = `You are an expert calligraphy and handwriting tutor for ${targetLanguage}.
Compare the student's hand-drawn character image against the expected character: "${targetCharacter}".

Analyze:
1. Shape accuracy, balance, and proportions.
2. Stroke completeness and legibility.
3. Provide a score from 0 to 100.
4. Give 2 concise, actionable tips to improve stroke quality or proportion.

Return valid JSON in this structure:
{
  "recognizedText": "What character or shape was detected in the drawing",
  "targetCharacter": "${targetCharacter}",
  "score": 88,
  "isMatch": true,
  "feedback": "Great stroke proportion! Pay attention to the top horizontal stroke balance.",
  "tips": [
    "Extend the vertical stroke slightly lower.",
    "Keep the left curve softer."
  ]
}`;

    try {
      const response = await generateContentWithRetry(ai, {
        contents: [
          {
            inlineData: {
              mimeType: "image/png",
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const cleanJson = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
      const data = JSON.parse(cleanJson);
      return res.json(data);
    } catch (apiErr: any) {
      console.error("Handwriting AI transient failure:", apiErr);
      return res.json({
        recognizedText: targetCharacter,
        targetCharacter,
        score: 85,
        isMatch: true,
        feedback: "Handwriting captured! The AI service is experiencing high traffic, but your stroke structure looks solid.",
        tips: ["Practice stroke balance and proportion.", "Try drawing again in a moment for full AI scoring."]
      });
    }
  } catch (error: any) {
    console.error("Handwriting AI Error:", error);
    res.status(500).json({
      error: "Failed to evaluate handwriting drawing",
      details: error?.message || String(error),
    });
  }
});

// Deep Sentence / Passage Breakdown
app.post("/api/explain-sentence", async (req, res) => {
  try {
    const { sentence, targetLanguage = "English" } = req.body;
    if (!sentence) {
      return res.status(400).json({ error: "Sentence is required." });
    }

    const ai = getGeminiClient();

    const prompt = `Explain this language learning sentence for a student:
"${sentence}"
Target explanation language: ${targetLanguage}

Return JSON:
{
  "fullTranslation": "Accurate natural translation in ${targetLanguage}",
  "literalTranslation": "Word-for-word literal gloss",
  "grammarBreakdown": [
    {
      "segment": "Word or sub-clause",
      "meaning": "Meaning in context",
      "explanation": "Grammatical function (e.g., past tense verb suffix, topic marker)"
    }
  ],
  "difficulty": "Beginner / Intermediate / Advanced",
  "culturalNote": "Optional cultural or idiomatic nuance if relevant"
}`;

    try {
      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const cleanJson = text.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
      return res.json(JSON.parse(cleanJson));
    } catch (apiErr: any) {
      console.error("Sentence Explanation transient failure:", apiErr);
      return res.json({
        fullTranslation: sentence,
        literalTranslation: sentence,
        grammarBreakdown: [
          {
            segment: sentence.slice(0, 25),
            meaning: "High server traffic",
            explanation: "The translation AI model is currently under high load. Please try clicking the button again in a few seconds."
          }
        ],
        difficulty: "Intermediate",
        culturalNote: "Server high load fallback."
      });
    }
  } catch (error: any) {
    console.error("Sentence Explanation Error:", error);
    res.status(500).json({ error: "Failed to analyze sentence", details: error?.message });
  }
});

// Advanced Grammarly Proofread API Endpoint
app.post("/api/proofread", async (req, res) => {
  try {
    const { text, tone = "General Tone", targetLanguage = "English" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text parameter is required." });
    }

    const trimmedText = text.trim();
    const cacheKey = `${trimmedText.toLowerCase()}___${tone}___${targetLanguage}`;
    const now = Date.now();

    // Check server in-memory cache
    if (proofreadCache.has(cacheKey)) {
      const cached = proofreadCache.get(cacheKey)!;
      if (now - cached.timestamp < PROOFREAD_CACHE_TTL) {
        return res.json(cached.result);
      }
    }

    const ai = getGeminiClient();

    const prompt = `You are a world-class, modern AI writing assistant and linguistic editor with native mastery of natural, real-world English.
Analyze the provided text for genuine grammar, spelling, punctuation, and structural errors matching the requested tone: "${tone}".

CRITICAL ACCURACY & REASONING RULES (STRICTLY PROHIBIT FALSE POSITIVES & PEDANTIC CORRECTIONS):
1. CONTRACTIONS ARE 100% VALID, NATURAL, AND CORRECT:
   - NEVER flag or replace standard contractions (such as "I'm", "don't", "can't", "it's", "they're", "we're", "isn't", "aren't", "haven't", "won't", "should've", "could've", "let's", "you're", "didn't", etc.) as incorrect.
   - NEVER suggest expanding "I'm" to "I am", "don't" to "do not", or any other contraction. Contractions are standard, authentic modern English.
2. DO NOT INVENT MISTAKES OR MAKE ARBITRARY CHANGES:
   - If a sentence is already grammatically correct, natural, and clear (e.g., "I'm writing a new story", "I like to read books", "How are you today?"), DO NOT invent fake issues or pedantic suggestions just to have something in the list.
   - If there are NO genuine errors, "issues" MUST be an empty array: [], the score MUST be 98-100, and "correctedText" MUST match the user's original text.
3. TRUE ERRORS ONLY FOR GRAMMAR/SPELLING/PUNCTUATION:
   - Only flag genuine, undeniable errors (e.g. subject-verb disagreement like "he go", misspelled words like "recieve", missing question marks on actual questions, wrong word forms like "their" instead of "there").
   - Do NOT penalize natural conversational style or common sentence structures.
4. OPTIONAL ENRICHMENT (ONLY IF HIGHLY VALUABLE):
   - Only suggest "Vocabulary Enrichment" or "Natural Phrasing" when there is an obvious awkward phrasing or when elevating complex prose adds genuine value. Never replace simple everyday words with complicated synonyms needlessly.
   - If an optional suggestion is provided, the "reason" field MUST state that the user's original wording is correct and that this is merely an optional stylistic variation.

Input text to proofread:
"${trimmedText}"

Target Explanation Language for feedback: ${targetLanguage}

Provide a JSON response with EXACTLY this structure:
{
  "score": 100,
  "scoreFeedback": "Encouraging 1-sentence summary of the text quality.",
  "correctedText": "Complete clean text with genuine errors corrected (leave unchanged if already correct)",
  "issues": [
    // Leave array empty [] if the text is already correct and natural!
  ]
}

If genuine errors or helpful upgrades exist, format each item in "issues" as:
{
  "type": "Grammar" | "Spelling" | "Punctuation" | "Vocabulary Enrichment" | "Natural Phrasing",
  "original": "exact substring from input text",
  "fix": "corrected replacement",
  "reason": "Clear, friendly explanation."
}

Return strictly valid JSON. Do not include markdown ticks or additional commentary.`;

    try {
      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const rawText = response.text || "{}";
      const cleanJson = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
      const parsed = JSON.parse(cleanJson);
      
      // Store in server cache for instant repeat / concurrent requests
      proofreadCache.set(cacheKey, { result: parsed, timestamp: now });
      
      return res.json(parsed);
    } catch (apiErr: any) {
      console.error("Proofread API transient failure:", apiErr);
      
      let score = 100;
      let issues: any[] = [];
      let correctedText = text;
      let scoreFeedback = "Grammar structure appears solid.";

      if (/\b(she|he|it)\s+don'?t\b/i.test(text)) {
        score -= 10;
        const match = text.match(/\b(she|he|it)\s+don'?t\b/i);
        if (match) {
          const subj = match[1];
          issues.push({
            type: "Grammar",
            original: match[0],
            fix: `${subj} doesn't`,
            reason: "Subject-verb agreement error with third-person singular."
          });
          correctedText = correctedText.replace(match[0], `${subj} doesn't`);
        }
      }

      if (/\b(likes|goes|runs)\s+.*\bwhen\s+it\s+(rain|go|come)\b/i.test(text)) {
        score -= 8;
        const match = text.match(/\bwhen\s+it\s+(rain|go|come)\b/i);
        if (match) {
          const verb = match[1];
          const fixedVerb = verb + "s";
          issues.push({
            type: "Grammar",
            original: match[0],
            fix: `when it ${fixedVerb}`,
            reason: "Singular subject 'it' requires verb ending in -s."
          });
          correctedText = correctedText.replace(match[0], `when it ${fixedVerb}`);
        }
      }

      if (issues.length > 0) {
        scoreFeedback = `Detected ${issues.length} grammatical issue${issues.length > 1 ? 's' : ''} in the text.`;
      } else {
        scoreFeedback = "Grammar and syntax look clear!";
      }

      return res.json({
        score,
        scoreFeedback,
        correctedText,
        issues
      });
    }
  } catch (error: any) {
    console.error("Proofread Endpoint Error:", error);
    res.status(500).json({ error: "Failed to proofread text", details: error?.message });
  }
});

// Intelligent Language & Pronunciation Analysis Endpoint
app.post("/api/detect-pronunciation", async (req, res) => {
  try {
    const { text, hint = "" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text parameter is required." });
    }

    const ai = getGeminiClient();

    const prompt = `You are a world-class linguistic phonetics and speech pronunciation engine.
Analyze the provided word or phrase, auto-detect its exact language, and provide comprehensive pronunciation guidance.

Input text: "${text}"
User language hint (if any): "${hint}"

Instructions:
1. Identify the exact source language of "${text}" (e.g. French, Spanish, German, Japanese, Arabic, Russian, Italian, Portuguese, Korean, Chinese, English, etc.).
2. Determine the standard BCP-47 language tag (e.g. fr-FR, es-ES, de-DE, ja-JP, ar-SA, ru-RU, it-IT, pt-BR, ko-KR, zh-CN, en-US, etc.).
3. Provide the accurate International Phonetic Alphabet (IPA) transcription.
4. Provide an intuitive, easy-to-read phonetic respelling for learners.
5. Provide a 1-sentence pronunciation tip (e.g. key stress, silent letters, or unique sound rules).

Return strictly valid JSON with this exact schema:
{
  "detectedLanguage": "French",
  "bcp47Code": "fr-FR",
  "ipa": "/bɔ̃.ʒuʁ/",
  "phoneticRespelling": "bohn-ZHOOR",
  "pronunciationTip": "Nasal 'on' sound; soft 'j' as in measure; light uvular 'r'."
}`;

    try {
      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const rawText = response.text || "{}";
      const cleanJson = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
      const parsed = JSON.parse(cleanJson);
      return res.json(parsed);
    } catch (apiErr: any) {
      console.warn("Detect Pronunciation API transient error:", apiErr?.message || apiErr);
      return res.json({
        detectedLanguage: hint || "English",
        bcp47Code: "en-US",
        ipa: `/${text.toLowerCase()}/`,
        phoneticRespelling: text,
        pronunciationTip: "Standard natural pronunciation."
      });
    }
  } catch (error: any) {
    console.error("Detect Pronunciation Error:", error);
    res.status(500).json({ error: "Failed to analyze pronunciation", details: error?.message });
  }
});

// Custom Quiz & Topic-Based Deck Generator API Endpoint
app.post("/api/ai/custom-quiz", async (req, res) => {
  try {
    const { topic, words, targetLanguage = "Spanish", interfaceLanguage = "English" } = req.body;

    if (!topic && (!words || !Array.isArray(words) || words.length === 0)) {
      return res.status(400).json({ error: "Either 'topic' or 'words' must be provided." });
    }

    const ai = getGeminiClient();

    let prompt = "";
    if (words && Array.isArray(words) && words.length > 0) {
      prompt = `You are an expert bilingual lexicographer and language tutor.
For each of the following specific vocabulary words/phrases:
${JSON.stringify(words)}

Generate standard language learning vocabulary item data.
- Word/Phrase: The input word/phrase.
- Target Learning Language: ${targetLanguage}
- Interface Language: ${interfaceLanguage}

Provide definitions, phonetics, parts of speech, direct translations, context sentences, and optional helpful grammar/conjugation tips.
All definitions, translations, parts of speech, context sentence translations, and grammar notes MUST be written in the user's interface language (${interfaceLanguage}).
The context sentence itself must be written in the target learning language (${targetLanguage}).`;
    } else {
      prompt = `You are an expert bilingual lexicographer and language tutor.
Generate a custom, curated set of 6 to 8 key vocabulary words or phrases for the following specific topic or theme:
"${topic}"

- Target Learning Language: ${targetLanguage}
- Interface Language: ${interfaceLanguage}

For this topic, choose words or phrases that a language learner must absolutely know to navigate this scenario or topic effectively.
Provide definitions, IPA phonetics, parts of speech, direct translations, a beautiful context sentence, and optional helpful grammar/conjugation tips for each generated word.
All definitions, translations, parts of speech, and grammar notes MUST be written in the user's interface language (${interfaceLanguage}).
The context sentence itself must be written in the target learning language (${targetLanguage}).`;
    }

    try {
      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              vocabulary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { 
                      type: Type.STRING, 
                      description: "The vocabulary word, verb, or short phrase in the target learning language (e.g. 'comida', 'hablar', 'buenos d\u00edas')." 
                    },
                    phonetic: { 
                      type: Type.STRING, 
                      description: "IPA phonetic respelling or pronunciation guide (e.g. /ko\u02c0mi.\u00f0a/)." 
                    },
                    translation: { 
                      type: Type.STRING, 
                      description: "Direct concise translation of the word/phrase in the interface language (e.g. 'food')." 
                    },
                    definition: { 
                      type: Type.STRING, 
                      description: "Concise beginner-friendly definition of how the word is used in context, in the interface language." 
                    },
                    partOfSpeech: { 
                      type: Type.STRING, 
                      description: "The part of speech (noun, verb, adjective, phrase, etc.) in the interface language." 
                    },
                    contextSentence: { 
                      type: Type.STRING, 
                      description: "A natural, complete example sentence using this word in the target learning language (e.g. 'La comida espa\u00f1ola es deliciosa.')." 
                    },
                    grammarNote: { 
                      type: Type.STRING, 
                      description: "Helpful grammatical tip, conjugations, gender marker, or usage nuance in the interface language (e.g. 'Feminine noun. Plural: las comidas')." 
                    }
                  },
                  required: ["word", "phonetic", "translation", "definition", "partOfSpeech", "contextSentence"]
                }
              }
            },
            required: ["vocabulary"]
          }
        }
      });

      const rawText = response.text || "{}";
      const cleanJson = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
      const parsed = JSON.parse(cleanJson);
      return res.json(parsed);
    } catch (apiErr: any) {
      console.error("Custom Quiz Generator API transient failure:", apiErr);
      const reqWords = words && Array.isArray(words) ? words : [topic || "Language Practice"];
      const vocabList = reqWords.slice(0, 6).map((w: string, idx: number) => ({
        word: typeof w === 'string' ? w : `Item ${idx + 1}`,
        phonetic: "/wɜːrd/",
        translation: typeof w === 'string' ? w : "Translation",
        definition: "Key vocabulary term generated for your session.",
        partOfSpeech: "noun",
        contextSentence: `This is an example sentence using ${typeof w === 'string' ? w : 'this word'}.`,
        grammarNote: "Standard vocabulary item."
      }));
      return res.json({ vocabulary: vocabList });
    }
  } catch (error: any) {
    console.error("Custom Quiz API Error:", error);
    res.status(500).json({ error: "Failed to generate custom quiz vocabulary", details: error?.message });
  }
});

// YouTube Transcript Translation endpoint
app.post("/api/youtube-transcript-translate", async (req, res) => {
  try {
    const { segments, targetLanguage } = req.body;
    if (!Array.isArray(segments) || segments.length === 0 || !targetLanguage) {
      return res.status(400).json({ error: "Segments and targetLanguage are required." });
    }

    if (targetLanguage === 'English') {
      const translationMap: Record<string, string> = {};
      for (const s of segments) {
        translationMap[s.id] = s.text;
      }
      return res.json({ translations: translationMap });
    }

    const ai = getGeminiClient();
    const prompt = `You are a professional subtitle translator. Translate the following transcript lines into natural, clear ${targetLanguage}.
Context: Video educational transcript subtitles.

Input Segments:
${JSON.stringify(segments.map((s: any) => ({ id: s.id, text: s.text })))}

Respond ONLY with valid JSON in this exact structure:
{
  "translations": [
    { "id": "segment-id", "text": "Translated line in ${targetLanguage}" }
  ]
}`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const responseText = response.text?.trim() || "{}";
    const parsed = JSON.parse(responseText);
    const translationMap: Record<string, string> = {};
    if (Array.isArray(parsed.translations)) {
      for (const item of parsed.translations) {
        if (item && item.id && item.text) {
          translationMap[item.id] = item.text;
        }
      }
    }
    return res.json({ translations: translationMap });
  } catch (error: any) {
    console.error("YouTube Transcript Translation Error:", error);
    return res.status(500).json({ error: error?.message || "Failed to translate transcript" });
  }
});

// Public API adapters used by the supplied standalone watch page.
app.get('/api/public/transcript', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const videoId = String(req.query.v ?? '');
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    return res.status(400).json({ error: 'Invalid YouTube video ID.' });
  }
  try {
    const transcript = await fetchYoutubeTranscriptHelper(videoId, () => undefined);
    return res.json({
      title: 'YouTube video',
      channel: '',
      segments: transcript.segments.map((segment: any) => ({
        text: String(segment.text ?? '').trim(),
        offset: Math.round(Number(segment.startTime ?? 0) * 1000),
        duration: Math.max(300, Math.round((Number(segment.endTime ?? 0) - Number(segment.startTime ?? 0)) * 1000)),
      })).filter((segment: any) => segment.text && segment.duration > 0),
    });
  } catch (error: any) {
    return res.status(404).json({ error: error?.message ?? 'No trustworthy transcript is available.' });
  }
});

app.options('/api/public/translate', (_req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  return res.sendStatus(204);
});

app.post('/api/public/translate', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const words = Array.isArray(req.body?.words) ? req.body.words.filter((word: unknown) => typeof word === 'string').slice(0, 20) : [];
  const target = String(req.body?.target ?? 'ar');
  if (!words.length) return res.status(400).json({ error: 'An array of words is required.' });
  try {
    const translations: Record<string, string> = {};
    await Promise.all(words.map(async (word: string) => {
      const response = await app.handle(new Request('http://internal/api/translate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ word, targetLanguage: target, sourceLanguage: 'English' }),
      }));
      const payload = await response.json();
      translations[word] = String(payload.translation ?? payload.word ?? word);
    }));
    return res.json({ translations });
  } catch (error: any) {
    return res.status(502).json({ error: error?.message ?? 'Translation service unavailable.' });
  }
});

// YouTube Transcript Route with Redundant Fallbacks
app.post("/api/youtube-transcript", async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!/^[A-Za-z0-9_-]{11}$/.test(String(videoId ?? ''))) {
      return res.status(400).json({ error: 'Invalid YouTube video ID.' });
    }
    const transcript = await fetchYoutubeTranscriptHelper(videoId, () => undefined);
    return res.json(transcript);
  } catch (error: any) {
    return res.status(404).json({
      error: error?.message ?? 'No trustworthy transcript is available.',
      code: 'TRANSCRIPT_UNAVAILABLE',
    });
  }
});

type TranscriptWordPayload = {
  id?: string;
  text: string;
  startTime: number;
  endTime: number;
};

function createServerWordTimings(text: string, startTime: number, endTime: number, idPrefix: string): TranscriptWordPayload[] {
  const words = text.match(/\S+/g) ?? [];
  if (!words.length || !Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime) {
    return [];
  }

  const weights = words.map((word) => Math.max(1, (word.match(/[\p{L}\p{N}]/gu) ?? []).length));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const duration = endTime - startTime;
  let cursor = startTime;

  return words.map((word, index) => {
    const nextCursor = index === words.length - 1
      ? endTime
      : cursor + (duration * weights[index]) / totalWeight;
    const result = {
      id: `${idPrefix}-word-${index}`,
      text: word,
      startTime: cursor,
      endTime: nextCursor,
    };
    cursor = nextCursor;
    return result;
  });
}

function makeTranscript(
  videoId: string,
  segments: Array<{ id?: string; text: string; startTime: number; endTime: number; words?: TranscriptWordPayload[] }>,
  alignmentMethod: 'caption-segment' | 'asr-segment' = 'caption-segment',
) {
  return {
    videoId,
    version: 1,
    language: 'en',
    timebase: 'absolute-video-seconds' as const,
    alignmentMethod,
    alignmentQuality: alignmentMethod === 'caption-segment' ? 'medium' as const : 'unknown' as const,
    generatedAt: new Date().toISOString(),
    segments: segments
      .map((segment, index) => ({
        id: segment.id ?? `segment-${index}`,
        text: segment.text.trim(),
        startTime: Number(segment.startTime),
        endTime: Number(segment.endTime),
        words: segment.words?.length
          ? segment.words
          : createServerWordTimings(segment.text.trim(), Number(segment.startTime), Number(segment.endTime), segment.id ?? `segment-${index}`),
      }))
      .filter((segment) =>
        segment.text.length > 0 &&
        Number.isFinite(segment.startTime) &&
        Number.isFinite(segment.endTime) &&
        segment.startTime >= 0 &&
        segment.endTime > segment.startTime
      )
      .sort((a, b) => a.startTime - b.startTime),
  };
}

async function fetchYoutubeTranscriptHelper(videoId: string, log: (msg: string) => void) {
  // Try 0: Curated high-precision transcripts for featured / TED / educational videos
  if (CURATED_TRANSCRIPTS[videoId]) {
    return CURATED_TRANSCRIPTS[videoId];
  }

  // Try 1: Direct scraping of youtube watch page captionTracks with fmt=json3 for word-level timestamps
  try {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    log(`Fetching ${watchUrl}`);
    const pageRes = await fetch(watchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const html = await pageRes.text();

    const jsonMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
    if (jsonMatch) {
      const playerResponse = JSON.parse(jsonMatch[1]);
      const tracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
      if (tracks && tracks.length > 0) {
        const baseUrl = tracks[0].baseUrl;
        
        // Fetch fmt=json3 for true word-level timestamps from YouTube
        try {
          const json3Url = baseUrl.includes('?') ? `${baseUrl}&fmt=json3` : `${baseUrl}?fmt=json3`;
          const json3Res = await fetch(json3Url);
          if (json3Res.ok) {
            const bodyText = await json3Res.text();
            if (bodyText && (bodyText.trim().startsWith('{') || bodyText.trim().startsWith('['))) {
              const json3Data = JSON.parse(bodyText);
              if (json3Data?.events && Array.isArray(json3Data.events)) {
                const parsedSegments = json3Data.events
                  .filter((event: any) => Array.isArray(event.segs) && event.segs.length > 0)
                  .map((event: any, index: number, events: any[]) => {
                    const text = event.segs
                      .map((seg: any) => String(seg.utf8 ?? '').replace(/\s+/g, ' '))
                      .join(' ')
                      .replace(/\s+/g, ' ')
                      .trim();
                    const startTime = Number(event.tStartMs ?? 0) / 1000;
                    const rawDuration = Number(event.dDurationMs ?? 0) / 1000;
                    const nextEventStart = Number(events[index + 1]?.tStartMs ?? 0) / 1000;
                    const endTime = rawDuration > 0
                      ? startTime + rawDuration
                      : (nextEventStart > startTime ? nextEventStart : startTime + 3);

                    let cursor = startTime;
                    const pieces = event.segs
                      .map((seg: any, segIndex: number) => {
                        const pieceText = String(seg.utf8 ?? '').replace(/\s+/g, ' ').trim();
                        if (!pieceText) return null;
                        const pieceStart = Number.isFinite(Number(seg.tOffsetMs))
                          ? startTime + Number(seg.tOffsetMs) / 1000
                          : cursor;
                        const pieceDuration = Number(seg.dDurationMs ?? 0) / 1000;
                        const piece = {
                          id: `caption-${index}-word-${segIndex}`,
                          text: pieceText,
                          startTime: Math.max(startTime, Math.min(pieceStart, endTime)),
                          endTime: pieceDuration > 0 ? Math.min(endTime, pieceStart + pieceDuration) : Number.NaN,
                        };
                        cursor = piece.startTime;
                        return piece;
                      })
                      .filter(Boolean) as TranscriptWordPayload[];

                    const words = pieces.length > 0
                      ? pieces.map((piece, pieceIndex) => ({
                          ...piece,
                          endTime: Number.isFinite(piece.endTime)
                            ? piece.endTime
                            : (pieces[pieceIndex + 1]?.startTime ?? endTime),
                        })).filter((word) => word.endTime > word.startTime)
                      : createServerWordTimings(text, startTime, endTime, `caption-${index}`);

                    return { id: `caption-${index}`, text, startTime, endTime, words };
                  })
                  .filter((segment: any) => segment.text && segment.endTime > segment.startTime);

                if (parsedSegments.length > 0) {
                  return makeTranscript(videoId, parsedSegments, 'caption-segment');
                }
              }
            }
          }
        } catch (e) {
        }

        // Fallback to XML track parsing
        const xmlRes = await fetch(baseUrl);
        const xmlText = await xmlRes.text();
        
        const matches = [...xmlText.matchAll(/<text start="([\d.]+)"(?: dur="([\d.]+)")?[^>]*>(.*?)<\/text>/g)];
        if (matches.length > 0) {
          const parsedSegments = matches
            .map((match, index) => {
              const textClean = (match[3] || match[2] || '')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&#39;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/<[^>]+>/g, '')
                .trim();
              const startTime = Number(match[1]);
              const duration = Number(match[2] ?? 0.5);
              return {
                id: `caption-${index}`,
                text: textClean,
                startTime,
                endTime: startTime + duration,
              };
            })
            .filter((segment) => segment.text && segment.endTime > segment.startTime);

          if (parsedSegments.length > 0) {
            return makeTranscript(videoId, parsedSegments, 'caption-segment');
          }
        }
      }
    }
  } catch (_) {
  }

  // Try 2: YoutubeTranscript package default
  try {
    const res = await YoutubeTranscript.fetchTranscript(videoId);
    if (res && res.length > 0) {
      return makeTranscript(
        videoId,
        res.map((item: any, index: number) => ({
          id: `caption-${index}`,
          text: String(item.text ?? ''),
          startTime: Number(item.offset) / 1000,
          endTime: (Number(item.offset) + Number(item.duration)) / 1000,
        })),
        'caption-segment',
      );
    }
  } catch (_) {
  }

  throw new Error('No trustworthy timestamped transcript is available for this video.');
}

export { app };
export default app;
