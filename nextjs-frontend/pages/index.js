import ChatComponent from "@/components/ChatComponent";
import VisionComponent from "@/components/VisionComponent";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">AI Assistant</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <ChatComponent />
        <VisionComponent />
      </div>
    </div>
  );
}
