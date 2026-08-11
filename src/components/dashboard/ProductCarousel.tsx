import React from 'react';
import { ArrowRight, Star, ShoppingCart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/api';
import { useStore } from '@/lib/StoreContext';

interface ProductCarouselProps {
    title: string | React.ReactNode;
    subtitle?: string;
    products: Product[];
    type: 'deals' | 'ai_picks';
    onProductClick?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
    onViewAllClick?: () => void;
}

export default function ProductCarousel({ title, subtitle, products, type, onProductClick, onAddToCart, onViewAllClick }: ProductCarouselProps) {
    const { formatPrice, isApiReady } = useStore();
    return (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-10">
            <div className="flex items-end justify-between mb-4 md:mb-6">
                <div>
                    <h2 className="text-lg md:text-xl font-black text-[#111111] flex items-center gap-2 drop-shadow-sm">
                        {title}
                    </h2>
                    {subtitle && <p className="text-xs md:text-sm text-[#666666] font-medium mt-1">{subtitle}</p>}
                </div>
                {type === 'deals' && (
                    <button onClick={onViewAllClick} className="text-[#FF6A00] font-bold text-xs md:text-sm flex items-center gap-1 hover:text-[#FF8A1F] hover:underline whitespace-nowrap ml-2 transition-colors">
                        View All Deals <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                )}
            </div>

            <div className="flex gap-4 md:gap-8 overflow-x-auto pb-8 md:pb-12 hide-scrollbar snap-x px-2">
                {!isApiReady ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="min-w-[200px] sm:min-w-[220px] md:min-w-[260px] max-w-[200px] sm:max-w-[220px] md:max-w-[260px] bg-white border border-[#ECECEC] rounded-3xl p-4 flex flex-col flex-shrink-0 animate-pulse">
                            <div className="w-full aspect-[4/5] bg-gray-100 rounded-2xl mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-full mb-4" />
                            <div className="mt-auto flex justify-between items-end">
                                <div className="h-6 bg-gray-200 rounded w-1/2" />
                                <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                            </div>
                        </div>
                    ))
                ) : (
                    products.map((product) => {
                        const brand = product.brand || 'Generic';
                        const hasRating = product.rating !== undefined && product.rating !== null && !isNaN(product.rating);
                        const imageUrl = product.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80';

                        return (
                            <div 
                                key={product.id} 
                                onClick={() => onProductClick && onProductClick(product)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && onProductClick && onProductClick(product)}
                                className="cursor-pointer min-w-[200px] sm:min-w-[220px] md:min-w-[260px] max-w-[200px] sm:max-w-[220px] md:max-w-[260px] bg-white border border-[#ECECEC] shadow-sm rounded-3xl p-4 flex flex-col group hover:shadow-md hover:-translate-y-2 transition-all duration-300 flex-shrink-0 snap-start relative focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                            >
                                {/* Badges */}
                                {type === 'deals' && product.discount && (
                                    <div className="absolute top-6 right-6 bg-gradient-to-r from-[#FF6A00] to-[#FF8A1F] text-white text-xs font-black px-2.5 py-1 rounded-md z-20 shadow-[0_4px_10px_rgba(255,106,0,0.4)]">
                                        {product.discount}
                                    </div>
                                )}
                                {type === 'ai_picks' && (
                                    <div className="absolute top-6 left-6 bg-[#FF6A00]/10 text-[#FF6A00] border border-[#FF6A00]/30 text-xs font-bold px-2 py-1 rounded-md z-20 flex items-center gap-1 uppercase tracking-wider backdrop-blur-md">
                                        <Sparkles className="w-3.5 h-3.5" /> AI Pick
                                    </div>
                                )}

                                {/* Image */}
                                <div className="w-full aspect-[4/5] bg-[#F8F8F8] rounded-2xl mb-4 p-5 flex items-center justify-center relative overflow-hidden group-hover:bg-[#F3F4F6] transition-colors">
                                    {imageUrl ? (
                                        <img 
                                            src={imageUrl} 
                                            alt={product.title} 
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const fb = e.currentTarget.parentElement?.querySelector('.pcar-fallback');
                                                if (fb) (fb as HTMLElement).style.display = 'flex';
                                            }}
                                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700 relative z-10" 
                                        />
                                    ) : null}
                                    <div className={`pcar-fallback absolute inset-0 flex flex-col items-center justify-center text-[#111111]/40 p-2 text-center z-0 ${imageUrl ? 'hidden' : 'flex'}`}>
                                        <svg className="w-10 h-10 mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <span className="text-xs font-bold uppercase tracking-widest text-[#111111]/50 leading-none">No Image</span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex flex-col flex-1 px-1">
                                    <span className="text-xs uppercase font-black text-[#666666] mb-1.5 tracking-widest">{brand}</span>
                                    <h3 className="text-base font-bold text-[#111111] leading-snug mb-3 line-clamp-2">{product.title}</h3>
                                    
                                    <div className="mt-auto flex flex-col">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-[#666666] mb-4">
                                            <Star className="w-4 h-4 fill-[#FF6A00] text-[#FF6A00]" /> 
                                            <span>{hasRating ? product.rating : 'New'}</span>
                                            {hasRating && <span className="text-xs text-[#666666]/60 ml-1">({product.reviews || 0})</span>}
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <div className="flex items-baseline gap-x-2">
                                                    <span className="text-lg font-black text-[#111111] leading-none tracking-tight">{formatPrice(product.price)}</span>
                                                    {product.originalPrice && (
                                                        <span className="text-xs text-[#666666] font-bold line-through leading-none">{formatPrice(product.originalPrice)}</span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(product); }}
                                                aria-label={`Add ${product.title} to cart`}
                                                className="w-10 h-10 rounded-[0.8rem] bg-gradient-to-br from-[#FF6A00] to-[#FF8A1F] text-white flex items-center justify-center transition-all duration-300 shadow-[0_4px_15px_rgba(255,106,0,0.3)] hover:shadow-[0_8px_25px_rgba(255,106,0,0.5)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#FF6A00] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}
