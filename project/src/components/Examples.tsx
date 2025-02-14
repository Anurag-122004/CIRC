// import React from 'react';

const Examples = () => {
    const examples = [
        {
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600",
        title: "Nature Analysis",
        description: "Identify landscapes, flora, and natural elements with precise detail",
        category: "Nature"
        },
        {
        image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600",
        title: "Art Recognition",
        description: "Analyze artistic styles, mediums, and historical context",
        category: "Art"
        },
        {
        image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600",
        title: "Pet Analysis",
        description: "Identify breeds, behaviors, and characteristics of animals",
        category: "Pets"
        },
        {
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600",
        title: "Architecture",
        description: "Recognize architectural styles, features, and historical periods",
        category: "Buildings"
        },
        {
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600",
        title: "Food Recognition",
        description: "Identify dishes, ingredients, and culinary styles",
        category: "Food"
        },
        {
        image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=600",
        title: "People & Portraits",
        description: "Analyze expressions, poses, and demographics",
        category: "People"
        }
    ];

    return (
        <section id="examples" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
                See CIRC in <span className="gradient-text">Action</span>
            </h2>
            <p className="text-xl text-gray-400">
                Discover the possibilities with our AI-powered image recognition
            </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {examples.map((example, index) => (
                <div
                key={index}
                className="group relative h-[300px] rounded-2xl overflow-hidden cursor-pointer transform transition-transform duration-300 hover:-translate-y-2"
                >
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${example.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Category Tag */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-purple-600/80 rounded-full text-sm font-medium backdrop-blur-sm">
                    {example.category}
                    </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-xl font-bold mb-2 text-white">
                    {example.title}
                    </h3>
                    <p className="text-gray-300 text-sm opacity-0 transform -translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    {example.description}
                    </p>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>
            ))}
            </div>
        </div>
        </section>
    );
};

export default Examples;