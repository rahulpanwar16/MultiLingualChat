import { useState, useRef } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  inputLanguage: string;
  targetLanguage: string;
  autoTranslateEnabled: boolean;
}

export function MessageInput({
  onSendMessage,
  inputLanguage,
  targetLanguage,
  autoTranslateEnabled,
}: MessageInputProps) {
  const [messageText, setMessageText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessageText(textarea.value);

    // Auto-resize textarea
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    const trimmedText = messageText.trim();
    if (!trimmedText) return;

    onSendMessage(trimmedText);
    setMessageText("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="border-t bg-white px-4 py-3">
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            rows={1}
          />
          <div className="absolute right-2 top-2 text-xs text-gray-400">
            <span>{inputLanguage.toUpperCase()}</span>
            <i className="fas fa-arrow-right mx-1"></i>
            <span>{targetLanguage.toUpperCase()}</span>
          </div>
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>
            Auto-translate: <strong>{autoTranslateEnabled ? "ON" : "OFF"}</strong>
          </span>
          <span>
            Detected: <strong>English</strong>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>{messageText.length}</span>/500
        </div>
      </div>
    </div>
  );
}
