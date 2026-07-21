import React from 'react';
import ProductCarousel from '../dashboard/ProductCarousel';
import { useStore } from '@/lib/StoreContext';
import { motion, Variants } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';

interface HomeViewProps {
    aiProducts: any[];
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const PROMPTS = [
    "LATEST DEALS",
    "SMART HOME TECH",
    "GIFTS UNDER $50",
    "TRENDING ELECTRONICS",
    "EVERYDAY ESSENTIALS"
];

export default function HomeView({ aiProducts }: HomeViewProps) {
    const { navigate, addToCart } = useStore();
    const [searchValue, setSearchValue] = React.useState('');

    const suggestions = [
        "Noise cancelling headphones under $100",
        "Top rated 4K drones for beginners",
        "Organic dark roast coffee beans",
        "Minimalist mechanical keyboards"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            window.dispatchEvent(new CustomEvent('triggerAiPrompt', { detail: searchValue }));
            setSearchValue('');
        }
    };

    return (
        <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            style={{ perspective: "1000px" }}
            className="flex flex-col items-center justify-center flex-1 pb-24 md:pb-10 px-4 w-full"
        >
            {aiProducts.length > 0 ? (
                <motion.div 
                    layoutId="magic-portal"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="w-full mt-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-6 md:p-8 drop-shadow-[0_0_80px_rgba(59,130,246,0.15)] relative z-50 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
                    <ProductCarousel 
                        title="AI Search Results" 
                        subtitle={`Found ${aiProducts.length} items based on your request.`}
                        products={aiProducts} 
                        type="deals"
                        onProductClick={(p) => navigate('product', p)}
                        onAddToCart={(p) => addToCart(p)}
                    />
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center w-full mt-10 md:mt-16">
                    <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 drop-shadow-lg">
                        What are you looking for today?
                    </motion.h1>
                    
                    <motion.p variants={itemVariants} className="text-white/60 text-sm md:text-base max-w-xl mx-auto mb-10">
                        Search millions of products instantly using our AI assistant. Just type what you need.
                    </motion.p>
                    
                    <motion.div variants={itemVariants} className="w-full relative flex flex-col items-center gap-6 mt-4">
                        {/* MAIN SEARCH BAR */}
                        <motion.form layoutId="magic-portal" onSubmit={handleSubmit} className="w-full relative group max-w-2xl bg-white/5 backdrop-blur-xl border border-white/20 rounded-full flex items-center p-2 shadow-2xl focus-within:border-blue-400/50 focus-within:bg-white/15 transition-all z-20">
                            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"></div>
                                <div className="w-10 h-10 flex items-center justify-center text-white/50 relative z-10 pointer-events-none">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input 
                                    type="text" 
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="e.g., I need a cheap laptop for college..."
                                    className="flex-1 bg-transparent border-none text-white outline-none placeholder:text-white/40 text-sm md:text-base py-3 relative z-10"
                                />
                                <button type="submit" className="w-10 h-10 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center text-white transition-colors shadow-lg">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                        </motion.form>
                        
                        {/* Suggestions Below */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 max-w-3xl">
                            <span className="text-white/40 text-sm mr-2 hidden md:inline">Try asking:</span>
                            {suggestions.map((suggestion, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => window.dispatchEvent(new CustomEvent('triggerAiPrompt', { detail: suggestion }))}
                                    className="bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white/60 hover:text-white px-4 py-2 rounded-full text-xs transition-colors shadow-sm"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    <motion.p variants={itemVariants} className="mt-16 text-white/30 text-xs md:text-sm flex items-center gap-2">
                        Or just click the orb above and speak naturally
                    </motion.p>
                </div>
            )}
        </motion.div>
    );
}
