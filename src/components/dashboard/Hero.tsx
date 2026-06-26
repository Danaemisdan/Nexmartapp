'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Star } from 'lucide-react';

interface HeroProps {
    children?: React.ReactNode; 
}

export default function Hero({ children }: HeroProps) {
    return (
        <section className="relative w-full overflow-hidden bg-[#FAFAFA] pb-24 pt-16 md:pt-28 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 flex flex-col items-center justify-center">
                
                {/* Centered Text Content */}
                <div className="text-center max-w-4xl mx-auto mb-16 z-30">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 bg-[#1A365D]/5 text-[#1A365D] font-bold text-xs sm:text-sm px-4 py-2 rounded-full mb-8 border border-[#1A365D]/10"
                    >
                        Nexmart Network is live!
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl sm:text-6xl md:text-8xl font-black text-gray-900 leading-[1.05] tracking-tight mb-8"
                    >
                        AI That Shops For You
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-gray-600 text-lg md:text-2xl leading-relaxed font-medium mb-12 max-w-3xl mx-auto"
                    >
                        Nexmart transforms everyday locations into smart commerce hubs. Our AI agents act on your behalf to find products, execute purchases, and manage subscriptions effortlessly.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <button className="bg-[#1A365D] text-white px-10 py-5 rounded-full font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(26,54,93,0.3)]">
                            Start Shopping With AI
                        </button>
                    </motion.div>
                </div>
                
            </div>
            
        </section>
    );
}
