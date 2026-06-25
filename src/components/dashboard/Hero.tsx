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

            {/* Glowing Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
                
                {/* Left Content */}
                <div className="flex-1 max-w-2xl text-center md:text-left mt-8 mb-16 md:mb-0">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 bg-white/5 text-blue-400 font-bold text-xs sm:text-sm px-4 py-2 rounded-full mb-8 border border-white/10 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                    >
                        <Sparkles className="w-4 h-4" /> The Future of E-Commerce
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
                    >
                        Shop Smarter.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                            Not Harder.
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto md:mx-0 leading-relaxed font-medium mb-10"
                    >
                        Experience the world's first AI-powered shopping assistant. Tell us what you need, and we'll handle the rest.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
                    >
                        <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] border border-white/10">
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
                        <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" /> Lightning Fast</div>
                        <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Secure Engine</div>
                    </motion.div>
                </div>

                {/* Right Content (Floating Interactive Elements) */}
                <div className="hidden lg:flex flex-1 w-full h-[550px] relative z-10 items-center justify-center perspective-[1200px]">
                    <div className="relative w-full h-full flex items-center justify-center">
                        
                        {/* Stunning Aurora Portal Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10 blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[inset_0_0_80px_rgba(255,255,255,0.05),0_0_60px_rgba(99,102,241,0.2)]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full border border-blue-400/20 bg-blue-500/5 backdrop-blur-3xl shadow-[inset_0_0_40px_rgba(59,130,246,0.1)]" />

                        {/* Floating Product Cards (Ultra Premium) */}
                        <motion.div 
                            initial={{ y: 30, opacity: 0, rotateX: 15, rotateY: -15 }}
                            animate={{ y: [-15, 15, -15], opacity: 1, rotateX: 15, rotateY: -15 }}
                            transition={{ opacity: { duration: 1.2, delay: 0.4 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
                            className="absolute top-6 -right-8 bg-white/5 backdrop-blur-2xl rounded-3xl p-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] border border-white/10 flex flex-col gap-3 w-72 transform-gpu z-20 hover:scale-105 transition-transform duration-500 cursor-pointer"
                        >
                            <div className="w-full h-44 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden relative border border-white/5 shadow-inner">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" alt="Headphones" className="w-full h-full object-cover mix-blend-screen scale-110" />
                                <div className="absolute bottom-3 left-3 z-20 flex gap-1 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">
                                    <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" />
                                </div>
                            </div>
                            <div className="flex flex-col px-2 pb-1">
                                <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3" /> AI Recommended
                                </span>
                                <span className="text-white text-lg font-bold leading-tight tracking-wide">Sony WH-1000XM5</span>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-white font-black text-2xl drop-shadow-md">$279</span>
                                    <button className="bg-white text-black text-xs font-bold py-2 px-5 rounded-full hover:bg-blue-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">Buy Now</button>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ y: -30, opacity: 0, rotateX: -15, rotateY: 15 }}
                            animate={{ y: [15, -15, 15], opacity: 1, rotateX: -15, rotateY: 15 }}
                            transition={{ opacity: { duration: 1.2, delay: 0.6 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
                            className="absolute bottom-6 -left-12 bg-white/5 backdrop-blur-2xl rounded-3xl p-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] border border-white/10 flex flex-col gap-3 w-64 transform-gpu z-10 hover:scale-105 transition-transform duration-500 cursor-pointer"
                        >
                            <div className="w-full h-36 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden relative border border-white/5 shadow-inner">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80" alt="Watch" className="w-full h-full object-cover mix-blend-screen opacity-90 scale-105" />
                            </div>
                            <div className="flex flex-col px-2 pb-1">
                                <span className="text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                                    <Zap className="w-3 h-3" /> Trending
                                </span>
                                <span className="text-white text-base font-bold leading-tight tracking-wide">Apple Watch S9</span>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-white font-black text-xl drop-shadow-md">$299</span>
                                    <button className="bg-white/10 text-white border border-white/20 text-xs font-bold py-1.5 px-4 rounded-full hover:bg-white/20 transition-colors">+</button>
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
