import React from 'react';
import { Star, Heart } from 'lucide-react';
import { MarketplaceProduct } from '@/lib/marketplaceData';

interface MarketplaceProductCardProps {
    product: MarketplaceProduct;
    onProductClick?: (product: MarketplaceProduct) => void;
    onAddToCart?: (product: MarketplaceProduct) => void;
    variant?: 'standard' | 'deal' | 'compact';
}

export default function MarketplaceProductCard({ product, onProductClick, onAddToCart, variant = 'standard' }: MarketplaceProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
    };

    return (
        <div 
            onClick={() => onProductClick && onProductClick(product)}
            className="flex flex-col bg-white border border-[#ECECEC] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group min-w-[160px] md:min-w-[200px] max-w-[240px] flex-shrink-0 snap-start"
        >
            {/* Image Container */}
            <div className="w-full aspect-square relative bg-[#F8F8F8] flex items-center justify-center p-4">
                <img 
                    src={product.image} 
                    alt={product.title} 
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                />
                
                {/* Wishlist Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); /* Add to wishlist logic */ }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-[#FF6A00] hover:bg-white shadow-sm transition-colors"
                >
                    <Heart className="w-4 h-4" />
                </button>

                {/* Deal Badge */}
                {product.discount && variant === 'deal' && (
                    <div className="absolute top-3 left-3 bg-[#CC0000] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                        {product.discount}
                    </div>
                )}
            </div>

            {/* Info Container */}
            <div className="p-4 flex flex-col flex-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{product.brand}</div>
                <h3 className="text-sm font-semibold text-[#111111] line-clamp-2 leading-snug mb-2 group-hover:text-[#FF6A00] transition-colors">{product.title}</h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mt-auto mb-3">
                    <div className="bg-[#388E3C] text-white flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {product.rating} <Star className="w-2.5 h-2.5 fill-white" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">({product.reviews})</span>
                    {product.isAssured && (
                        <div className="ml-auto flex items-center text-[10px] italic font-bold text-[#1565C0]">
                            <span className="text-[#FF6A00]">N</span>-Assured
                        </div>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-end gap-2 mb-3">
                    <span className="text-lg font-black text-[#111111] leading-none">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through leading-none pb-[2px]">{formatPrice(product.originalPrice)}</span>
                    )}
                    {product.discount && variant !== 'deal' && (
                        <span className="text-xs font-bold text-[#388E3C] leading-none pb-[2px]">{product.discount}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
