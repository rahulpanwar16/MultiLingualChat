import { RotateCcw, Languages, AlertTriangle, Loader2 } from "lucide-react";
import type { Message } from "@shared/schema";

interface MessageBubbleProps {
  message: Message;
  showOriginal: boolean;
  onRetryTranslation: (messageId: number) => void;
}

export function MessageBubble({
  message,
  showOriginal,
  onRetryTranslation,
}: MessageBubbleProps) {
  const formatTime = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getLanguageColor = (lang: string | null) => {
    const colors: Record<string, string> = {
      en: "bg-blue-500",
      es: "bg-red-500",
      fr: "bg-blue-600",
      de: "bg-gray-800",
      hi: "bg-orange-500",
      zh: "bg-red-600",
      ru: "bg-blue-700",
      ar: "bg-green-600",
      ja: "bg-pink-500",
      ko: "bg-purple-500",
      it: "bg-green-500",
      pt: "bg-yellow-600",
      tr: "bg-red-700",
      th: "bg-indigo-500",
      pl: "bg-gray-600",
      nl: "bg-orange-600",
      sv: "bg-blue-400",
      no: "bg-cyan-600",
      da: "bg-red-400",
      bn: "bg-emerald-500",
      ta: "bg-amber-600",
      te: "bg-violet-500",
      ml: "bg-lime-600",
      kn: "bg-teal-500",
      gu: "bg-sky-500",
      pa: "bg-rose-500",
      he: "bg-slate-600",
    };
    return colors[lang || ""] || "bg-orange-500";
  };

  if (message.isFromCurrentUser) {
    return (
      <div className="flex items-start space-x-3 justify-end mb-4 animate-fade-in">
        <div className="flex-1 max-w-xs lg:max-w-md">
          <div className="bg-blue-600 text-white rounded-lg px-4 py-2 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium opacity-90">You</span>
              <span className="text-xs opacity-75">{formatTime(message.timestamp)}</span>
            </div>
            <p className="mb-2">{message.originalText}</p>
            {message.translationStatus === "success" && message.translatedText && (
              <div className="border-t border-white border-opacity-20 pt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <Languages className="w-3 h-3 text-orange-300" />
                  <span className="text-xs opacity-75">
                    Sent as {message.detectedLanguage?.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 bg-opacity-80 rounded-full"></div>
                    <span className="text-xs opacity-75">Delivered</span>
                  </div>
                </div>
                <p className="text-sm opacity-90">{message.translatedText}</p>
              </div>
            )}
          </div>
        </div>
        <div className="w-8 h-8 bg-blue-600 bg-opacity-80 rounded-full flex items-center justify-center text-white text-sm font-medium">
          <span>{message.senderInitials}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 mb-4 animate-fade-in">
      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
        <span>{message.senderInitials}</span>
      </div>
      <div className="flex-1 max-w-xs lg:max-w-md">
        <div className="bg-gray-100 rounded-lg px-4 py-2 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">{message.senderName}</span>
            <div className="flex items-center space-x-1">
              {message.detectedLanguage && (
                <span
                  className={`text-xs text-white px-2 py-0.5 rounded-full ${getLanguageColor(
                    message.detectedLanguage
                  )}`}
                >
                  {message.detectedLanguage.toUpperCase()}
                </span>
              )}
              <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
            </div>
          </div>

          {showOriginal && (
            <p className="text-gray-800 mb-2">{message.originalText}</p>
          )}

          <div className="border-t pt-2">
            {message.translationStatus === "pending" && (
              <div className="flex items-center space-x-2 mb-1">
                <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                <span className="text-xs text-gray-500">Translating...</span>
              </div>
            )}

            {message.translationStatus === "failed" && (
              <div className="flex items-center space-x-2 mb-1">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500">Translation failed</span>
                <button
                  onClick={() => onRetryTranslation(message.id)}
                  className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {message.translationStatus === "success" && message.translatedText && (
              <>
                <div className="flex items-center space-x-2 mb-1">
                  <Languages className="w-3 h-3 text-orange-500" />
                  <span className="text-xs text-gray-500">Translated to English</span>
                  <button
                    onClick={() => onRetryTranslation(message.id)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-gray-700 text-sm">{message.translatedText}</p>
              </>
            )}

            {message.translationStatus === "failed" && (
              <p className="text-xs text-gray-500 italic">Click retry to translate this message</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
