import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { MarketplaceProduct } from '@/lib/marketplaceData';
import MarketplaceProductCard from '../ui/MarketplaceProductCard';
import { useStore } from '@/lib/StoreContext';

interface ProductShelfProps {
    title: string;
    products: MarketplaceProduct[];
    variant?: 'standard' | 'deal';
    backgroundColor?: string;
    viewAllLink?: string;
}

export default function ProductShelf({ title, products, variant = 'standard', backgroundColor = '#FFFFFF', viewAllLink }: ProductShelfProps) {
    const { navigate, addToCart } = useStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 600;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <section className="w-full py-4 rounded-3xl overflow-hidden shadow-sm" style={{ backgroundColor }}>
            <div className="max-w-[1800px] mx-auto px-4 md:px-8 relative group">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl md:text-2xl font-black text-[#111111]">{title}</h2>
                    <button 
                        onClick={() => navigate('categories')}
                        className="bg-[#FF6A00] hover:bg-[#E65C00] text-white p-2 rounded-full shadow-sm transition-colors"
                        title="View All"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Scroll Controls */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 md:left-4 top-[55%] -translate-y-1/2 w-10 h-24 bg-white/90 border border-gray-200 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 rounded-r-md hidden md:flex"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 md:right-4 top-[55%] -translate-y-1/2 w-10 h-24 bg-white/90 border border-gray-200 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 rounded-l-md hidden md:flex"
                >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>

                {/* Products */}
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x scroll-smooth"
                >
                    {products.map((product, idx) => (
                        <MarketplaceProductCard 
                            key={`${product.id}-${idx}`} 
                            product={product} 
                            variant={variant}
                            onProductClick={(p) => navigate('product', p as any)}
                            onAddToCart={(p) => addToCart(p as any)}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
