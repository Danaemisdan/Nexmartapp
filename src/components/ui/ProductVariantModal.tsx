import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Product } from '@/lib/api';

interface ProductVariantModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    onConfirm: (size: string) => void;
}

export default function ProductVariantModal({ isOpen, onClose, product, onConfirm }: ProductVariantModalProps) {
    const [selectedSize, setSelectedSize] = useState('');

    const getSizes = () => {
        // Depending on category, return different sizes
        if (product.category.toLowerCase().includes('fashion') || product.category.toLowerCase().includes('clothing')) {
            return ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
        }
        if (product.category.toLowerCase().includes('shoe')) {
            return ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
        }
        return ['Pack', 'Standard'];
    };

    const sizes = getSizes();

    const handleConfirm = () => {
        if (!selectedSize) return;
        onConfirm(selectedSize);
        onClose();
        setSelectedSize(''); // reset for next time
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col"
                    >
                        <div className="flex justify-between items-start p-4 border-b border-[#ECECEC]">
                            <div className="flex gap-4 items-center">
                                <img src={product.image} alt={product.title} className="w-16 h-16 object-contain rounded border border-[#ECECEC]" />
                                <div className="flex flex-col">
                                    <h4 className="text-sm font-semibold text-[#111111] line-clamp-1">{product.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm font-bold text-[#111111]">₹{product.price}</span>
                                        <span className="text-xs text-gray-400 line-through">₹{Math.floor(product.price * 1.5)}</span>
                                        <span className="text-xs font-bold text-[#FF6A00]">(33% OFF)</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <h3 className="text-sm font-bold text-[#111111] mb-4">Select Size</h3>
                            <div className="flex flex-wrap gap-3">
                                {sizes.map(size => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-bold transition-all
                                            ${selectedSize === size 
                                                ? 'border-[#FF6A00] text-[#FF6A00] bg-orange-50' 
                                                : 'border-gray-200 text-[#111111] hover:border-gray-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 pt-0">
                            <button 
                                onClick={handleConfirm}
                                disabled={!selectedSize}
                                className="w-full bg-[#FF6A00] disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#E65C00] text-white py-3.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
