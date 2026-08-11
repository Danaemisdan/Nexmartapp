import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { promoBanners } from '@/lib/marketplaceData';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketplaceBannerCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % promoBanners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % promoBanners.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + promoBanners.length) % promoBanners.length);
    };

    return (
        <div className="w-full relative bg-gray-100 overflow-hidden group rounded-3xl" style={{ height: 'calc(100vh - 450px)', minHeight: '300px', maxHeight: '420px' }}>
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full flex"
                    style={{ backgroundColor: promoBanners[currentIndex].backgroundColor }}
                >
                    <div className="w-1/2 h-full flex flex-col justify-center px-12 md:px-24">
                        <motion.h2 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-none"
                            style={{ color: promoBanners[currentIndex].textColor }}
                        >
                            {promoBanners[currentIndex].title}
                        </motion.h2>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg md:text-2xl font-bold opacity-80 mb-8"
                            style={{ color: promoBanners[currentIndex].textColor }}
                        >
                            {promoBanners[currentIndex].subtitle}
                        </motion.p>
                        <motion.button 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="px-8 py-3 rounded-xl font-bold text-lg w-max shadow-lg transition-transform hover:-translate-y-1"
                            style={{ backgroundColor: promoBanners[currentIndex].textColor, color: promoBanners[currentIndex].backgroundColor }}
                        >
                            Shop Now
                        </motion.button>
                    </div>
                    <div className="w-1/2 h-full relative">
                        <img 
                            src={promoBanners[currentIndex].image} 
                            alt={promoBanners[currentIndex].title}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient fade to blend image with solid color */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-color)] to-transparent w-1/3" style={{ '--bg-color': promoBanners[currentIndex].backgroundColor } as React.CSSProperties} />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-24 bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-24 bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {promoBanners.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-[#111111]' : 'w-2 bg-[#111111]/30'}`}
                    />
                ))}
            </div>
        </div>
    );
}
