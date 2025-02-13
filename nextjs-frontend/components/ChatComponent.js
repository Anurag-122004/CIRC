import { useState, useEffect, useRef } from "react";

export default function ChatComponent() {
  const [sessionId, setSessionId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const startSession = async () => {
      try {
        const res = await fetch(`${API_URL}/chat/start-session`, { method: "POST" });
        const data = await res.json();
        if (data.session_id) {
          setSessionId(data.session_id);
          connectWebSocket(data.session_id);
        }
      } catch (error) {
        console.error("Error starting chat session:", error);
      }
    };

    startSession();
  }, []);

  const connectWebSocket = (session_id) => {
    if (!session_id || socketRef.current) return;
    socketRef.current = new WebSocket(`ws://127.0.0.1:8000/api/v1/chat/ws/${session_id}`);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prev) => {
        return prev.map((msg, index) =>
          index === prev.length - 1 && msg.bot === "..."
            ? { ...msg, bot: data.bot } // ✅ Replace "..." with real response
            : msg
        );
      });
    };

    socketRef.current.onclose = () => {
      console.warn("WebSocket disconnected.");
      socketRef.current = null;
    };
  };

  const sendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;

    setMessages((prev) => [...prev, { user: inputText, bot: "..." }]); // ✅ Temporary response
    socketRef.current.send(inputText);
    setInputText("");
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Chat with AI (Real-Time)</h2>
      <div className="h-60 overflow-y-auto mb-4 bg-gray-50 p-2 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <p className="text-blue-600 font-medium">You: {msg.user}</p>
            <p className="text-gray-800">AI: {msg.bot}</p>
          </div>
        ))}
      </div>
      <input
        className="w-full p-2 border rounded"
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="mt-2 bg-blue-500 text-white p-2 rounded w-full" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}
