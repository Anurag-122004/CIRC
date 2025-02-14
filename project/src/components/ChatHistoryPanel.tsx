import React from 'react';
import { MessageSquare, X, Search, Loader2 } from 'lucide-react';
import type { ChatSession } from '../types';

interface ChatHistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    sessions: ChatSession[];
    currentSessionId: string | null;
    onSessionSelect: (session: ChatSession) => void;
    isLoading: boolean;
    }

    const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
    isOpen,
    onClose,
    sessions,
    currentSessionId,
    onSessionSelect,
    isLoading,
    }) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredSessions = sessions.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
        className={`fixed left-0 top-0 h-full bg-gray-900 transition-all duration-300 ease-in-out z-50 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '320px' }}
        >
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <MessageSquare size={24} />
                Chat History
            </h2>
            <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close sidebar"
            >
                <X size={20} className="text-gray-400" />
            </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-800">
            <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
            </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                <Loader2 size={24} className="animate-spin text-purple-600" />
                </div>
            ) : filteredSessions.length === 0 ? (
                <div className="text-center text-gray-400 p-4">
                No conversations found
                </div>
            ) : (
                <div className="space-y-1 p-2">
                {filteredSessions.map((session) => (
                    <button
                    key={session.id}
                    onClick={() => onSessionSelect(session)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentSessionId === session.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                    >
                    <div className="font-medium truncate">{session.title}</div>
                    <div className="text-sm opacity-75 truncate">{session.lastMessage}</div>
                    <div className="text-xs opacity-60 mt-1">
                        {new Date(session.timestamp).toLocaleDateString()}
                    </div>
                    </button>
                ))}
                </div>
            )}
            </div>
        </div>
        </div>
    );
    };

export default ChatHistoryPanel;