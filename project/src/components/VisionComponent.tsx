import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Upload, ImageIcon, X, Send, Bot, User, Loader2 } from 'lucide-react';
import type { VisionAnalysis, Message } from '../types';

const VisionComponent: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<VisionAnalysis | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const API_URL = import.meta.env.VITE_API_URL;

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification(prev => ({ ...prev, show: false }));
    setTimeout(() => {
      setNotification({ show: true, message, type });
    }, 100);
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload only JPG/PNG images (max 5MB)', 'error');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size must be less than 5MB', 'error');
      return false;
    }
    return true;
  }, [showNotification]);

  const handleImageLoad = useCallback((file: File) => {
    if (!validateFile(file)) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage({
        id: Date.now().toString(),
        imageUrl,
        analysis: '',
        timestamp: new Date()
      });
      setIsLoading(false);
      showNotification('Image uploaded successfully!', 'success');
    };
    
    reader.onerror = () => {
      setIsLoading(false);
      showNotification('Error uploading image', 'error');
    };
    
    reader.readAsDataURL(file);
  }, [validateFile, showNotification]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    file && handleImageLoad(file);
  }, [handleImageLoad]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    file && handleImageLoad(file);
  }, [handleImageLoad]);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setMessages([]);
    showNotification('Image removed', 'success');
  }, [showNotification]);

  const dataURLtoFile = useCallback((dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: mime });
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedImage) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append("input_text", input);
      formData.append("image", dataURLtoFile(selectedImage.imageUrl, 'image.jpg'));

      const response = await axios.post(`${API_URL}/analyze-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Add AI response only to chat messages
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      showNotification('Error analyzing image', 'error');
      console.error('API Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Image Upload Section */}
      <div className="w-1/2 p-4 border-r border-gray-800">
        <div className={`h-full flex flex-col ${!selectedImage ? 'items-center justify-center' : ''}`}>
          {!selectedImage ? (
            <div
              className={`w-full h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${
                dragActive ? 'border-purple-600 bg-purple-600/10' : 'border-gray-700 hover:border-purple-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <Loader2 size={48} className="text-purple-600 animate-spin mb-4" />
                  <p className="text-xl font-medium">Uploading...</p>
                </div>
              ) : (
                <>
                  <ImageIcon size={48} className="text-gray-400 mb-4" />
                  <p className="text-xl font-medium mb-2">Drag & drop image</p>
                  <p className="text-sm text-gray-400 mb-4">or</p>
                  <label className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 cursor-pointer">
                    <Upload size={20} />
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png"
                      onChange={handleFileInput}
                    />
                  </label>
                </>
              )}
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={selectedImage.imageUrl}
                alt="Upload preview"
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                aria-label="Remove image"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-1/2 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bot size={48} className="mb-4" />
              <p className="text-xl">Analyze images with AI</p>
              <p className="text-sm">Upload an image to start</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      message.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
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
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 pt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={selectedImage ? "Ask about the image..." : "Upload image to chat..."}
              disabled={!selectedImage || isTyping}
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Chat input"
            />
            <button
              onClick={handleSendMessage}
              disabled={!selectedImage || isTyping || !input.trim()}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Notification System */}
      <div
        className={`fixed bottom-4 right-4 transition-all duration-300 ${
          notification.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}
      >
        <div
          className={`px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </div>
      </div>
    </div>
  );
};

export default VisionComponent;