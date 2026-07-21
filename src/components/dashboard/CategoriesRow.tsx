import React from 'react';
import { Headphones, Shirt, Coffee, Sparkles, Trophy, Gamepad2, ShoppingBasket, Activity, Car, LayoutGrid } from 'lucide-react';

export default function CategoriesRow() {
    const categories = [
        { name: "Electronics", icon: <Headphones className="w-6 h-6" /> },
        { name: "Fashion", icon: <Shirt className="w-6 h-6" /> },
        { name: "Home & Kitchen", icon: <Coffee className="w-6 h-6" /> },
        { name: "Beauty", icon: <Sparkles className="w-6 h-6" /> },
        { name: "Sports", icon: <Trophy className="w-6 h-6" /> },
        { name: "Toys & Games", icon: <Gamepad2 className="w-6 h-6" /> },
        { name: "Grocery", icon: <ShoppingBasket className="w-6 h-6" /> },
        { name: "Health", icon: <Activity className="w-6 h-6" /> },
        { name: "Automotive", icon: <Car className="w-6 h-6" /> },
        { name: "View All", icon: <LayoutGrid className="w-6 h-6" />, isViewAll: true },
    ];

    return (
        <section className="max-w-7xl mx-auto w-full px-6 py-6">
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {categories.map((cat, i) => (
                    <button 
                        key={i} 
                        className="flex flex-col items-center gap-3 min-w-[80px] group flex-shrink-0"
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all backdrop-blur-sm ${
                            cat.isViewAll 
                            ? 'bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:text-white' 
                            : 'bg-white/5 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)] text-white/80 group-hover:border-yellow-400 group-hover:text-yellow-400 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                        }`}>
                            {cat.icon}
                        </div>
                        <span className="text-xs font-bold text-white/70 whitespace-nowrap text-center group-hover:text-yellow-400 transition-colors drop-shadow-md">
                            {cat.name}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}
