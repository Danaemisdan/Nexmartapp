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
                    initial={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden"
                >
                    <motion.div
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative z-10 flex items-center justify-center"
                    >
                        <img 
                            src="/logo-full.png" 
                            alt="Nexmart" 
                            className="w-48 h-48 md:w-64 md:h-64 object-contain mb-6" 
                        />
                        <motion.p 
                            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                            className="text-gray-500 font-medium text-lg md:text-xl tracking-wide absolute -bottom-8 whitespace-nowrap"
                        >
                            AI Commerce, Simplified
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
