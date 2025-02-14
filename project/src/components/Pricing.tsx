// import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
    const plans = [
        {
        name: "Basic",
        price: "Free",
        features: [
            "50 image analyses per month",
            "Basic conversation capabilities",
            "Standard response time",
            "Email support"
        ],
        highlighted: false
        },
        {
        name: "Pro",
        price: "$19",
        period: "per month",
        features: [
            "500 image analyses per month",
            "Advanced AI conversations",
            "Priority processing",
            "24/7 priority support",
            "API access"
        ],
        highlighted: true
        },
        {
        name: "Enterprise",
        price: "Custom",
        features: [
            "Unlimited image analyses",
            "Custom AI model training",
            "Dedicated support team",
            "SLA guarantee",
            "Custom integration"
        ],
        highlighted: false
        }
    ];

    return (
        <section id="pricing" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
                Simple, Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-xl text-gray-400">
                Choose the perfect plan for your needs
            </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
                <div
                key={index}
                className={`rounded-2xl p-8 ${
                    plan.highlighted
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 transform scale-105'
                    : 'bg-gradient-to-br from-gray-900 to-gray-800'
                } transition-all duration-300 hover:transform hover:scale-105`}
                >
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                    <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                        <span className="text-gray-400">/{plan.period}</span>
                    )}
                    </div>
                </div>

                <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-400" />
                        <span>{feature}</span>
                    </li>
                    ))}
                </ul>

                <button
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.highlighted
                        ? 'bg-white text-purple-600 hover:bg-gray-100'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                >
                    Get Started
                </button>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
};

export default Pricing;