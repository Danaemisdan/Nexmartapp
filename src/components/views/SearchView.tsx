import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/StoreContext';
import { Search, ArrowLeft, Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchView() {
    const { products, navigate, addToCart, formatPrice } = useStore();
    const [query, setQuery] = useState('');

    const filteredProducts = useMemo(() => {
        if (!query.trim()) return products;
        const q = query.toLowerCase();
        return products.filter(p => 
            p.title.toLowerCase().includes(q) || 
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
    }, [query, products]);

    return (
        <div className="w-full h-full bg-white flex flex-col pb-32">
            <div className="sticky top-0 z-10 bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3">
                <button onClick={() => navigate('home')} className="p-2 -ml-2 text-gray-600 hover:text-black">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products, brands, categories..."
                        className="w-full bg-gray-100 border-none rounded-xl pl-10 pr-4 py-3 text-base font-medium focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {query.trim() && (
                    <p className="text-sm text-gray-500 mb-4 font-bold">
                        Found {filteredProducts.length} results for "{query}"
                    </p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredProducts.map(product => (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={product.id} 
                            onClick={() => navigate('product', product)}
                            className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col cursor-pointer hover:border-[#1e3a8a] transition-colors"
                        >
                            <div className="aspect-square bg-gray-50 rounded-xl mb-3 p-4 flex items-center justify-center relative">
                                <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight mb-1">{product.title}</h3>
                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <span className="font-black text-black">{formatPrice(product.price)}</span>
                                <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="p-2 bg-gray-100 rounded-full hover:bg-[#1e3a8a] hover:text-white transition-colors">
                                    <ShoppingCart className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center pt-20 text-center">
                        <Search className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="font-bold text-lg text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 text-sm max-w-[200px]">Try searching for a different keyword or category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
