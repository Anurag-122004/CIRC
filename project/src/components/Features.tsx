// import React from 'react';
import { Brain, Image, MessageSquare, Zap } from 'lucide-react';

const Features = () => {
    const features = [
        {
        icon: <Brain className="w-12 h-12 text-purple-500" />,
        title: "Advanced AI Analysis",
        description: "State-of-the-art image recognition powered by cutting-edge AI models"
        },
        {
        icon: <MessageSquare className="w-12 h-12 text-pink-500" />,
        title: "Natural Conversations",
        description: "Engage in fluid, context-aware discussions about any image"
        },
        {
        icon: <Image className="w-12 h-12 text-purple-500" />,
        title: "Multi-Format Support",
        description: "Support for various image formats with instant processing"
        },
        {
        icon: <Zap className="w-12 h-12 text-pink-500" />,
        title: "Real-time Results",
        description: "Get instant analysis and insights about your images"
        }
    ];

    return (
        <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
                Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl text-gray-400">
                Experience the next generation of image recognition and conversation
            </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
                <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
};

export default Features;