import React from 'react';
import { motion } from 'framer-motion';

interface CSSOrbProps {
    isListening?: boolean;
    isTalking?: boolean;
    isWorking?: boolean;
    progress?: string;
}

export function CSSOrb({ isListening, isTalking, isWorking, progress }: CSSOrbProps) {
    let scale = 1;
    let colors = ['#3b82f6', '#1d4ed8']; // Base blue
    let duration = 3;

    if (isListening) {
        scale = 1.1;
        colors = ['#10b981', '#059669']; // Green listening
        duration = 1.5;
    } else if (isTalking) {
        scale = 1.05;
        colors = ['#8b5cf6', '#6d28d9']; // Purple talking
        duration = 0.8;
    } else if (isWorking) {
        scale = 1.15;
        colors = ['#f59e0b', '#d97706']; // Orange working
        duration = 0.5;
    }

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer Glow */}
            <motion.div
                className="absolute inset-0 rounded-full blur-2xl opacity-60 mix-blend-multiply dark:mix-blend-screen"
                animate={{
                    scale: [scale, scale * 1.2, scale],
                    background: `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 100%)`
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            
            {/* Inner Core */}
            <motion.div
                className="relative w-20 h-20 rounded-full shadow-[inset_0_-10px_20px_rgba(0,0,0,0.2),_0_10px_20px_rgba(0,0,0,0.2)] bg-gradient-to-tr overflow-hidden flex items-center justify-center"
                animate={{
                    scale: [1, 1.05, 1],
                    backgroundImage: `linear-gradient(to top right, ${colors[1]}, ${colors[0]})`
                }}
                transition={{
                    duration: duration * 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Specular highlight for a glass look */}
                <div className="absolute top-1 left-2 right-2 h-1/3 bg-white/30 rounded-full blur-[2px]" />
            </motion.div>
        </div>
    );
}
