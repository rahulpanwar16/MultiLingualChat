import { X, Wifi, CheckCircle } from "lucide-react";
import type { UserPreferences } from "@shared/schema";

interface SettingsPanelProps {
  preferences: UserPreferences;
  onUpdatePreferences: (preferences: UserPreferences) => void;
  onClose: () => void;
}

export function SettingsPanel({
  preferences,
  onUpdatePreferences,
  onClose,
}: SettingsPanelProps) {
  const languages = [
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

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    onUpdatePreferences({ ...preferences, [key]: value });
  };

  const handleSaveSettings = () => {
    onClose();
  };

  const getLanguageColor = (code: string) => {
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
    return colors[code] || "bg-gray-500";
  };

  return (
    <div className="w-80 bg-white border-l shadow-lg animate-slide-in">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">Translation Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Language Preferences */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Language Preferences</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Your Language</label>
              <select
                value={preferences.userLanguage}
                onChange={(e) => updatePreference("userLanguage", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Auto-translate to</label>
              <select
                value={preferences.targetLanguage}
                onChange={(e) => updatePreference("targetLanguage", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Translation Options */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Translation Options</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.autoTranslate}
                onChange={(e) => updatePreference("autoTranslate", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">Auto-translate incoming messages</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.showOriginal}
                onChange={(e) => updatePreference("showOriginal", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">Always show original text</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.autoDetect}
                onChange={(e) => updatePreference("autoDetect", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">Auto-detect input language</span>
            </label>
          </div>
        </div>

        {/* Translation Quality */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Translation Quality</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Speed</span>
              <span className="text-gray-600">Accuracy</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              value={preferences.qualityLevel}
              onChange={(e) => updatePreference("qualityLevel", parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Fast</span>
              <span>Balanced</span>
              <span>Precise</span>
            </div>
          </div>
        </div>

        {/* API Status */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">API Status</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Google Translate API</span>
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="text-xs text-gray-500">
              <div>Response time: <strong>~150ms</strong></div>
            </div>
          </div>
        </div>

        {/* Supported Languages */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Supported Languages</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {languages.map((lang) => (
              <div key={lang.code} className="flex items-center space-x-2">
                <span
                  className={`w-6 h-4 text-white text-center rounded text-xs leading-4 ${getLanguageColor(
                    lang.code
                  )}`}
                >
                  {lang.code.toUpperCase()}
                </span>
                <span className="text-gray-600">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={handleSaveSettings}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
