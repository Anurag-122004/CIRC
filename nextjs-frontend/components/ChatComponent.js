import { useState, useEffect, useRef } from "react";

export default function ChatComponent() {
  const [sessionId, setSessionId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    let isMounted = true; // ✅ Prevents setting state on unmounted component

    const startSession = async () => {
      try {
        const res = await fetch(`${API_URL}/chat/start-session`, { method: "POST" });
        const data = await res.json();
        if (data.session_id && isMounted) {
          setSessionId(data.session_id);
          connectWebSocket(data.session_id);  // ✅ Only connect WebSocket after session is set
        }
      } catch (error) {
        console.error("Error starting chat session:", error);
      }
    };

    startSession();

    return () => {
      isMounted = false; // ✅ Cleanup on unmount
      if (socketRef.current) {
        socketRef.current.close(); // ✅ Close WebSocket on component unmount
      }
    };
  }, []); // ✅ Run only once on mount

  const connectWebSocket = (session_id) => {
    if (!session_id || socketRef.current) return; // ✅ Prevent duplicate connections
    socketRef.current = new WebSocket(`ws://127.0.0.1:8000/api/v1/chat/ws/${session_id}`);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prev) => {
        return prev.map((msg, index) =>
          index === prev.length - 1 && msg.bot === "..."
            ? { ...msg, bot: Array.isArray(data.bot) ? data.bot.join(" ") : data.bot } // ✅ Replace placeholder with real response
            : msg
        );
      });
    };

    socketRef.current.onclose = () => {
      console.warn("WebSocket disconnected.");
      socketRef.current = null; // ✅ Allow reconnecting if needed
    };
  };

  const sendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;
    
    // ✅ Add user message with a placeholder bot response
    setMessages((prev) => [...prev, { user: inputText, bot: "..." }]);

    socketRef.current.send(inputText);
    setInputText(""); // Clear input field
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Chat with AI (Real-Time)</h2>
      <div className="h-60 overflow-y-auto mb-4 bg-gray-50 p-2 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <p className="text-blue-600 font-medium">You: {msg.user}</p>
            <p className="text-gray-800">AI: {msg.bot}</p> {/* ✅ FIXED */}
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
