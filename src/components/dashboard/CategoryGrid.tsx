import React from 'react';
import { useStore } from '@/lib/StoreContext';
import { marketplaceCategories } from '@/lib/marketplaceData';

export default function CategoryGrid() {
    const { navigate } = useStore();

    return (
        <section className="w-full bg-[#F8F8F8] py-6 md:py-8 rounded-3xl overflow-hidden shadow-sm">
            <div className="max-w-[1800px] mx-auto px-4 md:px-8">
                <h2 className="text-xl md:text-2xl font-black text-[#111111] mb-6">Explore Categories</h2>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 md:gap-6">
                    {marketplaceCategories.map((category) => (
                        <div 
                            key={category.id}
                            onClick={() => navigate('categories')}
                            className="flex flex-col items-center gap-3 cursor-pointer group"
                        >
                            <div 
                                className="w-full aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1 relative"
                                style={{ backgroundColor: category.color }}
                            >
                                <img 
                                    src={category.image} 
                                    alt={category.name} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>
                            <span className="text-sm font-bold text-[#111111] text-center group-hover:text-[#FF6A00] transition-colors">
                                {category.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
