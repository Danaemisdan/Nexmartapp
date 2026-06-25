import React from 'react';
import { useStore } from '@/lib/StoreContext';
import { ArrowLeft, Grid } from 'lucide-react';
import ProductCarousel from '../dashboard/ProductCarousel';

export default function CategoriesView() {
    const { products, navigate, addToCart } = useStore();
    
    // Group products by category
    const categories = Array.from(new Set(products.map(p => p.category)));

    return (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 pb-32">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => navigate('home')} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                    <Grid className="w-8 h-8 text-[#1e3a8a]" />
                    <h1 className="text-3xl font-black text-gray-900">All Categories</h1>
                </div>
            </div>
            
            <div className="flex flex-col gap-12">
                {categories.map(category => (
                    <div key={category}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{category}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.filter(p => p.category === category).map((product, i) => (
                                <div 
                                    key={product.id} 
                                    onClick={() => navigate('product', product)}
                                    className="cursor-pointer bg-white border border-gray-100 rounded-2xl p-4 flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 p-4 flex items-center justify-center overflow-hidden">
                                        <img src={product.image || product.thumbnail} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <h3 className="text-sm font-bold text-gray-800 leading-tight mb-1 line-clamp-2">{product.title}</h3>
                                        <div className="mt-auto pt-2 flex items-center justify-between">
                                            <span className="text-lg font-black text-gray-900">${product.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
