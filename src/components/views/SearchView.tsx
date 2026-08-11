import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/StoreContext';
import { Search, ArrowLeft, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { filterAndSortProducts, FilterState, SortOption } from '@/lib/utils';
import MarketplaceProductCard from '../ui/MarketplaceProductCard';
import { SearchService } from '@/lib/SearchService';

export default function SearchView() {
    const { navigate, addToCart, products, searchQuery, setSearchQuery } = useStore();
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
        if (!searchQuery.trim()) {
            return filterAndSortProducts(products, '', filters, sortOption);
        }
        const searchResult = SearchService.search(searchQuery, searchQuery.toLowerCase(), 'SEARCH', false, products);
        return filterAndSortProducts(searchResult.matchingProducts, '', filters, sortOption);
    }, [searchQuery, filters, sortOption, products]);

    const activeFilterCount = (filters.category ? 1 : 0) + (filters.brand ? 1 : 0) + (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) + (filters.minRating !== null ? 1 : 0);

    const uniqueCategories = useMemo(() => Array.from(new Set(products.map(p => p.category).filter(Boolean))), [products]);
    const uniqueBrands = useMemo(() => Array.from(new Set(products.map(p => p.brand).filter(Boolean))), [products]);

    const clearFilters = () => {
        setFilters({ category: '', brand: '', minPrice: null, maxPrice: null, minRating: null });
        setSortOption('relevance');
    };

    return (
        <div className="w-full min-h-screen bg-[#F8F8F8] text-[#111111] flex flex-col pb-32">
            <div className="sticky top-0 z-20 bg-white px-4 md:px-8 py-4 border-b border-[#ECECEC] flex flex-col gap-3 shadow-sm">
                <div className="max-w-[1800px] mx-auto w-full flex items-center gap-3">
                    <button 
                        onClick={() => navigate('home')} 
                        aria-label="Back to Store"
                        className="p-2 -ml-2 text-gray-500 hover:text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FF6A00] rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex-1 relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search marketplace..."
                            className="w-full bg-[#F8F8F8] border border-[#ECECEC] hover:border-gray-300 rounded-full pl-12 pr-4 py-3 text-base font-medium text-[#111111] placeholder-gray-400 focus:ring-2 focus:ring-[#FF6A00] outline-none transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        aria-label="Toggle Filters"
                        className={`p-3 rounded-full relative transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6A00] ${showFilters || activeFilterCount > 0 ? 'bg-[#FF6A00] text-white shadow-sm' : 'bg-white hover:bg-gray-50 text-gray-600 border border-[#ECECEC]'}`}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-sm">
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
                            className="max-w-[1800px] mx-auto w-full flex flex-col gap-3 overflow-hidden pt-4 pb-2"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <select className="bg-white border border-[#ECECEC] rounded-xl p-3 text-sm text-[#111111] font-medium focus:outline-none focus:border-[#FF6A00]" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
                                    <option value="">All Categories</option>
                                    {uniqueCategories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                                </select>
                                <select className="bg-white border border-[#ECECEC] rounded-xl p-3 text-sm text-[#111111] font-medium focus:outline-none focus:border-[#FF6A00]" value={filters.brand} onChange={e => setFilters({...filters, brand: e.target.value})}>
                                    <option value="">All Brands</option>
                                    {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                <select className="bg-white border border-[#ECECEC] rounded-xl p-3 text-sm text-[#111111] font-medium focus:outline-none focus:border-[#FF6A00]" value={filters.minRating?.toString() || ''} onChange={e => setFilters({...filters, minRating: e.target.value ? Number(e.target.value) : null})}>
                                    <option value="">Any Rating</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                </select>
                                <select className="bg-white border border-[#ECECEC] rounded-xl p-3 text-sm text-[#111111] font-medium focus:outline-none focus:border-[#FF6A00]" value={sortOption} onChange={e => setSortOption(e.target.value as SortOption)}>
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
                                    className="text-sm text-[#FF6A00] font-bold self-start flex items-center gap-1 focus:outline-none hover:underline mt-2"
                                >
                                    <X className="w-4 h-4" /> Clear Filters
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-[1800px] mx-auto w-full">
                {(searchQuery.trim() || activeFilterCount > 0) && (
                    <p className="text-sm text-gray-500 mb-6 font-extrabold flex justify-between items-center">
                        <span>Found {filteredProducts.length} results</span>
                    </p>
                )}
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="min-w-0 max-w-full flex">
                            <MarketplaceProductCard 
                                product={product}
                                onProductClick={(p) => navigate('product', p as any)}
                                onAddToCart={(p) => addToCart(p as any)}
                            />
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center pt-24 text-center">
                        <div className="w-24 h-24 bg-white border border-[#ECECEC] rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <Search className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="font-black text-2xl text-[#111111] mb-2">No products found</h3>
                        <p className="text-gray-500 text-base max-w-[320px]">Try adjusting your filters or searching for a different keyword.</p>
                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="mt-8 bg-[#FF6A00] hover:bg-[#E65C00] text-white px-8 py-3 rounded-full text-base font-bold shadow-sm transition-colors">
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
