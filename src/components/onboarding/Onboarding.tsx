'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Package, ArrowRight, Check, Zap, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    
    const interests = [
        { id: 'Electronics', icon: '💻' },
        { id: 'Fashion', icon: '👗' },
        { id: 'Groceries', icon: '🥑' },
        { id: 'Home & Kitchen', icon: '🛋️' },
        { id: 'Beauty', icon: '✨' },
        { id: 'Sports', icon: '🏃' }
    ];

    const toggleInterest = (i: string) => {
        if (selectedInterests.includes(i)) setSelectedInterests(selectedInterests.filter(x => x !== i));
        else setSelectedInterests([...selectedInterests, i]);
    };

    const handleComplete = () => {
        localStorage.setItem('nexmart_onboarded', 'true');
        onComplete();
    };

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
        else handleComplete();
    };

    const skipOnboarding = () => {
        handleComplete();
    };

    const stepVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { type: "spring" as const, stiffness: 300, damping: 30 }
        },
        exit: { 
            opacity: 0, 
            y: -20, 
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-6 overflow-hidden relative">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px] pointer-events-none" />

            <div className="absolute top-8 right-8 z-50">
                <button onClick={skipOnboarding} className="text-gray-400 hover:text-gray-900 font-medium text-sm transition-colors tracking-tight">Skip Onboarding</button>
            </div>

            <motion.div 
                className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] max-w-xl w-full p-8 md:p-12 relative overflow-hidden"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
            >
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div key="step0" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20 rotate-3">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Meet Nexmart AI.</h2>
                            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-sm">Experience the future of shopping. Your personal AI agent is ready to curate, negotiate, and discover.</p>
                            
                            <div className="flex flex-col gap-4 w-full">
                                <button onClick={nextStep} className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold text-lg flex justify-center items-center gap-3 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                                    Get Started <ArrowRight className="w-5 h-5" />
                                </button>
                                <p className="text-sm text-slate-400 flex items-center justify-center gap-1.5"><ShieldCheck className="w-4 h-4"/> 100% Privacy Protected</p>
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                            <div className="mb-8">
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">What do you love?</h2>
                                <p className="text-slate-500 text-lg">Pick a few categories to instantly train your AI.</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-10">
                                {interests.map(i => {
                                    const isSelected = selectedInterests.includes(i.id);
                                    return (
                                        <button 
                                            key={i.id} 
                                            onClick={() => toggleInterest(i.id)}
                                            className={`p-4 rounded-2xl border-2 text-left font-semibold flex items-center gap-3 transition-all duration-200 ${isSelected ? 'border-blue-500 bg-blue-50/50 text-blue-900 shadow-md scale-[1.02]' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <span className="text-2xl">{i.icon}</span>
                                            <span className="flex-1">{i.id}</span>
                                            {isSelected && <motion.div initial={{scale:0}} animate={{scale:1}}><Check className="w-5 h-5 text-blue-500" /></motion.div>}
                                        </button>
                                    );
                                })}
                            </div>

                            <button onClick={nextStep} disabled={selectedInterests.length === 0} className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:hover:scale-100 hover:scale-[1.02] active:scale-95 shadow-lg">
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-rose-500/20 -rotate-3">
                                <MapPin className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">Where to?</h2>
                            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-sm">Enable location so your AI can find hyper-local deals and guarantee instant delivery.</p>
                            
                            <div className="w-full space-y-3">
                                <button onClick={nextStep} className="w-full bg-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-600/30">
                                    Allow Location Access
                                </button>
                                <button onClick={nextStep} className="w-full py-4 px-6 rounded-2xl font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                                    I'll enter it manually
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                            <div className="mb-8">
                                <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Delivery Speed</h2>
                                <p className="text-slate-500 text-lg">How do you prefer your unboxings?</p>
                            </div>
                            
                            <div className="space-y-4 mb-10">
                                <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 flex gap-4 cursor-pointer relative overflow-hidden shadow-sm">
                                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">Recommended</div>
                                    <div className="mt-1 w-6 h-6 rounded-full border-[6px] border-emerald-500 bg-white flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">Nexmart Prime Fast</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">Consolidated smart deliveries, eco-friendly packaging, and prioritized routing.</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl border-2 border-slate-100 bg-white flex gap-4 cursor-pointer hover:border-slate-300 transition-colors">
                                    <div className="mt-1 w-6 h-6 rounded-full border-2 border-slate-300 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">Standard Drops</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">As fast as possible, items may arrive separately in multiple boxes.</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={nextStep} className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/20">
                                Enter the Store <ShoppingBag className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-slate-800' : i < step ? 'w-2 bg-slate-400' : 'w-2 bg-slate-200'}`} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
