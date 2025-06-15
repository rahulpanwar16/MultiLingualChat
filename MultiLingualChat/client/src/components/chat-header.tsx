import { Settings, Wifi } from "lucide-react";

interface ChatHeaderProps {
  onToggleSettings: () => void;
  connectionStatus: string;
}

export function ChatHeader({ onToggleSettings, connectionStatus }: ChatHeaderProps) {
  return (
    <header className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <i className="fas fa-language text-lg"></i>
        </div>
        <div>
          <h1 className="text-lg font-medium">ChatTranslate</h1>
          <p className="text-sm opacity-90">Real-time Translation Chat</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>{connectionStatus}</span>
        </div>
        <button
          onClick={onToggleSettings}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
