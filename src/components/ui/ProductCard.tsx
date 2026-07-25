'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/api';

interface ProductCardProps {
    product: Product;
    formatPrice: (price: number) => string;
    onProductClick: (product: Product) => void;
    onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, formatPrice, onProductClick, onAddToCart }: ProductCardProps) {
    const brand = product.brand || 'Generic';
    const hasRating = product.rating !== undefined && product.rating !== null && !isNaN(product.rating);
    const imageUrl = product.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80';

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => onProductClick(product)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onProductClick(product)}
            className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col cursor-pointer hover:border-[#1e3a8a] transition-colors group h-full focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
        >
            <div className="w-full aspect-square bg-gray-50 rounded-xl mb-3 p-4 flex items-center justify-center relative overflow-hidden">
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={product.title} 
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fb = e.currentTarget.parentElement?.querySelector('.pc-fallback');
                            if (fb) (fb as HTMLElement).style.display = 'flex';
                        }}
                        className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 relative z-10" 
                    />
                ) : null}
                <div className={`pc-fallback absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-2 text-center z-0 ${imageUrl ? 'hidden' : 'flex'}`}>
                    <svg className="w-8 h-8 md:w-10 md:h-10 mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-400">No Product Image</span>
                </div>
            </div>
            
            <div className="flex flex-col flex-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">{brand}</span>
                <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight mb-2">{product.title}</h3>
                
                <div className="flex items-center gap-1 mb-3 mt-auto">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-gray-600">{hasRating ? product.rating : 'New'}</span>
                    {hasRating && <span className="text-[10px] text-gray-400">({product.reviews || 0})</span>}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-black text-black">{formatPrice(product.price)}</span>
                        {product.stock !== undefined && (
                           <span className="text-[10px] text-gray-400">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                        )}
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} 
                        aria-label={`Add ${product.title} to cart`}
                        className="p-2 bg-gray-100 rounded-full hover:bg-[#1e3a8a] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export function ProductSkeleton() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col h-full animate-pulse">
            <div className="w-full aspect-square bg-gray-100 rounded-xl mb-3" />
            <div className="flex flex-col flex-1">
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-4 mt-auto" />
                <div className="flex items-center justify-between mt-auto">
                    <div className="h-5 bg-gray-100 rounded w-1/2" />
                    <div className="w-8 h-8 bg-gray-100 rounded-full" />
                </div>
            </div>
        </div>
    );
}
