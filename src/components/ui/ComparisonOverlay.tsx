import React, { useMemo } from 'react';
import { useStore } from '@/lib/StoreContext';
import { X, Star, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ComparisonOverlay() {
    const { comparisonProducts, setComparisonProducts, formatPrice, addToCart, navigate } = useStore();

    const handleClose = () => {
        setComparisonProducts(null);
    };

    // Extract all unique attribute keys across the compared products
    const allAttributeKeys = useMemo(() => {
        if (!comparisonProducts) return [];
        const keys = new Set<string>();
        comparisonProducts.forEach(p => {
            if (p.attributes) {
                Object.keys(p.attributes).forEach(k => keys.add(k));
            }
        });
        return Array.from(keys).sort();
    }, [comparisonProducts]);

    if (!comparisonProducts || comparisonProducts.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="w-full max-w-6xl max-h-[90vh] bg-[#0f1014] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative"
                >
                    <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Product Comparison
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-x-auto overflow-y-auto hide-scrollbar p-6">
                        <div className="flex gap-6 min-w-max">
                            {/* Static Labels Column */}
                            <div className="w-40 flex-shrink-0 hidden md:block pt-[220px]">
                                <div className="space-y-4">
                                    <div className="h-12 font-semibold text-gray-400 border-b border-white/5 flex items-center">Price</div>
                                    <div className="h-12 font-semibold text-gray-400 border-b border-white/5 flex items-center">Rating</div>
                                    <div className="h-12 font-semibold text-gray-400 border-b border-white/5 flex items-center">Brand</div>
                                    {allAttributeKeys.map(key => (
                                        <div key={key} className="h-12 font-semibold text-gray-400 border-b border-white/5 flex items-center capitalize">
                                            {key}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Product Columns */}
                            {comparisonProducts.map((product) => (
                                <div key={product.id} className="w-64 flex-shrink-0 flex flex-col">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 flex flex-col items-center">
                                        <div className="w-40 h-40 mb-4 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                                            <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-overlay" />
                                        </div>
                                        <h3 className="font-bold text-center text-sm mb-2 h-10 overflow-hidden line-clamp-2">
                                            {product.title}
                                        </h3>
                                        <button
                                            onClick={() => {
                                                addToCart(product, 1);
                                                toast.success('Added to cart');
                                            }}
                                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" /> Add
                                        </button>
                                    </div>

                                    {/* Data Rows */}
                                    <div className="space-y-4">
                                        <div className="h-12 font-bold text-xl flex items-center justify-center border-b border-white/5">
                                            {formatPrice(product.price)}
                                        </div>
                                        <div className="h-12 font-medium flex items-center justify-center border-b border-white/5 gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            {product.rating} ({product.reviews})
                                        </div>
                                        <div className="h-12 font-medium text-gray-300 flex items-center justify-center border-b border-white/5">
                                            {product.brand || '—'}
                                        </div>
                                        {allAttributeKeys.map(key => (
                                            <div key={key} className="h-12 text-sm text-gray-300 flex items-center justify-center border-b border-white/5 text-center px-2">
                                                {product.attributes?.[key] || '—'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
