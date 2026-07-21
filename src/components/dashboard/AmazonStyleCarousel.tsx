import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BANNERS = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000&auto=format&fit=crop",
        title: "Prime Day Deals",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2000&auto=format&fit=crop",
        title: "Holiday Specials",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2000&auto=format&fit=crop",
        title: "Exclusive Electronics",
    }
];

export default function AmazonStyleCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

    return (
        <div className="relative w-full max-w-full overflow-hidden bg-[#050505]">
            {/* Banner Container */}
            <div className="relative h-[250px] md:h-[400px] lg:h-[500px] w-full">
                <AnimatePresence initial={false}>
                    <motion.img
                        key={currentIndex}
                        src={BANNERS[currentIndex].image}
                        alt={BANNERS[currentIndex].title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                </AnimatePresence>
                
                {/* Gradient Overlay at the bottom to blend with the rest of the page */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
            </div>

            {/* Navigation Controls */}
            <button 
                onClick={prev}
                className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 w-10 h-16 md:w-12 md:h-24 bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors border border-white/10 flex items-center justify-center rounded-sm text-yellow-400 group"
            >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_5px_rgba(250,204,21,0.6)] group-hover:scale-110 transition-transform" />
            </button>
            <button 
                onClick={next}
                className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 w-10 h-16 md:w-12 md:h-24 bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors border border-white/10 flex items-center justify-center rounded-sm text-yellow-400 group"
            >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_5px_rgba(250,204,21,0.6)] group-hover:scale-110 transition-transform" />
            </button>
        </div>
    );
}
