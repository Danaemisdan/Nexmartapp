import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { promoBanners } from '@/lib/marketplaceData';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketplaceBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promoBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + promoBanners.length) % promoBanners.length);
  };

  return (
    <div className="w-full relative overflow-hidden group rounded-[2.5rem]" style={{ height: 'calc(100vh - 450px)', minHeight: '350px', maxHeight: '500px' }}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Full Cover Image */}
          <img 
            src={promoBanners[currentIndex].image} 
            alt={promoBanners[currentIndex].title}
            className="w-full h-full object-cover object-center"
          />
          
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 w-full md:w-2/3">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-7xl font-black mb-4 tracking-tight leading-[1.1] text-white"
            >
              {promoBanners[currentIndex].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-2xl font-medium text-gray-200 mb-8 max-w-xl"
            >
              {promoBanners[currentIndex].subtitle}
            </motion.p>
            <motion.button 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="px-8 py-3.5 rounded-full font-semibold text-lg w-max bg-white text-black hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95"
            >
              Shop Now
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button 
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 hover:scale-110 border border-white/10"
      >
        <ChevronLeft className="w-6 h-6 ml-[-2px]" />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 hover:scale-110 border border-white/10"
      >
        <ChevronRight className="w-6 h-6 mr-[-2px]" />
      </button>

      {/* Sleek Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {promoBanners.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-10 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
}
