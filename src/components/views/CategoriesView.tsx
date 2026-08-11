import React from 'react';
import { useStore } from '@/lib/StoreContext';
import { ArrowLeft, Grid } from 'lucide-react';
import MarketplaceProductCard from '../ui/MarketplaceProductCard';
import { marketplaceCategories, getProductsByCategory } from '@/lib/marketplaceData';

export default function CategoriesView() {
    const { navigate, addToCart } = useStore();

    return (
        <div className="w-full bg-white min-h-screen text-[#111111] py-8 pb-32">
            <div className="max-w-[1800px] mx-auto px-4 md:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <button 
                        onClick={() => navigate('home')} 
                        aria-label="Back to Store"
                        className="p-2 bg-white hover:bg-gray-50 border border-[#ECECEC] shadow-sm rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#111111]" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Grid className="w-8 h-8 text-[#FF6A00]" />
                        <h1 className="text-3xl font-black text-[#111111]">All Categories</h1>
                    </div>
                </div>
                
                <div className="flex flex-col gap-12">
                    {marketplaceCategories.map(category => {
                        const catProducts = getProductsByCategory(category.id);
                        if (catProducts.length === 0) return null;

                        return (
                            <div key={category.id} className="bg-[#F8F8F8] border border-[#ECECEC] rounded-3xl p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-[#ECECEC] pb-4">
                                    <div 
                                        className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center border border-[#ECECEC]"
                                        style={{ backgroundColor: category.color }}
                                    >
                                        <img src={category.image} alt={category.name} className="w-full h-full object-cover mix-blend-multiply" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-[#111111]">{category.name}</h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {catProducts.map(product => (
                                        <div key={product.id} className="min-w-0 max-w-full flex">
                                            <MarketplaceProductCard 
                                                product={product}
                                                onProductClick={(p) => navigate('product', p as any)}
                                                onAddToCart={(p) => addToCart(p as any)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
