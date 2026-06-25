import React from 'react';
import { useStore } from '@/lib/StoreContext';
import { ArrowLeft, Tag } from 'lucide-react';
import ProductCarousel from '../dashboard/ProductCarousel';

export default function DealsView() {
    const { products, navigate, addToCart } = useStore();
    const dealsProducts = products.filter(p => (p.discountPercentage || 0) > 0);

    return (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 pb-32">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => navigate('home')} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                    <Tag className="w-8 h-8 text-rose-500" />
                    <h1 className="text-3xl font-black text-gray-900">Today's Deals</h1>
                </div>
            </div>
            <ProductCarousel 
                title="" 
                products={dealsProducts.length > 0 ? dealsProducts : products} 
                type="deals"
                onProductClick={(p) => navigate('product', p)}
                onAddToCart={(p) => addToCart(p)}
            />
        </div>
    );
}
