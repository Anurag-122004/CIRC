import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import type { Message } from '../types';

const ChatComponent: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const startSession = async () => {
        try {
            const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
            const res = await fetch(`${baseUrl}chat/start-session`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            
            const data = await res.json();
            if (data.session_id) {
            setSessionId(data.session_id);
            connectWebSocket(data.session_id);
            }
        } catch (error) {
            console.error("Error starting chat session:", error);
            alert("Failed to initialize chat. Please try again.");
        }
        };

        if (API_URL) startSession();
        return () => socketRef.current?.close();
    }, [API_URL]);

    const connectWebSocket = (session_id: string) => {
        if (!session_id || socketRef.current) return;

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const backendHost = new URL(API_URL).host;
        const wsUrl = `${wsProtocol}//${backendHost}/api/v1/chat/ws/${session_id}`;

        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            setMessages(prev => prev.map(msg => 
            msg.content === '...' ? { 
                ...msg, 
                content: data.bot,
                timestamp: new Date()
            } : msg
            ));
            setIsTyping(false);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
        };

        socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsTyping(false);
        };

        socketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
        };
    };

    const handleSend = () => {
        if (!input.trim() || !socketRef.current?.OPEN) return;

        const newMessage: Message = {
        id: Date.now().toString(),
        content: input,
        role: 'user',
        timestamp: new Date(),
        };

        const aiTempMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '...',
        role: 'assistant',
        timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMessage, aiTempMessage]);
        setIsTyping(true);
        socketRef.current.send(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Bot size={48} className="mb-4" />
                <p className="text-xl">Start a conversation with AI</p>
                <p className="text-sm">Ask anything about your research papers</p>
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
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                    </div>
                </div>
                )}
            </>
            )}
        </div>
        
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
                title='Send'
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send size={20} />
            </button>
            </div>
        </div>
        </div>
    );
};

export default ChatComponent;