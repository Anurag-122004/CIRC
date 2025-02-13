import { Link } from 'react-router-dom';
import ChatComponent from '../components/ChatComponent';

export default function ChatPage() {
    return (
        <div className="min-h-screen p-6">
        <nav className="mb-6">
            <Link to="/">
            <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
                ← Back to Home
            </span>
            </Link>
        </nav>
        <ChatComponent />
        </div>
    );
}