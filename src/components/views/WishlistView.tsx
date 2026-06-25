import React from 'react';
import { useStore } from '@/lib/StoreContext';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WishlistView() {
    const { products, wishlist, toggleWishlist, addToCart, navigate } = useStore();

    const wishlistProducts = products.filter(p => wishlist.includes(p.id));

    if (wishlistProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center pt-24 pb-32 px-4 h-[70vh]">
                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-rose-300" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">No favorites yet</h2>
                <p className="text-gray-500 mb-8 text-center max-w-xs">Tap the heart icon on any product to save it for later.</p>
                <button onClick={() => navigate('home')} className="bg-black text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Start Exploring
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 pb-32 md:pb-12">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => navigate('home')} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-3xl font-black text-gray-900">Your Wishlist</h1>
                <div className="ml-auto bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-sm font-bold">
                    {wishlistProducts.length} saved
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {wishlistProducts.map((product, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={product.id} 
                        onClick={() => navigate('product', product)}
                        className="cursor-pointer bg-white border border-gray-100 rounded-2xl p-4 flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
                    >
                        {/* Remove button */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-rose-500 hover:bg-rose-50 z-10"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 p-4 flex items-center justify-center overflow-hidden">
                            <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        <div className="flex flex-col flex-1">
                            <h3 className="text-sm font-bold text-gray-800 leading-tight mb-1 line-clamp-2">{product.title}</h3>
                            <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                            
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-lg font-black text-gray-900">${product.price.toFixed(2)}</span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                    className="w-8 h-8 rounded-full border-2 border-[#1e3a8a] text-[#1e3a8a] flex items-center justify-center hover:bg-[#1e3a8a] hover:text-white transition-colors"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
