import React from 'react';
import { useStore } from '@/lib/StoreContext';
import { ArrowLeft, Tag } from 'lucide-react';
import MarketplaceProductCard from '../ui/MarketplaceProductCard';
import { marketplaceProducts } from '@/lib/marketplaceData';

export default function DealsView() {
    const { navigate, addToCart } = useStore();
    // Use marketplaceProducts that have a discount
    const dealsProducts = marketplaceProducts.filter(p => !!p.discount);

    return (
        <div className="w-full bg-[#FFFDE7] min-h-screen text-[#111111] py-8 pb-32">
            <div className="max-w-[1800px] mx-auto w-full px-4 md:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <button 
                        onClick={() => navigate('home')} 
                        className="p-2 bg-white hover:bg-gray-50 border border-[#ECECEC] rounded-full shadow-sm transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#111111]" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Tag className="w-8 h-8 text-[#FF6A00]" />
                        <h1 className="text-3xl font-black text-[#111111]">Today's Deals</h1>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {dealsProducts.map(product => (
                        <div key={product.id} className="min-w-0 max-w-full flex">
                            <MarketplaceProductCard 
                                product={product}
                                variant="deal"
                                onProductClick={(p) => navigate('product', p as any)}
                                onAddToCart={(p) => addToCart(p as any)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
