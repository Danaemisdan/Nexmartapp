import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/StoreContext';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

export default function MarketplaceToast() {
    const { toast, hideToast, navigate } = useStore();

    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                hideToast();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible, hideToast]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />;
            case 'info':
            default: return <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />;
        }
    };

    return (
        <AnimatePresence>
            {toast.visible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    className="fixed top-20 right-4 z-[9999] bg-[#111111] text-white rounded-xl shadow-2xl p-4 min-w-[320px] max-w-[420px] flex items-center justify-between border border-gray-800"
                >
                    <div className="flex items-center gap-3">
                        {toast.productImage ? (
                            <img src={toast.productImage} alt="Product" className="w-10 h-10 object-cover rounded bg-white" />
                        ) : (
                            getIcon()
                        )}
                        <span className="text-sm font-semibold">{toast.message}</span>
                    </div>
                    {toast.message.toLowerCase().includes('bag') && (
                        <button 
                            onClick={() => {
                                hideToast();
                                navigate('cart');
                            }}
                            className="ml-4 px-3 py-1.5 bg-[#00BFA5] hover:bg-[#00A08A] text-white text-xs font-bold rounded transition-colors whitespace-nowrap"
                        >
                            VIEW BAG
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
