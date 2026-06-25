'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Star } from 'lucide-react';

interface HeroProps {
    children?: React.ReactNode; 
}

export default function Hero({ children }: HeroProps) {
    return (
        <section className="relative w-full overflow-hidden bg-[#030712] pb-24 pt-12 md:pt-24 border-b border-gray-800">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
                
                {/* Left Content */}
                <div className="flex-1 max-w-2xl text-center md:text-left mt-8 mb-16 md:mb-0">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 bg-white/5 text-blue-400 font-bold text-xs sm:text-sm px-4 py-2 rounded-full mb-8 border border-white/10"
                    >
                        <Sparkles className="w-4 h-4" /> Next-Gen Shopping
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6"
                    >
                        Shop Smarter.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Not Harder.
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto md:mx-0 leading-relaxed font-medium mb-10"
                    >
                        Discover the perfect products with our intelligent shopping assistant. Instant checkout, seamless tracking, and guaranteed quality.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
                    >
                        <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-900/40">
                            Enter the Store <ArrowRight className="w-5 h-5" />
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
                        <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-500" /> Secure AI Engine</div>
                    </motion.div>
                </div>

                {/* Right Content (Floating Interactive Elements) */}
                <div className="hidden lg:flex flex-1 w-full h-[500px] relative z-10 items-center justify-center perspective-[1000px]">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Glow ring */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[inset_0_0_80px_rgba(255,255,255,0.05)]" />

                        {/* Floating Product Cards (Premium Glassmorphism) */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0, rotateX: 10, rotateY: -10 }}
                            animate={{ y: [-10, 10, -10], opacity: 1, rotateX: 10, rotateY: -10 }}
                            transition={{ opacity: { duration: 1, delay: 0.5 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                            className="absolute top-8 -right-4 bg-white/10 backdrop-blur-xl rounded-3xl p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col gap-3 w-64 transform-gpu z-20"
                        >
                            <div className="w-full h-40 bg-gray-900 rounded-2xl overflow-hidden relative border border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" alt="Headphones" className="w-full h-full object-cover mix-blend-screen" />
                                <div className="absolute bottom-3 left-3 z-20 flex gap-1 text-yellow-400">
                                    <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                                </div>
                            </div>
                            <div className="flex flex-col px-1">
                                <span className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> AI Selected
                                </span>
                                <span className="text-white text-base font-bold leading-tight line-clamp-1">Sony WH-1000XM5</span>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-white font-black text-xl">$279</span>
                                    <button className="bg-white text-black text-xs font-bold py-1.5 px-4 rounded-full hover:scale-105 transition-transform">Buy</button>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ y: -20, opacity: 0, rotateX: -10, rotateY: 10 }}
                            animate={{ y: [10, -10, 10], opacity: 1, rotateX: -10, rotateY: 10 }}
                            transition={{ opacity: { duration: 1, delay: 0.7 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
                            className="absolute bottom-8 -left-8 bg-white/10 backdrop-blur-xl rounded-3xl p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col gap-3 w-60 transform-gpu z-10"
                        >
                            <div className="w-full h-32 bg-gray-900 rounded-2xl overflow-hidden relative border border-white/10">
                                <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80" alt="Watch" className="w-full h-full object-cover mix-blend-screen opacity-90" />
                            </div>
                            <div className="flex flex-col px-1">
                                <span className="text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Trending
                                </span>
                                <span className="text-white text-sm font-bold leading-tight">Apple Watch S9</span>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-white font-black text-lg">$299</span>
                                    <button className="bg-white text-black text-[10px] font-bold py-1.5 px-3 rounded-full hover:scale-105 transition-transform">+</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* Bottom Gradient Fade to match the rest of the white site */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
        </section>
    );
}
