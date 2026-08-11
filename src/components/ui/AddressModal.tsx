'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/StoreContext';
import { X } from 'lucide-react';
import AddressesView from '../views/account/AddressesView';

export default function AddressModal() {
    const { addressModalOpen, setAddressModalOpen } = useStore();

    if (!addressModalOpen) return null;

    return (
        <AnimatePresence>
            {addressModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setAddressModalOpen(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-10"
                    >
                        <button 
                            onClick={() => setAddressModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-2 sm:p-4">
                            <AddressesView />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
