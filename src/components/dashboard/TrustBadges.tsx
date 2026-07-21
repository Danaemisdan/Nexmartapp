import React from 'react';
import { Sparkles, ShieldCheck, Truck, Lock } from 'lucide-react';

export default function TrustBadges() {
    const badges = [
        {
            icon: <Sparkles className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.6)]" />,
            title: "AI-Powered Recommendations",
            desc: "Personalized picks just for you"
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.6)]" />,
            title: "Best Price Guarantee",
            desc: "We ensure you get the best deal"
        },
        {
            icon: <Truck className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.6)]" />,
            title: "Fast & Reliable Delivery",
            desc: "Quick delivery at your doorstep"
        },
        {
            icon: <Lock className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.6)]" />,
            title: "Secure Shopping",
            desc: "100% secure & trusted payments"
        }
    ];

    return (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 border-y border-white/10 my-4 backdrop-blur-sm">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {badges.map((badge, i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.1)] flex items-center justify-center flex-shrink-0">
                            {badge.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs sm:text-sm font-bold text-white/90 leading-tight">{badge.title}</span>
                            <span className="hidden sm:block text-xs text-white/50 font-medium mt-0.5">{badge.desc}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
