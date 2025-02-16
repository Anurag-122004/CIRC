import React, { useCallback, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, File, Image as ImageIcon, FileText, Film, Music, X, FileUp, Loader2, CheckCircle } from 'lucide-react';

interface FileWithPreview extends File {
    preview?: string;
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ACCEPTED_FILE_TYPES = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'video/*': ['.mp4', '.webm', '.ogg'],
    'audio/*': ['.mp3', '.wav'],
    };

    const FileUploader: React.FC = () => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
        setIsDragging(true);
        } else if (e.type === 'dragleave') {
        setIsDragging(false);
        }
    }, []);

    const validateFile = (file: File): boolean => {
        if (file.size > MAX_FILE_SIZE) {
        toast.error('File is too large. Maximum size is 10MB.');
        return false;
        }

        const fileType = Object.entries(ACCEPTED_FILE_TYPES).find(([type]) => 
        file.type.match(type.replace('*', '.*'))
        );

        if (!fileType) {
        toast.error('File type not supported.');
        return false;
        }

        return true;
    };

    const processFiles = async (files: FileList) => {
        setIsLoading(true);
        const validFiles: FileWithPreview[] = [];

        // Simulate some processing time for the animation
        await new Promise(resolve => setTimeout(resolve, 1500));

        for (const file of Array.from(files)) {
        if (validateFile(file)) {
            if (file.type.startsWith('image/')) {
            const preview = URL.createObjectURL(file);
            validFiles.push(Object.assign(file, { preview }));
            } else {
            validFiles.push(file);
            }
        }
        }

        setFiles(prev => [...prev, ...validFiles]);
        setIsLoading(false);
        toast.success(`${validFiles.length} file(s) uploaded successfully!`);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const { files } = e.dataTransfer;
        if (files && files.length > 0) {
        processFiles(files);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
        processFiles(files);
        }
    };

    const removeFile = useCallback((fileToRemove: FileWithPreview) => {
        setFiles(files => files.filter(f => f !== fileToRemove));
        if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
        }
        toast.success('File removed successfully!');
    }, []);

    const getFileIcon = (file: FileWithPreview) => {
        if (file.type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-400" />;
        if (file.type === 'application/pdf') return <FileText className="w-8 h-8 text-red-400" />;
        if (file.type.startsWith('video/')) return <Film className="w-8 h-8 text-purple-400" />;
        if (file.type.startsWith('audio/')) return <Music className="w-8 h-8 text-green-400" />;
        return <File className="w-8 h-8 text-gray-400" />;
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-8">
        <div
            className={`file-drop-zone glass-card rounded-lg p-8 text-center ${
            isDragging ? 'border-2 border-dashed border-white/30' : ''
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click();
            }
            }}
        >
            <div onClick={() => fileInputRef.current?.click()}>
            <input
            title='Upload files'
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            accept={Object.entries(ACCEPTED_FILE_TYPES)
                .map(([, exts]) => exts.join(','))
                .join(',')}
            />
            
            <div className="flex flex-col items-center justify-center space-y-4">
            <Upload className={`w-12 h-12 ${isDragging ? 'text-blue-400 animate-bounce' : 'text-gray-400'}`} />
            <div className="text-lg font-medium text-gray-200">
                {isDragging ? (
                <span className="text-blue-400">Drop files here</span>
                ) : (
                <span>
                    Drag & drop files or <span className="text-blue-400">browse</span>
                </span>
                )}
                </div>
            </div>
            <p className="text-sm text-gray-400">
                Supports images, PDFs, videos, and audio files up to 10MB
            </p>
            </div>
        </div>

        {isLoading && (
            <div className="mt-8 glass-card rounded-lg p-8">
            <div className="flex items-center justify-center space-x-6">
                <FileUp className="w-8 h-8 text-blue-400 loading-icon opacity-0" />
                <Loader2 className="w-8 h-8 text-purple-400 loading-icon opacity-0" />
                <CheckCircle className="w-8 h-8 text-green-400 loading-icon opacity-0" />
            </div>
            </div>
        )}

        {files.length > 0 && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => (
                <div
                key={`${file.name}-${index}`}
                className="glass-card rounded-lg p-4 file-preview-enter relative group"
                >
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file);
                    }}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove file"
                >
                    <X className="w-4 h-4 text-gray-400" />
                </button>

                <div className="aspect-square rounded-md overflow-hidden mb-2 bg-gray-800/50 flex items-center justify-center">
                    {file.preview ? (
                    <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                    />
                    ) : (
                    getFileIcon(file)
                    )}
                </div>
                <p className="text-sm truncate text-gray-300" title={file.name}>
                    {file.name}
                </p>
                <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                </p>
                </div>
            ))}
            </div>
        )}
        </div>
    );
};

export default FileUploader;