'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Star } from 'lucide-react';

interface HeroProps {
    children?: React.ReactNode; 
}

export default function Hero({ children }: HeroProps) {
    return (
        <section className="relative w-full overflow-hidden bg-white pb-16 pt-8 md:pt-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
                
                {/* Left Content */}
                <div className="flex-1 max-w-2xl text-center md:text-left mt-4 md:mt-12 mb-12 md:mb-0">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-bold text-xs sm:text-sm px-4 py-2 rounded-full mb-8"
                    >
                        <Sparkles className="w-4 h-4" /> Next-Gen Shopping
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] tracking-tight mb-6"
                    >
                        Shop Smarter.<br />
                        <span className="text-[#1e3a8a]">
                            Not Harder.
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto md:mx-0 leading-relaxed font-medium mb-10"
                    >
                        Discover the perfect products with our intelligent shopping assistant. Instant checkout, seamless tracking, and guaranteed quality.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
                    >
                        <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#1e3a8a] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-900/20">
                            Start Shopping <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="mt-12 flex items-center justify-center md:justify-start gap-8 text-gray-500 text-sm font-bold"
                    >
                        <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> Fast Delivery</div>
                        <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-500" /> Secure Payments</div>
                    </motion.div>
                </div>

                {/* Right Content (The Orb) */}
                <div className="hidden lg:flex flex-1 w-full h-[500px] relative z-10 items-center justify-center perspective-[1000px]">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Soft background circle for the Orb to sit on */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-100/50 mix-blend-multiply" />
                        
                        {/* Inject the AgentOrb here */}
                        <div className="z-50 scale-125">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
