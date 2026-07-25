import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/StoreContext';
import { Search, ArrowLeft, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { filterAndSortProducts, FilterState, SortOption } from '@/lib/utils';
import { ProductCard, ProductSkeleton } from '../ui/ProductCard';

export default function SearchView() {
    const { products, navigate, addToCart, formatPrice, isApiReady } = useStore();
    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    const [filters, setFilters] = useState<FilterState>({
        category: '',
        brand: '',
        minPrice: null,
        maxPrice: null,
        minRating: null
    });
    const [sortOption, setSortOption] = useState<SortOption>('relevance');

    const filteredProducts = useMemo(() => {
        return filterAndSortProducts(products, query, filters, sortOption);
    }, [products, query, filters, sortOption]);

    const activeFilterCount = (filters.category ? 1 : 0) + (filters.brand ? 1 : 0) + (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) + (filters.minRating !== null ? 1 : 0);

    const uniqueCategories = useMemo(() => Array.from(new Set(products.map(p => p.category).filter(Boolean))), [products]);
    const uniqueBrands = useMemo(() => Array.from(new Set(products.map(p => p.brand).filter(Boolean))), [products]);

    const clearFilters = () => {
        setFilters({ category: '', brand: '', minPrice: null, maxPrice: null, minRating: null });
        setSortOption('relevance');
    };

    return (
        <div className="w-full h-full bg-white flex flex-col pb-32">
            <div className="sticky top-0 z-20 bg-white px-4 py-4 border-b border-gray-100 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('home')} 
                        aria-label="Back to Store"
                        className="p-2 -ml-2 text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] rounded-full"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full bg-gray-100 border-none rounded-xl pl-10 pr-4 py-3 text-base font-medium focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                        />
                    </div>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        aria-label="Toggle Filters"
                        className={`p-3 rounded-xl relative transition-colors focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] ${showFilters || activeFilterCount > 0 ? 'bg-[#1e3a8a] text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col gap-3 overflow-hidden pt-2"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <select className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
                                    <option value="">All Categories</option>
                                    {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" value={filters.brand} onChange={e => setFilters({...filters, brand: e.target.value})}>
                                    <option value="">All Brands</option>
                                    {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                <select className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" value={filters.minRating?.toString() || ''} onChange={e => setFilters({...filters, minRating: e.target.value ? Number(e.target.value) : null})}>
                                    <option value="">Any Rating</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                </select>
                                <select className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" value={sortOption} onChange={e => setSortOption(e.target.value as SortOption)}>
                                    <option value="relevance">Relevance</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="rating_desc">Highest Rated</option>
                                </select>
                            </div>
                            {activeFilterCount > 0 && (
                                <button 
                                    onClick={clearFilters} 
                                    aria-label="Clear all filters"
                                    className="text-xs text-red-500 font-bold self-start flex items-center gap-1 focus:outline-none focus:underline"
                                >
                                    <X className="w-3 h-3" /> Clear Filters
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {isApiReady && (query.trim() || activeFilterCount > 0) && (
                    <p className="text-sm text-gray-500 mb-4 font-bold flex justify-between items-center">
                        <span>Found {filteredProducts.length} results</span>
                    </p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {!isApiReady ? (
                        Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
                    ) : (
                        filteredProducts.map(product => (
                            <ProductCard 
                                key={product.id}
                                product={product}
                                formatPrice={formatPrice}
                                onProductClick={(p) => navigate('product', p)}
                                onAddToCart={addToCart}
                            />
                        ))
                    )}
                </div>

                {isApiReady && filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center pt-20 text-center">
                        <Search className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="font-bold text-lg text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 text-sm max-w-[250px]">Try adjusting your filters or searching for a different keyword.</p>
                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="mt-4 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-bold">
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
