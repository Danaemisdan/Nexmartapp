import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Star } from 'lucide-react';

interface HeroProps {
    children?: React.ReactNode; 
}

export default function Hero({ children }: HeroProps) {
    return (
        <section className="relative w-full overflow-hidden bg-black pb-16 pt-8 md:pt-16">
            {/* Ambient Animated Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-[150px] mix-blend-screen" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-500/20 blur-[150px] mix-blend-screen" />
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-purple-600/20 blur-[150px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
                
                {/* Left Content */}
                <div className="flex-1 max-w-2xl text-center md:text-left mt-4 md:mt-12 mb-12 md:mb-0">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md text-blue-200 font-medium text-xs sm:text-sm px-4 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                    >
                        <Sparkles className="w-4 h-4 text-blue-400" /> Introducing Nexmart Engine v2.0
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8"
                    >
                        Shopping,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            Reinvented.
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto md:mx-0 leading-relaxed font-light mb-10"
                    >
                        Experience the world's first fully autonomous AI shopping agent. Discover, negotiate, and checkout instantly with the power of neural intelligence.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
                    >
                        <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                            Enter the Store <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 text-white border border-white/20 backdrop-blur-md px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                            Watch Demo
                        </button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="mt-12 flex items-center justify-center md:justify-start gap-8 text-gray-400 text-sm font-medium"
                    >
                        <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /> Instant Checkout</div>
                        <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-500" /> Secure AI Engine</div>
                    </motion.div>
                </div>

                {/* Right Content (Floating Interactive Elements) */}
                <div className="hidden lg:flex flex-1 w-full h-[600px] relative z-10 items-center justify-center perspective-[1000px]">
                    
                    {/* The core Orb Container */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Glow ring around where the Orb sits */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[inset_0_0_80px_rgba(255,255,255,0.05)]" />
                        
                        {/* Inject the AgentOrb here */}
                        <div className="z-50 scale-125">
                            {children}
                        </div>

                        {/* Floating Product Cards (Premium Glassmorphism) */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0, rotateX: 10, rotateY: -10 }}
                            animate={{ y: [-10, 10, -10], opacity: 1, rotateX: 10, rotateY: -10 }}
                            transition={{ opacity: { duration: 1, delay: 0.5 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                            className="absolute top-16 -right-4 bg-white/10 backdrop-blur-xl rounded-3xl p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col gap-3 w-64 transform-gpu"
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
                            className="absolute bottom-16 -left-12 bg-white/10 backdrop-blur-xl rounded-3xl p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col gap-3 w-60 transform-gpu"
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
