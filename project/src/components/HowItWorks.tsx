// import React from 'react';
import { Upload, Search, MessageCircle } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
        icon: <Upload className="w-16 h-16 text-purple-500" />,
        title: "Upload Your Image",
        description: "Simply drag and drop or select any image you want to analyze"
        },
        {
        icon: <Search className="w-16 h-16 text-pink-500" />,
        title: "AI Analysis",
        description: "Our advanced AI processes and understands your image instantly"
        },
        {
        icon: <MessageCircle className="w-16 h-16 text-purple-500" />,
        title: "Start Chatting",
        description: "Engage in natural conversation about any aspect of your image"
        }
    ];

    return (
        <section id="how-it-works" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
                How <span className="gradient-text">It Works</span>
            </h2>
            <p className="text-xl text-gray-400">
                Three simple steps to start your conversation
            </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {steps.map((step, index) => (
                <div
                key={index}
                className="flex-1 text-center p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition-all duration-300"
                >
                <div className="flex justify-center mb-6">{step.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
                {index < steps.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                    <div className="w-8 h-8 rotate-45 border-t-2 border-r-2 border-purple-500"></div>
                    </div>
                )}
                </div>
            ))}
            </div>
        </div>
        </section>
    );
};

export default HowItWorks;