import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface HeroProductCardProps {
    product: {
        title: string;
        price: number;
        image: string;
        rating: number;
        reviews?: string;
    };
    badgeText: string;
    delay?: number;
    rotation?: number;
    scale?: number;
    className?: string;
    yOffset?: number;
    theme?: 'light' | 'dark';
}

export function HeroProductCard({ 
    product, 
    badgeText, 
    delay = 0, 
    rotation = 0, 
    scale = 1,
    className = '', 
    yOffset = 8,
    theme = 'dark'
}: HeroProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
    };

    const isLight = theme === 'light';

    return (
        <motion.div 
            initial={{ opacity: 0, scale: scale * 0.9 }}
            animate={{ 
                opacity: 1, 
                scale: scale,
                y: [0, -yOffset, 0],
                rotate: rotation
            }}
            transition={{ 
                opacity: { duration: 0.8, delay },
                scale: { duration: 0.8, delay },
                y: { duration: 6 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay }
            }}
            style={{ rotate: `${rotation}deg` }}
            className={`absolute ${isLight ? 'bg-white border-[#ECECEC] shadow-xl' : 'bg-[#111111] border-[#262626] shadow-[0_15px_40px_rgba(0,0,0,0.8)]'} rounded-2xl p-2.5 w-44 sm:w-52 flex flex-col overflow-hidden pointer-events-none z-10 ${className}`}
        >
            <div className={`w-full aspect-[4/3] rounded-xl mb-2 flex items-center justify-center relative overflow-hidden ${isLight ? 'bg-[#F8F8F8]' : 'bg-white/5'}`}>
                <div className="absolute top-2 left-2 bg-[#FF6A00] rounded-full px-2 py-0.5 z-20 shadow-md">
                    <span className="text-[9px] font-bold text-white tracking-widest uppercase">{badgeText}</span>
                </div>
                <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover relative z-10" 
                />
            </div>
            
            <div className="flex flex-col px-1.5 pb-1">
                <h3 className={`font-bold text-[11px] sm:text-xs line-clamp-1 leading-tight mb-1 ${isLight ? 'text-[#111111]' : 'text-white'}`}>{product.title}</h3>
                
                <div className="flex justify-between items-end mt-1">
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#FF6A00] text-[#FF6A00]" />
                        <span className={`text-[10px] font-bold ${isLight ? 'text-[#666666]' : 'text-white/90'}`}>{product.rating}</span>
                        {product.reviews && <span className={`text-[9px] ${isLight ? 'text-[#666666]/60' : 'text-white/40'}`}>| {product.reviews}</span>}
                    </div>
                    <span className={`font-black text-xs sm:text-sm tracking-tight ${isLight ? 'text-[#111111]' : 'text-white'}`}>{formatPrice(product.price)}</span>
                </div>
            </div>
        </motion.div>
    );
}
