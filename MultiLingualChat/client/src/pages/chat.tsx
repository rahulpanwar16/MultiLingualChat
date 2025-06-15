import { useState, useEffect } from "react";
import { ChatHeader } from "@/components/chat-header";
import { MessageBubble } from "@/components/message-bubble";
import { MessageInput } from "@/components/message-input";
import { SettingsPanel } from "@/components/settings-panel";
import { useChat } from "@/hooks/use-chat";
import { useTranslation } from "@/hooks/use-translation";
import type { UserPreferences } from "@shared/schema";

export default function Chat() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem("chatTranslatePreferences");
    return saved ? JSON.parse(saved) : {
      userLanguage: "en",
      targetLanguage: "es",
      autoTranslate: true,
      showOriginal: true,
      autoDetect: true,
      qualityLevel: 2,
    };
  });

  const { messages, sendMessage, isLoading } = useChat(userPreferences.targetLanguage);
  const { retryTranslation } = useTranslation();

  useEffect(() => {
    localStorage.setItem("chatTranslatePreferences", JSON.stringify(userPreferences));
  }, [userPreferences]);

  const handleSendMessage = (text: string) => {
    sendMessage({
      senderName: "You",
      senderInitials: "ME",
      originalText: text,
      targetLanguage: userPreferences.targetLanguage,
      isFromCurrentUser: true,
    });
  };

  const handleRetryTranslation = (messageId: number) => {
    retryTranslation(messageId, userPreferences.targetLanguage);
  };

  return (
    <div className="bg-gray-50 h-screen overflow-hidden">
      <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-lg">
        <ChatHeader
          onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
          connectionStatus="Connected"
        />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  showOriginal={userPreferences.showOriginal}
                  onRetryTranslation={handleRetryTranslation}
                />
              ))}
              {isLoading && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>

            <MessageInput
              onSendMessage={handleSendMessage}
              inputLanguage={userPreferences.userLanguage}
              targetLanguage={userPreferences.targetLanguage}
              autoTranslateEnabled={userPreferences.autoTranslate}
            />
          </div>

          {isSettingsOpen && (
            <SettingsPanel
              preferences={userPreferences}
              onUpdatePreferences={setUserPreferences}
              onClose={() => setIsSettingsOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
