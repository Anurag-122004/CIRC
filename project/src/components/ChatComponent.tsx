import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Menu } from 'lucide-react';
import type { Message, ChatSessionOnlyForChat } from '../types';
import ChatHistoryPanelForChat from './ChatHistoryPanelForChat';

const ChatComponent: React.FC = () => {
  // Chat messages and input state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // For auto-scroll
  const API_URL = import.meta.env.VITE_API_URL;

  // Chat history states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSessionOnlyForChat[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // 1. Start a new chat session & connect WebSocket (only once per page load).
  useEffect(() => {
    const startSession = async () => {
      try {
        const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
        const res = await fetch(`${baseUrl}chat/start-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        if (data.session_id) {
          setSessionId(data.session_id);
          connectWebSocket(data.session_id);
        }
      } catch (error) {
        console.error('Error starting chat session:', error);
        alert('Failed to initialize chat. Please try again.');
      }
    };

    if (API_URL) startSession();
    return () => socketRef.current?.close();
  }, [API_URL]);

  // 2. WebSocket connection logic
  const connectWebSocket = (session_id: string) => {
    if (!session_id || socketRef.current) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const backendHost = new URL(API_URL).host;
    const wsUrl = `${wsProtocol}//${backendHost}/api/v1/chat/ws/${session_id}`;

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // This is the AI (assistant) message
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: data.bot, // Response from backend
          role: 'assistant',
          timestamp: new Date()
        };

        // Add AI message to local UI
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);

        // Also update the chatSessions with this AI response
        if (currentSessionId) {
          setChatSessions((prev) =>
            prev.map((session) =>
              session.id === currentSessionId
                ? {
                    ...session,
                    messages: [...session.messages, aiMessage],
                    lastMessage: aiMessage.content,
                    timestamp: new Date()
                  }
                : session
            )
          );
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsTyping(false);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  // 3. Handle sending a message
  const handleSend = () => {
    if (
      !input.trim() ||
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    // This is the user message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    // Add user message to local UI
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    // Send to the WebSocket server
    socketRef.current.send(input);
    setInput('');

    // Update or create a session in local state
    if (currentSessionId) {
      // Update existing session with the new user message
      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: [...session.messages, newMessage],
                lastMessage: newMessage.content,
                timestamp: new Date()
              }
            : session
        )
      );
    } else {
      // Create a new session if none exists
      const newSessionId = Date.now().toString();
      const newSession: ChatSessionOnlyForChat = {
        id: newSessionId,
        title: `Chat ${new Date().toLocaleString()}`,
        messages: [newMessage],
        timestamp: new Date(),
        lastMessage: newMessage.content
      };
      setChatSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSessionId);
    }
  };

  // 4. Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 5. Load chat sessions from localStorage (once on mount)
  useEffect(() => {
    const loadSessions = () => {
      setIsLoadingSessions(true);
      try {
        const savedSessions = localStorage.getItem('chatSessionsOnlyForChat');
        if (savedSessions) {
          setChatSessions(JSON.parse(savedSessions));
        }
      } catch (error) {
        console.error('Error loading chat sessions:', error);
      }
      setIsLoadingSessions(false);
    };

    loadSessions();
  }, []);

  // 6. Save chat sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      'chatSessionsOnlyForChat',
      JSON.stringify(chatSessions)
    );
  }, [chatSessions]);

  // 7. When user selects an old chat session, reload its messages
  const handleSessionSelect = (session: ChatSessionOnlyForChat) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="absolute top-4 left-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors z-10"
        aria-label="Open chat history"
      >
        <Menu size={24} className="text-white" />
      </button>

      {/* Chat History Panel */}
      <ChatHistoryPanelForChat
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={chatSessions}
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        isLoading={isLoadingSessions}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bot size={48} className="mb-4" />
              <p className="text-xl">Start a conversation with AI</p>
              <p className="text-sm">Ask anything about your daily life tasks!</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === 'user' ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                      <span className="text-sm font-medium">
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg bg-gray-800 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot size={16} />
                      <span className="text-sm font-medium">AI Assistant</span>
                    </div>
                    {/* Typing animation */}
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}
              {/* Empty div for auto-scroll */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Box */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isTyping}
            />
            <button
              title="Send"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
