import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Logo shrinks over 3.8s, then we trigger home screen at 4.0s
        const timer = setTimeout(() => {
            onComplete(); 
        }, 4000);
        
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
                    {/* Cinematic Glowing Orbs */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-80 mix-blend-screen">
                        {/* Blue Glow */}
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [0.8, 1.2, 2], opacity: [0, 0.6, 0] }}
                            transition={{ duration: 3.5, ease: "easeInOut" }}
                            className="absolute w-[40vw] h-[40vw] bg-blue-500 rounded-full filter blur-[100px] md:blur-[120px]"
                        />
                        {/* Orange Glow */}
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [0.8, 1.5, 2.5], opacity: [0, 0.8, 0] }}
                            transition={{ duration: 3.5, ease: "easeInOut", delay: 0.2 }}
                            className="absolute w-[45vw] h-[45vw] bg-orange-500 rounded-full filter blur-[100px] md:blur-[120px]"
                        />
                        {/* Yellow Glow */}
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [0.8, 1.3, 3], opacity: [0, 0.9, 0] }}
                            transition={{ duration: 3.5, ease: "easeInOut", delay: 0.4 }}
                            className="absolute w-[35vw] h-[35vw] bg-yellow-400 rounded-full filter blur-[100px] md:blur-[120px]"
                        />
                    </div>

                    {/* Center X Logo */}
                    <div className="relative z-10 flex items-center justify-center origin-center">
                        <motion.img 
                            layoutId="main-logo"
                            initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            src="/logo-icon.png" 
                            alt="Nexmart Logo"
                            className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_0_30px_rgba(251,191,36,0.8)]"
                        />
                    </div>
        </div>
    );
}
