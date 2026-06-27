import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Netflix-style timing: Logo animation takes about 2.5s, then fades out
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800); // Wait for the fade-out animation to finish before unmounting
        }, 2500);
        
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="splash-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* The "X" Logo with Netflix-style cinematic zoom/scale */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                            scale: [0.8, 1.2, 2.5], 
                            opacity: [0, 1, 0] 
                        }}
                        transition={{ 
                            duration: 2.5, 
                            times: [0, 0.4, 1],
                            ease: "easeInOut"
                        }}
                        className="relative z-10 flex items-center justify-center"
                    >
                        <img 
                            src="/logo-full.png" 
                            alt="Nexmart" 
                            className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_0_30px_rgba(255,204,0,0.5)]" 
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
