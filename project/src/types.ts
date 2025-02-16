export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

export interface VisionAnalysis {
    id: string;
    imageUrl: string;
    analysis: string;
    timestamp: Date;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    imageData: VisionAnalysis | null;
    timestamp: Date;
    lastMessage?: string;
}

export interface ChatSessionOnlyForChat {
    id: string;
    title: string;
    messages: Message[];
    timestamp: Date;
    lastMessage?: string;
}