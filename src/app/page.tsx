'use client'
import React, { useState } from 'react';
import SplashScreen from '@/components/dashboard/SplashScreen';
import Onboarding from '@/components/onboarding/Onboarding';
import Dashboard from '@/components/dashboard/Dashboard';
import { AnimatePresence, motion } from 'framer-motion';

type AppState = 'SPLASH' | 'ONBOARDING' | 'HOME';

export default function Home() {
    const [appState, setAppState] = useState<AppState>('SPLASH');

    const handleSplashComplete = () => {
        setAppState('HOME');
    };

    return (
        <div className="h-screen w-full relative overflow-hidden font-sans bg-white">

            <AnimatePresence mode="wait">
                {appState === 'SPLASH' && (
                    <motion.div key="splash" exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 z-50 bg-black">
                        <SplashScreen onComplete={handleSplashComplete} />
                    </motion.div>
                )}

                {appState === 'ONBOARDING' && (
                    <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="absolute inset-0 z-40 bg-gray-50">
                        <Onboarding onComplete={() => setAppState('HOME')} />
                    </motion.div>
                )}

                {appState === 'HOME' && (
                    <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 z-30">
                        <Dashboard />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
