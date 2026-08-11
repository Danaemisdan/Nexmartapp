import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Trigger home screen at 3.0s for a faster, premium feel
        const timer = setTimeout(() => {
            onComplete(); 
        }, 3000);
        
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden">
            {/* Soft Premium Glows */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
                {/* Subtle Orange Aura */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.8, 1.2, 2], opacity: [0, 0.4, 0] }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                    className="absolute w-[40vw] h-[40vw] bg-[#FF6A00] rounded-full filter blur-[100px] md:blur-[120px]"
                />
            </div>

            {/* Center X Logo */}
            <div className="relative z-10 flex items-center justify-center origin-center">
                <motion.img 
                    layoutId="main-logo"
                    initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                    animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    src="/yellow-x-logo.png" 
                    alt="Nexmart Logo"
                    className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_10px_30px_rgba(255,106,0,0.2)]"
                />
            </div>
            
            {/* Minimal Loader */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-24 flex flex-col items-center gap-3"
            >
                <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-full h-full bg-[#FF6A00] rounded-full"
                    />
                </div>
            </motion.div>
        </div>
    );
}
