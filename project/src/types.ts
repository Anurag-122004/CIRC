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