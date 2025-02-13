import { Link } from 'react-router-dom';
import VisionComponent from '../components/VisionComponent';

export default function VisionPage() {
    return (
        <div className="min-h-screen p-6">
        <nav className="mb-6">
            <Link to="/">
            <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
                ← Back to Home
            </span>
            </Link>
        </nav>
        <VisionComponent />
        </div>
    );
}