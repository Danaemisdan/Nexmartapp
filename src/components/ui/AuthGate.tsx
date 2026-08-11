'use client';
import React from 'react';
import { useAuth } from '@clerk/nextjs';
import { useStore } from '@/lib/StoreContext';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AuthGateProps {
    /** Icon to show in the empty state circle */
    icon: React.ReactNode;
    /** Page name shown in "Login to view your {pageName}" */
    pageName: string;
    /** Subtitle text */
    subtitle?: string;
    children: React.ReactNode;
}

/**
 * Wraps any view that requires authentication.
 * Shows a branded "Login to view" screen for guests,
 * renders children for signed-in users.
 */
export default function AuthGate({ icon, pageName, subtitle, children }: AuthGateProps) {
    const { setAuthModalOpen } = useStore();
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) return <div className="h-[65vh] flex items-center justify-center">Loading...</div>;

    if (!isSignedIn) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-[65vh] px-4 text-center"
            >
                {/* Icon circle */}
                <div className="w-24 h-24 bg-[#F8F8F8] border border-[#ECECEC] rounded-full flex items-center justify-center mb-6 shadow-sm">
                    {icon}
                </div>

                {/* Headline */}
                <h2 className="text-xl font-bold text-[#111111] mb-2">
                    Login to view your {pageName}
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-8">
                    {subtitle || `Sign in to access your ${pageName} and manage your Nexmart account.`}
                </p>

                {/* CTA */}
                <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-10 py-3 bg-[#FF6A00] hover:bg-[#E65C00] text-white font-bold text-sm rounded-lg transition-colors shadow-md shadow-orange-500/20"
                >
                    LOGIN / SIGNUP
                </button>

                {/* Subtle sub-text */}
                <p className="text-xs text-gray-400 mt-4">
                    New to Nexmart? Signing up is free and takes 30 seconds.
                </p>
            </motion.div>
        );
    }

    return <>{children}</>;
}
