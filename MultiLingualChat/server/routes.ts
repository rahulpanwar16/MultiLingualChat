import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";

// Enhanced language detection function
function detectLanguage(text: string): string {
  // Basic language detection using character patterns
  const patterns = {
    hi: /[\u0900-\u097f]/,  // Hindi (Devanagari script)
    zh: /[\u4e00-\u9fff]/,  // Chinese characters
    ru: /[\u0400-\u04ff]/,  // Cyrillic characters
    ar: /[\u0600-\u06ff]/,  // Arabic characters
    ja: /[\u3040-\u309f\u30a0-\u30ff]/,  // Japanese hiragana/katakana
    ko: /[\uac00-\ud7af]/,  // Korean characters
    th: /[\u0e00-\u0e7f]/,  // Thai characters
    he: /[\u0590-\u05ff]/,  // Hebrew characters
    bn: /[\u0980-\u09ff]/,  // Bengali characters
    ta: /[\u0b80-\u0bff]/,  // Tamil characters
    te: /[\u0c00-\u0c7f]/,  // Telugu characters
    ml: /[\u0d00-\u0d7f]/,  // Malayalam characters
    kn: /[\u0c80-\u0cff]/,  // Kannada characters
    gu: /[\u0a80-\u0aff]/,  // Gujarati characters
    pa: /[\u0a00-\u0a7f]/,  // Punjabi characters
    es: /[ñáéíóúü¿¡]/i,     // Spanish specific characters
    fr: /[àâäéèêëïîôöùûüÿç]/i, // French specific characters
    de: /[äöüß]/i,          // German specific characters
    it: /[àèéìíîòóù]/i,     // Italian specific characters
    pt: /[ãâàáêéçõôóü]/i,   // Portuguese specific characters
    pl: /[ąćęłńóśźż]/i,     // Polish specific characters
    tr: /[çğıöşü]/i,        // Turkish specific characters
    sv: /[åäö]/i,           // Swedish specific characters
    no: /[æøå]/i,           // Norwegian specific characters
    da: /[æøå]/i,           // Danish specific characters
    nl: /[ëïij]/i,          // Dutch specific characters
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      return lang;
    }
  }
  
  return "en"; // Default to English
}

// MyMemory Free Translation API integration
async function translateText(text: string, targetLanguage: string) {
  try {
    // Detect language first
    const detectedLanguage = detectLanguage(text);

    // Skip translation if already in target language
    if (detectedLanguage === targetLanguage) {
      return {
        translatedText: text,
        detectedLanguage,
      };
    }

    // Use MyMemory free translation API
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${detectedLanguage}|${targetLanguage}`,
      {
        method: "GET",
        headers: { 
          "User-Agent": "ChatTranslate/1.0"
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.responseStatus !== 200) {
      throw new Error(`Translation API error: ${data.responseDetails}`);
    }

    const translatedText = data.responseData.translatedText;

    return {
      translatedText,
      detectedLanguage,
    };
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all messages
  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Get messages since timestamp (for polling)
  app.get("/api/messages/since", async (req, res) => {
    try {
      const timestamp = req.query.timestamp as string;
      if (!timestamp) {
        return res.status(400).json({ message: "Timestamp is required" });
      }

      const messages = await storage.getMessagesSince(new Date(timestamp));
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Create new message
  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);

      // Start translation process asynchronously
      if (validatedData.targetLanguage) {
        translateText(validatedData.originalText, validatedData.targetLanguage)
          .then(({ translatedText, detectedLanguage }) => {
            storage.updateMessageTranslation(
              message.id,
              translatedText,
              detectedLanguage,
              "success"
            );
          })
          .catch((error) => {
            console.error("Translation failed for message", message.id, error);
            storage.updateMessageTranslation(
              message.id,
              "",
              "",
              "failed"
            );
          });
      }

      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create message" });
      }
    }
  });

  // Retry translation for a specific message
  app.post("/api/messages/:id/translate", async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const { targetLanguage } = req.body;

      if (!targetLanguage) {
        return res.status(400).json({ message: "Target language is required" });
      }

      const messages = await storage.getMessages();
      const message = messages.find(m => m.id === messageId);

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      // Update status to pending
      await storage.updateMessageTranslation(messageId, "", "", "pending");

      // Attempt translation
      try {
        const { translatedText, detectedLanguage } = await translateText(
          message.originalText,
          targetLanguage
        );

        const updatedMessage = await storage.updateMessageTranslation(
          messageId,
          translatedText,
          detectedLanguage,
          "success"
        );

        res.json(updatedMessage);
      } catch (translationError) {
        await storage.updateMessageTranslation(messageId, "", "", "failed");
        res.status(500).json({ message: "Translation failed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to retry translation" });
    }
  });

  // Get supported languages
  app.get("/api/languages", async (_req, res) => {
    const supportedLanguages = [
      { code: "en", name: "English" },
      { code: "es", name: "Español" },
      { code: "fr", name: "Français" },
      { code: "de", name: "Deutsch" },
      { code: "hi", name: "हिन्दी" },
      { code: "zh", name: "中文" },
      { code: "ru", name: "Русский" },
      { code: "ar", name: "العربية" },
      { code: "ja", name: "日本語" },
      { code: "ko", name: "한국어" },
      { code: "it", name: "Italiano" },
      { code: "pt", name: "Português" },
      { code: "tr", name: "Türkçe" },
      { code: "th", name: "ไทย" },
      { code: "pl", name: "Polski" },
      { code: "nl", name: "Nederlands" },
      { code: "sv", name: "Svenska" },
      { code: "no", name: "Norsk" },
      { code: "da", name: "Dansk" },
      { code: "bn", name: "বাংলা" },
      { code: "ta", name: "தமிழ்" },
      { code: "te", name: "తెలుగు" },
      { code: "ml", name: "മലയാളം" },
      { code: "kn", name: "ಕನ್ನಡ" },
      { code: "gu", name: "ગુજરાતી" },
      { code: "pa", name: "ਪੰਜਾਬੀ" },
      { code: "he", name: "עברית" },
    ];
    res.json(supportedLanguages);
  });

  const httpServer = createServer(app);
  return httpServer;
}
