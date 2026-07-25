import React from 'react';
import { useStore } from '@/lib/StoreContext';

export default function FloatingProducts() {
    const { products } = useStore();

    // If no products, don't render anything
    if (!products || products.length === 0) return null;

    // We'll create 5 columns of floating products for a masonry look
    const colCount = 5;
    const columns = Array.from({ length: colCount }, () => [] as any[]);
    
    // Distribute all products into columns so the full variety of the catalog scrolls in the background
    const extendedProducts = [...products, ...products];
    extendedProducts.forEach((product, i) => {
        columns[i % colCount].push(product);
    });

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
            {/* The Grid */}
            <div className="absolute inset-0 flex justify-between gap-4 md:gap-8 scale-110">
                {columns.map((col, colIndex) => {
                    // Different speed and direction for each column
                    const isEven = colIndex % 2 === 0;
                    const duration = 40 + (colIndex * 10); // 40s to 80s
                    
                    return (
                        <div 
                            key={colIndex} 
                            className={`flex-col gap-4 md:gap-8 w-[45vw] md:w-[15vw] min-w-[140px] md:min-w-[150px] ${colIndex >= 2 ? 'hidden md:flex' : 'flex'}`}
                            style={{
                                animation: `${isEven ? 'floatUp' : 'floatDown'} ${duration}s linear infinite`
                            }}
                        >
                            {[...col, ...col].map((product, pIndex) => (
                                <div 
                                    key={`${product.id}-${pIndex}`} 
                                    className="w-full bg-white/5 backdrop-blur-none md:backdrop-blur-md rounded-3xl flex flex-col items-center justify-start border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)] overflow-hidden transition-transform duration-300 relative group p-4 text-center min-h-[200px] md:min-h-[220px]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    <div className="w-20 h-20 md:w-28 md:h-28 mb-3 relative flex-shrink-0 rounded-2xl overflow-hidden bg-black/20 border border-white/5 shadow-inner flex items-center justify-center">
                                        {product.image ? (
                                            <img 
                                                src={product.image} 
                                                alt={product.title || 'Product'} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 relative z-10"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    const fb = e.currentTarget.parentElement?.querySelector('.fp-fallback');
                                                    if (fb) (fb as HTMLElement).style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`fp-fallback absolute inset-0 flex flex-col items-center justify-center text-white/30 p-2 text-center z-0 ${product.image ? 'hidden' : 'flex'}`}>
                                            <svg className="w-6 h-6 md:w-8 md:h-8 mb-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-white/40 leading-none">No Product Image</span>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-white font-extrabold text-xs md:text-sm line-clamp-2 leading-snug mb-1 w-full px-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        {product.title || 'Unknown Product'}
                                    </h3>
                                    <span className="text-sky-300 font-black text-sm mt-auto drop-shadow-sm">
                                        ₦{product.price?.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes floatUp {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                @keyframes floatDown {
                    0% { transform: translateY(-50%); }
                    100% { transform: translateY(0); }
                }
            `}} />
        </div>
    );
}
