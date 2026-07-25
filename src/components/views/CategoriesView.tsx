import React, { useMemo } from 'react';
import { useStore } from '@/lib/StoreContext';
import { ArrowLeft, Grid } from 'lucide-react';
import { ProductCard, ProductSkeleton } from '../ui/ProductCard';

export default function CategoriesView() {
    const { products, navigate, addToCart, formatPrice, loadMoreProducts, hasMore, isApiReady } = useStore();
    
    const categories = useMemo(() => Array.from(new Set(products.map(p => p.category).filter(Boolean))), [products]);

    return (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 pb-32">
            <div className="flex items-center gap-3 mb-8">
                <button 
                    onClick={() => navigate('home')} 
                    aria-label="Back to Store"
                    className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center gap-2">
                    <Grid className="w-8 h-8 text-yellow-400" />
                    <h1 className="text-3xl font-black text-white">All Categories</h1>
                </div>
            </div>
            
            <div className="flex flex-col gap-12">
                {!isApiReady ? (
                    <div>
                        <div className="h-8 bg-white/10 rounded w-48 mb-6 animate-pulse" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[280px]"><ProductSkeleton /></div>)}
                        </div>
                    </div>
                ) : (
                    categories.map(category => (
                        <div key={category}>
                            <h2 className="text-2xl font-bold text-white mb-6 capitalize border-b border-white/10 pb-2">{category}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.filter(p => p.category === category).map(product => (
                                    <ProductCard 
                                        key={product.id}
                                        product={product}
                                        formatPrice={formatPrice}
                                        onProductClick={(p) => navigate('product', p)}
                                        onAddToCart={addToCart}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {hasMore && isApiReady && (
                <div className="flex justify-center mt-12 w-full">
                    <button 
                        onClick={() => loadMoreProducts()} 
                        className="bg-white text-black px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:-translate-y-1 hover:shadow-xl hover:bg-gray-100 transition-all duration-300"
                    >
                        Load More Products...
                    </button>
                </div>
            )}
        </div>
    );
}
