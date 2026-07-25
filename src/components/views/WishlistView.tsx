import React from 'react';
import { useStore } from '@/lib/StoreContext';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WishlistView() {
    const { products, wishlist, toggleWishlist, addToCart, navigate, formatPrice } = useStore();

    const wishlistProducts = products.filter(p => wishlist.includes(p.id));

    if (wishlistProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center pt-24 pb-32 px-4 h-[70vh]">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <Heart className="w-10 h-10 text-rose-400 drop-shadow-md" />
                </div>
                <h2 className="text-3xl font-black text-white mb-3">No favorites yet</h2>
                <p className="text-gray-400 mb-8 text-center max-w-sm">Tap the heart icon on any product to save it for later.</p>
                <button onClick={() => navigate('home')} className="bg-white text-black px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-all flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Start Exploring
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 pb-32 md:pb-12">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => navigate('home')} className="p-2 bg-white/5 backdrop-blur-md rounded-full hover:bg-white/10 border border-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-300" />
                </button>
                <h1 className="text-3xl font-black text-white">Your Wishlist</h1>
                <div className="ml-auto bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)]">
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
                        className="cursor-pointer bg-white/10 md:bg-white/5 border border-white/15 md:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.7)] rounded-2xl p-4 flex flex-col group hover:bg-white/15 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative backdrop-blur-sm"
                    >
                        {/* Remove button */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                            className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-colors z-10"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="w-full aspect-square bg-white/10 rounded-xl mb-4 p-4 flex items-center justify-center overflow-hidden">
                            <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        <div className="flex flex-col flex-1">
                            <h3 className="text-sm font-extrabold text-white leading-tight mb-1 line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{product.title}</h3>
                            <p className="text-xs text-white/70 font-bold mb-2 drop-shadow-sm">{product.category}</p>
                            
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-lg font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{formatPrice(product.price)}</span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                    className="w-8 h-8 rounded-full border-2 border-sky-300 text-sky-300 flex items-center justify-center hover:bg-sky-300 hover:text-black transition-colors shadow-[0_0_10px_rgba(56,189,248,0.3)]"
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
